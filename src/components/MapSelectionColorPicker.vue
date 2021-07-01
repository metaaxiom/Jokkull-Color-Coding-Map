<template>
  <div id="color-panel-container">
    <input type="color" v-model="currColorPickerVal" id="selection-color-picker">
    <label for="selection-color-picker" class="color-panel-label">Current Color</label>
    <div id="former-colors-panel-container">
      <div class="color-panel-label">Former colors:</div>
      <div id="former-colors-boxes-container">
        <div 
          v-for="(formerColor, fcIdx) in formerSelectionsColors" 
          :key="fcIdx"
          class="former-color-box"
          :style="`background-color: ${formerColor};`"
          @click="updateCurrSelectionColor(formerColor)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MapSelectionColorPicker',
  data(){
    return {
      defaultColor: '#ff4646'
    }
  },
  computed: {
    ...mapState(['currSelectionColor', 'formerSelectionsColors']),
    currColorPickerVal: {
      get(){
        return this.currSelectionColor;
      },
      set(newColor){
        this.updateCurrSelectionColor(newColor);
      }
    }
  },
  methods: {
    ...mapActions(['updateCurrSelectionColor'])
  },
  mounted(){
    this.updateCurrSelectionColor(this.defaultColor);
  }
}
</script>

<style>
#former-colors-panel-container {
  min-height: 60px;
  margin-top: 8px;
}
.color-panel-label {
  font-size: 0.9em;
  font-weight: bold;
  color: #fff;
}
#selection-color-picker {
  margin-right: 4px;
}
#former-colors-boxes-container {
  margin: 3px -3px 0 -3px;
}
.former-color-box {
  display: inline-block;
  border: 1px solid #26282c;
  height: 15px;
  width: 15px;
  margin: 3px;
  cursor: pointer;
}
</style>