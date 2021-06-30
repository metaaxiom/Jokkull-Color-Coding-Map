:earth_americas: Jokkull Color-Coding Map
========================

**Assign colors to counties on a US map, group counties by color, and calculate the populations of each color group.**

The app is built on Vue.js (v3) with Vuex for state management. D3.js is used to generate the interactive map, and the Census API is queried for population data.

## :clipboard: To-Do's

* [ ] Ability to change the color of existing selections.
* [ ] Ability to remove existing selections.
* [ ] Ability to assign names to selections.
* [ ] Ability to toggle (show / hide) selection group.
* [ ] Ability to save maps as a "key".
* [ ] Fix sticky shift multi-selection issue.
* [ ] See county and state names in tooltip on hover.
* [ ] Improve the appearance of the UI.

## :date: Update History

### Version 0.1.0

* Prototype / proof of concept.

### Version 0.4.0

* [x] Rewrote the whole app in Vue.js, to simplify the process of re-rendering the map legend with new data.
* [x] Added grouping by selection color. Also, the population totals are now calculated for each group seperately.
* [x] Fixed the delay between making a selection and seeing the relevant data on the map legend. Instead of loading data piece-by-piece, county-by-county on select, all data is now fetched from the Census API in bulk, on page load.
* [x] Expanded this README with update history and other information.