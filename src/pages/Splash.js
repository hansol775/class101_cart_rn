import React, { useEffect} from 'react';
import { View, Text} from 'react-native';

function Splash({route, navigation}) {

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('MainTab')
        }, 2000)
    }, [])

    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text>스플래쉬</Text>
        </View>
    )
}

export default Splash