// DeleteConfirmationModal.tsx
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onDelete: () => void;
  onCancel: () => void;
  status: number
}

const UserDelete: React.FC<DeleteConfirmationModalProps> = ({ visible, onDelete, onCancel, status }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>¿Estás seguro?</Text>
          <Text style={styles.modalMessage}>{status === 1 ? "¿Quieres desavilitar al Usuario?": "¿Quieres Habilitar al Usuario?"}</Text>

          <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
                styles.deleteButton,
                { backgroundColor: status === 1 ? 'red' : 'green' } // Cambia el color según el estado
            ]}
            onPress={onDelete}
            >
            <Text style={styles.buttonText}>
                {status === 1 ? 'Desavilitar' : 'Habilitar'}
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#A9A9A9',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default UserDelete;
