/* global postMessageAPI */

var appMount = async function () {
  this.battle = new Battle();
  
  await this.initPokemons()
  await this.initRanks()
  this.initBestCSV()
            
  this.ready = true
  //this.initBestIV()
}