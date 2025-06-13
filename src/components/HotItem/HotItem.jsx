import { View, Text } from "@tarojs/components";
import React, { forwardRef } from 'react';
import Taro from "@tarojs/taro";
import './HotItem.scss'

// 使用 forwardRef 包装组件，使其支持 ref
// 注意父组件传过来的toHotDetail，forwardRef第一个参数就是props，可以接收变量、方法
const HotItem = forwardRef(({ hot, toHotDetail }, ref) => {
    function getHotId() {
        // console.log(hot.id);
        toHotDetail && toHotDetail(hot);
    }
    return (
        <View className="HotItem" ref={ref} onClick={getHotId}>
            <View className="hot-title">{hot.title}</View>
            <View className="hot-description">{hot.desc}</View>
            <View className="hot-bottom">
                <View className="hot-hot"><Text className="myicon myicon-hot"></Text>热度：{hot.hot}</View>
                <View className="hot-url"><Text className="myicon myicon-star-outline"></Text>{hot.url}</View>
            </View>
        </View>
    )
});

export default HotItem;