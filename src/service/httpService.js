import Taro from "@tarojs/taro"
import { request as TaroRequest } from '@tarojs/taro';

// 网络请求拦截器
const interceptor = function (chain) {
    const requestParams = chain.requestParams
    const { method, data, url } = requestParams

    // console.log(`http ${method || 'GET'} --> ${url} data: `, data)
    // 添加token
    // console.log(requestParams)
    // debugger
    requestParams.header = { ...requestParams.header, token: '111' }
    // console.log(requestParams)
    // 这里还意外发现两个console.log打印结果都是添加了token后的内容，原因是没有深拷贝， 
    // JavaScript 的 console 在打印对象时，通常会显示对象的最终状态（特别是在异步环境中）。
    // 这是因为 console 可能会在修改对象后才渲染其内容，导致看到的两个打印结果都包含了 token。

    // 顺便使用了debugger，在debugger的帮助下，第一个console.log会打印出添加token前的requestParams

    return chain.proceed(requestParams)
        .then(res => {
            // console.log(`http <-- ${url} result:`, res)
            return res
        })
}
Taro.addInterceptor(interceptor)

// option是obj，暂时先设置允许传入url、data、header
export default {
    request(option, method = 'GET') {
        // return Taro.request({
        return TaroRequest({
            ...option,
            method, // 传递 method 参数
            header: {
                'content-type': 'application/json', // 默认值
                ...option.header
            },
            success: function (res) {
                // console.log(res.data)
            }
        })
    },
    get(option) {
        return this.request(option, 'GET');
    }
}


