:earth_americas: Jokkull Color-Coding Map
========================

**Assign colors to counties on a US map, group counties by color, and calculate the populations of each color group.**

The app is built on Vue.js (v3) with Vuex for state management. D3.js is used to generate the interactive map, and the Census API is queried for population data.

[You can preview the app on Replit](https://replit.com/join/tyghgmriur-metaaxiom). Note that the version posted there may not always be the most recent one.

## :clipboard: To-Do's

* [ ] Ability to remove existing selections.
* [ ] Ability to save maps as a "key", and load them later.
* [ ] Fix sticky shift multi-selection issue.
* [ ] Ability to reset the map's position.
* [ ] Show loading notification before map data loads.

## :date: Update History

### Version 0.7.0-alpha

* [x] Ability to change the color of existing selections.
* [x] Ability to assign names to selections.
* [x] Ability to toggle (show / hide) selection group.
* [x] See county and state names in tooltip on hover.
* [x] Make small counties easier to select (by decreasing stroke width when zoomed in).
* [x] Improve the appearance of the UI.

### Version 0.4.0-alpha

* [x] Rewrote the whole app in Vue.js, to simplify the process of re-rendering the map legend with new data.
* [x] Added grouping by selection color. Also, the population totals are now calculated for each group seperately.
* [x] Fixed the delay between making a selection and seeing the relevant data on the map legend. Instead of loading data piece-by-piece, county-by-county on select, all data is now fetched from the Census API in bulk, on page load.
* [x] Expanded this README with update history and other information.

### Version 0.1.0-alpha

* Prototype / proof of concept.