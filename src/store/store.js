import { createStore } from 'vuex';

const state = {
  currSelectionsData: new Map(),
  currSelectionColor: '',
  formerSelectionsColors: []
};

const getters = {
  currSelectionsColors(state){
    let selectionsColorsArr = [];
    state.currSelectionsData.forEach(countyObj => {
      if(!selectionsColorsArr.includes(countyObj.currColor)){
        selectionsColorsArr.push(countyObj.currColor);
      }
    });
    return selectionsColorsArr;
  },
  // inner function inside getter allows the passing of args
  selectionOfColor: (state) => (color) => {
    let selectionArr = [];
    state.currSelectionsData.forEach(countyObj => {
      if(countyObj.currColor == color){
        selectionArr.push(countyObj);
      }
    });
    return selectionArr;
  },
  selectionPopTotalFromColor: (state, getters) => (color) => {
    let selectionArr = getters.selectionOfColor(color);
    return selectionArr.reduce((accumulatedPop, countyObj) => {
      return accumulatedPop + countyObj.countyPop;
    }, 0);
  }
};

const mutations = {
  updateCurrSelectionColor(state, newColor){
    state.currSelectionColor = newColor;
  },
  saveFormerSelectionColor(state, formerColor){
    state.formerSelectionsColors.push(formerColor);
  },
  insertSelectionDatum(state, countyDatumObj){
    state.currSelectionsData.set(countyDatumObj.FIPS, countyDatumObj);
  },
  addPopToSelectionDatum(state, payload){
    let currCountyDatum = state.currSelectionsData.get(payload.countyFIPS);
    state.currSelectionsData.set(
      payload.countyFIPS, 
      {...currCountyDatum, ...payload.expandedData}
    );
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
  insertSelectionDatum({state, commit}, countyDatumObj){
    /*  
    currSelectionsData:
      04005: { 
        FIPS: 04005, 
        stateCode: 04, 
        countyCode: 005, 
        countyName: 'County Name', 
        stateName: 'State Name', 
        currColor: '#020202'
      }
    */
    
    // prevent duplicates - only insert county, if it's not in the dataset
    if(!state.currSelectionsData.has(countyDatumObj.FIPS)){
      commit('insertSelectionDatum', countyDatumObj);
    }
  },
  fetchCountyPop({state, commit}, {countyDatumObj, callbackOnFinish}){
    fetch(`https://api.census.gov/data/2019/pep/population?get=POP,NAME&for=county:${countyDatumObj.countyCode}&in=state:${countyDatumObj.stateCode}`)
    .then(response => response.json())
    .then(data => {
      // expand countyDatumObj with additional info from API
      countyDatumObj.countyPop = parseInt(data[1][0]);
      countyDatumObj.stateName = ((data[1][1]).split(',')[1]).trim();

      // if currSelectionsData still not populated with new county obj, add it
      if(!state.currSelectionsData.has(countyDatumObj.FIPS)){
        commit('insertSelectionDatum', countyDatumObj);
      }else{
        // otherwise, just append new fields to existing obj
        commit('addPopToSelectionDatum', {
          countyFIPS: countyDatumObj.FIPS, 
          expandedData: {
            countyPop: countyDatumObj.countyPop,
            stateName: countyDatumObj.stateName
          }
        });

        // callback
        if(callbackOnFinish != undefined){
          callbackOnFinish();
        }
      }
    });
  }
};


// create store
export const store = createStore({
  state,
  getters,
  mutations,
  actions
});