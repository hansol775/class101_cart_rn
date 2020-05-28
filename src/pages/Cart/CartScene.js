import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { commaNum } from '../../settings/utils/string'
import coupon from '../../settings/data/coupons'
import produce from "immer"

function CartScene({ navigation, userStore }) {
    const [totalPrice, setTotalPrice] = useState(0)
    const [couponList, setCouponList] = useState(coupon)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [state, setState] = useState({
        cartList: toJS(userStore.CartList),
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            userStore.fetchCartList()
            setState(prev => ({ ...prev, cartList: toJS(userStore.CartList) }))
        });
        return unsubscribe;
    }, [navigation]);


    useEffect(() => {
        console.log('state.cardList 변경',state.cartList)
        let total = 0
        state.cartList.map((e) => {
            if (e.checked) {
                total = total + (e.price * e.number)
            }
        })
        setTotalPrice(total)
    }, [state.cartList])

    const deleteCart = (id) => {
        console.log('삭제를 누름!', state.cartList[id])
        Alert.alert(
            '삭제하시겠습니까?', '',
            [{
                text: '예',
                onPress: () => (
                    userStore.deleteCartList(id),
                    setRefreshing()
                )
            },
            { text: '아니오' }],
            { concelable: true }
        );
    }

    const setRefreshing = () => {
        userStore.fetchCartList()
        setState(prev => ({ ...prev, cartList: toJS(userStore.CartList) }))
    }

    const addPurchaseList = (item, index) => {
        setState(produce(draft => {
            draft.cartList[index].checked = true
        }))
    }

    const deletePurchaseList = (item, index) => {
        setState(produce(draft => {
            draft.cartList[index].checked = false
        }))
    }

    const increaseNumber = (item, index) => {
        setState(produce(draft => {
            draft.cartList[index].number = draft.cartList[index].number + 1
        }))
    }

    const decreaseNumber = (item, index) => {
        setState(produce(draft => {
            draft.cartList[index].number = Math.max(draft.cartList[index].number - 1, 1)
        }))
    }

    const setCouponPrice = (item) => {
        let total = 0
        const purchase = state.cartList.filter(e => e.checked)
        if (item.type === 'rate') {
            if (purchase.length === 1) {
                purchase.map((e) => {
                    e.availableCoupon === undefined
                        ? total = total + (e.price * e.number) * (1 - (1 / item.discountRate))
                        : (alert('쿠폰사용불가 상품입니다.'), total = total + e.price * e.number)
                })
            } else {
                purchase.map((e) => {
                    e.availableCoupon === undefined
                        ? total = total + (e.price * e.number) * (1 - (1 / item.discountRate))
                        : total = total + e.price * e.number
                })
                
            }
            console.log(item.title, '쿠폰을 선택하여', total, '원이 나왔습니다.')
            setTotalPrice(total)
        } else {
            if (purchase.length === 1) {
                purchase.map((e) => {
                    e.availableCoupon === undefined
                        ? total = (total + e.price * e.number) - item.discountAmount
                        : (alert('쿠폰사용불가 상품입니다.'), total = total + e.price * e.number)
                })
            } else {
                purchase.map((e) => {
                    e.availableCoupon === undefined
                        ? total = total + e.price * e.number
                        : total = total + e.price * e.number
                })
                total = total - item.discountAmount
            }
            console.log(item.title, '쿠폰을 선택하여', total, '원이 나왔습니다.')
            setTotalPrice(total)
        }
    }


    const renderItem = (item, index) => {
        return (
            <View style={{ flex: 1, marginHorizontal: 15, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', paddingBottom: 24 }}>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }}>
                    {
                        item.checked ?
                            <TouchableOpacity onPress={() => deletePurchaseList(item, index)} style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                                <View style={{ width: 15, height: 15, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ width: 7, height: 7, backgroundColor: '#000' }} />
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => addPurchaseList(item, index)} style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                                <View style={{ width: 15, height: 15, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ width: 7, height: 7, backgroundColor: '#FFF' }} />
                                </View>
                            </TouchableOpacity>
                    }
                    <View style={{ height: 120, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 6, marginRight: 15, backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: item.coverImage }} style={{ width: 90, height: 120 }} resizeMode='cover' />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ color: '#202020', fontSize: 16, fontWeight: 'bold', marginBottom: 5, lineHeight: 24, textAlign: 'left' }}>{item.title}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14 }}>{item.availableCoupon === undefined ? '쿠폰사용가능 상품' : '쿠폰사용불가 상품'}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16, fontWeight: 'bold' }}>수량 {item.number}개</Text>
                                <View>
                                    <TouchableOpacity onPress={() => increaseNumber(item, index)}>
                                        <Image source={require('../../assets/icons/up-arrow.png')} style={{ width: 15, height: 15 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => decreaseNumber(item, index)} style={{ marginRight: 5 }}>
                                        <Image source={require('../../assets/icons/down-arrow.png')} style={{ width: 15, height: 15 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <Text style={{ color: '#202020', fontSize: 16 }}>{commaNum(item.price * item.number)}원</Text>
                            <TouchableOpacity onPress={() => deleteCart(index)}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F00' }}>빼기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: '#202020' }}>장바구니</Text>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={state.cartList}
                    renderItem={({ item, index }) => renderItem(item, index)}
                    keyExtractor={item => item.id}
                    extraData={userStore.CartList}
                    refreshing={isRefreshing}
                    onRefresh={() => setRefreshing()}
                />
            </View>
            <View style={{ backgroundColor: '#5ABAFF', padding: 10, alignItems: 'flex-end' }}>

                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 10 }}>쿠폰적용하기</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
                    {
                        couponList.map((e, i) => (
                            <TouchableOpacity
                                onPress={() => setCouponPrice(e)}
                                key={i}
                                style={{ borderColor: '#FFF', borderWidth: 1, padding: 2, marginRight: 5 }}>
                                <Text style={{ color: '#FFF', fontSize: 14 }}>{e.title}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <Text style={{ fontSize: 16, color: '#FFF' }}>총 금액 :  {commaNum(totalPrice)}원</Text>
            </View>
        </SafeAreaView>
    )
}

export default inject("userStore")(observer(CartScene));