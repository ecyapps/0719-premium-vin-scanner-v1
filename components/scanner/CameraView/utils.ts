import { CameraViewProps, CameraViewRef } from './types';
import { CameraType } from 'expo-camera';
import { Alert, Platform } from 'react-native';

export const validateCameraHealth = async (
  cameraRef: React.RefObject<any>,
  permission: { granted: boolean } | null,
  isCameraReady: boolean,
  cameraError: string | null,
  lastSuccessfulCapture: React.MutableRefObject<number>
): Promise<boolean> => {
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
};

export const handleCameraError = (
  error: unknown,
  setErrorCount: React.Dispatch<React.SetStateAction<number>>,
  setCameraError: React.Dispatch<React.SetStateAction<string | null>>,
  onAutoScanToggle: CameraViewProps['onAutoScanToggle']
) => {
  console.error('❌ CameraView: Capture error:', error);

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('permission')) {
      Alert.alert(
        'Permission Error',
        'Camera access was denied. Please check your permissions.'
      );
    } else if (errorMessage.includes('camera') || errorMessage.includes('capture')) {
      Alert.alert('Camera Error', 'Camera capture failed. Please try again.');
      setCameraError('Capture failed');
    } else {
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  }

  setErrorCount((prev) => {
    const newCount = prev + 1;
    if (newCount >= 3) {
      onAutoScanToggle(false);
      setCameraError('Multiple failures - try manual scan');
      Alert.alert(
        'Camera Issue',
        'Auto-scan disabled due to errors. Please try manual scanning.',
        [{ text: 'OK' }]
      );
    }
    return newCount;
  });
};

export const getPlatformDelay = () => {
  return Platform.OS === 'ios' ? 300 : 500;
};