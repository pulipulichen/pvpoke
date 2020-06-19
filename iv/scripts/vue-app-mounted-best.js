/* global postMessageAPI */

var appMount = async function () {
  this.battle = new Battle();
  
  await this.initPokemons()
  await this.initRanks()
            
  this.ready = true
  //this.initBestIV()
}