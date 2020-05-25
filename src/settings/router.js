import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../pages/Splash';
import ProductListScene from '../pages/ProductList/ProductListScene';
import CartScene from '../pages/Cart/CartScene';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Product() {
    return (
        <Stack.Navigator headerMode={'none'} initialRouteName={'ProductListScene'}>
            <Stack.Screen name="ProductListScene" component={ProductListScene} />
        </Stack.Navigator>
    )
}

function Cart() {
    return (
        <Stack.Navigator headerMode={'none'} initialRouteName={'CartScene'}>
            <Stack.Screen name="CartScene" component={CartScene} />
        </Stack.Navigator>
    )
}

function MainTab() {
    return (
        <Tab.Navigator
            initialRouteName='Product'
            // tabBarOptions={{
            //     showLabel: false,
            // }}
        >
            <Tab.Screen
                name="Product"       
                component={Product}
                // options={{
                //     tabBarIcon: ({ focused }) => (
                //         <Image source={focused ? require('../icons/bottom/feed_on.png') : require('../icons/bottom/feed_off.png')} resizeMode={'contain'} style={{ width: 30, height: 30 }} />
                //     ),
                // }}
            />
            <Tab.Screen
                name="Cart"
                component={Cart}
                // options={{
                //     tabBarIcon: ({ focused }) => (
                //         <Image source={focused ? require('../icons/bottom/content_on.png') : require('../icons/bottom/content_off.png')} resizeMode={'contain'} style={{ width: 30, height: 30 }} />
                //     ),
                // }}
            />
        </Tab.Navigator>
    );
}

export default function Router() {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode={'none'} initialRouteName={'Splash'}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="MainTab" component={MainTab} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}