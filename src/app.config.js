export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/me/me',
    'pages/hot/hot'
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
      pagePath: 'pages/me/me',
      text: '我的',
      iconPath: 'assets/images/me.png',
      selectedIconPath: 'assets/images/me_active.png'
    }],
    color: '#8a8a8a',
    selectedColor: '#6190E8'
  }
})
