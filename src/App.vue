<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style >

/* 隐藏浏览器自带的滚动条 */
body::-webkit-scrollbar {
  width: 0; /* 调整滚动条宽度 */
}
 
body::-webkit-scrollbar-track {
  background-color: transparent; /* 设置滚动条轨道背景色为透明 */
}
 
body::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2); /* 设置滚动条滑块颜色 */
  border-radius: 0.25em; /* 设置滚动条滑块圆角 */
}
 
/* 显示页面内的滚动条 */
.scrollable-content {
  overflow-y: auto; /* 启用垂直滚动条 */
}
</style>