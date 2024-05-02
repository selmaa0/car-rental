import React, { useRef, useState, useEffect } from 'react';
import { Alert, Dimensions, View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat'
import { Kanit_400Regular } from '@expo-google-fonts/kanit'
import { Montserrat_300Light } from '@expo-google-fonts/montserrat'
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import { supabase } from "../supabase/supabase";
import tw from 'twrnc';

const Signup = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [password, setPassword] = useState('');
    const [selected, setSelected] = React.useState([]);

    async function signUpWithEmail() {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
    
            if (error) throw error;
    
            // Update user data in the 'users' table
            const { error: updateError } = await supabase
                .from('users')
                .insert([
                    {
                        fname: fname,
                        lname: lname,
                        email: email,
                        city: selected
                    },
                ])
                .match({ email });
    
            if (updateError) throw updateError;
    
            // Alert user to check their email
            Alert.alert('Sign Up Successful', 'Please check your email for verification.');
    
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }


    const data = [
        { key: '1', value: 'Casablanca' },
        { key: '2', value: 'Rabat' },
        { key: '3', value: 'Tangier' },
        { key: '4', value: 'Ifrane' },
        { key: '5', value: 'Azrou' },
        { key: '6', value: 'Marrakech' },
        { key: '7', value: 'Fes' },
        { key: '8', value: 'Mohammedia' },
        { key: '9', value: 'Meknes' },
        { key: '10', value: 'Kenitra' }
    ];

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Kanit_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }



    return (
        <View style={tw`bg-[#171719] h-full `}>
            <View>
                <Text
                    style={[tw`mr-5 ml-5 text-[#ffffff] mt-15 `, { fontSize: 40, fontFamily: 'Kanit_400Regular' }]}
                >Create Account.</Text>
                <Text
                    style={[tw`mr-5 ml-5 text-[#8D8D8E] mt-3 mb-5`, { fontSize: 16, fontFamily: 'Kanit_400Regular' }]}
                >Start your journey with us by creating an account.</Text>

            </View>
            <TextInput
                style={[tw`w-85 mx-auto border pt-3 pb-3 pl-2 rounded-2xl mt-3 bg-white`, { fontFamily: 'Kanit_400Regular' }]}
                placeholder="First name:"
                value={fname}
                onChangeText={setFname}
            />
            <TextInput
                style={[tw`w-85 mx-auto border pt-3 pb-3 pl-2 rounded-2xl mt-3 bg-white`, { fontFamily: 'Kanit_400Regular' }]}
                placeholder="Last name:"
                value={lname}
                onChangeText={setLname}
            />
            <TextInput
                style={[tw`w-85 mx-auto border pt-3 pb-3 pl-2 rounded-2xl mt-3 bg-white`, { fontFamily: 'Kanit_400Regular' }]}
                placeholder="Email:"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={[tw`w-85 mx-auto border pt-3 pb-3 pl-2 rounded-2xl mt-3 bg-white`, { fontFamily: 'Kanit_400Regular' }]}
                placeholder="Password:"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}></TextInput>


            <SelectList
                boxStyles={{

                    marginLeft: 22,
                    marginRight: 22,
                    marginTop: 12,
                    width: 340,
                    height: 55, // Adjust the height as needed
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 18,

                }}
                placeholder="City" // Change the placeholder text here

                inputStyles={{
                    fontFamily: 'Kanit_400Regular',
                    fontSize: 14,
                    color: 'black',
                }}
                dropdownStyles={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 8,
                }}
                dropdownItemStyles={{
                    paddingVertical: 10,
                }}
                dropdownTextStyles={{
                    fontFamily: 'Kanit_400Regular',
                    fontSize: 16,
                    color: 'black',
                }}

                setSelected={setSelected}
                data={data}
                save="value"
            />

            <TouchableOpacity
           onPress={signUpWithEmail}
                style={[tw`mt-20 bg-white w-80 mx-auto rounded-2xl h-15 `, {}]}>
                <Text style={[tw`mt-3 rounded-2xl text-xl mx-auto `, { fontFamily: 'Kanit_400Regular' }]} >Sign up


</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={[tw`ml-9 mt-5 text-base text-[#ffffff]`, { fontFamily: 'Kanit_400Regular' }]}>Already have an account? Log in.</Text>
                </TouchableOpacity>



        </View>
    );
}

export default Signup;
