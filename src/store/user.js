import Taro from "@tarojs/taro";
import { observable } from "mobx";
import service from "../service";

const userStore = observable({
    user: null,
    async wxLogin(code) {
        const res = await service.wxLogin(code)
        // console.log(res);
        if (res && res.data.success && res.data.data) {
            try {
                Taro.setStorageSync('token', res.data.data.token)
            } catch (err) {
                throw new Error(err);
            }
        }
        return res;
    },
    // async ticket(){
    //     const res = await service.ticket();
    //     console.log(res);
    //     return res;
    // }
    async userInfo(params) {
        const res = await service.userInfo(params)
        console.log(res);
        return res;
    }
})

export default userStore 