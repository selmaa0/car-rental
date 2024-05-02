import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import Home from './src/Home';
import Heart from './src/Heart';
import Signup from './src/Signup';
import Login from './src/Login';
import Settings from './src/Settings';
import Homepage from './src/Homepage';
import Cemail from './src/Cemail';
import Cpassword from './src/Cpassword';
import Cars from './src/Cars';
import Clocation from './src/Clocation';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'black', // Color of the active tab
        inactiveTintColor: 'gray', // Color of the inactive tabs
        style: {
          backgroundColor: '#ffffff', // Background color of the tab bar
        },
        labelStyle: {
          fontSize: 12, // Font size of tab labels
          fontWeight: 'bold', // Font weight of tab labels
        },
        tabStyle: {
          paddingTop: 5, // Padding top of individual tabs
          paddingBottom: 5, // Padding bottom of individual tabs
        },
        iconStyle: {
          marginBottom: -3, // Adjust icon position if needed
        },
      }}
    >
            <Tab.Screen
        name="Homepage"
        component={Homepage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

<Tab.Screen
        name="Wishlist"
        component={Heart}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />


    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer initialRouteName={Home}>
      <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
          name="Homepage"
          component={HomeStack}  // Render the HomeStack navigator
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Cars" component={Cars} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Cemail" component={Cemail} options={{ headerShown: false }} />
        <Stack.Screen name="Cpassword" component={Cpassword} options={{ headerShown: false }} />
        <Stack.Screen name="Clocation" component={Clocation} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
