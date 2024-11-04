import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export type Pharmacy = {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  codeZona: string;
  status: number;
  sectorName: string;
  typePharmacy: string;
  zonaName: string;
  healthNetwork: string;
  townName: string;
  userName: string;
  personName: string;
  personLastName: string;
  profilePicture?: string; 
};

type PharmacyCardProps = {
  pharmacy: Pharmacy;
  onPress: (pharmacy: Pharmacy) => void; 
};

const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(pharmacy)}>
      <Image
        source={pharmacy.profilePicture ? { uri: pharmacy.profilePicture } : require('../../assets/images/logPharmacy.jpg')}
        style={styles.profileImage} // Cambia la imagen de usuario por una de farmacia
      />
      <View style={styles.infoContainer}>
         <View>
            
          <Text style={styles.name}>{pharmacy.name}</Text>
          <Text style={styles.additionalInfo}><MaterialIcons name='person' size={17}></MaterialIcons> {pharmacy.personName} {pharmacy.personLastName}</Text>
          <Text style={styles.phone}><MaterialIcons name='phone' color={"white"} size={17}></MaterialIcons>{pharmacy.phone}</Text>    
          <Text style={styles.additionalInfo}><MaterialIcons name="location-city" size={17} color="white" />{pharmacy.townName}</Text>
         
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PharmacyCard;

const styles = StyleSheet.create({
   
  card: {
    flexDirection: 'row',
    padding: 12,
    margin: 10,
    backgroundColor: '#4A628A',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 10, // Ajusta el borderRadius si necesitas un diseño diferente
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column', // Cambiado a columna para mejor disposición de texto
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B9E5E8',
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  phone: {
    fontSize: 14,
    color: 'white',
  },
  additionalInfo: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
  },
  contRole: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  textRole: {
    fontWeight: '300',
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 10,
    textTransform: 'uppercase',
    fontSize: 12,
  },
});
