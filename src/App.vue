<template>
  <Header/>
  <main>
    <div id="main-content-container" class="general-content-container">
      <UsMap/>
      <MapSidebar/>
    </div>
  </main>
</template>

<script>
import Header from './components/Header.vue'
import UsMap from './components/UsMap.vue'
import MapSidebar from './components/MapSidebar.vue'

export default {
  name: 'App',
  components: {
    Header,
    UsMap,
    MapSidebar
  },
  created(){
    document.title = 'Jokkull Color Coding Map';
  }
}
</script>

<style>
@import './styles/variables.css';

body {
  margin: 0;
  font-family: 'Lato';
  background-color: var(--bg-base);
  color: #fff;
}
.general-content-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}
#main-content-container {
  display: flex;
  align-items: stretch;
}
</style>