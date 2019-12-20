<template>
  <div id="app">
    <div class='container-fluid'>
      <div class='row'>
        <div class='col-3' id="sidebar">
          <sidebar></sidebar>
        </div>
        <div class='col-9'>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Sidebar from './components/Sidebar/Sidebar'

  export default {
    name: 'director',
    components: {
      'sidebar': Sidebar
    },
    mounted: function () {
    },
    methods: {
    }
  }
</script>

<style>
  /* CSS */
  body {
    background: grey;
  }
</style>
