import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export type User = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  nit: string;
  numberPhone: string;
  role: string;
  status: number;
  userName: string;
  profilePicture?: string;
};

type UserCardProps = {
  user: User;
  onPress: (user: User) => void; // Agregamos la función onPress como prop
};

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {

  
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(user)}>
      <Image
        source={user.profilePicture ? { uri: user.profilePicture } : require('../../assets/images/user.jpg')}
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.name}>{user.name} {user.lastName}</Text>
          <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
        </View>
        <View style={styles.contRole}>
          <Text style={styles.textRole}>{user.role}</Text>

          { user.status == 1 ? (
            <Text style={styles.textStatus}>Activo</Text>
          ) : (
            <Text style={styles.textStatusIna}>Inactivo</Text>
          )
          }
          
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    margin: 10,
    backgroundColor: '#CBDCEB',
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
    borderRadius: 30,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    flexDirection:'row',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  contRole:{
    flex:1,
    display:'flex',
    justifyContent:'center',
    alignItems:'flex-end',
    
  },
  textRole:{
    fontWeight:'300',
    textAlign:'center',
    backgroundColor:'#608BC1',
    padding:4,
    borderRadius:10,
    textTransform: 'uppercase',
    fontSize:12,
    marginBottom:4
  },

  textStatus:{
    fontWeight:'300',
    textAlign:'center',
    backgroundColor:'green',
    padding:4,
    borderRadius:10,
    textTransform: 'uppercase',
    fontSize:12
  },

  textStatusIna:{
    fontWeight:'300',
    textAlign:'center',
    backgroundColor:'red',
    padding:4,
    borderRadius:10,
    textTransform: 'uppercase',
    fontSize:12
  }
});
