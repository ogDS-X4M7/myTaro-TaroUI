import { observable, runInAction } from "mobx";
import service from "../service";
import Taro from "@tarojs/taro";
// 如果是体验服版本，就不要获取token，也不要定时器定时更新历史记录
const token = Taro.getStorageSync('token')
const videoStore = observable({
    videoes: [],
    index: 0,
    timer: null,
    history: [],
    clickUrl: '',
    async getVideoes() {
        try {
            const result = await service.shortVideo();
            // console.log(result)
            if (result.data.code === 200) {
                runInAction(() => {
                    // 在 runInAction 中修改状态
                    this.videoes = [...this.videoes, result.data.data]
                });
                this.index++;
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.updateHistory({ token, history: this.videoes[this.index - 1] })
                }, 5000)
                return result.data.data;
            }
            return result.data.msg; // 因为其他原因没能获取数据，则返回原因
        } catch (err) {
            return err;
        }
    },
    async getNext() {
        if (this.index < this.videoes.length) {
            this.index++;
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.updateHistory({ token, history: this.videoes[this.index - 1] })
            }, 5000)
            return this.videoes[this.index - 1];
        } else {
            return this.getVideoes();
        }
    },
    async getPrev() {
        if (this.index > 0) {
            this.index--;
            // 每次看新视频都要清空计时，看的时间不满5秒不计入历史记录
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.updateHistory({ token, history: this.videoes[this.index - 1] })
            }, 5000)
            return this.videoes[this.index - 1];
        } else {
            return null
        }
    },
    async updateHistory(params) {
        const res = await service.updateHistory(params)
        return res;
    },
    async getHistory(token) {
        const res = await service.getHistory(token)
        // console.log(res)
        if (res.data.code === 200) {
            this.history = res.data.data.res.reverse(); // 倒序实现时间后的先显示
        }
        return res.data.msg
    },
    // 播放历史记录中被点击查看的视频
    async playHistory(historyUrl) {
        this.clickUrl = historyUrl;
        runInAction(() => {
            // 在 runInAction 中修改状态
            this.videoes = [...this.videoes, historyUrl]
        });
        // 让下一个播放的视频确定为选中的历史视频
        this.index = this.videoes.length - 1;
        // 外部会导向播放页面，并且之前设置的就是自动播放
        return true
    }

})


export default videoStore;