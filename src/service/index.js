import httpService from "./httpService";

const service = {
    getFilmList() {
        return httpService.get({
            url: 'https://ghibliapi.vercel.app/films',
        })
    },
    getHotList() {
        return httpService.get({
            url: 'https://v2.xxapi.cn/api/baiduhot',
        })
    }
}

export default service;