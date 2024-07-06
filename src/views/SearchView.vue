<template>
  <div class="search">

    <Suspense>
      <Header :SearchAd="searchCityAdcode"  />
    </Suspense>

    <main class="container">
      <div class="cityinfo">
        你正在浏览
        <span class="cityname">{{ ResultCityName }}</span>
        的天气信息
        <span v-if="store.saveList.includes(AdCode)">, 此城市已保存</span>
        <span v-else>，可以点击右上角的"+"号保存起来</span>
      </div>

      <div class="rescityweather" v-for="item in ResultCityDayweather" :key="item.id">
        <h1>当日气温是：{{ item.temp }}摄氏度</h1>
        <h1>当日天气是：{{ item.weather }}</h1>
        <h1>当日风向是：{{ item.winddirection }}风</h1>
        <h1>当日风力是：{{ item.windpower }}级</h1>
      </div>

      <hr style="margin-top:20px; border-color: #fff; opacity: 0.1;">

      <div class="weatherinfobox">
        <div class="weatherinfo">

          <div class="week-box">
            <div>今天</div>
            <div>明天</div>
            <div class="date" v-for="item in Week" :key="item.date">
              <div>{{ store.weekSwitch(item) }}</div>
            </div>
          </div>

          <div class="weather-box">
            <div class="weather" v-for="item in ResultCityForecastweatherData" :key="item.id">
              <div>{{ item.date }}</div>
              <div>{{ item.dayweather }}</div>
              <div>风力&nbsp;{{ item.daypower }}级</div>
            </div>
          </div>

          <div class="temp-chart">
            <v-chart :option="options"></v-chart>
          </div>

        </div>
      </div>
    </main>

  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  // 引入公共组件
  import Header from "@/components/Header.vue";

  // 引入请求数据的方法
  import { getBaseWeatherDataApi, getWeatherForecastDataApi} from "@/api";

  // 引入store（Pinia）
  import { useWeatherStore } from '@/stores/weatherstore'
  // 定义store对象
  const store = useWeatherStore()


  // 存储搜索城市的名字
  const ResultCityName = ref()

  // 存储搜索城市的实况天气数据
  const ResultCityDayweather = ref()

  // 存储搜索城市的预报天气数据
  const ResultCityForecastweatherArr = ref()
  const ResultCityForecastweatherData = ref()
  // 星期
  const Week = ref()

  // 折线图数据
  const DayTempData = ref()
  const NightTempData = ref()
  // 折线图配置项
  const options = ref()


  // 定义route对象（获取路由参数）
  const route = useRoute()
  // 获取路由参数adcode
  const AdCode = route.params.cityCode
  // console.log(AdCode)


  // 给header子组件传参
  const searchCityAdcode = ref(AdCode)
  

  // 显示加号（用于保存天气信息）
  store.isShow = true


  function renderChart(data1,data2) {
    options.value = {
      xAxis: {
          type: 'category',
          show: false,
        },
      yAxis: {
        type: 'value',
        show: false,
      },
      grid: {
        left: 0,
        right: 0,
        top: 50,
        bottom: 0,
      },
      series: [
        {
          type: 'line',
          data: data1,
          lineStyle: { 
            color: '#5470c6',
          },
          label: {
            show: true,
            position: 'top',
            color: '#fff',
            formatter: (params) => {
              const res =
                '白' +
                params.data +
                '°C';
              return res;
            }
          },
          smooth: true
        },
        {
          type: 'line',
          data: data2,
          lineStyle: { 
            color: '#91cc75',
          },
          label: {
            show: true,
            position: 'bottom',
            color: '#fff',
            formatter: (params) => {
              const res =
                '白' +
                params.data +
                '°C';
              return res;
            }
          },
          smooth: true
        },
      ],
    }
  }


  onMounted (async ()=>{

    // 获取当前城市的实时天气数据的方法
    const weather = await getBaseWeatherDataApi(AdCode)
    // console.log(weather)

    // 获取搜索城市的城市名
    ResultCityName.value = weather.data.lives[0].city
    // console.log(ResultCityName.value)

    // 获取搜索城市当天的天气数据的方法
    ResultCityDayweather.value = weather.data.lives.map((obj)=>
      obj = {
        temp: obj.temperature,
        weather: obj.weather,
        winddirection: obj.winddirection,
        windpower: obj.windpower
      }
    )
    // console.log(ResultCityDayweather.value)

    // 获取搜索城市天气预报数据（当天以及后3天的天气数据）
    const weatherforecast = await getWeatherForecastDataApi(AdCode)
    // console.log(weatherforecast)

    // 获取搜索城市天气数据的数组
    ResultCityForecastweatherArr.value = weatherforecast.data.forecasts[0].casts
    // console.log(ResultCityForecastweatherArr.value)

    // 获取所需的天气数据
    ResultCityForecastweatherData.value = ResultCityForecastweatherArr.value.map((obj)=>
      obj = {
        week: obj.week,
        date: obj.date.slice(5,10),
        dayweather: obj.dayweather,
        daypower: obj.daypower
      }
    )
    // console.log(ResultCityForecastweatherData.value)
    

    // 日期
    Week.value = ResultCityForecastweatherArr.value.map((item)=>item.week).slice(2,4)
    // console.log(Week.value)


    // 折线温度图数据
    // 获取白天温度
    DayTempData.value = ResultCityForecastweatherArr.value.map((item)=>{
      return item.daytemp
    })
    // 获取夜间温度
    NightTempData.value = ResultCityForecastweatherArr.value.map((item)=>{
      return item.nighttemp
    })
    // console.log(DayTempData.value, NightTempData.value)

    // 渲染折线图（填充实际数据）
    renderChart(DayTempData.value, NightTempData.value)

  })

</script>

<style lang="scss" scoped>
.search {
  width: 100vw;
  // height: 100vh;
  height: 782px;
  background-color: #00668a;
  .container{
    .cityinfo{
      width: 1519px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      padding: 8px;
      color: #fff;
      background-color: #004E71;
    }
    .rescityweather{
      margin-top: 20px;
      padding: 0px 160px;
      line-height: 40px;
      text-align: center;
      color: #fff;
    }
    .weatherinfobox{
      padding: 0px 160px;
      .weatherinfo{
        text-align: center;
        margin: 0 auto;
        padding: 40px 48px;
        color: #fff;
        background-color: #004E71;
        font-size: 16px;
        .week-box{
          display: flex;
          div{
            flex: 1;
          }
        }
        .weather-box{
          margin-top: 10px;
          margin-bottom: 30px;
          display: flex;
          line-height: 40px;
          div{
            flex: 1;
          }
        }
        .temp-chart{
          margin: 0 auto;
          width: 1100px;
          height: 160px;
        }
      }
    }  
  }
}
</style>
