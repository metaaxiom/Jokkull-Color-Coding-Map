<template>
  <div id="map-legend">
    <div v-for="(selectionColor, scIdx) in currSelectionsColors" :key="scIdx" class="legend-selection-container">
      <div class="legend-selection-box" :style="`border-color: ${selectionColor};`">
        <div class="legend-selection-box__header" :style="`background-color: ${selectionColor};`">
          <div class="legend-selection-box__header-inner">
            Group {{ scIdx + 1 }}
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
              <tr v-for="(countyObj, coIdx) in selectionOfColor(selectionColor)" :key="coIdx">
                <td>{{ countyObj.countyName }}, {{ countyObj.stateName }}</td>
                <td align="right">{{ countyObj.countyPop.toLocaleString()  }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td align="left" class="total-population-cell-name">Total Population</td>
                <td align="right" class="total-population-cell-value">
                  {{ selectionPopTotalFromColor(selectionColor).toLocaleString() }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MapLegend',
  computed: {
    ...mapGetters([
      'currSelectionsColors', 
      'selectionOfColor', 
      'selectionPopTotalFromColor'
    ])
  }
}
</script>

<style scoped>
.legend-selection-container {
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
  padding: 5px 6px;
}
.legend-selection-box__header-inner {
  display: inline-block;
  color: #000;
  background-color: #fff;
  border-radius: 2px;
  padding: 1px 4px;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
}
table thead {
  border-bottom: 1px solid #ccc;
  font-weight: normal;
  text-transform: uppercase;
  color: #646464;
  font-size: 0.7em;
}
table thead th {
  padding-bottom: 2px;
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
</style>