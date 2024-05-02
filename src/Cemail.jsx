import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text , Alert, SafeAreaView} from 'react-native';
import { Kanit_400Regular } from '@expo-google-fonts/kanit';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { supabase } from "../supabase/supabase";

const Cemail = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();



  const handleChangeEmail = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
  
      if (!user) {
        setError('User session not found');
        return;
      }
  
      if (!newEmail || !currentEmail) {
        setError('Please enter both the current and new email');
        return;
      }

      if (currentEmail !== user.email) {
        setError('Current email does not match your email');
        console.log(user.email);

        return;
      }
  
      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail,
      } 

    );
  
      if (updateError) {
        console.log(updateError.message);
      } else {
        Alert.alert('confirm in both emails please');
        setError('');
        setNewEmail('');
        setCurrentEmail('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred');
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
        Change your email.
      </Text>
      <TextInput
        style={[tw`bg-white p-2 mt-6 rounded mb-4`,  {fontFamily: 'Kanit_400Regular'}] }
        placeholder="Enter current email"
        value={currentEmail}
        onChangeText={setCurrentEmail}
      />
      <TextInput
        style={[tw`bg-white p-2 mt-2 rounded mb-4`,  {fontFamily: 'Kanit_400Regular'}] }
        placeholder="Enter new email"
        value={newEmail}
        onChangeText={setNewEmail}
      />
      {error ? <Text style={tw`text-red-500 mb-4`}>{error}</Text> : null}
      <TouchableOpacity
        style={tw`w-50 mx-auto mt-4 bg-white p-2 rounded-3xl`}
        onPress={handleChangeEmail}
      >
        <Text style={[tw`text-black text-center`,  {fontFamily: 'Kanit_400Regular'}]}>Change Email</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Cemail;
