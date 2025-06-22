import React, { forwardRef } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Video, Image } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton, AtMessage, AtTabs, AtTabsPane } from 'taro-ui'
// import { useLoad } from '@tarojs/taro'
import './index.scss'
// import Item from '../../components/classComponent/classComponent';
import HotItem from '../../components/HotItem/HotItem';
import { inject, observer } from 'mobx-react';


const Index = forwardRef(({ counterStore, hotStore, videoStore }, ref) => {
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
  const [current, setCurrent] = useState(0); // 标签页页数状态 
  const [firstPlay, setFirstPlay] = useState(true); //设置信号，进入页面就应该尝试获取收藏，如果未登录可能获取不到，所以登录后也得获取一次
  let token = Taro.getStorageSync('token')
  const fetchData = async () => {
    if (hotsFlag) {
      Taro.atMessage({
        'message': '您已经获取热点数据了哦',
        'type': 'success',
      })
    } else {
      token = Taro.getStorageSync('token')
      // console.log(token);
      // 有token再发请求，不然taro框架内部的文件发现请求失败就要在控制台报错，虽然不影响功能，但不美观
      if (token) {
        const getResult = await hotStore.getHots();
        if (getResult === true) {
          // console.log('获取数据成功')
          setHotsFlag(true);
          Taro.atMessage({
            'message': '获取数据成功',
            'type': '',
          })
        } else {
          Taro.atMessage({
            'message': `获取失败，${getResult}`,
            'type': 'error',
          })
        }
      } else {
        Taro.atMessage({
          'message': '请先登录',
          'type': 'error',
        })
      }

      // 下面是体验服版本，把从else开始部分全部注释掉换成下面即可，也就是不要token
      // const getResult = await hotStore.getHots();
      // if (getResult === true) {
      //   // console.log('获取数据成功')
      //   setHotsFlag(true);
      //   Taro.atMessage({
      //     'message': '获取数据成功',
      //     'type': '',
      //   })
      // } else {
      //   Taro.atMessage({
      //     'message': `获取失败，${getResult}`,
      //     'type': 'error',
      //   })
      // }
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


  function handleTabs(value) {
    // console.log(value)
    setCurrent(value)
  }
  useEffect(() => {
    console.log('Page loaded')
    if (token) {
      // 有token才请求，避免401
      // 非常重要的一点，因为collections必须严格校验，因此进入小程序就应该获取collections
      // 当然这里是做一个防自动登录的请求，后面token失效，需要手动登录的也要额外安排获取收藏的操作
      if (firstPlay) {
        videoStore.getCollections();
        setFirstPlay(false)
      }
    }
  }, [])
  return (
    <View className='index' ref={ref}>
      <AtMessage />
      <AtTabs
        current={current}
        scroll
        tabList={[
          { title: '使用须知' },
          { title: '热点获取' },
          { title: '天气预报' },
          { title: '每日英语' },
          { title: '单词详解' },
          { title: '携程样式' }
        ]}
        onClick={handleTabs}>
        <AtTabsPane current={current} index={0}>
          <View className='at-article'>
            <View className='at-article__h1' style={{ textAlign: 'center', marginBottom: '20px' }}>
              使用须知的内容
            </View>
            {/* <View className='at-article__info'>
              2017-05-07&nbsp;&nbsp;&nbsp;这是作者
            </View> */}
            <View className='at-article__content'>
              <View className='at-article__section'>
                {/* <View className='at-article__h2'>这是二级标题</View>
                <View className='at-article__h3'>这是三级标题</View> */}
                <View className='at-article__h3' style={{ marginTop: '20px' }}>因为没有部署服务器，只有本地服务器，因此体验服无法使用以下功能：</View>
                <View className='at-article__p'>
                  - 服务器支持的登录功能
                </View>
                <View className='at-article__p'>
                  - 点赞、收藏交互功能
                </View>
                <View className='at-article__h3' style={{ marginTop: '20px' }}>
                  目前项目可正常使用以下功能：
                </View>
                <View className='at-article__p'>
                  ✅ 首页-热点内容获取
                </View>
                <View className='at-article__p'>
                  ✅ 短视频播放功能
                </View>
                <View className='at-article__p'>
                  ✅ 知识文档浏览
                </View>
                <Image
                  className='at-article__img'
                  src={require('../../assets/images/shouldKnow.jpg')}
                  mode='widthFix' />
              </View>
            </View>
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View style={{ marginTop: '10px' }}>
            <AtButton type='primary' onClick={fetchData}>获取热点信息</AtButton>
            {
              hotStore.hots.map((hot) => <HotItem key={hot.id} hot={hot} toHotDetail={toHotDetail} />)
            }
          </View>
        </AtTabsPane>
        {/* <AtTabsPane current={current} index={2}>
          <View style='text-align:center;'>
            <Video
              className='videobox'
              id='video'
              src='https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
              // poster='https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
              initialTime={0}
              controls={true}
              autoplay={false}
              loop={false}
              muted={false}
              enablePlayGesture={true}
            />
          </View>
        </AtTabsPane> */}
        <AtTabsPane current={current} index={2}>
          <View style='font-size:18px;text-align:center;height:100px;'>天气预报的内容</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={3}>
          <View style='font-size:18px;text-align:center;height:100px;'>每日英语的内容</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={4}>
          <View style='font-size:18px;text-align:center;height:100px;'>单词详解的内容</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={5}>
          <View style='font-size:18px;text-align:center;height:100px;'>携程样式的内容</View>
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

export default inject('counterStore', 'hotStore', 'videoStore')(observer(Index))
// observable 是用来创建 / 转换状态数据的，不能直接包装组件,将普通对象、数组或类转换为可观察对象。
// observer 是 MobX 提供的高阶组件，用于将 React 组件转换为响应式组件。
