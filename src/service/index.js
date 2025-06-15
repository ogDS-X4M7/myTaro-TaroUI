import httpService from "./httpService";

const service = {
    getFilmList() {
        return httpService.get({
            url: 'https://ghibliapi.vercel.app/films',
        })
    },
    getHotList() {
        return httpService.get({
            // url: 'https://v2.xxapi.cn/api/baiduhot',
            // 只是本地运行，学习相关内容，不需要校验合法域名，在微信开发者工具右上角详情-本地设置-勾选不校验合法域名即可
            url: 'http://127.0.0.1:7002/api/v1/hots',
        })
    }
}

export default service;