import React, { forwardRef } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Video, Image, Swiper, SwiperItem } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtButton, AtMessage, AtTabs, AtTabsPane, AtSearchBar, AtToast, AtIcon } from 'taro-ui'
// import { useLoad } from '@tarojs/taro'
import './index.scss'
// import Item from '../../components/classComponent/classComponent';
import HotItem from '../../components/HotItem/HotItem';
import { inject, observer } from 'mobx-react';


const Index = forwardRef(({ counterStore, hotStore, videoStore, weatherStore, EnglishStore }, ref) => {
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
  const [firstEnter, setFirstEnter] = useState(true); //设置首次进入页面信号，首次进入就应尝试获取收藏-防自动登录；如果未登录可能获取不到，所以登录后也得获取一次；
  const [city, setCity] = useState(''); // 设置天气搜索 市/区 的名字
  const [successCity, setSuccessCity] = useState('') // 记录最后一次成功请求的城市名，可用于设置默认市/区，上面的city绑定了搜索栏所以不适合承担这个任务
  const [toastOpen, setToastOpen] = useState(false) // 轻提示开关信号，提示默认城市设置的成功
  const [englishTip, setEnglishTip] = useState(false) // 每日英语获取信号，获取过则为true，未获取则为false--显示提示
  let UKAudio = Taro.createInnerAudioContext({ useWebAudioImplement: true }) // 创建英式发音音频
  let USAudio = Taro.createInnerAudioContext() // 创建美式发音音频
  let token = Taro.getStorageSync('token')
  let defaultCity = Taro.getStorageSync('defaultCity') // 开始就要获取，和token一样，token判断获取收藏，defaultCity判断获取天气
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

  // 切换标签页
  function handleTabs(value) {
    // console.log(value)
    setCurrent(value)
  }

  // 实时修改搜索城市
  function onChange(value) {
    setCity(value)
  }

  // 搜索城市天气
  async function onActionClick() {
    const res = await weatherStore.getWeathers(city);
    if (res !== true) {
      Taro.atMessage({
        message: res,
        type: 'error'
      })
    } else {
      setSuccessCity(city) // 请求成功，记录最新的成功请求城市名
    }
    console.log(res);
  }

  // 设置默认市/区存入token
  async function CityInToken() {
    Taro.setStorageSync('defaultCity', successCity);
    setToastOpen(true)
    setTimeout(() => {
      setToastOpen(false)
    }, 1000)
  }

  async function getEverydayEnglish() {
    const res = await EnglishStore.getEverydayEnglish();
    if (res === true) {
      // UKAudio.src = EnglishStore.ukspeech;
      // console.log(UKAudio.src);
      // 由于不是响应式，在这里设置的话会导致src并不更新， DOM 中的音频元素未更新，点击播放无效，而再次点击获取新知识时会直接播放下一个音频
      setEnglishTip(true)
    }
  }

  // 播放英式发音音频
  function playUKAudio() {
    UKAudio.src = EnglishStore.ukspeech;
    // console.log('播放音频',UKAudio.src);
    UKAudio.play();
  }


  // 播放美式发音音频
  function playUSAudio() {
    USAudio.src = EnglishStore.usspeech;
    USAudio.play();
  }

  useEffect(() => {
    console.log('Page loaded')
    if (token) {
      // 有token才请求，避免401
      // 非常重要的一点，因为collections必须严格校验，因此进入小程序就应该获取collections
      // 当然这里是做一个防自动登录的请求，后面token失效，需要手动登录的也要额外安排获取收藏的操作
      if (firstEnter) {
        videoStore.getCollections();
        setFirstEnter(false)
      }
    }
    if (defaultCity) {
      setSuccessCity(defaultCity) // 如果有就设置默认市/区并发送请求获取数据
      const res = weatherStore.getWeathers(defaultCity);
      console.log(res);
    }
  }, [])
  return (
    <View className='index' ref={ref}>
      <AtMessage />
      <AtToast isOpened={toastOpen} text="默认市/区设置成功" duration={1000}	></AtToast>
      <AtTabs
        current={current}
        scroll
        tabList={[
          { title: '使用须知' },
          { title: '新闻热点' },
          { title: '天气预报' },
          { title: '每日英语' },
          { title: '单词详解' },
          { title: '携程样式' }
        ]}
        onClick={handleTabs}>
        {/* 使用须知 */}
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
        {/* 新闻热点 */}
        <AtTabsPane current={current} index={1}>
          <View style={{ marginTop: '10px' }}>
            <AtButton type='primary' onClick={fetchData}>获取热点信息</AtButton>
            {
              hotStore.hots.map((hot) => <HotItem key={hot.id} hot={hot} toHotDetail={toHotDetail} />)
            }
          </View>
        </AtTabsPane>
        {/* 天气预报 */}
        <AtTabsPane current={current} index={2} className='weatherReport'>
          <View>
            <AtSearchBar
              inputType='text'
              placeholder='请输入您要查看的市/区'
              value={city}
              onChange={onChange}
              onActionClick={onActionClick}
            />
            {
              weatherStore.weathers.length
                ? <View>
                  <View className='weatherTop'>{weatherStore.city}</View>
                  <View className='weatherToday'>
                    <View className='temperToday'>
                      {weatherStore.weathers[1].temperature}
                    </View>
                    <View className='weatherTagArea'>
                      <AtTag className='weatherType' circle >{weatherStore.weathers[1].weather}</AtTag>
                      <AtTag className='Air' circle >空气{weatherStore.weathers[1].air_quality}</AtTag>
                      <AtTag className='wind' circle >{weatherStore.weathers[1].wind}</AtTag>
                    </View>
                  </View>
                  <View className='weatherList'>
                    <Swiper
                      className='Swiper'
                      indicatorColor='#999'
                      indicatorActiveColor='#333'
                      displayMultipleItems='3'>
                      {/* 这里不做map操作是为了方便设置昨、今、明的显示，而不是直接显示星期
                      如果使用map，就必须操作dom才能修改里面的文本内容，把星期改成昨今明，但taro一般不建议操作dom
                      反正只有6个数据，干脆手动操作更加简单明了 */}
                      <SwiperItem>
                        <View className='demo-text-1'>
                          <View className='ListItem'>昨天</View>
                          <View className='ListItem'>{weatherStore.weathers[0].weather}</View>
                          <View className='ListItem'>{weatherStore.weathers[0].temperature}</View>
                          <View className='ListItem'>{weatherStore.weathers[0].wind}</View>
                          <AtTag circle className='airTag ListItem'>{weatherStore.weathers[0].air_quality}</AtTag>
                        </View>
                      </SwiperItem>
                      <SwiperItem className='swiperItemToday'>
                        <View>
                          <View className='ListItem'>今天</View>
                          <View className='ListItem'>{weatherStore.weathers[1].weather}</View>
                          <View className='ListItem'>{weatherStore.weathers[1].temperature}</View>
                          <View className='ListItem'>{weatherStore.weathers[1].wind}</View>
                          <AtTag circle className='airTag ListItem'>{weatherStore.weathers[1].air_quality}</AtTag>
                        </View>
                      </SwiperItem>
                      <SwiperItem>
                        <View className='demo-text-3'>
                          <View className='ListItem'>明天</View>
                          <View className='ListItem'>{weatherStore.weathers[2].weather}</View>
                          <View className='ListItem'>{weatherStore.weathers[2].temperature}</View>
                          <View className='ListItem'>{weatherStore.weathers[2].wind}</View>
                          <AtTag circle className='airTag ListItem'>{weatherStore.weathers[2].air_quality}</AtTag>
                        </View>
                      </SwiperItem>
                      <SwiperItem>
                        <View className='demo-text-4'>
                          <View className='ListItem'>{weatherStore.weathers[3].date}</View>
                          <View className='ListItem'>{weatherStore.weathers[3].weather}</View>
                          <View className='ListItem'>{weatherStore.weathers[3].temperature}</View>
                          <View className='ListItem'>{weatherStore.weathers[3].wind}</View>
                          <AtTag circle className='airTag ListItem'>{weatherStore.weathers[3].air_quality}</AtTag>
                        </View>
                      </SwiperItem>
                      <SwiperItem>
                        <View className='demo-text-5'>
                          <View className='ListItem'>{weatherStore.weathers[4].date}</View>
                          <View className='ListItem'>{weatherStore.weathers[4].weather}</View>
                          <View className='ListItem'>{weatherStore.weathers[4].temperature}</View>
                          <View className='ListItem'>{weatherStore.weathers[4].wind}</View>
                          <AtTag circle className='airTag ListItem'>{weatherStore.weathers[4].air_quality}</AtTag>
                        </View>
                      </SwiperItem>
                      <SwiperItem>
                        <View className='demo-text-6'>
                          <View className='ListItem'>{weatherStore.weathers[5].date}</View>
                          <View className='ListItem'>{weatherStore.weathers[5].weather}</View>
                          <View className='ListItem'>{weatherStore.weathers[5].temperature}</View>
                          <View className='ListItem'>{weatherStore.weathers[5].wind}</View>
                          <AtTag circle className='airTag ListItem'>{weatherStore.weathers[5].air_quality}</AtTag>
                        </View>
                      </SwiperItem>
                    </Swiper>
                  </View>
                  <View className='weatherBottom'>下方设置默认市/区，以后打开天气预报默认展示该市/区天气</View>
                  <AtButton circle onClick={CityInToken}>设置为默认市/区</AtButton>
                </View>
                : null
            }
          </View>
        </AtTabsPane>
        {/* 每日英语 */}
        <AtTabsPane current={current} index={3}>
          <View >
            <AtButton onClick={getEverydayEnglish}>获取每日英语知识</AtButton>
            {
              englishTip
                ? <View>
                  <View className='EnglishWord'>{EnglishStore.word}</View>
                  {
                    EnglishStore.translations.map((translation) => {
                      return (
                        <View key={translation.id || translation.pos} className='EnglishTranslations'>
                          <Text className='translationPos'>{translation.pos}</Text>
                          <Text className='translationTran'>{translation.tran_cn}</Text>
                        </View>
                      )
                    })
                  }
                  {
                    EnglishStore.ukphone
                      ? <View className='UKaudio' onClick={playUKAudio}>
                        英<Text>{EnglishStore.ukphone}</Text><AtIcon value='volume-plus' size='20' color='#5a70cd'></AtIcon>
                      </View>
                      : null
                  }
                  {
                    EnglishStore.usphone
                      ? <View className='USaudio' onClick={playUSAudio}>
                        美<Text>{EnglishStore.usphone}</Text><AtIcon value='volume-plus' size='20' color='#5a70cd'></AtIcon>
                      </View>
                      : null
                  }
                  {
                    EnglishStore.phrases.length
                      ? <View className='phrasesArea'>
                        <Text className='phrasesTitle'>常用短语：</Text>
                        {
                          EnglishStore.phrases.map((phrase) => {
                            return (
                              <View key={phrase.id || phrase.p_content} className='phrase'>
                                <Text>{phrase.p_content} </Text>
                                <Text>{phrase.p_cn} </Text>
                              </View>
                            )
                          })
                        }
                      </View>
                      : null
                  }
                  {
                    EnglishStore.sentences.length
                      ? <View className='sentencesArea'>
                        <Text className='sentencesTitle'>例句：</Text>
                        {
                          EnglishStore.sentences.map((sentence) => {
                            return (
                              <View key={sentence.id || sentence.p_content} className='sentence'>
                                <View>{sentence.s_content} </View>
                                <View>{sentence.s_cn} </View>
                              </View>
                            )
                          })
                        }
                      </View>
                      : null
                  }
                  {
                    EnglishStore.relWords.length
                      ? <View className='relwordsArea'>
                        <Text className='relwordsTitle'>关系词：</Text>
                        {
                          EnglishStore.relWords.map((relWord) => {
                            return (
                              <View key={relWord.id || relWord.Pos} className='relWord'>
                                {
                                  relWord.Hwds.map((Hwd) => {
                                    return (
                                      <View>
                                        <Text>{Hwd.hwd} </Text>
                                        <Text>{relWord.Pos} </Text>
                                        <Text>{Hwd.tran}</Text>
                                      </View>)
                                  })
                                }
                              </View>
                            )
                          })
                        }
                      </View>
                      : null
                  }
                  {
                    EnglishStore.synonyms.length
                      ? <View className='synonymsArea'>
                        <Text className='synonymsTitle'>同义词：</Text>
                        {
                          EnglishStore.synonyms.map((synonym) => {
                            return (
                              <View key={synonym.id || synonym.pos} className='synonym'>
                                <View>
                                  <Text>{synonym.pos}  </Text>
                                  <Text>{synonym.tran}:</Text>
                                </View>
                                {
                                  synonym.Hwds.map((Hwd) => <AtTag circle>{Hwd.word}</AtTag>)
                                }
                              </View>
                            )
                          })
                        }
                      </View>
                      : null
                  }

                  <View></View>
                  <View></View>
                </View>
                : <View className='EnglishTip'>
                  每日英语提供每日经典英语例句、词汇和短语等内容，帮助您进行英语学习，提高语言能力。当然您可以多次点击按钮来学习更多，不过学习知识，质量比数量更重要，请量力而行。
                </View>
            }
          </View>
        </AtTabsPane>
        {/* 单词详解 */}
        <AtTabsPane current={current} index={4}>
          <View style='font-size:18px;text-align:center;height:100px;'>单词详解的内容</View>
        </AtTabsPane>
        {/* 携程样式 */}
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

export default inject('counterStore', 'hotStore', 'videoStore', 'weatherStore', 'EnglishStore')(observer(Index))
// observable 是用来创建 / 转换状态数据的，不能直接包装组件,将普通对象、数组或类转换为可观察对象。
// observer 是 MobX 提供的高阶组件，用于将 React 组件转换为响应式组件。
