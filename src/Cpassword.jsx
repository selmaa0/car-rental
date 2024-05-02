import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, SafeAreaView, Image } from 'react-native'; // Import Alert from 'react-native'
import { Kanit_400Regular } from '@expo-google-fonts/kanit';
import tw from 'twrnc';
import { supabase } from "../supabase/supabase";
import { useNavigation } from '@react-navigation/native';


const Cpassword = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    try {
      // Check if current password is provided
      if (!currentEmail.trim()) {
        setError('Please enter your current password.');
        return;
      }

      // Check if new password is provided
      if (!newPassword.trim()) {
        setError('Please enter a new password.');
        return;
      }

      const {   data: { user }, } = await supabase.auth.getUser()
  
      // Check if user email matches the current email
      if (user.email !== currentEmail) {
        setError('The current email provided does not match your account email.');
        return;
      }
  

      // Update password using Supabase

      const { error } = await supabase.auth.updateUser({password: newPassword})
      if (error) {
        setError(error.message);
      } else {
        // Password changed successfully
        // Clear input fields and error message
        setCurrentEmail('');
        setNewPassword('');
        setError('');
        // Show success message using Alert
        Alert.alert('Success', 'Your password has been changed successfully.');
      }
    } catch (error) {
      console.error('Error changing password:', error.message);
      setError('An error occurred while changing your password. Please try again.');
    }
  };

  return (
    <View style={tw`bg-black h-full p-4`}>
                          <SafeAreaView style={[tw`flex`]}>
                <TouchableOpacity
                    style={[tw`mt-2 w-7`]}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        style={[tw`w-10 h-10 mt-3`, { tintColor: '#808080' }]}
                        source={require('../assets/arrow.png')}
                    />
                </TouchableOpacity>
            </SafeAreaView>

      <Text style={[tw`mr-5 mt-10 pt-3.5 text-white`, { fontSize: 40, fontFamily: 'Kanit_400Regular' }]}>
        Change your Password.
      </Text>
      <TextInput
        style={[tw`bg-white p-2 mt-2 rounded mb-4`,  {fontFamily: 'Kanit_400Regular'}] }
        placeholder="Enter current Email"
        value={currentEmail}
        onChangeText={setCurrentEmail}
      />
      <TextInput
        style={[tw`bg-white p-2 mt-2 rounded mb-4`,  {fontFamily: 'Kanit_400Regular'}] }
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry // To hide the new password
      />
      {error ? <Text style={tw`text-red-500 mb-4`}>{error}</Text> : null}
      <TouchableOpacity
        style={tw`w-50 mx-auto mt-5 bg-white p-2 rounded-3xl`}
        onPress={handleChangePassword}
      >
        <Text style={[tw`text-black text-center `,  {fontFamily: 'Kanit_400Regular'}]}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Cpassword;
