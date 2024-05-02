import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
import {useFonts, Montserrat_700Bold, Montserrat_400Regular} from '@expo-google-fonts/montserrat'
import { Kanit_400Regular } from '@expo-google-fonts/kanit'
import { Montserrat_300Light } from '@expo-google-fonts/montserrat'
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

const Home = () => {
    const navigation = useNavigation();
    
    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Kanit_400Regular,
    });
    
    if (!fontsLoaded) {
        return null;
    }
    
    return (
        <View style={tw`bg-[#171719] h-full `}>
            <Image 
                style={[tw`absolute w-180`, { resizeMode: `contain`, marginLeft: -230, marginBottom: 100, marginTop: -360 }]}
                source={require("../assets/home.png")}
            />

                    <View style={[tw``, { marginTop:450}]}>
                    <Text style={[tw`mr-5 ml-5 text-white `, {fontSize:40, fontFamily: 'Kanit_400Regular', marginTop:-70}]}>
                        KriCar.
                    </Text>
                    <Text style={[tw`mr-5 ml-5 text-white `, {fontSize:40, fontFamily: 'Kanit_400Regular', }]}>

                    Car Rental Made Easy in Morocco.
                </Text>

                <Text style={[tw`mr-5 ml-5 text-[#8D8D8E] mt-5 `, {fontSize:15, fontFamily: 'Kanit_400Regular'}]}>Explore the road ahead with our amazing rental deals!</Text>
            </View>

        <TouchableOpacity
        onPress={() => navigation.navigate('Signup')}
        style={[tw`mt-15 bg-white w-80 mx-auto rounded-2xl h-15 `, {}]}>
<Text style={[tw`mt-3 rounded-2xl text-xl mx-auto `, {fontFamily: 'Kanit_400Regular'}]} >Let's Go!</Text>
        </TouchableOpacity>

        </View>
    );
}

export default Home;
