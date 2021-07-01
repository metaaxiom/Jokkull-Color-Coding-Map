<template>
  <div id="app">
    <main id="main-content-container">
      <UsMap/>
      <MapSidebar/>
    </main>
  </div>
</template>

<script>
import UsMap from './components/UsMap.vue'
import MapSidebar from './components/MapSidebar.vue'

export default {
  name: 'App',
  components: {
    UsMap,
    MapSidebar
  },
  created(){
    document.title = 'Jokkull Color Coding Map';
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Lato';
  background-color: #36393f;
}
#main-content-container {
  margin: 0 auto;
  padding-top: 40px;
  width: 1400px;
  display: flex;
  align-items: flex-start;
}
</style>