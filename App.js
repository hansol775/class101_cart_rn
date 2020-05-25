import 'react-native-gesture-handler';
import * as React from 'react';
import Router from './src/settings/router';

if (process.env.NODE_ENV === 'production') {
    console.log = ()=>{}
}

export default function App() {
    return (
        <Router/>
    );
}