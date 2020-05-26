import React, {useEffect} from 'react'
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Alert} from 'react-native'
import { inject, observer } from 'mobx-react';
import { commaNum } from '../../settings/utils/string'

function CartScene({navigation, userStore}) {

    useEffect(() => {
        userStore.fetchCartList()
        console.log(userStore)
    }, [])


    const deleteCart = (id) => {
        Alert.alert(
            '삭제하시겠습니까?', '', 
            [{ 
                text: '예',
                 onPress: () => userStore.deleteCartList(id)
                }, 
                { text: '아니오' }],
            { concelable: true }
        );
    }


    const renderItem = (item) => {
        return (
            <View style={{ flex: 1, marginHorizontal: 15, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', paddingBottom: 24 }}>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ height: 120, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 6, marginRight: 15, backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: item.coverImage }} style={{ width: 90, height: 120 }} resizeMode='cover' />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ color: '#202020', fontSize: 16, fontWeight: 'bold', marginBottom: 5, lineHeight:24, textAlign:'left' }}>{item.title}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', alignItems:'flex-end' }}>
                            <Text style={{ color: '#202020', fontSize: 16 }}>{commaNum(item.price)}원</Text>
                        <TouchableOpacity onPress={() => deleteCart(userStore.CartListIds.indexOf(item.id))}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F00' }}>빼기</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor:'#FFF' }}>
            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{fontSize:20, fontWeight:"bold", color:'#202020'}}>장바구니</Text>
            </View>
            <View style={{flex:1}}>
                <FlatList
                    data={userStore.CartList}
                    renderItem={({item}) => renderItem(item)}
                    keyExtractor={item => item.id}
                    extraData={userStore.CartList}
                />
            </View>
        </SafeAreaView>
    )
}

export default inject("userStore")(observer(CartScene));