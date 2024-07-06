<template>
  <header class="header">
    <nav class="nav">

      <router-link to="/">
        <span class="iconfont icon-sun" style="font-size: 30px;"></span>&nbsp;
        <span style="font-size: 24px;">新中地天气</span>&nbsp;&nbsp;
      </router-link>

      <div class="local-weather">
        <span style="font-size: 1.125rem;">{{ City }}</span>&nbsp;&nbsp;
        <span style="font-size: .875rem;">实时天气：{{ Weather }}&nbsp;{{ Temp }}°C</span>&nbsp;&nbsp;
        <span style="font-size: .875rem;">{{ windDirection }}风{{ windPower }}级</span>&nbsp;
      </div>

      <div class="info" style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
        <div class="iconfont icon-banbenxinxifuxy20160326" @click="store.switchAbout()"></div>
        <div class="iconfont icon-jia" v-show="store.isShow" @click="add()"></div>
      </div>

    </nav>
  </header>
  <Transition name="fade">
    <About v-if="store.isShowAbout" />
  </Transition>
</template>

<script setup>
import About from "./About.vue"
import {ref, onMounted} from "vue";
import { RouterLink } from 'vue-router'

// 引入请求数据的方法
import {getCurrentCityApi, getBaseWeatherDataApi } from "@/api";

// 引入store（Pinia）
import { useWeatherStore } from '@/stores/weatherstore'
// 定义store对象
const store = useWeatherStore()

// 获取当前所在城市的adcode
const currentCityCode = ref() 
// 当前所在城市名
const City = ref()
// 当前所在城市的实时天气信息
const Temp = ref()
const Weather = ref()
const windDirection = ref()
const windPower = ref()

// 接收父组件（SearchView）的传参
let props = defineProps({
  SearchAd: {
    type: String,
    default: ''
  }
})
// console.log(props.SearchAd)

// 相Store中传参的方法
function add(){
  store.addList(props.SearchAd)
}


onMounted(async ()=>{
  // 获取当前城市数据的方法
  const city = await getCurrentCityApi()

  // 获取当前城市adcode
  currentCityCode.value = city.data.adcode
  // console.log(currentCity.value)


  // 获取当前城市的实时天气数据的方法
  const weather = await getBaseWeatherDataApi(currentCityCode.value)
  // console.log(weather)

  // 获取当前城市的实时天气数据 
  City.value = weather.data.lives[0].city
  Temp.value = weather.data.lives[0].temperature
  Weather.value = weather.data.lives[0].weather
  windDirection.value = weather.data.lives[0].winddirection
  windPower.value = weather.data.lives[0].windpower
  // console.log(City.value, Temp.value, Weather.value, windDirection.value, windPower.value)

})

</script>

<style lang="scss" scoped>

.header{
  position: sticky;
  top: 0;
  color: #fff;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  .nav{
    display: flex;
    align-items: center;
    padding: 24px 160px;
    background-color: #00668a;
    a{
      text-decoration: none;
      color: #fff;
    }
    .info{
      margin-left: 700px;
      .icon-banbenxinxifuxy20160326{
        font-size: 24px;
      }
      .icon-banbenxinxifuxy20160326:hover{
        color: #004e71;
        transition: all 1s;
      }
      .icon-jia{
        font-size: 20px;
      }
      .icon-jia:hover{
        color: #004e71;
        transition: all 1s;
      }
    }
  }
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}
</style>