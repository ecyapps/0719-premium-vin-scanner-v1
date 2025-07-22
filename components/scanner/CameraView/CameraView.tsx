import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity ,Platform,Alert} from 'react-native';
import { CameraType, CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useVINScanner } from '../../../hooks/useVINScanner';
import { styles } from './styles';
import { CameraViewProps, CameraViewRef } from './types';
import { validateCameraHealth, handleCameraError, getPlatformDelay } from './utils';

export const CameraViewComponent = React.forwardRef<CameraViewRef, CameraViewProps>(
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
    const [facing, setFacing] = useState<CameraType>('back');
    const [torch, setTorch] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [errorCount, setErrorCount] = useState(0);

    const scanningIntervalRef = useRef<any>(null);
    const cameraRef = useRef<ExpoCameraView>(null);
    const { scanImage } = useVINScanner();
    const initializationAttempts = useRef(0);
    const lastSuccessfulCapture = useRef<number>(0);

    const takePictureForScanning = useCallback(async () => {
      try {
        const isHealthy = await validateCameraHealth(
          cameraRef,
          permission,
          isCameraReady,
          cameraError,
          lastSuccessfulCapture
        );
        if (!isHealthy) return;

        setIsProcessing(true);
        await new Promise((resolve) => setTimeout(resolve, getPlatformDelay()));

        if (!cameraRef.current || !isCameraReady) return;

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
          shutterSound: false,
          skipProcessing: false,
        });

        if (!photo?.uri) {
          setErrorCount((prev) => prev + 1);
          return;
        }

        lastSuccessfulCapture.current = Date.now();
        const result = await scanImage(photo.uri);

        if (result && onVINDetected) {
          setErrorCount(0);
          if (scanningIntervalRef.current) {
            clearInterval(scanningIntervalRef.current);
            scanningIntervalRef.current = null;
          }
          onAutoScanToggle(false);
          onVINDetected(result);
        }

        if (onImageCaptured) onImageCaptured(photo.uri);
        setErrorCount(0);
      } catch (error) {
        handleCameraError(error, setErrorCount, setCameraError, onAutoScanToggle);
      } finally {
        setIsProcessing(false);
      }
    }, [
      permission,
      isCameraReady,
      cameraError,
      scanImage,
      onVINDetected,
      onImageCaptured,
      onAutoScanToggle,
    ]);

    const takePicture = useCallback(async () => {
      try {
        const isHealthy = await validateCameraHealth(
          cameraRef,
          permission,
          isCameraReady,
          cameraError,
          lastSuccessfulCapture
        );
        if (!isHealthy) return;

        setIsProcessing(true);
        await new Promise((resolve) => setTimeout(resolve, getPlatformDelay() + 100));

        if (!cameraRef.current || !isCameraReady) return;

        const photo = await cameraRef.current.takePictureAsync({
          quality: 1.0,
          base64: false,
          exif: false,
          shutterSound: false,
          skipProcessing: false,
        });

        if (!photo?.uri) return;

        lastSuccessfulCapture.current = Date.now();
        const result = await scanImage(photo.uri);

        if (result && onVINDetected) {
          onVINDetected(result);
        } else {
          Alert.alert('No VIN Found', 'Could not detect a VIN in the image.');
        }

        if (onImageCaptured) onImageCaptured(photo.uri);
        setErrorCount(0);
        setCameraError(null);
      } catch (error) {
        handleCameraError(error, setErrorCount, setCameraError, onAutoScanToggle);
      } finally {
        setIsProcessing(false);
      }
    }, [
      permission,
      isCameraReady,
      cameraError,
      scanImage,
      onVINDetected,
      onImageCaptured,
      onAutoScanToggle,
    ]);

    const toggleTorch = useCallback(() => setTorch((prev) => !prev), []);

    useEffect(() => {
      if (!permission?.granted) requestPermission();
      if (!mediaLibraryPermission?.granted) requestMediaLibraryPermission();
    }, [permission, mediaLibraryPermission]);

    useEffect(() => {
      if (!autoScan || !permission?.granted || !isCameraReady) return;

      const initTimer = setTimeout(() => {
        scanningIntervalRef.current = setInterval(async () => {
          if (!isProcessing && isCameraReady && !cameraError) {
            await takePictureForScanning();
          }
        }, 2000);
      }, Platform.OS === 'ios' ? 1000 : 1500);

      return () => {
        clearTimeout(initTimer);
        if (scanningIntervalRef.current) {
          clearInterval(scanningIntervalRef.current);
          scanningIntervalRef.current = null;
        }
      };
    }, [autoScan, permission, isCameraReady, isProcessing, cameraError, takePictureForScanning]);

    React.useImperativeHandle(ref, () => ({
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
    }));

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
          <Text style={styles.message}>Camera access is required to scan VINs</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        <ExpoCameraView
          style={styles.camera}
          facing={facing}
          enableTorch={torch}
          flash="off"
          animateShutter={false}
          mode="picture"
          ref={cameraRef}
          onCameraReady={() => {
            setIsCameraReady(true);
            setCameraError(null);
            setErrorCount(0);
            initializationAttempts.current = 0;
          }}
        />

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

        {children}
      </View>
    );
  }
);

CameraViewComponent.displayName = 'CameraView';