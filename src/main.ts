import { createApp } from 'vue'
import App from './App.vue'
import lazy_use from './core/lazy_use'
import router from './router'
import { setGlobalOptions } from 'vue-request'
import { VueAxios } from './utils/request'

//加载样式
import './global.less'

// 设置请求处理器
setGlobalOptions({
  // ...
})

const app = createApp(App)

app.use(router)
app.use(VueAxios)
lazy_use(app)

app.mount('#app')
