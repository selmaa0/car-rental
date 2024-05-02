import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, View, Text, ScrollView, TouchableOpacity, Image, TextInput, RefreshControl } from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat'
import { Kanit_400Regular } from '@expo-google-fonts/kanit'
import { Montserrat_300Light } from '@expo-google-fonts/montserrat'
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import { supabase } from "../supabase/supabase";
import SearchBar from 'react-native-dynamic-search-bar';
import tw from 'twrnc';

const Homepage = () => {
    const navigation = useNavigation();
    const [currentRentals, setCurrentRentals] = useState([]);
    const [filteredRentals, setFilteredRentals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchCurrentRentals = async () => {
        setRefreshing(true); // Set refreshing state to true while fetching
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('email', user.email)
                .single();

            if (userError || !userData) {
                throw new Error('User not found');
            }

            const { data: rentalsData, error: rentalsError } = await supabase
                .from('rental')
                .select('*')
                .eq('user_id', userData.id);

            if (rentalsError) {
                throw rentalsError;
            }

            // Fetch car details for each rental
            const rentalsWithCarDetails = await Promise.all(rentalsData.map(async (rental) => {
                const { data: carData, error: carError } = await supabase
                    .from('cars')
                    .select('*')
                    .eq('car_id', rental.car_id)
                    .single();
                    
                if (carError) {
                    throw carError;
                }

                return { ...rental, carDetails: carData };
            }));
            setCurrentRentals(rentalsWithCarDetails);
            setFilteredRentals(rentalsWithCarDetails);
        } catch (error) {
            console.error('Error fetching current rentals:', error.message);
        } finally {
            setRefreshing(false); // Set refreshing state to false after fetching
        }
    };

    useEffect(() => {
        fetchCurrentRentals();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredRentals(currentRentals);
        } else {
            const filtered = currentRentals.filter((rental) =>
                rental.carDetails.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredRentals(filtered);
        }
    };

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Kanit_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    const entries = [
        // Personal
        {
            title: 'Ford',
            illustration: require('../assets/f.png'),
        },
        {
            title: 'Nissan',
            illustration: require('../assets/n.png'),
        },
        {
            title: 'KIA',
            illustration: require('../assets/k.png'),
        },
        {
            title: 'Mercedes',
            illustration: require('../assets/m.png'),
        },
        {
            title: 'Toyota',
            illustration: require('../assets/t.png'),
        },
        {
            title: 'Volvo',
            illustration: require('../assets/v.png'),
        },
        {
            title: 'Dacia',
            illustration: require('../assets/d.png'),
        },
    ];

    return (
        <ScrollView
            style={[tw`bg-[#ffffff] h-full`, {}]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchCurrentRentals} />
            }
        >
            <View style={[tw`mt-10 ml-3 h-15`, {}]}>
                <Text style={[{ fontFamily: 'Kanit_400Regular', fontSize: 20 }]}>Hello!</Text>
            </View>
            <View style={[tw`ml-3`, {}]}>
                <Text style={[tw``, { fontFamily: 'Kanit_400Regular', fontSize: 30 }]}>Where are you going?</Text>
                <Text style={[tw``, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>Find the best car rental deals in Morocco.</Text>
            </View>
            <View>
                <SearchBar
                    style={[tw`border mt-5 mx-auto w-80 h-12 bg-white`, {}]}
                    placeholder="Search your current rentals..."
                    onChangeText={handleSearch}
                    value={searchQuery}
                />
            </View>
            <View style={[tw`ml-3 mt-5 bg-white`, {}]}>
                <View style={[tw`ml-3 mt-5 flex-row`, {}]}>
                    <Text style={[tw`mb-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>Available Models</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Cars')}>
                        <Text style={tw`ml-29 text-base text-blue-500`}>See All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`flex-grow`}>
                    {entries.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => navigation.navigate('Cars')}>
                            <View style={tw`flex items-center mx-2`}>
                                <View style={[tw` rounded-2xl`, { width: 100, height: 80, overflow: 'hidden', marginHorizontal: 5 }]}>
                                    <Image resizeMode='contain' source={item.illustration} style={{ borderRadius: 8, width: '100%', height: '100%' }} />
                                </View>
                                <Text style={[tw`text-center mt-`, { fontFamily: 'Kanit_400Regular' }]}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <View style={[tw`mt-5 ml-3`]}>
                <Text style={[tw``, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>Car Recommendation</Text>
                <View style={[tw`border bg-[#ffffff] h-80 mr-3 mt-5 rounded-2xl `, {}]}>
                    <Image source={require("../assets/ford1.png")} resizeMode='contain' style={{ borderRadius: 8, width: '100%', height: '100%', marginTop: -40, marginBottom: -90 }} />
                    <Text style={[tw`ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>Ford Escape</Text>
                    <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 14 }]}>2024</Text>
                    <Text style={[tw`text-[#808080] ml-3`, { fontFamily: '', fontSize: 14 }]}>_______________________________________________</Text>
                    <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>Casablanca                       800MAD/Day</Text>
                    <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>5 Seats</Text>
                </View>
            </View>
            <View style={[tw`mt-5 ml-3`]}>
                <View>
                    <Text style={[tw``, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>Current rentals</Text>
                    {
                        filteredRentals.map((rental, index) => (
                            <View key={index} style={[tw`border border-[#000000] h-100 mr-3 mt-5 rounded-2xl bg-[#ffffff]`, {}]}>
                                <Image source={{ uri: rental.carDetails.photo }}  resizeMode='contain' style={{ width: '100%', height: 200, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
                                <Text style={[tw`ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{rental.carDetails.name}</Text>
                                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 14 }]}>{rental.carDetails.model}</Text>
                                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: '', fontSize: 14 }]}>_______________________________________________</Text>
                                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{rental.carDetails.city}                                {rental.carDetails.price_per_day}/Day</Text>
                                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{rental.carDetails.seats} Seats</Text>
                                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 14 }]}>Start Date: {rental.start_date}</Text>
                                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 14 }]}>Return Date: {rental.return_date}</Text>
                                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 14 }]}>Total Price: {rental.total_cost}</Text>

                            </View>
                        ))
                    }
                </View>
            </View>
        </ScrollView>
    );
}

export default Homepage;
