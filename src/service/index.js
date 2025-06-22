import httpService from "./httpService";

const service = {
    getFilmList() {
        return httpService.get({
            url: 'https://ghibliapi.vercel.app/films',
        })
    },
    // 获取热点列表
    getHotList() {
        return httpService.get({
            // 体验服url
            // url: 'https://v2.xxapi.cn/api/baiduhot',
            // 只是本地运行，学习相关内容，不需要校验合法域名，在微信开发者工具右上角详情-本地设置-勾选不校验合法域名即可
            url: 'http://127.0.0.1:7002/api/v1/hots',
        })
    },
    // 通过code授权微信登录
    wxLogin(code) {
        return httpService.post({
            url: 'http://127.0.0.1:7002/api/v1/wxLogin',
            data: {
                code
            }
        })
    },
    // ticket(){
    //     return httpService.get({
    //         url:'http://127.0.0.1:7002/api/v1/ticket',
    //     })
    // },
    // 更新用户信息-头像昵称
    userInfo(params) {
        return httpService.post({
            url: 'http://127.0.0.1:7002/api/v1/updateUser',
            // data: {
            //     token: params.token,
            //     avatarUrl: params.avatarUrl,
            //     userName: params.userName
            // }
            data: params
        })
    },
    // 实现自动登录
    autoLogin(token) {
        return httpService.post({
            url: 'http://127.0.0.1:7002/api/v1/autoLogin',
            data: {
                token
            }
        })
    },
    // 获取知识文档
    study() {
        return httpService.get({
            url: 'http://127.0.0.1:7002/api/v1/study',
        })
    },
    // 获取短视频
    shortVideo() {
        return httpService.get({
            url: 'https://v2.xxapi.cn/api/meinv'
        })
    },
    // 更新浏览历史记录
    updateHistory(params) {
        return httpService.post({
            url: 'http://127.0.0.1:7002/api/v1/updateHistory',
            data: params
        })
    },
    // 获取浏览历史记录
    getHistory(token) {
        return httpService.post({
            url: 'http://127.0.0.1:7002/api/v1/getHistory',
            data: { token }
        })
    },
    // 清空浏览历史记录
    clearHistory(token) {
        return httpService.post({
            url: 'http://127.0.0.1:7002/api/v1/clearHistory',
            data: { token }
        })
    },
    // 更新点赞记录
    updateLikes(params) {
        return httpService.post({
            url: 'http://127.0.0.1:7002/api/v1/updateLikes',
            data: params
        })
    },
    // 获取点赞记录
    getLikes(token) {
        return httpService.post({
            url: 'http://127.0.0.1:7002/api/v1/getLikes',
            data: { token }
        })
    },
    // 更新收藏
    updateCollections(params) {
        return httpService.post({
            url: 'http://127.0.0.1:7002/api/v1/updateCollections',
            data: params
        })
    },
    // 获取收藏
    getCollections(token) {
        return httpService.post({
            url: 'http://127.0.0.1:7002/api/v1/getCollections',
            data: { token }
        })
    },
}

export default service;