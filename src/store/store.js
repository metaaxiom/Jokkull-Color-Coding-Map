import { selection } from 'd3';
import { createStore } from 'vuex';

const state = {
  allCountyData: new Map(),
  currSelectionsData: {},
  currSelectionColor: '',
  defaultSelectionColor: '#ff4646',
  formerSelectionsColors: [],
  defaultCountyEleFill: '#eaeaea'
};

const getters = {
  popTotalForColorGroup: (state) => (selectionColor) => {
    let sum = 0;
    for(let cdoIdx in state.currSelectionsData[selectionColor]['selectedCounties']){
      let countyDatumObj = state.currSelectionsData[selectionColor]['selectedCounties'][cdoIdx];
      sum += countyDatumObj.countyPop;
    }
    return sum;
  }
};

const mutations = {
  insertToAllCountyData(state, countyDatumObj){
    state.allCountyData.set(countyDatumObj.FIPS, countyDatumObj);
  },
  addColorGroupToSelectionsData(state, selectionColor){
    state.currSelectionsData[selectionColor] = {
      selectedCounties: {},
      colorGroupName: '',
      colorGroupPop: 0 // not actively used yet
    };
  },
  addCountyToSelectionsData(state, {countyFIPS, selectionColor}){
    state.currSelectionsData[selectionColor]['selectedCounties'][countyFIPS] = {
      ...state.allCountyData.get(countyFIPS), selectionColor
    }
  },
  addCountyToSelectionsDataDirectly(state, countyDatumObj){
    state.currSelectionsData[countyDatumObj.selectionColor]['selectedCounties'][countyDatumObj.FIPS] = countyDatumObj;
  },
  removeCountyFromSelectionData(state, {countyFIPS, selectionColor}){
    if(Object.keys(state.currSelectionsData[selectionColor]['selectedCounties']).length == 1){
      delete state.currSelectionsData[selectionColor];
    }else{
      delete state.currSelectionsData[selectionColor]['selectedCounties'][countyFIPS];
    }
  },
  updateCurrSelectionColor(state, newColor){
    state.currSelectionColor = newColor;
  },
  saveFormerSelectionColor(state, formerColor){
    state.formerSelectionsColors.push(formerColor);
  },
  assignNameToColorGrpManually(state, {colorGroupHex, nameToAssign}){
    state.currSelectionsData[colorGroupHex].colorGroupName = nameToAssign;
  },
  clearSelectionData(state){
    state.currSelectionsData = {};
  },
  clearColorsData(state){
    state.formerSelectionsColors = [];
  }
};

const actions = {
  updateCurrSelectionColor({commit}, newColor){
    commit('updateCurrSelectionColor', newColor);
  },
  saveFormerSelectionColor({state, commit}, formerColor = state.currSelectionColor){
    // don't save former color, if it already has been saved
    if(!state.formerSelectionsColors.includes(formerColor)){
      commit('saveFormerSelectionColor', formerColor);
    }
  },
  async fetchAllCountyData({state, commit}){
    await fetch(`https://api.census.gov/data/2019/pep/population?get=POP,NAME&for=county:*`)
    .then(response => response.json())
    .then(data => {
      for(let cpdIdx = 1; cpdIdx < data.length; cpdIdx++){
        // start at 1 to skip the first item (data structure info)

        let countyPopDatum = data[cpdIdx];
        
        let stateCode = countyPopDatum[2];
        let countyCode = countyPopDatum[3];
        let FIPS = stateCode + countyCode;
        let splitNameArr = (countyPopDatum[1]).split(',');
        let stateName = (splitNameArr[1]).trim();
        let countyName = (splitNameArr[0]).replace('County', '').trim();
        let countyPop = Number(countyPopDatum[0]);

        commit('insertToAllCountyData', {
          FIPS, stateCode, countyCode, stateName, countyName, countyPop
        });
      }
    });
  },
  addCountyToSelectionsData({state, commit}, {countyFIPS, selectionColor}){
    // if currSelectionsData has no entry for color, add one
    if(!state.currSelectionsData.hasOwnProperty(selectionColor)){
      console.log('added new color grp to selectionsData', selectionColor);
      commit('addColorGroupToSelectionsData', selectionColor);
    }
    // don't add duplicates
    if(!state.currSelectionsData[selectionColor]['selectedCounties'].hasOwnProperty(countyFIPS)){
      console.log('added new county to existing color group in selectiosData');
      commit('addCountyToSelectionsData', {countyFIPS, selectionColor});
    }
  },
  removeCountyFromSelectionData({state, commit}, {countyFIPS}){
    let removedCountyDatumObj = null;
    for(let cgdIdx in state.currSelectionsData){
      let selectedCounties = state.currSelectionsData[cgdIdx]['selectedCounties'];
      if(selectedCounties.hasOwnProperty(countyFIPS)){
        removedCountyDatumObj = selectedCounties[countyFIPS];
        commit('removeCountyFromSelectionData', {countyFIPS, selectionColor: cgdIdx})
      }
    }
    return removedCountyDatumObj;
  },
  changeCountySelectionColor({state, dispatch, commit}, {countyFIPS, newSelectionColor}){
    dispatch('removeCountyFromSelectionData', {countyFIPS})
      .then(removedCountyDatumObj => {
        let updatedCountyDatumObj = {...removedCountyDatumObj};
        updatedCountyDatumObj.selectionColor = newSelectionColor;

        // if currSelectionsData has no entry for color, add one
        if(!state.currSelectionsData.hasOwnProperty(newSelectionColor)){
          commit('addColorGroupToSelectionsData', newSelectionColor);
        }
        commit('addCountyToSelectionsDataDirectly', updatedCountyDatumObj);
      });
  },
  assignNameToColorGrpManually({state, commit}, {colorGroupHex, nameToAssign}){
    if(state.currSelectionsData.hasOwnProperty(colorGroupHex)){
      commit('assignNameToColorGrpManually', {colorGroupHex, nameToAssign});
    }
  },
  clearSelectionData({commit}){
    commit('clearSelectionData');
  },
  clearColorsData({commit}){
    commit('clearColorsData');
  }
};


// create store
export const store = createStore({
  state,
  getters,
  mutations,
  actions
});