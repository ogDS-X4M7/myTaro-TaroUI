import { Component } from 'react';
// 从 Taro 3 开始，类组件的 Component 基类需要从 react 导入，而不是 @tarojs/taro
import { View } from '@tarojs/components';

// 这里记录一个类组件的写法，不过现在更推荐函数组件+hook的写法，因此这里只留一个示范，其他采用函数组件实现
export default class Item extends Component {
    render() {
        const { text } = this.props;
        return (
            <View>{ text }</View>
        )
    }
}