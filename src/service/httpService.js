// import Taro from "@tarojs/taro"
import { request as TaroRequest } from '@tarojs/taro';

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
                //   console.log(res.data)
            }
        })
    },
    get(option) {
        return this.request(option, 'GET');
    }
}


