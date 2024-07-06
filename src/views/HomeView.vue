
<template>
  <div class="home">

    <Suspense>
      <Header />
    </Suspense>

    <main class="container">

      <div class="input">

        <input type="text" placeholder="请输入城市名称" v-model.lazy="input" @input="search">

        <ul class="searchResult" v-show="showflag1">
          <p v-show="showflag2">似乎没有找到你查找的城市</p>
          <li v-show="!showflag2" @click="router.push({ name: 'search', params: { cityCode } })">{{cityName}}</li>
        </ul>

      </div>

      <div class="savedCity" style="height: 200px; overflow: auto;" v-if="savedCityWeather.length > 0">
        <div v-for="item in savedCityWeather" :key="item.code">
          <div class="savedCityWeather" style="display: flex; justify-content: center; align-items: center;
          color: #fff; background-color: #004e71; margin-bottom: 16px; padding: 10px;">
            <div style="flex: 1;">{{ item.city }}</div>
            <div style="margin-right: 10px;">{{ item.temp }}度</div>
            <div style="display: flex; gap: 10px;">
              <button class="look" @click="router.push({ name: 'search', params: { cityCode:item.code } })">查询</button>
              <button class="del" @click="store.delList(item.code)">删除</button>
            </div>
          </div>
        </div>
      </div>

      <h2 style="text-align: center; color: #fff;" v-if="savedCityWeather.length < 1">暂时没有保存过城市天气信息，请查询后点击右上角"+"号保存。</h2>
      <h2 style="margin: 24px 0 8px 0; color: #fff;">近期天气</h2>

      <div class="weatherinfobox">

        <div class="week-box">
          <div>今天</div>
          <div>明天</div>
          <div class="date" v-for="item in Week" :key="item.date">
            <div>{{ store.weekSwitch(item) }}</div>
          </div>
        </div>

        <div class="weather-box">
          <div class="weather" v-for="item in WeatherRecent" :key="item.id">
            <div>{{ item.date }}</div>
            <div>{{ item.dayweather }}</div>
            <div>风力&nbsp;{{ item.daypower }}级</div>
          </div>
        </div>

        <div class="temp-chart">
          <v-chart :option="options"></v-chart>
        </div>

      </div>

    </main>

  </div>
</template>

<script setup>

  import {ref, onMounted} from "vue";
  import { useRouter } from 'vue-router'

  // 引入store（Pinia）
  import { useWeatherStore } from '@/stores/weatherstore'
  // 定义store对象
  const store = useWeatherStore()

  // 引入封装的axios实例
  import request from '@/api/axios'

  // 引入请求数据的方法
  import {getCurrentCityApi, getWeatherForecastDataApi, getBaseWeatherDataApi} from "@/api";

  // 引入公共组件
  import Header from "@/components/Header.vue";
  

  // 运用router对象进行路由转跳
  const router = useRouter()

  // 获取当前所在城市的adcode
  const currentCityCode = ref() 

  // 当前所在城市天气预报（当天以及后3天的天气数据）
  const WeatherForecastArr = ref() 
  // 当前所在城市近期天气
  const WeatherRecent = ref()
  // 星期
  const Week = ref()
  // 折线图配置项
  const options = ref()
  // 折线图数据
  const DayTempData = ref()
  const NightTempData = ref()


  //输入框数据
  const input = ref("");
  //定义用于防抖的定时器
  // 防抖：在浏览器的一些高频触发(input resize)的事件中,在指定的单位时间内，只响应最后一次。（单位时间内，频繁触发一个事件，以最后一次触发为准）
  // 作用：如，input事件获取用户输入的内容，然后发送数据请求给后端，后端返回搜素框提示内容，希望等用户输入结束之后再发送请求，而不是输入一个发一次请求
  const timer = ref(null);
  //定义搜索城市的城市名和adcode
  const cityName = ref("");
  const cityCode = ref("");
  //判断城市是否添加到了list
  const showflag1 = ref(false);
  const showflag2 = ref(false);


  // 隐藏加号（用于保存天气信息）
  store.isShow = false;

  // 保存的城市
  const savedCity = ref()
  // 保存的城市的天气信息
  const savedCityWeather = ref([])


  //搜索地区（城市）的方法
  function search(e) {
      clearTimeout(timer);
      timer.value = setTimeout(() => {
        const cityname = e.target.value;
        // console.log(cityname)

        const getRes = async (data) => {
          // 运用地区名获取地区相关数据（如，adcode）的方法
          const res = await request.get(
              `geocode/geo?address=${data}&key=b6510975201abe43bb343cc9c8ea1ff9`
          );
          // console.log(res)
          // console.log(res.data.infocode)

          //判断是否搜索成功（成功时infocode属性的值为 10000 ，失败时infocode属性的值为 30001）
          if (res.data.infocode === "30001") {
              showflag1.value = true;
              showflag2.value = true;
          } else if (res.data.infocode === "10000") {
              showflag1.value = true;
              showflag2.value = false;
              //判断搜索到的是省份还是城市（在level属性中）
              // 省的名字是存储在名为province的属性中的
              // 其他省级以下行政级别（如，市，村庄..）的地区的名字都存储在名为city的属性中
              if (res.data.geocodes[0].level === "省") {
                  cityName.value = res.data.geocodes[0].province;
                  cityCode.value = res.data.geocodes[0].adcode;
              } else {
                  cityName.value = res.data.geocodes[0].city;
                  cityCode.value = res.data.geocodes[0].adcode;
              }
          } else {
              showflag1.value = false;
              showflag2.value = false;
          }
        };
        getRes(cityname);
      }, 900); // 等0.9秒再显示搜索结果，可以手动过滤掉非目标搜索项的显示，提升用户体验
  }


  // 配置折线图
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
  

  onMounted(async ()=>{
    // 获取当前城市数据的方法
    const city = await getCurrentCityApi()

    // 获取当前城市adcode
    currentCityCode.value = city.data.adcode
    // console.log(currentCity.value)


    // 获取当前城市天气预报数据（当天以及后3天的天气数据）
    const weatherforecast = await getWeatherForecastDataApi(currentCityCode.value)
    // console.log(weatherforecast)

    // 获取存储天气数据的数组对象
    WeatherForecastArr.value = weatherforecast.data.forecasts[0].casts
    // console.log(WeatherForecastArr.value)

    // 获取近期天气数据
    WeatherRecent.value = WeatherForecastArr.value.map((obj)=>
      obj = {
        week: obj.week,
        date: obj.date.slice(5,10),
        dayweather: obj.dayweather,
        daypower: obj.daypower
      }
    )
    

    // 日期
    Week.value = WeatherForecastArr.value.map((item)=>item.week).slice(2,4)
    // console.log(Week.value)

    
    // 折线温度图数据
    // 获取白天温度
    DayTempData.value = WeatherForecastArr.value.map((item)=>{
      return item.daytemp
    })
    // 获取夜间温度
    NightTempData.value = WeatherForecastArr.value.map((item)=>{
      return item.nighttemp
    })
    // console.log(DayTempData.value, NightTempData.value)
    
    // 渲染折线图（填充实际数据）
    renderChart(DayTempData.value, NightTempData.value)


    // 获取保存的城市
    const SavedcityCode = store.saveList

    // 获取去重后的保存的城市
    savedCity.value = Array.from(new Set(SavedcityCode))
    // console.log(savedCity.value)

    // 请求保存的城市的天气数据
    const getSavedCity = savedCity.value.map((item)=> getBaseWeatherDataApi(item))
    // console.log(getSavedCity)

    // 获取保存的城市的天气数据
    Promise.all(getSavedCity).then((res)=>{
      // 遍历保存的城市的天气数据
      // console.log(res)
      res.map((item)=>{
        // console.log(item.data)
        // 将保存的城市的天气数据（对象）存储到数组中
        const obj = {
          city: item.data.lives[0].city,
          code: item.data.lives[0].adcode,
          temp: item.data.lives[0].temperature,
        } 
        savedCityWeather.value.push(obj)
      })
    })
    // 打印查看保存的城市的天气数据
    // console.log(savedCityWeather.value)



  })

</script>

<style lang="scss" scoped>

.home {
  width: 100vw;
  // height: 100vh;
  height: 935px;
  background-color: #00668a;
  .container{
    padding: 0px 160px;
    .input{
      padding-top: 16px;
      margin-bottom: 32px;
      input{
        width: 1208px;
        padding: 8px 4px;
        background-color: transparent;
        border:transparent;
        outline: none;
        font-size: 16px;
        color: #fff;
        border-bottom: 1px solid #fff;
      }
      ul{
        margin-top: 5px;
        width: 1208px;
        height: 40px;
        padding: 8px 0;
        line-height: 40px;
        background-color: #004e71;
        font-size: 16px;
        color: #fff;
        list-style: none;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        cursor: pointer;
        li{
          margin-left: 5px;
        }
      }
    }
    .weatherinfobox{
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
.look{
  border-radius: 10px;
  border: 0;
  padding: 5px 10px;
}
.look:hover{
  color: #fff;
  background-color: #00668a;
  transition: all 1s;
  border: 0;
}
.del{
  border-radius: 10px;
  border: 0;
  padding: 5px 10px;
}
.del:hover{
  color: #fff;
  background-color: #00668a;
  transition: all 1s;
  border: 0;
}
</style>
