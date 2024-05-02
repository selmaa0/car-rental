import React, { useRef, useState, useEffect } from 'react';
import { Alert, Dimensions, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat'
import { Kanit_400Regular } from '@expo-google-fonts/kanit'
import { Montserrat_300Light } from '@expo-google-fonts/montserrat'
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import { supabase } from "../supabase/supabase";
import tw from 'twrnc';

const Clocation = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [password, setPassword] = useState('');
    const [selected, setSelected] = React.useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Kanit_400Regular,
    });

    if (!fontsLoaded) {
        return null;
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

    const handleChangeLocation = async () => {
        try {
            // Check if a location is selected
            if (!selectedLocation.trim()) {
                Alert.alert('Error', 'Please select a location.');
                return;
            }

            // Get the current user
            const {   data: { user }, } = await supabase.auth.getUser()


            // Update location in the "user" table
            const { error: updateUserError } = await supabase
                .from('users')
                .update({ city: selectedLocation })
                .eq('email', user.email);
            if (updateUserError) {
                throw updateUserError;
            }


            // Show success message
            Alert.alert('Success', 'Location updated successfully.');
        } catch (error) {
            console.error('Error updating location:', error.message);
            Alert.alert('Error', 'An error occurred while updating your location. Please try again.');
        }
    };
    const handleSelectLocation = (value) => {
        setSelectedLocation(value); // Update the selectedLocation state with the selected value
    };


    return (
        <View style={tw`bg-[#171719] h-full `}>
                              <SafeAreaView style={[tw`flex`]}>
                <TouchableOpacity
                    style={[tw`mt-2 p-4 w-7`]}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        style={[tw`w-10 h-10 mt-3`, { tintColor: '#808080' }]}
                        source={require('../assets/arrow.png')}
                    />
                </TouchableOpacity>
            </SafeAreaView>

            <Text style={[tw`mr-5 mt-10 ml-5 pt-3.5 text-white`, { fontSize: 40, fontFamily: 'Kanit_400Regular' }]}>
                Change your Location.
            </Text>

            <View style={tw`mt-10 `}>
                <SelectList
                    boxStyles={{
                        marginLeft: 22,
                        marginRight: 10,
                        marginTop: 12,
                        width: 340,
                        height: 55,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: 'black',
                        borderRadius: 18,
                    }}
                    placeholder="City"
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
                    setSelected={handleSelectLocation} // Pass the function to handle selection
                    data={data}
                    save="value"
                />
      <TouchableOpacity
        style={tw`w-50 mx-auto mt-5 bg-white p-2 rounded-3xl`}
        onPress={handleChangeLocation}
      >
        <Text style={[tw`text-black text-center `,  {fontFamily: 'Kanit_400Regular'}]}>Confirm</Text>
      </TouchableOpacity>

            </View>
        </View>
    );
};

export default Clocation;
