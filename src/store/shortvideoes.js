import { observable, runInAction } from "mobx";
import service from "../service";
import Taro from "@tarojs/taro";
// 如果是体验服版本，就不要获取token，也不要定时器定时更新历史记录
const originToken = Taro.getStorageSync('token') // 获取初始token
const videoStore = observable({
    videoes: [],
    index: -1,
    timer: null,
    history: [],
    likes: [],
    likeSignal: false,
    clickUrl: '',
    token: originToken, // 先初始化，后续登录、退出登录都对这个token进行操作
    async getVideoes() {
        try {
            const result = await service.shortVideo();
            // console.log(result)
            if (result.data.code === 200) {
                runInAction(() => {
                    // 在 runInAction 中修改状态
                    this.videoes = [...this.videoes, result.data.data]
                    this.likeSignal = false; // 新视频全都未点赞
                });
                this.index++;
                if (this.token) {
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.updateHistory({ token: this.token, history: this.videoes[this.index] })
                    }, 500)
                }
                return result.data.data;
            }
            return result.data.msg; // 因为其他原因没能获取数据，则返回原因
        } catch (err) {
            return err;
        }
    },
    async getNext() {
        if (this.index < this.videoes.length - 1) {
            this.index++;
            if (this.token) {
                if (this.likes.includes(this.videoes[this.index])) {
                    runInAction(() => {
                        // 在 runInAction 中修改状态
                        this.likeSignal = true;
                    })
                } else {
                    runInAction(() => {
                        // 在 runInAction 中修改状态
                        this.likeSignal = false;
                    })
                }
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.updateHistory({ token: this.token, history: this.videoes[this.index] })
                }, 500)
            }
            return this.videoes[this.index];
        } else {
            return this.getVideoes();
        }
    },
    async getPrev() {
        if (this.index > 0) {
            this.index--;
            if (this.token) {
                if (this.likes.includes(this.videoes[this.index])) {
                    runInAction(() => {
                        // 在 runInAction 中修改状态
                        this.likeSignal = true;
                    })
                } else {
                    runInAction(() => {
                        // 在 runInAction 中修改状态
                        this.likeSignal = false;
                    })
                }
                // 每次看新视频都要清空计时，看的时间不满5秒不计入历史记录
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.updateHistory({ token: this.token, history: this.videoes[this.index] })
                }, 500)
            }
            return this.videoes[this.index];
        } else {
            return null
        }
    },
    // 更新历史记录-现在也许应该叫新增
    async updateHistory(params) {
        const res = await service.updateHistory(params)
        if (res.data.code !== 200) this.token = '' // 如果不是200，那肯定是token过期，直接把token放空，不要再做更新历史的请求
        return res;
    },
    async getHistory() {
        const res = await service.getHistory(this.token)
        // console.log(res)
        if (res.data.code === 200) {
            this.history = res.data.data.res; // 倒序实现时间后的先显示
            this.history = this.history.reverse();
        }
        return res.data.msg
    },
    // 清空历史记录
    async clearHistory() {
        this.history = [];
        const res = await service.clearHistory(this.token)
        return res.data
    },
    // 播放历史记录中被点击查看的视频
    async playHistory(historyUrl) {
        this.clickUrl = historyUrl;
        runInAction(() => {
            // 在 runInAction 中修改状态
            this.videoes = [...this.videoes, historyUrl]
        });
        // 让下一个播放的视频确定为选中的历史视频
        this.index = this.videoes.length - 2;
        // 外部会导向播放页面，并且之前设置的就是自动播放
        return true
    },
    // 外部获取clickUrl的方法
    getClickUrl() {
        return this.clickUrl;
    },
    // 外部清空clickUrl的方法，表示退出历史模式
    async clearClickUrl() {
        this.clickUrl = '';
    },
    // 外部更新token的方法，实时确保token状态以应对是否进行更新浏览历史的判断
    updateToken(token) {
        this.token = token;
    },
    // 更新点赞列表
    async updateLikes(signal) {
        const res = await service.updateLikes({ token: this.token, like: this.videoes[this.index], signal })
        console.log(res)
        if (res.data.code === 200) {
            if (signal) {
                runInAction(() => {
                    // 在 runInAction 中修改状态
                    this.likes.push(this.videoes[this.index]);
                    this.likeSignal = true;
                })
            } else {
                runInAction(() => {
                    // 在 runInAction 中修改状态
                    this.likes = this.likes.filter((like) => like != this.videoes[this.index])
                    this.likeSignal = false;
                })
            }
        }
        return res;
    }
})


export default videoStore;