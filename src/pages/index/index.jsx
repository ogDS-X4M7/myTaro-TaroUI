import React, { forwardRef } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton, AtMessage, AtTabs, AtTabsPane } from 'taro-ui'
// import { useLoad } from '@tarojs/taro'
import './index.scss'
// import Item from '../../components/classComponent/classComponent';
import HotItem from '../../components/HotItem/HotItem';
import { inject, observer } from 'mobx-react';


const Index = forwardRef(({ counterStore, hotStore }, ref) => {
  // useLoad(() => {
  //   console.log('Page loaded.')
  // })
  // const {counterStore} = props;
  // const [text, setText] = useState('123'); // 学习测试修改text，使用settext修改作为状态(state)的text的值
  // const [flag, setFlag] = useState(true); // 同时增加一个信号标志，这样可以修改多次，而不只是一次
  // let flag = true;
  // const handleClickSettext = function () {
  //   if (flag) {
  //     setText('000');
  //   } else {
  //     setText('123')
  //   }
  //   // flag = !flag;
  //   setFlag(!flag);
  // }
  const [hotsFlag, setHotsFlag] = useState(false); // 热点获取状态，避免重复获取
  const [current,setCurrent] = useState(0); // 标签页页数状态 
  const fetchData = async () => {
    if (hotsFlag) {
      Taro.atMessage({
        'message': '您已经获取热点数据了哦',
        'type': 'success',
      })
    } else {
      const getResult = await hotStore.getHots();
      if (getResult === true) {
        // console.log('获取数据成功')
        setHotsFlag(true);
        Taro.atMessage({
          'message': '获取数据成功',
          'type': '',
        })
      } else {
        console.log('获取数据失败，原因：', getResult)
        Taro.atMessage({
          'message': '请先登录',
          'type': 'error',
        })
      }
    }
  }


  function toHotDetail(hot) {
    const encodeUrl = encodeURIComponent(hot.url)
    Taro.navigateTo({
      url: `/pages/hot/hot?id=${hot.id}&url=${encodeUrl}&hot=${hot.hot}`,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
    // redirectTo重定向，会从栈中弹出一个，再让自己入栈
    // Taro.redirectTo({
    //   url: '/pages/hot/hot'
    // })
    // console.log(hot.id)
  }


  function handleTabs (value) {
    // console.log(value)
    setCurrent(value)
  }
  useEffect(() => {
    console.log('Page loaded')
  }, [])
  return (
    <View className='index' ref={ref}>
      <AtMessage />
      <AtTabs
        current={current}
        scroll
        tabList={[
          { title: '热点获取' },
          { title: '使用须知' },
          { title: '视频播放' },
          { title: '携程样式' },
          { title: '标签页5' },
          { title: '标签页6' }
        ]}
        onClick={handleTabs}>
        <AtTabsPane current={current} index={0}>
          <View>
            <AtButton type='primary' onClick={fetchData}>获取热点信息</AtButton>
            {
              hotStore.hots.map((hot) => <HotItem key={hot.id} hot={hot} toHotDetail={toHotDetail} />)
            }
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View style='font-size:18px;text-align:center;height:100px;'>标签页二的内容</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <View style='font-size:18px;text-align:center;height:100px;'>标签页三的内容</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={3}>
          <View style='font-size:18px;text-align:center;height:100px;'>标签页四的内容</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={4}>
          <View style='font-size:18px;text-align:center;height:100px;'>标签页五的内容</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={5}>
          <View style='font-size:18px;text-align:center;height:100px;'>标签页六的内容</View>
        </AtTabsPane>
      </AtTabs>
      
      {/* <Text>Hello world!</Text>
      <Text>{text}</Text>
      <Item text='789' />
      <Button onClick={()=>setText('000')}>修改</Button>
      <Button onClick={handleClickSettext}>修改</Button>
      <Text>{counterStore.counter}</Text>
      <Button onClick={()=>counterStore.increment()}>+</Button>
      <AtTag type='primary' circle active>标签1</AtTag>
      <Button onClick={fetchData}>获取热点信息</Button>
      {
        hotStore.hots.map((hot)=><View key={hot.id}>{hot.title}</View>)
      } */}
      
    </View>
  )
})

export default inject('counterStore', 'hotStore', 'userStore')(observer(Index))
// observable 是用来创建 / 转换状态数据的，不能直接包装组件,将普通对象、数组或类转换为可观察对象。
// observer 是 MobX 提供的高阶组件，用于将 React 组件转换为响应式组件。
