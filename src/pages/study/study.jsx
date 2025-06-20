import React, { forwardRef } from 'react';
import { View, Text, Button, WebView } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton, AtMessage } from 'taro-ui'
import Taro from '@tarojs/taro';
import './study.scss'
import service from '../../service';


const Study = forwardRef((props, ref) => {
    // 权限信号，用于设置学习页面登录前后内容展示
    const [needAuth, setNeedAuth] = useState(true);
    // 使用state管理url
    const [webViewUrl, setWebViewUrl] = useState('');
    useEffect(() => {
        console.log('Page loaded')
    }, [])

    function handleMessage() { }
    async function tryEnter() {
        // const token = Taro.getStorageSync('token')
        // // console.log(token);
        // // 有token再发请求，不然taro框架内部的文件发现请求失败就要在控制台报错，虽然不影响功能，但不美观
        // if (token) {
        //     try {
        //         const res = await service.study();
        //         if (res.data.code === 200) {
        //             // Taro.atMessage({
        //             //     'message': '获取数据成功',
        //             //     'type': '',
        //             // })
        //             setWebViewUrl(res.data.data.res)
        //             setNeedAuth(false)
        //         } else {
        //             console.log('请求出错')
        //         }
        //     } catch (err) {
        //         return err
        //     }
        // } else {
        //     Taro.atMessage({
        //         'message': '请先登录',
        //         'type': 'error',
        //     })
        // }

        // 下面附一个免请求版本，让体验服不受登录的干扰，切换时把上面的都注释掉换成下面即可
        setWebViewUrl('https://ogds-x4m7.github.io/InternshipGain/')
        setNeedAuth(false)
    }
    return (
        <View>
            {
                needAuth
                    ?
                    <View>
                        <AtMessage />
                        <AtButton type='primary' onClick={tryEnter}>进入知识文档</AtButton>
                        {/* <WebView src={webViewUrl} onMessage={handleMessage} /> */}
                    </View>
                    :
                    <WebView src={webViewUrl} onMessage={handleMessage} />
            }
        </View>
    )
})

export default Study;

