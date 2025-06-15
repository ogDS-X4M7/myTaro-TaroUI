import React, { forwardRef, useRef } from 'react';
import { View, Text, Button } from '@tarojs/components'
import { useState, useEffect, useCallback } from 'react';
import { AtTag, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import Taro from '@tarojs/taro';
import './me.scss'


const Me = forwardRef((props, ref) => {
    const [needAuth, setNeedAuth] = useState(true);
    const [isOpened, setIsOpened] = useState(false);
    const loginRef = useRef(null);
    useEffect(() => {
        // loginRef.current.addEventListener('tap', OpenModal);
        // console.log(loginRef)
        console.log('Page loaded')
        // 写完每次都发现返回res.authSetting['scope.userInfo']为true，经查看微信官方文档，现在已经不适用这些api获取信息了，
        // getSetting拿到的一定是true授权，getUserInfo拿到的是匿名信息;
        // 于是转而想考虑使用getUserProfile，结果折腾半天getUserProfile也他妈停用了，它们觉得用wx.login就够了
        // 结果我跑去一看，这玩意给的是一个临时code，得授权，请求一个临时code，然后交给服务端，再处理，提交appid等等给微信
        // 微信才提供用户身份标识，不提别的，我就是搞个装模作样的授权，现在又叫我还得自己弄服务器，那我当然不干了
        // 本来就觉得教程里自己做一个model模态框还使用授权弹窗是脱裤子放屁，既然现在授权弹窗没有了，也就是没屁放了，
        // 但从学习的角度，我仍然可以做个模态框，而且不会有两个弹窗了，这样看起来就像是为了脱裤子而脱裤子，不会觉得在脱裤子放屁了
        // Taro.getSetting({
        //     success: function (res) {
        //         console.log(res);
        //         console.log(res.authSetting)
        //         // res.authSetting = {
        //         //   "scope.userInfo": true,
        //         //   "scope.userLocation": true
        //         // }
        //         if (res.authSetting['scope.userInfo'] === true) {
        //             console.log('来获取信息')
        //             Taro.getUserProfile({
        //                 desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        //                 success: (res) => {
        //                     // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        //                     setUserInfo(res.userInfo);
        //                     setHasUserInfo(true);
        //                 }
        //             })
        //         }
        //     }
        // })
    }, [])
    function OpenModal() {
        setIsOpened(true);
    }
    function handleCancel() {
        setIsOpened(false);
    }
    function handleClose() {
        setIsOpened(false);
    }
    // function handleConfirm() {
    //     Taro.login({
    //         success: function (res) {
    //             if (res.code) {
    //                 console.log('登录成功')
    //                 // const viewref = loginRef.current
    //                 if (loginRef.current) {
    //                     loginRef.current.removeEventListener('tap', OpenModal)
    //                     console.log('移除成功')
    //                 }
    //                 setNeedAuth(false);
    //                 //     //     //发起网络请求
    //                 //     //     Taro.request({
    //                 //     //         url: 'https://test.com/onLogin',
    //                 //     //         data: {
    //                 //     //             code: res.code
    //                 //     //         }
    //                 //     // })
    //             } else {
    //                 console.log('登录失败！' + res.errMsg)
    //             }
    //         }
    //     })
    //     setIsOpened(false);
    // }

    async function handleConfirm() {
        try {
            const loginres = await Taro.login();
            if (loginres.code) {
                console.log('登录成功')
                console.log(loginres.code)
                if (loginRef.current) {
                    loginRef.current.removeEventListener('tap', OpenModal)
                    console.log('移除成功')
                }
                setNeedAuth(false);
            } else {
                console.log('登录失败！' + loginres.errMsg)
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsOpened(false);
        }
    }
    return (
        <View className='me' ref={ref}>
            {/* <AtTag type='primary' circle active>标签2</AtTag>
            <AtButton type='primary'>按钮文案</AtButton> */}
            {/* <Button open-type='getUserProfile' onGetUserProfile={getUserProfile}>授权登录</Button> */}
            <View ref={loginRef} onClick={OpenModal}>
                {
                    needAuth
                        ? <View>
                            <Text className='className'>请先授权登录</Text>
                        </View>
                        : <View>
                            <Text>个人页面</Text>
                        </View>
                }
            </View>
            <AtModal
                isOpened={isOpened}
                title='授权提醒'
                cancelText='取消'
                confirmText='授权'
                onClose={handleClose}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                content='获取您的登录许可'
            />
        </View>
    )
})

export default Me
