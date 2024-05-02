import React, { useState, useEffect } from 'react';
import { Alert, View, Text, ScrollView, TouchableOpacity, Image, Modal, Error } from 'react-native';
import tw from 'twrnc';
import { supabase } from "../supabase/supabase";
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icon library


const CarRentalScreen = () => {
  const [selectedModel, setSelectedModel] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All'); // State to keep track of the selected brand
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null); // State to keep track of the selected car
  const [rentalDates, setRentalDates] = useState({ startDate: new Date(), endDate: new Date() });
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // State to store user's location
  const [isWishlistSelected, setIsWishlistSelected] = useState(false); // State to track wishlist selection
  const [favoriteCars, setFavoriteCars] = useState([]); // State to store favorite cars

  const navigation = useNavigation();


  
  const handleWishlistToggle = async () => {
    try {
      const {   data: { user }, } = await supabase.auth.getUser()
      const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

      console.log(userData.id);

      if (!userData || !selectedCar) return; // Check if user ID and selected car are available

      if (isWishlistSelected) {
        // Remove car from wishlist
        const { error } = await supabase.from('wishlist').delete().eq('user_id', userData.id).eq('car_id', selectedCar.car_id);
        Alert.alert("Car removed from Wishlist")
        if (error) {
          throw error;
        }
        setIsWishlistSelected(false); // Update state
      } else {
        // Add car to wishlist
        const { error } = await supabase.from('wishlist').insert([{ user_id: userData.id, car_id: selectedCar.car_id }]);
        Alert.alert("Car added to Wishlist")
    setIsWishlistSelected(true); // Update state
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error.message);
    }
  };


  useEffect(() => {
    // Fetch car data from Supabase table
    const fetchCars = async () => {
      const { data, error } = await supabase.from('cars').select('*');
      if (error) {
        console.error('Error fetching car data:', error.message);
      } else {
        setCars(data);
      }
    };

    fetchCars();
  }, []);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setSelectedBrand(model); // Set selected brand when a brand button is picked
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };

  
  const handleRentNow = async () => {
    try {
      // Fetch user ID from the users table based on user's email
      const {   data: { user }, } = await supabase.auth.getUser()
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();
  
      if (userError) {
        throw userError;
      }
  
      if (!userData) {
        throw new Error('User not found');
      }
  
      // Insert a new row into the rental table
      const { data: rentalData, error: rentalError } = await supabase
        .from('rental')
        .insert([
          {
            user_id: userData.id, // User ID
            car_id: selectedCar.car_id, // Car ID
            start_date: rentalDates.startDate, // Start date
            return_date: rentalDates.endDate, // End date
            total_cost: calculateTotalPrice() // Total price
          }
        ]);
  
      if (rentalError) {
        throw rentalError;
      }
  
      // Show success alert
      Alert.alert(
        'Success',
        'Car rented successfully',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
  
      console.log('Rental data:', rentalData);
      console.log('Rent Now button pressed');
    } catch (error) {
      // Show error alert
      Alert.alert(
        'Error',
        'Failed to rent car: ' + error.message,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      console.error('Error renting car:', error.message);
    }
  };
      
  const showStartDatePicker = () => {
    setIsStartDatePickerVisible(true);
  };

  const hideStartDatePicker = () => {
    setIsStartDatePickerVisible(false);
  };

  const handleStartDateConfirm = (date) => {
    setRentalDates(prevState => ({ ...prevState, startDate: date }));
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setIsEndDatePickerVisible(true);
  };

  const hideEndDatePicker = () => {
    setIsEndDatePickerVisible(false);
  };

  const handleEndDateConfirm = (date) => {
    setRentalDates(prevState => ({ ...prevState, endDate: date }));
    hideEndDatePicker();
  };

  // Function to calculate total price
  const calculateTotalPrice = () => {
    // Calculate the number of days between start date and end date
    const startDate = rentalDates.startDate.getTime();
    const endDate = rentalDates.endDate.getTime();
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.ceil((endDate - startDate) / millisecondsPerDay);
    
    // Calculate total price
    const totalPrice = numberOfDays * (selectedCar && selectedCar.price_per_day) + (selectedCar && selectedCar.price_per_day);
    
    return totalPrice;
  };

  const fetchUserLocation = async () => {
    try {
      const {   data: { user }, } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User session not found');
      }
      console.log('User:', user);
      const { data } = await supabase
        .from('users')
        .select('city')
        .eq('email', user.email);
      console.log('User:', data);
      if (!data || data.length === 0) {
        throw new Error('User location not found');
      }
      setUserLocation(data[0]?.city); // Assuming 'city' is the correct field for user location
    } catch (error) {
      console.error('Error fetching user location:', error.message);
    }
  };
  
  const handleYourLocation = () => {
    fetchUserLocation(); // Fetch user's location
    setSelectedModel('Your Location'); // Set selected model to "Your Location"
    setSelectedBrand('Your Location'); // Set selected brand to "Your Location"
  };


  // Filter cars based on the selected brand
  const filteredCars = cars.filter(car => {
    if (selectedModel === 'All') {
      return true; // Show all cars
    } else if (selectedModel === 'Your Location') {
      return car.city === userLocation; // Show cars based on user's location
    } else {
      return car.model === selectedModel; // Show cars of the selected brand
    }
  });
  
  const carBrands = [ 'Ford', 'Nissan', 'Kia', 'Mercedes', 'Toyota', 'Dacia', 'Volvo'];

  return (
    <View style={tw`flex-1 justify-center mt-10`}>
      <View style={[tw`flex mb-3`, tw`flex-row`, tw`items-center`]}>
        <TouchableOpacity
          style={[tw`p-3`]}
          onPress={() => navigation.goBack()}>
          <Image
            style={[tw`w-7 h-5`, { tintColor: '#808080' }]}
            source={require('../assets/arrow.png')}
          />
        </TouchableOpacity>
        <Text style={[tw`ml-2 mt-2 text-3xl`, { fontFamily: 'Kanit_400Regular' }]}>Our Vehicles</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[tw`flex-row px-4 py-2 `, { marginLeft: -20 }]}>
          <TouchableOpacity
            style={[
              tw`px-4 py-2 rounded-2xl`,
              selectedModel === 'All' ? tw`bg-gray-600` : tw`bg-gray-400`,
              tw`ml-4 h-10`
            ]}
            onPress={() => handleModelSelect('All')}
          >
            <Text style={[tw`text-gray-800 text-center`,{ fontFamily: 'Kanit_400Regular', fontSize:15 }]}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[tw`px-4 py-2 rounded-2xl`, tw`bg-gray-400`, tw`h-10 ml-4`,
            selectedModel === 'Your Location' ? tw`bg-gray-600` : tw`bg-gray-400`,
          ]}
            onPress={handleYourLocation}
            
          >
            <Text style={[tw`text-gray-800 text-center`, { fontFamily: 'Kanit_400Regular', fontSize: 15 }]}>Your Location</Text>
          </TouchableOpacity>

          {carBrands.map((brand, index) => (
            <TouchableOpacity
              key={index}
              style={[
                tw`px-4 py-2 rounded-2xl`,
                brand === selectedModel ? tw`bg-gray-600` : tw`bg-gray-400`,
                tw`ml-4 h-10`
              ]}
              onPress={() => handleModelSelect(brand)}
            >
              <Text style={[tw`text-gray-800 text-center`,{ fontFamily: 'Kanit_400Regular', fontSize:15 }]}>{brand}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <ScrollView>
        {/* Car list */}
        {filteredCars.map((car, index) => (
          <TouchableOpacity key={index} onPress={() => handleCarSelect(car)}>
            <View style={[tw` ml-3`]}>
              <View style={[tw`border h-100 mr-3 mt-5 rounded-2xl `]}>
                <Image 
                  source={car.photo ? { uri: car.photo } : require('../assets/ford1.png')} 
                  resizeMode='contain' 
                  style={{ borderRadius: 8, width: '100%', height: '100%', marginTop: -40, marginBottom: -90 }} 
                />
                <Text style={[tw`ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{car.name}</Text>
                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 14 }]}>{car.model}</Text>
                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: '', fontSize: 14 }]}>_______________________________________________</Text>
                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{car.city} {car.price_per_day}/Day</Text>
                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{car.seats} Seats</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Display car details in modal */}
      <Modal visible={selectedCar !== null} animationType="slide">
        <ScrollView>
        <View style={tw`flex-1  items-center`}>
          <View style={[tw`bg-white rounded-t-3xl `, ]}>
            <View style={[tw`flex flex-row `, ]} >
            <Text style={[tw`text-2xl mb-4 mt-10`, { fontFamily: 'Kanit_400Regular', fontSize: 30 }]}>Selected Car</Text>

            <TouchableOpacity onPress={handleWishlistToggle}>
              <View style={[tw` ml-20 mt-8 h-10 p-2 bg-gray-300 rounded-3xl`, { }]}>
              <Text style={[tw`text-center`, { fontFamily: 'Kanit_400Regular' }]}>Wishlist</Text>

              </View>
          </TouchableOpacity>
          </View>
            <View>
              <View style={[tw`border h-100 mt-5 rounded-2xl `]}>
                <Image
                  source={selectedCar && selectedCar.photo ? { uri: selectedCar.photo } : require('../assets/ford1.png')}
                  resizeMode='contain'
                  style={{ borderRadius: 8, width: '100%', height: '100%', marginTop: -40, marginBottom: -90 }}
                />
                <Text style={[tw`ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{selectedCar && selectedCar.name}</Text>
                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 14 }]}>{selectedCar && selectedCar.model}</Text>
                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: '', fontSize: 14 }]}>_______________________________________________</Text>
                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{selectedCar && selectedCar.city}                                       {selectedCar && selectedCar.price_per_day}/Day</Text>
                <Text style={[tw`text-[#808080] ml-3`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>{selectedCar && selectedCar.seats} Seats</Text>
              </View>
              {/* Start date picker */}
              <TouchableOpacity onPress={showStartDatePicker}>
                <View style={[tw`mt-10 h-10 p-2 bg-gray-300 rounded-3xl`, { }]}>
                  <Text style={[tw``, { fontFamily: 'Kanit_400Regular' }]}>Select Start Date: {rentalDates.startDate.toDateString()}</Text>
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                date={rentalDates.startDate}
                onConfirm={handleStartDateConfirm}
                onCancel={hideStartDatePicker}
              />
              {/* End date picker */}
              <TouchableOpacity onPress={showEndDatePicker}>
                <View style={[tw`mt-5 h-10 p-2 bg-gray-300 rounded-3xl`, { }]}>
                  <Text style={[tw``, { fontFamily: 'Kanit_400Regular' }]}>Select End Date: {rentalDates.endDate.toDateString()}</Text>
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                date={rentalDates.endDate}
                onConfirm={handleEndDateConfirm}
                onCancel={hideEndDatePicker}
              />
              {/* Rent now button */}
              <TouchableOpacity onPress={handleRentNow}>
                <View style={[tw`mx-auto mt-10 h-10 p-2 bg-gray-300 rounded-3xl w-50`, { }]}>
                  <Text style={[tw`text-center`, { fontFamily: 'Kanit_400Regular' }]}>Rent Now</Text>
                </View>
              </TouchableOpacity>
              {/* Total price */}
              <Text style={[tw`text-center mt-5`, { fontFamily: 'Kanit_400Regular', fontSize: 18 }]}>Total Price: ${calculateTotalPrice()}</Text>
              {/* Close modal button */}
              <TouchableOpacity onPress={() => setSelectedCar(null)}>
                <View style={[tw`mx-auto mt-3 h-10 p-2 bg-red-300 rounded-3xl w-50`, { }]}>
                  <Text style={[tw`text-center`, { fontFamily: 'Kanit_400Regular' }]}>Close</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default CarRentalScreen;
