<template>
  <div id="map-svg-wrapper">
    <svg id="map-svg" width="960" height="600"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

import { mapState, mapActions } from 'vuex';

export default {
  name: 'UsMap',
  data(){
    return {}
  },
  computed: {
    ...mapState(['currSelectionsData', 'currSelectionColor'])
  },
  mounted(){
    this.init();
  },
  methods: {
    ...mapActions([
      'fetchCountyPop', 
      'insertSelectionDatum',
      'saveFormerSelectionColor'
    ]),
    init(){
      //const width = 960;
      //const height = 600;
      let self = this;

      var svg = d3.select('svg');
      var path = d3.geoPath().projection(null);
      var features = svg.append('g');

      /* Zooming functionality */
      var zoom = d3.zoom()
        .filter(() => {
          return !d3.event.shiftKey;
        })
        .scaleExtent([1, 10])
        .on('zoom', function() {
          features.selectAll('path')
          .attr('transform', d3.event.transform);
        });
      svg.call(zoom);

      d3.json('https://d3js.org/us-10m.v2.json', function (error, us) {
        if (error) throw error;

        /* EVENTS & INTERACTIONS - START */
        features.selectAll('path')
          .data(topojson.feature(us, us.objects.counties).features)
          .enter()
          .append('path')
          .attr('class', 'county')
          .attr('d', path)
          .attr('pointer-events', 'visible')
          .on('click', function(target){
            if(d3.event.shiftKey){
              let countyDatumObj = self.buildCountyDatumObj(target, self.currSelectionColor);

              // prevent duplicate insertion fetching for selected counties
              if(this.style.fill == ''){
                this.style.fill = self.currSelectionColor;
                self.saveFormerSelectionColor(); // won't save duplicates
                self.insertSelectionDatum(countyDatumObj);
                self.fetchCountyPop({countyDatumObj});
              }
            }
          });
        
        let hoverEnabled = false;
        // tracks counties recently inserted into currSelectionsData
        let bufferFIPSArr = [];
        features
          .on('mousedown', x => {
            if(d3.event.shiftKey){
              hoverEnabled = true
            }
          })
          .on('mouseup', x => {
            hoverEnabled = false
            bufferFIPSArr.forEach((FIPS, idx) => {
              self.fetchCountyPop({
                countyDatumObj: self.currSelectionsData.get(FIPS),
                callbackOnFinish: () => {
                  if(idx == bufferFIPSArr.length-1){
                    bufferFIPSArr = []; // clear buffer arr
                  }
                }
              });
            });
          });

        features.selectAll("path").on('mouseover', function(target, d){
          if(hoverEnabled){
            let countyDatumObj = self.buildCountyDatumObj(target, self.currSelectionColor);
            
            if(this.style.fill == ''){
              this.style.fill = self.currSelectionColor;
              self.saveFormerSelectionColor(); // won't save duplicates
              bufferFIPSArr.push(countyDatumObj.FIPS);
              self.insertSelectionDatum(countyDatumObj);
            }
          }
        })
        /* EVENTS & INTERACTIONS - END */

        features.append("path")
          .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && !(a.id / 1000 ^ b.id / 1000); }))
          .attr("class", "county-border")
          .attr("d", path);
        
        features.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("class", "state-border")
          .attr("d", path);
      });
    },
    buildCountyDatumObj(countyElement, currCountyColor = this.currSelectionColor){
      // FIPS = state code (2-digit) + county code (3-digit)
      return {
        FIPS: countyElement.id,
        stateCode: countyElement.id.toString().substring(0, 2),
        countyCode: countyElement.id.toString().substring(2),
        countyName: countyElement.properties.name,
        currColor: currCountyColor
      }
    }
  }
}
</script>

<style>
#map-svg-wrapper {
  display: inline-block;
  border: 1px solid #ddd;
}

.county {
  fill: #ccc;
  cursor: pointer;
}
.county:hover {
  fill: #101010;
}
.county-border {
  fill: none;
  stroke: #eee;
}
.state-border {
  fill: none;
  stroke-width: 1px;
  stroke: #eee;
}
.overlay {
  fill: none;
}
</style>