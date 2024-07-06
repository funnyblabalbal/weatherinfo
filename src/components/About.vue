<template>
    <!-- 
     about页的内容必须装在一个容器（div）中，不然无法添加过渡效果。
     会报警告: Component inside <Transition> renders non-element root node that cannot be animated
     原因：因为template中只能有一个根元素。（虽然vue3的template可以有多个根元素，不会报错，但会导致<Transition>组件失效）
    -->
    <div class="about-container">
        <div class="cover"></div>
        <div class="about-text">
            <h2 style="margin-bottom: 5px;">关于:</h2>
            <p style="margin-bottom: 16px; font-size: 12px;">这个应用可以用来追踪你选择城市的当前天气</p>
            <h2 style="margin-bottom: 5px;">如何使用:</h2>
            <p style="margin-bottom: 16px; font-size: 12px; line-height: 18px;">
            1.点击搜索框输入你希望追踪的城市<br>
            2.在搜索结果中选中一个城市，你将获取当地最新的天气<br>
            3.点击右侧的＋号可以将追踪城市的天气情况保存在首页<br>
            </p>
            <h2 style="margin-bottom: 5px;">移除城市:</h2>
            <p style="font-size: 12px;">
            如果你不想在首页关注某个城市,可以通过底部的按钮删除它
            </p>
            <button class="close-btn" @click="store.switchAbout()">关闭</button>
        </div>
    </div>
</template>

<script setup>
 // 引入store（Pinia）
 import { useWeatherStore } from '@/stores/weatherstore'
 // 定义store对象
 const store = useWeatherStore()

</script>

<style lang="scss" scoped>

.cover{
  opacity: 0.3;
  background-color: #000;
  width: 100vw;
  height: 742px;
  position: fixed;
  z-index: 200;
  
}
.about-text{
  position: absolute;
  left: 595px;
  width: 300px;
  height: 250px;
  margin-top: 128px;
  padding: 16px;
  background-color: #fff;
  color: #000;
  z-index: 500;
  .close-btn{
    margin-top: 32px;
    padding: 8px 24px;
    background-color: #00668A;
    color: #fff;
    border: 0;
    cursor: pointer;
  }
}


</style>