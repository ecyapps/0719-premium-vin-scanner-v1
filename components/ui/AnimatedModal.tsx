/**
 * @component AnimatedModal
 * @description Professional animated modal component with smooth animations and backdrop handling
 * @props AnimatedModalProps - Modal visibility, close handler, and content
 * @returns JSX.Element - Animated modal with backdrop
 */

import React, { useState, useRef, useEffect } from 'react';
import { Modal, TouchableOpacity, Animated, StyleSheet } from 'react-native';

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationDuration?: number;
  backdropOpacity?: number;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({ 
  visible, 
  onClose, 
  children,
  animationDuration = 250,
  backdropOpacity = 1
}) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      // Animate in
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: backdropOpacity,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(modalScale, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: animationDuration - 50,
          useNativeDriver: true,
        }),
        Animated.timing(modalScale, {
          toValue: 0.9,
          duration: animationDuration - 50,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: animationDuration - 50,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible, animationDuration, backdropOpacity, backdropAnim, modalScale, modalOpacity]);

  const handleBackdropPress = () => {
    onClose();
  };

  if (!modalVisible) {
    return null;
  }

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: modalOpacity,
              transform: [{ scale: modalScale }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    maxWidth: '90%',
    maxHeight: '85%',
    marginHorizontal: 20,
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedModal; 