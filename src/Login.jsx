import React, { useRef, useState, useEffect } from 'react';
import { Alert, View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat'
import { Kanit_400Regular } from '@expo-google-fonts/kanit'
import { Montserrat_300Light } from '@expo-google-fonts/montserrat'
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import { supabase } from "../supabase/supabase";
import tw from 'twrnc';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Kanit_400Regular,
    });

    const signInWithEmail = async () => {
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
    
        if (error) {
          Alert.alert(error.message);
        } else {
          console.log('Signed in successfully');
          navigation.navigate('Homepage');
        }
    };
    

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={tw`bg-[#171719] h-full `}>
            <View>
                <Text
                    style={[tw`mr-5 ml-5 text-[#ffffff] mt-35 `, { fontSize: 40, fontFamily: 'Kanit_400Regular' }]}
                >Login.</Text>
                <Text
                    style={[tw`mr-5 ml-5 text-[#8D8D8E] mt-3 mb-5`, { fontSize: 16, fontFamily: 'Kanit_400Regular' }]}
                >Login to access our services.</Text>

            </View>
            <TextInput
                style={[tw`w-85 mx-auto border pt-3 pb-3 pl-5 rounded-2xl mt-6 bg-white`, { fontFamily: 'Kanit_400Regular' }]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={[tw`w-85 mx-auto border pt-3 pb-3 pl-5 rounded-2xl mt-3 bg-white`, { fontFamily: 'Kanit_400Regular' }]}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}></TextInput>

            <TouchableOpacity
           onPress={signInWithEmail}
               
               
               style={[tw`mt-20 bg-white w-80 mx-auto rounded-2xl h-15 `, {}]}>
                <Text style={[tw`mt-3 rounded-2xl text-xl mx-auto `, { fontFamily: 'Kanit_400Regular' }]} >Sign up


</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={[tw`ml-9 mt-5 text-base text-[#ffffff]`, { fontFamily: 'Kanit_400Regular' }]}>No account yet? Sign up.</Text>
                </TouchableOpacity>


        </View>
    );
}

export default Login;
