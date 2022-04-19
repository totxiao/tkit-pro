import { createApp } from 'vue'
import App from './App.vue'
import lazy_use from './core/lazy_use'
import router from './router'
import { setGlobalOptions } from 'vue-request'

//加载样式
import './global.less'

// 设置请求处理器
setGlobalOptions({
  manual: true,
  // ...
})

const app = createApp(App)

app.use(router)
lazy_use(app)

app.mount('#app')
