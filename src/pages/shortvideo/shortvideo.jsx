import React, { forwardRef, useRef } from 'react';
import { View, Text, Button, Video, Icon } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton, AtMessage, AtIcon, AtToast } from 'taro-ui'
import Taro from '@tarojs/taro';
import './shortvideo.scss'
import { inject, observer } from 'mobx-react';



const ShortVideo = forwardRef(({ videoStore }, ref) => {
    const [videosrc, setVideoSrc] = useState(''); // 设置视频播放链接
    const [fromOhter, setFromOhter] = useState(false); // 设置信号，判断是不是从浏览历史、点赞、收藏页面过来的 
    const [likeOpened, setLikeOpened] = useState(false) // 点赞成功显示信号
    const [unlikeOpened, setUnlikeOpened] = useState(false) // 点赞取消显示信号
    const [collectOpened, setCollectOpened] = useState(false) // 收藏成功显示信号
    const [uncollectOpened, setUncollectOpened] = useState(false) // 收藏取消显示信号
    const [likeThrottle, setLikeThrottle] = useState(false) // 点赞节流信号
    const [collectThrottle, setCollectThrottle] = useState(false) // 收藏节流信号
    // Throttle

    // const location = useLocation();
    useEffect(() => {
        // console.log('Page loaded');
        let res = '';
        // 点击传递播放视频的方法里同时设置了clickUrl，如果有就说明是从历史记录点击过来的，没有就是自然观看
        let clickUrl = videoStore.getClickUrl();
        // console.log(clickUrl);
        // 在前面的historyVideo讲过，不能给回调直接套上异步，应该内部写立即执行异步函数
        (async () => {
            if (clickUrl) {
                setFromOhter(true)
                Taro.atMessage({
                    message: '浏览历史视频中，点底部中间按钮则返回，观看其他视频则退出历史',
                })
                res = await videoStore.getNext()
            } else {
                setFromOhter(false)
                res = await videoStore.getVideoes()
            }
            // console.log(res)
            setVideoSrc(res)
        })();

    }, [videoStore.getClickUrl()])


    async function getNext() {
        let res = await videoStore.getNext();
        if (res) setVideoSrc(res)
    }

    async function getPrev() {
        let res = await videoStore.getPrev();
        if (res) {
            setVideoSrc(res)
        } else {
            Taro.atMessage({
                'message': '已经是第一条视频',
                'type': '',
            })
        }
    }

    async function exitOhter() {
        videoStore.clearClickUrl(); // 如预期所想，清空会重新渲染
        // 弄个定时器缓冲一下，因为重新渲染后，由于video的设置视频会自动播放，因此可能出现到历史记录还有视频播放的声音
        // 又因为taro的video没有或者说很难暂停，常规的ref和查到的方法都使用过，没能暂停video，
        // 因此转而利用切换页面自动暂停的api来避免回到历史记录还有视频播放的声音
        // 而想要利用这个api，就只有让视频先播放再跳转，才能利用它切换页面暂停视频，因此用了定时器缓冲
        setTimeout(() => {
            Taro.switchTab({
                url: '/pages/me/me'
            })
            // 退出时根据信号返回对应的页面
            if (videoStore.fromSignal === '0') {
                Taro.navigateTo({
                    url: '/pages/historyVideo/historyVideo?fromSignal=0'
                })
            } else if (videoStore.fromSignal === '1') {
                Taro.navigateTo({
                    url: '/pages/historyVideo/historyVideo?fromSignal=1'
                })
            } else {
                Taro.navigateTo({
                    url: '/pages/historyVideo/historyVideo?fromSignal=2'
                })
            }
        }, 300)
    }

    async function updateLikes(signal) {
        if (!likeThrottle) {
            setLikeThrottle(true)
            const res = await videoStore.updateLikes(signal)
            if (signal === 1) {
                setLikeOpened(true)
                setTimeout(() => {
                    setLikeOpened(false)
                }, 1000)
            } else {
                setUnlikeOpened(true)
                setTimeout(() => {
                    setUnlikeOpened(false)
                }, 1000)
            }
            setLikeThrottle(false);
        } else {
            Taro.atMessage({
                message: '操作过快，请稍后重试',
                type: 'info'
            })
        }

    }

    async function updateCollections(signal) {
        if (!collectThrottle) {
            setCollectThrottle(true)
            const res = await videoStore.updateCollections(signal)
            if (signal === 1) {
                setCollectOpened(true)
                setTimeout(() => {
                    setCollectOpened(false)
                }, 1000)
            } else {
                setUncollectOpened(true)
                setTimeout(() => {
                    setUncollectOpened(false)
                }, 1000)
            }
            setCollectThrottle(false)
        } else {
            Taro.atMessage({
                message: '操作过快，请稍后重试',
                type: 'info'
            })
        }
    }

    return (
        <View style={{ textAlign: 'center' }}>
            <AtMessage />
            <AtToast isOpened={likeOpened} text="点赞成功" duration={500}></AtToast>
            <AtToast isOpened={unlikeOpened} text="取消点赞" duration={500}></AtToast>
            <AtToast isOpened={collectOpened} text="收藏成功" duration={500}></AtToast>
            <AtToast isOpened={uncollectOpened} text="取消收藏" duration={500}></AtToast>
            <Video
                className='videobox'
                id='video'
                src={videosrc}
                // src='https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
                // poster='https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg' // 封面-不需要
                initialTime={0}
                controls={true}
                autoplay={true}
                loop={false}
                muted={false}
                enablePlayGesture={true} // 非全屏下进度拖动手势
                vslideGesture={true} // 非全屏下亮度和音量手势
            />
            <View className='ButtonArea'>
                <Button className='videoButton' onClick={getPrev}><AtIcon value='chevron-left' size='24' color='#6190E8' /></Button>
                {
                    videoStore.likeSignal
                        ? <Button className='videoButton' onClick={() => updateLikes(0)}><AtIcon value='heart-2' size='24' color='#6190E8' /></Button>
                        : <Button className='videoButton' onClick={() => updateLikes(1)}><AtIcon value='heart' size='24' color='#6190E8' /></Button>
                }
                {/* <Button className='videoButton' onClick={() => updateLikes(1)}><AtIcon value='heart' size='24' color='#6190E8' /></Button> */}
                {
                    fromOhter
                        ? <Button className='exitButton' onClick={exitOhter}><AtIcon value='close' size='24' color='#dc1717' /></Button>
                        : null
                }
                {
                    videoStore.collectionSignal
                        ? <Button className='videoButton' onClick={() => updateCollections(0)}><AtIcon value='star-2' size='24' color='#6190E8' /></Button>
                        : <Button className='videoButton' onClick={() => updateCollections(1)}><AtIcon value='star' size='24' color='#6190E8' /></Button>
                }

                <Button className='videoButton' onClick={getNext}><AtIcon value='chevron-right' size='24' color='#6190E8' /></Button>
            </View>
        </View>
    )
})


export default inject('videoStore')(observer(ShortVideo))
