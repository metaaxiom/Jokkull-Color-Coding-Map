<template>
  <div id="map-legend">
    <div 
      v-for="(colorGroupData, colorGroupHex, cgdIdx) in currSelectionsData" 
      :key="cgdIdx" 
      class="legend-selection-container" 
      :class="toggledColorGroupPanelClass(cgdIdx)"
    >
      <div class="legend-selection-box" :style="`border-color: ${colorGroupHex};`">
        <div class="legend-selection-box__header" :style="`background-color: ${colorGroupHex};`">
          <div class="legend-selection-box__header-inner">
            <div class="color-group-name-input-wrapper">
              <input 
                type="text" 
                v-model="colorGroupData['colorGroupName']" 
                class="color-group-name-input" 
                :placeholder="`Group ${cgdIdx+1}`"
              />
            </div>
            <button class="color-group-toggle-btn" @click="toggleColorGroupPanel(cgdIdx)">
              <i class="fas fa-angle-up"></i>
            </button>
          </div>
        </div>

        <div class="legend-selection-box__content">
          <table>
            <thead>
              <tr>
                <th align="left">County &amp; State</th>
                <th align="right">Population</th>
              </tr>
            </thead>
            <tbody>
              
              <tr v-for="(countyObj, coIdx) in colorGroupData['selectedCounties']" :key="coIdx">
                <td>{{ countyObj.countyName }}, {{ countyObj.stateName }}</td>
                <td align="right">{{ countyObj.countyPop.toLocaleString() }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td align="left" class="total-population-cell-name">Total Population</td>
                <td align="right" class="total-population-cell-value">{{ popTotalForColorGroup(colorGroupHex).toLocaleString() }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'MapLegend',
  data(){
    return {
      hiddenColorGroupPanels: []
    }
  },
  computed: {
    ...mapState(['currSelectionsData']),
    ...mapGetters(['popTotalForColorGroup']),
    toggledColorGroupPanelClass(){
      return (cgdIdx) => {
        if(this.hiddenColorGroupPanels.includes(cgdIdx)){
          return 'content-hidden';
        }
        return '';
      };
    },
  },
  methods: {
    toggleColorGroupPanel(cgdIdx){
      if(this.hiddenColorGroupPanels.includes(cgdIdx)){
        this.hiddenColorGroupPanels = this.hiddenColorGroupPanels.filter(hiddenPanelIdx => hiddenPanelIdx != cgdIdx);
      }else{
        this.hiddenColorGroupPanels.push(cgdIdx);
      }
    }
  }
}
</script>

<style scoped>
.legend-selection-container {
  background-color: #2f3136;
  color: #fff;
  margin-bottom: 10px;
}
.legend-selection-container:last-child {
  margin-bottom: 0;
}
.legend-selection-box {
  border: 1px solid;
}
.legend-selection-box__header,
.legend-selection-box__content {
  max-height: 800px;
  transition: max-height 0.3s, padding 0.3s;
  padding: 5px 6px;
  overflow: hidden;
  box-sizing: border-box;
}
.legend-selection-box__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.color-group-toggle-btn {
  flex-basis: 70%;
  padding: 0 0 0 6px;
  box-sizing: border-box;
  background: none;
  color: #fff;
  border: none;
  cursor: pointer;
  text-align: right;
}
.color-group-toggle-btn i {
  font-size: 24px;
  transition: transform 0.3s;
}
.color-group-name-input-wrapper {
  flex-basis: 30%;
}
.color-group-name-input {
  width: 100%;
  padding: 2px 4px;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 2px;
}

table {
  width: 100%;
  border-collapse: collapse;
}
table thead {
  border-bottom: 1px solid #26282c;
  font-weight: normal;
  text-transform: uppercase;
  color: #b0b0b0;
  font-size: 0.7em;
}
table thead th {
  padding-bottom: 4px;
}
table tbody tr:first-child td {
  padding-top: 8px;
}
table tfoot td {
  padding-top: 8px;
}
.total-population-cell-name {
  font-style: italic;
}
.total-population-cell-value {
  font-weight: bold;
}

.legend-selection-container.content-hidden {
  opacity: 0.6;
  transition: opacity 0.3s;
}
.legend-selection-container.content-hidden .color-group-toggle-btn i {
  transform: rotate(180deg);
  transition: transform 0.3s;
}
.legend-selection-container.content-hidden .legend-selection-box__content {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  transition: max-height 0.3s, padding 0.3s;
}
</style>