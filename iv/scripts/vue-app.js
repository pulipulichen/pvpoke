/* global appData, appComputed, appWatch, appMethods, appMount */

let app = {
  el: '#app',
  data: appData,
  computed: appComputed,
  mounted: appMount,
  watch: appWatch,
  methods: appMethods
}

app = new Vue(app)

/*
setTimeout(() => {
  let battle = new Battle();
  let selectedPokemon = new Pokemon('abomasnow', 0, battle);

  console.log(selectedPokemon)
}, 1000)
*/