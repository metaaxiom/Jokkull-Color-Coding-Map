<template>
  <div id="map-sidebar">
    <MapSelectionColorPicker/>
    <MapLegend/>
  </div>
</template>

<script>
import MapSelectionColorPicker from './MapSelectionColorPicker.vue'
import MapLegend from './MapLegend.vue'

export default {
  name: 'MapSidebar',
  components: {
    MapSelectionColorPicker,
    MapLegend
  }
}
</script>

<style>
#map-sidebar {
  margin-left: 20px;
  flex-basis: 100%;
}
</style>