import React, { useState, useEffect } from 'react'
import { View, Text, Image, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import productItems from '../../settings/data/productItems'
import { commaNum } from '../../settings/utils/string'
import { inject, observer } from 'mobx-react';

function ProductListScene({ navigation, userStore }) {
    const [productData, setProductData] = useState()
    const [currentData, setCurrentData] = useState()
    const [dataIndex, setDataIndex] = useState()
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        setMainProductList()
    }, [])

    const setMainProductList = () => {
        let len = productItems.length
        let cnt = Math.floor(len / 5)
        let tmp = []
        const sort_data = productItems.sort((a, b) => a.score > b.score ? -1 : a.score < b.score ? 1 : 0)
        for (let i = 0; i <= cnt; i++) {
            tmp.push(sort_data.splice(0, 5));
        }

        setProductData(tmp)
        setCurrentData(tmp[0])
        setDataIndex(1)
    }

    const loadMoreData = () => {
        if (productData.length > dataIndex) {
            let data = currentData.concat(productData[dataIndex])
            setDataIndex(dataIndex + 1)
            setCurrentData(data)
        } else {
            alert(`마지막 페이지입니다. ${JSON.stringify(productItems)}`)
            
        }
    }

    const setRefreshing = () => {
        setCurrentData(productData[0])
        setDataIndex(1)
        console.log(productData)
    }

    const addMyCart = (item) => {
        if(userStore.CartList.length >= 3) {
            alert('장바구니에는 최대 3개의 상품만 담길 수 있습니다.')
        } else {
            userStore.addCartList({...item, number: 1, checked: true})
        }
        
    }

    const renderItem = (item) => {
        let index = userStore.CartListIds.indexOf(item.id)
        let isFav = index >= 0;
        return (
            <View style={{ flex: 1, marginHorizontal: 15, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', paddingBottom: 24 }}>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ height: 120, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 6, marginRight: 15, backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: item.coverImage }} style={{ width: 90, height: 120 }} resizeMode='cover' />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ color: '#202020', fontSize: 16, fontWeight: 'bold', marginBottom: 5, lineHeight: 24, textAlign: 'left' }}>{item.title}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', alignItems:'flex-end' }}>
                            <Text style={{ color: '#202020', fontSize: 16 }}>{commaNum(item.price)}원</Text>
                            {
                                isFav ?
                                    <TouchableOpacity

                                        onPress={() => userStore.deleteCartList(userStore.CartListIds.indexOf(item.id))}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F00' }}>빼기</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity

                                        onPress={() => addMyCart(item) }>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>담기</Text>
                                    </TouchableOpacity>
                            }
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderFooter = () => {
        return (
            <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: '#000', borderWidth: 1, marginHorizontal: 20, paddingVertical: 5, marginBottom: 20 }}
                onPress={() => loadMoreData()}>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>더 불러오기</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: '#202020' }}>상품리스트</Text>
            </View>
            <View style={{flex:1}}>
                <FlatList
                    data={currentData}
                    renderItem={({ item }) => renderItem(item)}
                    keyExtractor={item => item.id}
                    ListFooterComponent={() => renderFooter()}
                    refreshing={isRefreshing}
                    onRefresh={() => setRefreshing()}
                    extraData={userStore.CartList}
                />
                {/* <Text>{JSON.stringify(productData)}</Text> */}
            </View>
        </SafeAreaView>

    )
}

export default inject("userStore")(observer(ProductListScene));