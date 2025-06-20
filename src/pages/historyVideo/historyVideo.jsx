import React, { forwardRef } from 'react';
import { View, Text, Button, Video, Icon } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton, AtMessage, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro';
import './historyVideo.scss'
import { inject, observer } from 'mobx-react';



const HistoryVideo = forwardRef(({ videoStore }, ref) => {
    useEffect(async () => {
        console.log('Page loaded')
    }, [])

    async function handleClickVideo(clickUrl) {
        const res = await videoStore.playHistory(clickUrl)
        if (res) {
            // 注意navigateTo只能跳转非tab页面，这里使用会报错，得用switchTab来切换tab页面
            debugger
            Taro.switchTab({
                url: `/pages/shortvideo/shortvideo`,
                // ? url = ${ clickUrl }
            })
        }
    }

    return (
        <View>
            {
                videoStore.history.length
                    ?
                    <View>
                        {
                            // 在热点列表中使用过hotItem来处理map的点击，这里只有url，就不必要再弄组件，而且也展示第二种解决方案
                            videoStore.history.map((url) =>
                                <View className='historybox' key={url} onClick={() => handleClickVideo(url)}>
                                    <Video
                                        key={url}
                                        src={url}
                                        className='videobox'
                                        onClick={() => handleClickVideo(url)} // 绑定事件并传递数据
                                        initialTime={0}
                                        controls={false}
                                        autoplay={false}
                                        loop={false}
                                        muted={false}
                                        showCenterPlayBtn={false}
                                    />
                                    <View >假装我是视频</View>
                                    <Text>视频没有标题</Text>
                                </View>)
                        }
                    </View>
                    :
                    <View>还没有任何历史记录哦</View>
            }
        </View>
    )
})


export default inject('videoStore')(observer(HistoryVideo))
