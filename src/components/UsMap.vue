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
    ...mapState(['allCountyData', 'currSelectionsData', 'currSelectionColor'])
  },
  mounted(){
    this.init();
  },
  methods: {
    ...mapActions([
      'fetchAllCountyData',
      'addCountyToSelectionsData',
      'changeCountySelectionColor',
      'saveFormerSelectionColor'
    ]),
    init(){
      this.fetchAllCountyData().then(() => {
        //console.log('All data fetched:', this.allCountyData);
      })

      //const width = 960;
      //const height = 600;
      var svg = d3.select('svg');
      var path = d3.geoPath().projection(null);
      var features = svg.append('g');

      let self = this;

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
        // tooltip
        let tooltip = d3.select('#map-svg-wrapper')
          .append('div')
          .attr('id', 'mapHoverTooltip');
        
        features.selectAll('path')
          .data(topojson.feature(us, us.objects.counties).features)
          .enter()
          .append('path')
          .attr('class', 'county')
          .attr('d', path)
          .attr('pointer-events', 'visible')
          .on('click', function(target){
            if(d3.event.shiftKey){
              self.makeSelection({countyFIPS: target.id, countyPath: this});
            }
          });
        
        let shiftDragEnabled = false;
        features
          .on('mousedown', x => {
            if(d3.event.shiftKey){
              shiftDragEnabled = true
            }
          })
          .on('mouseup', x => {
            shiftDragEnabled = false
          });

        features.selectAll('path').on('mouseover', function(target, d){
          tooltip.style('visibility', 'visible');
          if(shiftDragEnabled){
            self.makeSelection({countyFIPS: target.id, countyPath: this});
          }
        })
        
        features.selectAll('path').on('mousemove', function(target){
          let hovCountyDatumObj = self.allCountyData.get(target.id);
          tooltip.text(`${hovCountyDatumObj.countyName}, ${hovCountyDatumObj.stateName}`);
          tooltip.style('top', `${d3.event.pageY - 15}px`);
          tooltip.style('left', `${d3.event.pageX + 15}px`);
        });
        features.selectAll('path').on('mouseout', function(){
          tooltip.style('visibility', 'hidden');
        });
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
    makeSelection({countyFIPS, countyPath}){
      let selectionColor = this.currSelectionColor;
      
      if(countyPath.style.fill == ''){
        // if not selected, add new entry
        countyPath.style.fill = selectionColor;
        this.saveFormerSelectionColor(); // won't save duplicates
        this.addCountyToSelectionsData({countyFIPS, selectionColor});
      }else{
        if(countyPath.style.fill != selectionColor){
          // selected, but with a different color
          countyPath.style.fill = selectionColor;
          // update selectionColor in currSelectionsData
          this.changeCountySelectionColor({countyFIPS, newSelectionColor: selectionColor});
        }
      }
    }
  }
}
</script>

<style>
#map-svg-wrapper {
  display: inline-block;
  border: 1px solid #26282c;
  background-color: #2f3136;
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

#mapHoverTooltip {
  position: absolute;
  visibility: hidden;
  background-color: #fff;
  color: #000;
  border: 1px solid #000;
  border-radius: 2px;
  padding: 1px 2px;
  font-size: 0.8em;
}
</style>