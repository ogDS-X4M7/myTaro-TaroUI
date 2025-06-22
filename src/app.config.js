export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/me/me',
    'pages/hot/hot',
    'pages/study/study',
    'pages/shortvideo/shortvideo',
    'pages/historyVideo/historyVideo',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [{
      pagePath: 'pages/index/index',
      text: '首页',
      iconPath: 'assets/images/indexnor1.png',
      selectedIconPath: 'assets/images/indexnor1_active.png'
    }, {
      pagePath: 'pages/shortvideo/shortvideo',
      text: '短视频',
      iconPath: 'assets/images/video.png',
      selectedIconPath: 'assets/images/video_active.png'
    }, {
      pagePath: 'pages/study/study',
      text: '知识文档',
      iconPath: 'assets/images/learn.png',
      selectedIconPath: 'assets/images/learn_active.png'
    }, {
      pagePath: 'pages/me/me',
      text: '我的',
      iconPath: 'assets/images/me.png',
      selectedIconPath: 'assets/images/me_active.png'
    }],
    color: '#8a8a8a',
    selectedColor: '#6190E8'
  }
})
