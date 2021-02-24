import { createApp } from 'vue'
import App from './App.vue'
// style
import './assets/css/base.css'
import './assets/css/global.scss'
import './assets/iconfont/iconfont.css'
import 'nprogress/nprogress.css'
// plugins
import plugins from './plugins'
// permision
import './router/permision'

createApp(App)
.use(plugins)
.mount('#app')