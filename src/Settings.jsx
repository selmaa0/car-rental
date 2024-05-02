import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat'
import { Kanit_400Regular } from '@expo-google-fonts/kanit'
import { Montserrat_300Light } from '@expo-google-fonts/montserrat'
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import Home from './Home'
import { supabase } from "../supabase/supabase";
import Cemail from './Cemail'


const Settings = () => {

    const disconnect = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw error;
            } else {
                // Navigate to the login screen after successful logout
                navigation.navigate('Home');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };



    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Kanit_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={tw`bg-[#7f9db9] h-full `}>
            <View style={tw` `}>

                <Text style={[tw`ml-6 mt-20 mr-5  text-white `, { fontSize: 40, fontFamily: 'Kanit_400Regular' }]}>
                    Settings</Text>
            </View>

            <View >
                <TouchableOpacity
onPress={() => navigation.navigate('Cemail')}                style={tw`bg-[#cfe2f3] mt-18 h-15 ml-6 mr-6 rounded-3xl `}>
                    <Image
                        style={[tw`absolute w-15`, { resizeMode: 'contain', marginTop: -218 }]}
                        source={require("../assets/email.png")}
                    />

                    <Text style={[tw`ml-13 mr-5 pt-3.5 `, { fontSize: 20, fontFamily: 'Kanit_400Regular' }]}>
                        Change your email.</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Cpassword")}>
                <View style={tw`bg-[#cfe2f3] mt-5 h-15 ml-6 mr-6 rounded-3xl `}>
                <Image
                        style={[tw`absolute w-12 ml-1`, { resizeMode: 'contain', marginTop: -92 }]}
                        source={require("../assets/pw.png")}
                    />

                    <Text style={[tw`ml-13 mr-5 pt-3.5 `, { fontSize: 20, fontFamily: 'Kanit_400Regular' }]}>
                        Change your Password.</Text>
                </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Clocation")}>

                <View style={tw`bg-[#cfe2f3] mt-5 h-15 ml-6 mr-6 rounded-3xl `}>
                <Image
                        style={[tw`absolute w-12 ml-1.5`, { resizeMode: 'contain', marginTop: -200 }]}
                        source={require("../assets/location.png")}
                    />

                    <Text style={[tw`ml-13 mr-5 pt-3.5 `, { fontSize: 20, fontFamily: 'Kanit_400Regular' }]}>
                        Change your Location.</Text>
                </View>
                </TouchableOpacity>


                <TouchableOpacity 
                onPress={disconnect}
                style={tw`bg-[#cfe2f3] mt-35 h-15 ml-6 mr-6 rounded-3xl `}>
                <Image
                        style={[tw`absolute w-10 ml-2 `, { resizeMode: 'contain', marginTop: -110 }]}
                        source={require("../assets/out.png")}
                    />

                    <Text style={[tw`ml-13 mr-5 pt-3.5 `, { fontSize: 20, fontFamily: 'Kanit_400Regular' }]}>
                        Sign out.</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

export default Settings;
