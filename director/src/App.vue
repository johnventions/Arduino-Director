<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <sidebar></sidebar>
    <router-view/>
  </div>
</template>
<script>
import Sidebar from "./components/Sidebar/Sidebar";


export default {
  name: 'App',
  components: {
    'sidebar': Sidebar
  },
  computed: {

  }
}
</script>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
