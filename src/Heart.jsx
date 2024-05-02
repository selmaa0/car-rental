import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { useFonts, Kanit_400Regular } from '@expo-google-fonts/kanit';
import tw from 'twrnc';
import { supabase } from '../supabase/supabase'; // Import your Supabase client

const Heart = () => {
    const [refreshing, setRefreshing] = useState(false); // State variable to track refreshing state
    const [wishlist, setWishlist] = useState([]);
    const [fontsLoaded] = useFonts({
        Kanit_400Regular,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []); // Fetch wishlist on component mount

    // Function to fetch wishlist data
    const fetchWishlist = async () => {
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

            const { data: wishlistData, error: wishlistError } = await supabase
                .from('wishlist')
                .select('car_id')
                .eq('user_id', userData.id);

            if (wishlistError) {
                throw wishlistError;
            }

            // Fetch car details for each car ID in the wishlist
            const carsPromises = wishlistData.map(async (item) => {
                const { data: carData, error: carError } = await supabase
                    .from('cars')
                    .select('*')
                    .eq('car_id', item.car_id)
                    .single();

                if (carError) {
                    throw carError;
                }

                return carData;
            });

            // Wait for all car details promises to resolve
            const carsData = await Promise.all(carsPromises);

            setWishlist(carsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching wishlist:', error.message);
            setLoading(false);
        }
    };

    // Function to handle pull-to-refresh
    const onRefresh = React.useCallback(() => {
        setRefreshing(true); // Set refreshing state to true
        fetchWishlist(); // Fetch wishlist data
        setRefreshing(false); // Set refreshing state to false after fetching data
    }, []);

    // Function to remove item from wishlist
    const removeFromWishlist = async (carId) => {
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

            const { error } = await supabase
                .from('wishlist')
                .delete()
                .eq('user_id', userData.id)
                .eq('car_id', carId);

            if (error) {
                throw error;
            }

            // Remove the deleted item from the wishlist state
            setWishlist(prevWishlist => prevWishlist.filter(item => item.car_id !== carId));

            Alert.alert('Success', 'Car removed from wishlist');
        } catch (error) {
            console.error('Error removing car from wishlist:', error.message);
            Alert.alert('Error', 'Failed to remove car from wishlist. Please try again.');
        }
    };

    if (!fontsLoaded) {
        return null; // Return null while fonts are loading
    }

    if (loading) {
        return <ActivityIndicator style={tw`mt-10`} size="large" color="#0000ff" />; // Display loading indicator
    }

    return (
        <View style={tw`bg-[#cfe2f3] h-full`}>
            <Image
                style={[tw`absolute h-15`, { resizeMode: `contain`, marginLeft: -200, marginBottom: 0, marginTop: 54 }]}
                source={require("../assets/heart.png")} />

            <Text style={[tw`ml-25 mt-20 rounded-2xl text-4xl`, { fontFamily: 'Kanit_400Regular' }]}>
                Wishlist
            </Text>
            <Text style={[tw`ml-3 mt-5`, { fontFamily: 'Kanit_400Regular', fontSize: 25 }]}>Your favourites.</Text>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {wishlist.map((item) => (
                    <View style={[tw`border h-100 mr-3 ml-3 mt-5 mb-13 rounded-2xl `]} key={item.car_id}>
                        <Image source={{ uri: item.photo }} resizeMode='contain' style={{ borderRadius: 8, width: '100%', height: '100%', marginTop: -40, marginBottom: -90 }} />
                        <Text style={[tw`ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{item.name}</Text>
                        <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 14 }]}>________________________________________</Text>
                        <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{item.city}                                   {item.price_per_day} MAD/Day</Text>
                        <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{item.seats} Seats</Text>
                        <TouchableOpacity onPress={() => removeFromWishlist(item.car_id)}>
                            <View style={[tw`flex mb-50 mt-3 mx-auto h-10 p-2 bg-red-300 rounded-3xl w-50`, {}]}>
                                <Text style={[tw`text-center`, { fontFamily: 'Kanit_400Regular' }]}>Remove from Wishlist</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default Heart;
