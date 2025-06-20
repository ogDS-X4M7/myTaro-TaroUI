import React, { forwardRef } from 'react';
import { View, Text, Button, WebView } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton } from 'taro-ui'
import Taro from '@tarojs/taro';
import './hot.scss'


const Hot = forwardRef((props, ref) => {
    // 使用state管理url
    const [webViewUrl, setWebViewUrl] = useState('');
    useEffect(() => {
        console.log('Page loaded')
        // console.log(Taro.getCurrentPages().length)// 能够显示当前页面栈深度，如果使用redirect重定向过来的，大概率就是1，这里前面是navigateto过来，所以是2
        // console.log(Taro.getCurrentInstance().router.params)// 前面跳转可以携带params参数，这边通过router路由器来读取
        let decodedUrl = decodeURIComponent(Taro.getCurrentInstance().router.params.url)
        // console.log('完整URL',decodedUrl);
        setWebViewUrl(decodedUrl)
    }, [])
    // function goback() {
    //     Taro.navigateBack({
    //         delta: 1 // 可以设置返回深度，这里是为了演示，不写也可以因为默认就是1；
    //     })
    // }
    // function goToMe() {
    //     // 如果使用navigate无法切换tab页面，会报错："errMsg":"navigateTo:fail can not navigateTo a tabbar page"
    //     // Taro.navigateTo({ 无法跳转！！
    //     //     url: '/pages/me/me'
    //     // })
    //     Taro.switchTab({
    //         url: '/pages/me/me'
    //     })
    // }
    function handleMessage() { }
    return (
        // <View className='hot' ref={ref}>
        //     热点详情
        //     <Button onClick={goback}>点我返回</Button>
        //     <Button onClick={goToMe}>点我前往个人页面</Button>
        // </View>
        // 处理url，如果直接传像“？”这类特殊字符会导致解析出问题，因此使用encodeURIComponent编码后传过来，再用decodeURIComponent解码使用
        // webview会占满屏幕，因此不能return其他内容
        <WebView src={webViewUrl} onMessage={handleMessage} />
    )
})

export default Hot;

