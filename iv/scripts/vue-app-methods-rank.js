/* global postMessageAPI, XLSX, GameMaster */

var appMethodsRank = {
  computedBuildTopMaxPokemons: function (sourceRankings, cp) {
    if (this.ready === false) {
      return {}
    }
    
    let ranking = {
      //"normal": [],
      //"alolan": [],
      //"galarian": []
    }
    
    let count = 0
    
    let addRanking = (speciesId) => {
      
      let p = this.speciesIdToData[speciesId]
      
      if (p.topMaxIncludable === false) {
        count++
        return true
      }
      else if ( (cp === 'cp1500' && this.exclude1500.indexOf(speciesId) > -1) 
              || (cp === 'cp2500' && this.exclude2500.indexOf(speciesId) > -1) ) {
        count++
        return true
      }
      else {
        //let iv = p.defaultIVs[cp]
        let iv = this.getIV(cp, speciesId)
        if (iv[1] !== 15 
                && iv[2] !== 15 
                && iv[3] !== 15) {
          count++
          return true
        }
      }
      
      // 接下來我要看，這個pokemon它屬於哪一個類型
      
      if (p.isAlolan) {
        if (Array.isArray(ranking.alolan) === false) {
          ranking.alolan = []
        }
        ranking.alolan.push(p)
      }
      else if (p.isGalarian) {
        if (Array.isArray(ranking.galarian) === false) {
          ranking.galarian = []
        }
        ranking.galarian.push(p)
      }
      else {
        if (Array.isArray(ranking.normal) === false) {
          ranking.normal = []
        }
        ranking.normal.push(p)
      }
      
      //if (p.dex === 3) {
      //  console.log("妙蛙花加入了")
      //}
      
      count++
    }
    
    for (let i = 0; i < sourceRankings.length; i++) {
      let r = sourceRankings[i]
      let speciesId = r.speciesId
      if (addRanking(speciesId) === false) {
        break
      }
      if (count > this.topLimit) {
        break
      }
    }
    
    let includeList = this.include1500
    if (cp === 'cp2500') {
      includeList = this.include2500
    }
    
    for (let i = 0; i < includeList.length; i++) {
      let speciesId = includeList[i]
      if (addRanking(speciesId) === false) {
        break
      }
    }
    
    return ranking
  },
}