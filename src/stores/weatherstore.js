import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', () => {

  // 数据（状态）

  // 用于存储用户保存后的城市码的数组，并重新渲染以存储的数据（城市码）
  // 如果之前本地存储中有值，就渲染，没有值就返回空数组
  // JSON.parse(localStorage.getItem('weather')) || []
  const saveList = ref(JSON.parse(localStorage.getItem('weather')) || [])

  // 用于存储保存天气信息的加号的显示隐藏的布尔值
  const isShow = ref() 

  // 用于储存显示隐藏about信息提示框的布尔值
  const isShowAbout = ref(false)


  // 方法
  //添加城市代码至列表并持久化的方法
  function addList(code) {
    saveList.value.push(code)
    localStorage.setItem('weather', JSON.stringify(saveList.value))

  }

  // 删除城市代码的方法
  function delList(data) {
    const index = saveList.value.findIndex(item=>item === data)
    saveList.value.splice(index,1)

    localStorage.removeItem('weather') // 删除本地存储
    localStorage.setItem('weather', JSON.stringify(saveList.value)) // 添加本地存储(实现更新并覆盖原有数据)
    // console.log(saveList.value)

    // 手动刷新页面(实现页面数据的更新)
    history.go(0)
  }

  //定义切换标记的方法
  function switchAbout() {
    isShowAbout.value = ! isShowAbout.value
  }

  // 替换星期的方法
  function weekSwitch (n) {
    switch (n) {
      case '1':
        return '周一'
      case '2':
        return '周二'
      case '3':
        return '周三'
      case '4':
        return '周四'
      case '5':
        return '周五'
      case '6':
        return '周六'
      case '7':
        return '周日'
   }
  }


  // 将数据（状态）和操作方法暴露出去供外部组件使用
  return { 
    weekSwitch,
    switchAbout,
    addList,
    delList,
    isShow,
    isShowAbout,
    saveList,

  }
  
})
