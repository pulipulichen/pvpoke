/* global postMessageAPI, GameMaster */

var appMount = async function () {
  this.battle = new Battle();
  
    await this.initPokemons()
    this.initQuery()
}