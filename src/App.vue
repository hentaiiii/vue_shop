<template>
  <div id="app">
     <el-button type="success">
       <router-link to="/login">去登陆</router-link>
     </el-button>
     <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
 
}
</script>

<style>

</style>
