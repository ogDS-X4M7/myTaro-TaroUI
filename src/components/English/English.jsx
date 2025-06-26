import React, { forwardRef } from 'react';
import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react';
import { AtTag, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro';
import './English.scss'

// 使用 forwardRef 包装组件，使其支持 ref
// 注意父组件传过来的toHotDetail，forwardRef第一个参数就是props，可以接收变量、方法
const EnglishWeb = forwardRef(({ EnglishStore,word }, ref) => {
    let UKAudio = Taro.createInnerAudioContext({ useWebAudioImplement: true }) // 创建英式发音音频
    let USAudio = Taro.createInnerAudioContext() // 创建美式发音音频
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
        // console.log('Page loaded')
      }, [word])
    return (
        <View className='EveryDayEnglish'>
            <View className='EnglishWord'>{EnglishStore.word}</View>
            {
              EnglishStore.ukphone
                ? <AtTag circle className='audio' onClick={playUKAudio}>
                  英<Text> {EnglishStore.ukphone} </Text><AtIcon value='volume-plus' size='20' color='#5a70cd'></AtIcon>
                </AtTag>
                : null
            }
            {
              EnglishStore.usphone
                ? <AtTag circle className='audio' onClick={playUSAudio}>
                  美<Text> {EnglishStore.usphone} </Text><AtIcon value='volume-plus' size='20' color='#5a70cd'></AtIcon>
                </AtTag>
                : null
            }
            {
              EnglishStore.translations.map((translation) => {
                return (
                  <View key={translation.id || translation.pos} className='EnglishTranslations'>
                    <Text className='translationPos'  style={{color: '#999'}}>{translation.pos}. </Text>
                    <Text className='translationTran'>{translation.tran_cn}</Text>
                  </View>
                )
              })
            }
            {
              EnglishStore.phrases.length
                ? <View className='phrasesArea'>
                  <Text className='phrasesTitle'>常用短语：</Text>
                  {
                    EnglishStore.phrases.map((phrase) => {
                      return (
                        <View key={phrase.id || phrase.p_content} className='phrase'>
                          <View className='pcontent'>{phrase.p_content}  </View>
                          <View className='ppcn'>{phrase.p_cn} </View>
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
                          <View style={{marginBottom: '10px'}}>{sentence.s_content} </View>
                          {/* style={{color: '#5a70cd'}} */}
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
                        <View key={relWord.id || relWord.Pos}>
                          {
                            relWord.Hwds.map((Hwd) => {
                              return (
                                <View className='relWord'>
                                  <Text style={{color: '#5a70cd'}}>{Hwd.hwd} </Text>
                                  <Text style={{color: '#999'}}>{relWord.Pos}. </Text>
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
                          <View className='synonymTran'>
                            <Text style={{color: '#999'}}>{synonym.pos}.  </Text>
                            <Text>{synonym.tran}:</Text>
                          </View>
                          {
                            synonym.Hwds.map((Hwd) => <AtTag circle active className='synonymTag'>{Hwd.word}</AtTag>)
                          }
                        </View>
                      )
                    })
                  }
                </View>
                : null
            }
        </View>
    )
});

export default EnglishWeb;