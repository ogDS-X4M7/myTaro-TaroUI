import React, { forwardRef } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton } from 'taro-ui'
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
  const [text, setText] = useState('123');
  const [flag, setFlag] = useState(true);
  // let flag = true;

  const handleClickSettext = function () {
    if (flag) {
      setText('000');
    } else {
      setText('123')
    }
    // flag = !flag;
    setFlag(!flag);
  }
  const fetchData = async () => {
    const getResult = await hotStore.getHots();
    if (getResult === true) {
      console.log('获取数据成功')
    } else {
      console.log('获取数据失败，原因：', getResult)
    }
  }
  function toHotDetail(hot) {
    Taro.navigateTo({
      url: `/pages/hot/hot?id=${hot.id}`,
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
    console.log(hot.id)
  }
  useEffect(() => {
    console.log('Page loaded')
  }, [])
  return (
    <View className='index' ref={ref}>
      {/* <Text>Hello world!</Text>
      <Text>{text}</Text>
      <Item text='789' /> */}
      {/* <Button onClick={()=>setText('000')}>修改</Button> */}
      {/* <Button onClick={handleClickSettext}>修改</Button>
      <Text>{counterStore.counter}</Text>
      <Button onClick={()=>counterStore.increment()}>+</Button> */}
      <AtTag type='primary' circle active>标签1</AtTag>
      <AtButton type='primary'>按钮文案</AtButton>
      <Button onClick={fetchData}>获取热点信息</Button>
      {/* {
        hotStore.hots.map((hot)=><View key={hot.id}>{hot.title}</View>)
      } */}
      {
        hotStore.hots.map((hot) => <HotItem key={hot.id} hot={hot} toHotDetail={toHotDetail} />)
      }
    </View>
  )
})

export default inject('counterStore', 'hotStore')(observer(Index))
// observable 是用来创建 / 转换状态数据的，不能直接包装组件,将普通对象、数组或类转换为可观察对象。
// observer 是 MobX 提供的高阶组件，用于将 React 组件转换为响应式组件。
