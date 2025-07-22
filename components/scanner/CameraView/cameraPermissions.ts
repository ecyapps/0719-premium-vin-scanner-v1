// components/scanner/CameraView/cameraPermissions.ts

import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export const useCameraAndMediaPermissions = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  return {
    cameraPermission,
    requestCameraPermission,
    mediaLibraryPermission,
    requestMediaPermission,
  };
};
