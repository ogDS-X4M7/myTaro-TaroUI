import React, { forwardRef } from 'react';
import { View, Text, Button, Video, Icon } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton, AtMessage, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro';
import './historyVideo.scss'
import { inject, observer } from 'mobx-react';



const HistoryVideo = forwardRef(({ videoStore }, ref) => {
    // 设置信号重载页面 实现清空历史记录后的刷新效果
    const [refresh, setRefresh] = useState(false);
    // 因为发现历史、点赞、收藏页面具有高度重复性，因此集合到一起写，通过外部传入对应标志信号fromSignal来判断要展示历史还是点赞收藏
    // 这里设置状态信号接收
    const [fromSignal, setFromSignal] = useState(-1);
    // 设置统一的视频展示列表，根据状态信号切换
    const [videoList, setVideoList] = useState([])
    // 这里出现过问题，如果useEffect的回调函数如果直接使用async会导致，页面能进入，但是退出时会报错c is not a function，程序崩溃：
    // 原因如下：async 函数会隐式返回一个 Promise，而 useEffect 期望的返回值是一个清理函数（或不返回任何值）
    // 因此，当组件卸载时，React 会发现拿到一个promise返回，导致程序崩溃
    // 当然也可能是 组件卸载时异步操作尚未完成，导致资源释放异常；
    // 总而言之,useEffect 的回调函数不能是 async
    // 如果实在需要异步,那也应该在回调内部写async,而不能让回调成为async
    // 这里再详解一下useEffect：
    useEffect(() => {
        console.log('Page loaded')
        let fromSignal = Taro.getCurrentInstance().router.params.fromSignal;
        // 参数fromSignal从个人页面点击进入时传入,因为是navigate链接的params参数，因此通过如上方式从路由里获取
        setFromSignal(fromSignal);
        if (fromSignal === '0') {
            setVideoList(videoStore.history)
        } else if (fromSignal === '1') {
            setVideoList(videoStore.likes)
        } else {
            setVideoList(videoStore.collections)
        }
    }, [refresh])

    async function handleClickVideo(clickUrl) {
        const res = await videoStore.playHistory(clickUrl, fromSignal) // fromSignal设置信号，从播放页退出能回到对应的历史、点赞、收藏页面
        if (res) {
            // 注意navigateTo只能跳转非tab页面，这里使用会报错，得用switchTab来切换tab页面
            Taro.switchTab({
                url: `/pages/shortvideo/shortvideo`,
                // ? url = ${ clickUrl }
            })
        }
    }
    async function clearHistory() {
        const res = await videoStore.clearHistory()
        if (res.code === 200) {
            setRefresh(!refresh)
        }
        console.log(res.msg)
    }

    return (
        <View>
            {
                fromSignal === '0'
                    ? <View>
                        <View>浏览历史</View>
                        <AtButton onClick={clearHistory} >清空浏览历史记录</AtButton>
                    </View>
                    : fromSignal === '1'
                        ? <View>我的点赞</View>
                        : <View>我的收藏</View>
            }
            {
                videoList.length
                    ?
                    <View>
                        {
                            // 在热点列表中使用过hotItem来处理map的点击，这里只有url，就不必要再弄组件，而且也展示第二种解决方案
                            videoList.map((url) =>
                                <View className='historybox' key={url} onClick={() => handleClickVideo(url)}>
                                    {/* 事实上这里压根不应该、不必要请求视频，但是因为只有视频，没有封面之类的其他任何东西，而且出于做个demo小项目的想法，请求视频就请求视频吧
                                     但是会很卡，如果卡到影响测试(毕竟请求大量视频数据量是很夸张的)了，就换成下面的没有封面来替代video，
                                     这里这么写是因为开发时请求到video能帮助看到视频部分内容，更能确保点击跳转等功能是否正确 */}
                                    {/* <Video
                                        key={url}
                                        src={url}
                                        className='videobox'
                                        initialTime={0}
                                        controls={false}
                                        autoplay={false}
                                        loop={false}
                                        muted={false}
                                        showCenterPlayBtn={false}
                                    /> */}
                                    <View className='videobox'>没有封面</View>
                                    <View className='textContent'>
                                        <Text className='videoTitle'>该视频没有标题</Text>
                                        <Text className='videoUpper'>该视频没有作者</Text>
                                    </View>
                                </View>)
                        }
                    </View>
                    :
                    <View className='nohistory'>
                        <Text>还没有任何记录哦</Text>
                    </View>
            }
        </View>
    )
})


export default inject('videoStore')(observer(HistoryVideo))
