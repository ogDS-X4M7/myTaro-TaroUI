import React, { forwardRef } from 'react';
import { View, Text, Button, Video, Icon } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton, AtMessage, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro';
import './like.scss'


const Like = forwardRef((props, ref) => {
    useEffect(() => {
        console.log('Page loaded')
    }, [])
    return (
        <View>test</View>
    )
})

export default Like


