import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  CameraView as ExpoCameraView,
  CameraType,
  useCameraPermissions,
} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useVINScanner } from '../../hooks/useVINScanner';

interface VINScanResult {
  vin: string;
  confidence: number;
  source: string;
}

interface CameraViewProps {
  onImageCaptured?: (imageUri: string) => void;
  onVINDetected?: (result: VINScanResult) => void;
  isScanning?: boolean;
  autoScan: boolean;
  onAutoScanToggle: (enabled: boolean) => void;
  style?: any;
  children?: ReactNode;
}

interface CameraControls {
  facing: CameraType;
  torch: boolean;
  isProcessing: boolean;
  setFacing: (facing: CameraType) => void;
  toggleTorch: () => void;
  takePicture: () => Promise<void>;
  takePictureForScanning: () => Promise<void>;
}

export interface CameraViewRef {
  controls: CameraControls;
  permissions: {
    granted: boolean;
    requestPermission: () => Promise<any>;
  };
}

export const CameraView = React.forwardRef<CameraViewRef, CameraViewProps>(
  (
    {
      onImageCaptured,
      onVINDetected,
      isScanning = false,
      autoScan,
      onAutoScanToggle,
      style,
      children,
    },
    ref
  ) => {
    // Camera state
    const [facing, setFacing] = useState<CameraType>('back');
    const [torch, setTorch] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [mediaLibraryPermission, requestMediaLibraryPermission] =
      MediaLibrary.usePermissions();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // References and hooks
    const scanningIntervalRef = useRef<any>(null);
    const cameraRef = useRef<ExpoCameraView>(null);
    const { scanImage } = useVINScanner(); // ROLLBACK: Remove scanConfig import

    // Error recovery state
    const [errorCount, setErrorCount] = useState(0);
    const initializationAttempts = useRef(0);
    const lastSuccessfulCapture = useRef<number>(0);

    // Use errorCount value to satisfy linter (state is used via setErrorCount)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentErrorCount = errorCount;

    // Camera health validation function
    const validateCameraHealth = useCallback(async (): Promise<boolean> => {
      try {
        if (!cameraRef.current) {
          console.warn('📸 Camera ref not available');
          return false;
        }

        if (!permission?.granted) {
          console.warn('📸 Camera permission not granted');
          return false;
        }

        if (!isCameraReady) {
          console.warn('📸 Camera not ready yet');
          return false;
        }

        if (cameraError) {
          console.warn('📸 Camera has error state:', cameraError);
          return false;
        }

        // Check if enough time passed since last capture (prevent spam)
        const now = Date.now();
        if (now - lastSuccessfulCapture.current < 2000) {
          console.log('📸 Camera cooling down, skipping capture');
          return false;
        }

        return true;
      } catch (error) {
        console.error('📸 Camera health check failed:', error);
        return false;
      }
    }, [permission?.granted, isCameraReady, cameraError]);

    // Enhanced auto-scanning function with robust error handling
    const takePictureForScanning = useCallback(async () => {
      try {
        // Comprehensive camera health check
        const isHealthy = await validateCameraHealth();
        if (!isHealthy) {
          console.log('📸 Skipping auto-scan: camera not healthy');
          return;
        }

        if (isProcessing) {
          console.log('📸 Skipping auto-scan: already processing');
          return;
        }

        setIsProcessing(true);
        console.log('🔍 CameraView: Starting auto-scan capture...');

        // Platform-specific delay for camera stabilization
        const stabilizationDelay = Platform.OS === 'ios' ? 300 : 500;
        await new Promise((resolve) => setTimeout(resolve, stabilizationDelay));

        // Validate camera is still healthy after delay
        if (!cameraRef.current || !isCameraReady) {
          console.warn('📸 Camera became unavailable during stabilization');
          return;
        }

        // Enhanced picture settings with error handling
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8, // Slightly reduced quality for better performance
          base64: false,
          exif: false,
          shutterSound: false,
          skipProcessing: false,
        });

        if (!photo || !photo.uri) {
          console.warn(
            '📸 CameraView: Auto-scan failed to capture valid image'
          );
          setErrorCount((prev) => prev + 1);
          return;
        }

        // Update last successful capture time
        lastSuccessfulCapture.current = Date.now();

        // Scan the image for VIN using ML Kit
        console.log('🔍 CameraView: Auto-scan analyzing image...');

        try {
          const result = await scanImage(photo.uri);

          console.log(
            '🔍 DEBUG: scanImage result received in CameraView:',
            result ? JSON.stringify(result) : 'null'
          );

          if (result && onVINDetected) {
            // Found a real VIN! Reset error count and stop auto-scanning immediately
            console.log('✅ Auto-scan found VIN:', result.vin);
            console.log(
              '🎯 CAMERA: Calling onVINDetected with result:',
              result
            );
            setErrorCount(0);

            // Stop the interval timer immediately to prevent further scans
            if (scanningIntervalRef.current) {
              clearInterval(scanningIntervalRef.current);
              scanningIntervalRef.current = null;
              console.log('🔄 Auto-scan interval stopped after VIN detection');
            }

            // Disable auto-scan toggle and notify parent
            onAutoScanToggle(false);
            console.log('🎯 CAMERA: About to call onVINDetected callback');
            onVINDetected(result);
            console.log('🎯 CAMERA: onVINDetected callback completed');
          } else if (result && !onVINDetected) {
            console.log(
              '⚠️ DEBUG: Have result but no onVINDetected callback:',
              result
            );
          } else if (!result && onVINDetected) {
            console.log('📸 Auto-scan: No VIN detected in image');
          } else {
            console.log(
              '⚠️ DEBUG: No result and no callback - this should not happen'
            );
          }
        } catch (scanError) {
          console.error(
            '🔍 DEBUG: Error in scanImage call from CameraView:',
            scanError
          );
          console.log(
            '🔍 DEBUG: Will continue with normal flow despite scan error'
          );
        }

        // Also notify parent about captured image if callback provided
        if (onImageCaptured) {
          onImageCaptured(photo.uri);
        }

        // Reset error count on successful capture
        setErrorCount(0);
      } catch (error) {
        console.error('❌ CameraView: Auto-scan error:', error);

        // Increment error count for recovery tracking
        setErrorCount((prev) => {
          const newCount = prev + 1;
          console.log(`⚠️ Auto-scan error count: ${newCount}`);

          // Stop auto-scan after 3 consecutive errors to prevent spam
          if (newCount >= 3) {
            console.warn('🛑 Stopping auto-scan due to repeated errors');
            onAutoScanToggle(false);
            setCameraError(
              'Multiple capture failures - please try manual scan'
            );

            // Show user-friendly message after multiple failures
            setTimeout(() => {
              Alert.alert(
                'Camera Issue',
                'Auto-scan temporarily disabled due to camera issues. Please try manual scanning or restart the camera.',
                [{ text: 'OK' }]
              );
            }, 100);
          }

          return newCount;
        });

        // Handle specific errors gracefully
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase();

          if (
            errorMessage.includes('camera') ||
            errorMessage.includes('capture')
          ) {
            console.warn('⚠️ Camera capture issue - will retry');
            setCameraError('Camera capture failed');
          } else if (errorMessage.includes('permission')) {
            console.warn('⚠️ Permission issue during auto-scan');
            onAutoScanToggle(false);
            setCameraError('Camera permission lost');
          } else {
            console.warn('⚠️ General auto-scan error - implementing recovery');
            setCameraError('Auto-scan error occurred');
          }
        }
      } finally {
        setIsProcessing(false);
      }
    }, [
      validateCameraHealth,
      isProcessing,
      scanImage,
      onVINDetected,
      onImageCaptured,
      onAutoScanToggle,
      isCameraReady,
    ]);

    // Camera ready handler for better initialization timing
    const handleCameraReady = useCallback(() => {
      console.log('📸 Camera is ready for use');
      setIsCameraReady(true);
      setCameraError(null);
      setErrorCount(0);
      initializationAttempts.current = 0;
    }, []);

    // Enhanced manual picture capture with maximum quality
    const takePicture = useCallback(async () => {
      try {
        // Use the same camera health validation as auto-scan
        const isHealthy = await validateCameraHealth();
        if (!isHealthy) {
          Alert.alert(
            'Camera Not Ready',
            'Please wait for the camera to initialize properly.'
          );
          return;
        }

        if (isProcessing) {
          console.log('📸 Manual capture already in progress');
          return;
        }

        setIsProcessing(true);
        console.log('🔍 CameraView: Manual capture starting...');

        // Platform-specific delay for optimal capture
        const captureDelay = Platform.OS === 'ios' ? 400 : 600;
        await new Promise((resolve) => setTimeout(resolve, captureDelay));

        // Final validation before capture
        if (!cameraRef.current || !isCameraReady) {
          Alert.alert(
            'Camera Error',
            'Camera became unavailable. Please try again.'
          );
          return;
        }

        // Enhanced picture settings for manual capture - always use max quality
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1.0, // Maximum quality for manual capture
          base64: false,
          exif: false,
          shutterSound: false, // Mute shutter sound for manual capture
          skipProcessing: false,
        });

        if (!photo || !photo.uri) {
          Alert.alert(
            'Capture Failed',
            'Failed to capture image. Please try again.'
          );
          return;
        }

        // Update last successful capture time
        lastSuccessfulCapture.current = Date.now();

        // Scan the image for VIN
        console.log(
          '🔍 CameraView: Manual scan analyzing image (max quality)...'
        );
        const result = await scanImage(photo.uri);

        if (result && onVINDetected) {
          console.log('✅ Manual scan found VIN:', result.vin);
          onVINDetected(result);
        } else {
          Alert.alert(
            'No VIN Found',
            'Could not detect a VIN in the image. Please ensure the VIN is clearly visible and well-lit. Try using the flashlight or adjusting the angle to reduce glare.',
            [{ text: 'OK' }]
          );
        }

        // Also notify parent about captured image if callback provided
        if (onImageCaptured) {
          onImageCaptured(photo.uri);
        }

        // Reset error count on successful manual capture
        setErrorCount(0);
        setCameraError(null);
      } catch (error) {
        console.error('❌ CameraView: Manual capture error:', error);

        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase();

          if (errorMessage.includes('permission')) {
            Alert.alert(
              'Permission Error',
              'Camera access was denied. Please check your permissions.'
            );
          } else if (
            errorMessage.includes('camera') ||
            errorMessage.includes('capture')
          ) {
            Alert.alert(
              'Camera Error',
              'Camera capture failed. Please try again.'
            );
            setCameraError('Manual capture failed');
          } else {
            Alert.alert('Error', 'Failed to capture image. Please try again.');
          }
        } else {
          Alert.alert(
            'Error',
            'An unexpected error occurred. Please try again.'
          );
        }
      } finally {
        setIsProcessing(false);
      }
    }, [
      validateCameraHealth,
      isProcessing,
      scanImage,
      onVINDetected,
      onImageCaptured,
      isCameraReady,
    ]);

    // Toggle torch
    const toggleTorch = useCallback(() => {
      setTorch((prev) => !prev);
    }, []);

    // Request permissions on mount
    useEffect(() => {
      if (!permission?.granted) {
        requestPermission();
      }
      if (!mediaLibraryPermission?.granted) {
        requestMediaLibraryPermission();
      }
    }, [
      permission?.granted,
      mediaLibraryPermission?.granted,
      requestPermission,
      requestMediaLibraryPermission,
    ]);

    // Enhanced auto-scanning with camera health validation
    useEffect(() => {
      if (!autoScan || !permission?.granted) return;

      // Wait for camera to be ready before starting auto-scan
      if (!isCameraReady) {
        console.log(
          '🔄 Waiting for camera to be ready before starting auto-scan'
        );
        return;
      }

      // Additional delay for camera stabilization after ready state
      const initDelay = Platform.OS === 'ios' ? 1000 : 1500;
      const initTimer = setTimeout(() => {
        console.log(
          `🔄 Setting up auto-scan with enhanced validation (${Platform.OS})`
        );

        // Set up enhanced interval scanning with health checks
        scanningIntervalRef.current = setInterval(async () => {
          if (!isProcessing && isCameraReady && !cameraError) {
            try {
              await takePictureForScanning();
            } catch (error) {
              console.error('❌ Error during auto-scan interval:', error);
              // Error handling is now done inside takePictureForScanning
            }
          } else {
            console.log(
              '📸 Skipping auto-scan cycle: camera not ready or processing'
            );
          }
        }, 2000); // PERFORMANCE: Reduced from 5 seconds to 2 seconds for faster scanning
      }, initDelay);

      // Cleanup on unmount or dependency change
      return () => {
        if (initTimer) {
          clearTimeout(initTimer);
        }
        if (scanningIntervalRef.current) {
          clearInterval(scanningIntervalRef.current);
          scanningIntervalRef.current = null;
        }
      };
    }, [
      autoScan,
      permission?.granted,
      isCameraReady,
      isProcessing,
      cameraError,
      takePictureForScanning,
    ]);

    // Reset camera error when permissions change or camera becomes ready
    useEffect(() => {
      if (permission?.granted && isCameraReady) {
        setCameraError(null);
        setErrorCount(0);
      }
    }, [permission?.granted, isCameraReady]);

    // Camera readiness detection with timeout
    useEffect(() => {
      if (permission?.granted && cameraRef.current) {
        // Give camera some time to initialize, then assume it's ready
        const readyTimer = setTimeout(
          () => {
            if (!isCameraReady && !cameraError) {
              console.log('📸 Camera ready timeout - assuming ready');
              setIsCameraReady(true);
            }
          },
          Platform.OS === 'ios' ? 2000 : 3000
        );

        return () => clearTimeout(readyTimer);
      }
    }, [permission?.granted, isCameraReady, cameraError]);

    // Expose camera controls through ref
    React.useImperativeHandle(
      ref,
      () => ({
        controls: {
          facing,
          torch,
          isProcessing,
          setFacing,
          toggleTorch,
          takePicture,
          takePictureForScanning,
        },
        permissions: {
          granted: permission?.granted || false,
          requestPermission,
        },
      }),
      [
        facing,
        torch,
        isProcessing,
        setFacing,
        toggleTorch,
        takePicture,
        takePictureForScanning,
        permission?.granted,
        requestPermission,
      ]
    );

    // Permission handling UI
    if (!permission) {
      return (
        <View style={[styles.container, style]}>
          <Text style={styles.message}>Requesting camera permissions...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={[styles.container, style]}>
          <Text style={styles.message}>
            Camera access is required to scan VINs
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        {/* Camera View */}
        <ExpoCameraView
          style={styles.camera}
          facing={facing}
          enableTorch={torch}
          flash="off"
          animateShutter={false}
          mode="picture"
          ref={cameraRef}
          onCameraReady={handleCameraReady}
        />

        {/* Error overlay for camera issues */}
        {cameraError && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>{cameraError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setCameraError(null);
                setErrorCount(0);
                setIsCameraReady(false);
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Overlay content (passed as children) */}
        {children}
      </View>
    );
  }
);

// Component display name for debugging
CameraView.displayName = 'CameraView';

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
