import { useLaunch } from '@tarojs/taro'
import 'taro-ui/dist/style/index.scss'
import './app.scss'

// import counterStore from './store/counter'
// import hotStore from './store/hot'
import rootStore from './store'
import { Provider } from 'mobx-react'

function App({ children }) {
  useLaunch(() => {
    console.log('App launched.')
  })
  // 初始化仓库
  // counterStore.init();

  // children 是将要会渲染的页面
  return (
    // <Provider counterStore={counterStore}>  // Store改成集中到一起提供
    <Provider {...rootStore}>
      {children}
    </Provider>
  )
}



export default App
