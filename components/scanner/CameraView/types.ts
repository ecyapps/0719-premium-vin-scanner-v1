import { CameraView as ExpoCameraView, CameraType } from 'expo-camera';
import { ReactNode } from 'react';

export interface VINScanResult {
  vin: string;
  confidence: number;
  source: string;
}

export interface CameraViewProps {
  onImageCaptured?: (imageUri: string) => void;
  onVINDetected?: (result: VINScanResult) => void;
  isScanning?: boolean;
  autoScan: boolean;
  onAutoScanToggle: (enabled: boolean) => void;
  style?: any;
  children?: ReactNode;
}

export interface CameraControls {
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

export type CameraViewHandle = React.RefObject<CameraViewRef>;
export type CameraViewInstance = ExpoCameraView;