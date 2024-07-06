
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


// 后期引入的依赖（包）

// 引入清除默认样式的包
import "reset-css";

// 引入echarts
import ECharts from 'vue-echarts'
import * as echarts from 'echarts'

// 引入字体图标
import './assets/iconfont/iconfont.css'


const app = createApp(App)

app.use(createPinia())
app.use(router)

// 全局注册echarts
app.component('v-chart', ECharts)
app.config.globalProperties.$echarts = echarts


app.mount('#app')

