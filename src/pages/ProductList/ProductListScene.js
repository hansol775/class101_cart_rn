import React, {useState, useEffect} from 'react'
import { View, Text} from 'react-native'
import productItems from '../../settings/data/productItems'

function ProductListScene() {
    const [productData, setProductData] =  useState()

    useEffect(() => {
        setProductData(productItems)
    }, [])


    return (
        <View>
            <Text>{JSON.stringify(productData)}</Text>
        </View>
    )
}

export default ProductListScene