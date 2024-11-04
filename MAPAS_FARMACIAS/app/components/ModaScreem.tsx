import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, ModalProps } from 'react-native';

interface LoadingModalProps extends ModalProps {
  onClose: () => void;
}

const ModaScreem: React.FC<LoadingModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >    
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white', // Color de fondo del contenido del modal
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
});

export default ModaScreem;
