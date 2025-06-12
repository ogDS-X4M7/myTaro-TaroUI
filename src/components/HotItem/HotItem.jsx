// import { View, Text } from "@tarojs/components";
// import './HotItem.scss'

// const HotItem = ({ hot }) => {
//     return (
//         <View className="HotItem">
//             <View className="hot-title">{hot.title}</View>
//             <View className="hot-description">{hot.desc}</View>
//             <View className="hot-bottom">
//                 <View className="hot-hot"><Text className="myicon myicon-hot"></Text>热度：{hot.hot}</View>
//                 <View className="hot-url"><Text className="myicon myicon-star-outline"></Text>{hot.url}</View>
//             </View>
//         </View>
//     )
// }

// export default HotItem;
import { View, Text } from "@tarojs/components";
import React, { forwardRef } from 'react';
import './HotItem.scss'

// 使用 forwardRef 包装组件，使其支持 ref
const HotItem = forwardRef(({ hot }, ref) => {
    return (
        <View className="HotItem" ref={ref}>
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