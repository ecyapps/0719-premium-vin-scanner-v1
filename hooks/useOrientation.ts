import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

interface OrientationData {
  orientation: Orientation;
  width: number;
  height: number;
  isLandscape: boolean;
  isPortrait: boolean;
}

export const useOrientation = (): OrientationData => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  const isLandscape = width > height;
  const orientation: Orientation = isLandscape ? 'landscape' : 'portrait';

  return {
    orientation,
    width,
    height,
    isLandscape,
    isPortrait: !isLandscape,
  };
}; 