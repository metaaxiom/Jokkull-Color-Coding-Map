import { createStore } from 'vuex';

const state = {
  allCountyData: new Map(),
  currSelectionsData: new Map(),
  currSelectionColor: '',
  formerSelectionsColors: []
};

const getters = {
  popTotalFromColorGroup: (state) => (selectionColor) => {
    let sum = 0;
    state.currSelectionsData.get(selectionColor).forEach(countyDatumObj => {
      sum += countyDatumObj.countyPop;
    });
    return sum;
  }
};

const mutations = {
  insertToAllCountyData(state, countyDatumObj){
    state.allCountyData.set(countyDatumObj.FIPS, countyDatumObj);
  },
  addColorGroupToSelectionsData(state, selectionColor){
    state.currSelectionsData.set(selectionColor, new Map());
  },
  addCountyToSelectionsData(state, {countyFIPS, selectionColor}){
    state.currSelectionsData.get(selectionColor)
      .set(countyFIPS, {...state.allCountyData.get(countyFIPS), selectionColor});
  },
  updateCurrSelectionColor(state, newColor){
    state.currSelectionColor = newColor;
  },
  saveFormerSelectionColor(state, formerColor){
    state.formerSelectionsColors.push(formerColor);
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
    if(!state.currSelectionsData.has(selectionColor)){
      commit('addColorGroupToSelectionsData', selectionColor);
    }
    // don't add duplicates
    if(!state.currSelectionsData.get(selectionColor).has(countyFIPS)){
      commit('addCountyToSelectionsData', {countyFIPS, selectionColor});
    }
    state.currSelectionsData.get(selectionColor).forEach(countyObj => {
      console.log(countyObj.countyName);
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