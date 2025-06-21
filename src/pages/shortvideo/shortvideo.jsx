import React, { forwardRef } from 'react';
import { View, Text, Button, Video, Icon } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton, AtMessage, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro';
import './shortvideo.scss'
import { inject, observer } from 'mobx-react';



const ShortVideo = forwardRef(({ videoStore }, ref) => {
    const [videosrc, setVideoSrc] = useState(''); // 设置视频播放链接
    const [fromOhter,setFromOhter] = useState(false); // 设置信号，判断是不是从浏览历史、点赞、收藏页面过来的 
    // const location = useLocation();
    useEffect(() => {
        console.log('Page loaded');
        let res = '';
        // 点击传递播放视频的方法里同时设置了clickUrl，如果有就说明是从历史记录点击过来的，没有就是自然观看
        let clickUrl = videoStore.getClickUrl();
        // console.log(clickUrl);
        // 在前面的historyVideo讲过，不能给回调直接套上异步，应该内部写立即执行异步函数
        (async ()=>{
            if (clickUrl) {
                setFromOhter(true)
                Taro.atMessage({
                    message:'浏览历史视频中，点底部中间按钮则返回，观看其他视频则退出历史',
                })
                res = await videoStore.getNext()
            } else {
                console.log(clickUrl)
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
        Taro.navigateTo({
            url:'/pages/historyVideo/historyVideo'
        })
        // 弄个定时器缓冲一下，因为跳转需要时间，如果没有缓冲，会先看到渲染效果，观感不好
        setTimeout(()=>{
            videoStore.clearClickUrl(); // 如预期所想，清空会重新渲染
        },1000)
    }

    return (
        <View style={{ textAlign: 'center' }}>
            <AtMessage />
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
                <Button className='videoButton'><AtIcon value='heart-2' size='24' color='#6190E8' /></Button>
                {
                    fromOhter
                    ?<Button className='videoButton' onClick={exitOhter}>退出</Button>
                    :null
                }
                <Button className='videoButton'><AtIcon value='star-2' size='24' color='#6190E8' /></Button>
                <Button className='videoButton' onClick={getNext}><AtIcon value='chevron-right' size='24' color='#6190E8' /></Button>
            </View>
        </View>
    )
})


export default inject('videoStore')(observer(ShortVideo))
