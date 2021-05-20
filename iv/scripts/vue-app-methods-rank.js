/* global postMessageAPI, XLSX, GameMaster */

var appMethodsRank = {
  computedBuildTopMaxPokemons: function (sourceRankings, cp) {
    if (this.ready === false) {
      return {}
    }
    
//    if (cp === 'cp1500') {
//      console.log(sourceRankings.length)
//    }
    
//    if (cp === 'cp1500') {
//      console.log(sourceRankings.filter(p => p.speciesId.startsWith('diggersby')))
//    }
    
    let ranking = {
      //"normal": [],
      //"alolan": [],
      //"galarian": []
    }
    
    let count = 0
    
    let addedSpeciesIdList = []
    
    let addRanking = (speciesId) => {
      if (typeof(speciesId) !== 'string') {
        return false
      }
      // ------------
      
      speciesId = this.stripXLorXS(speciesId)

      if (addedSpeciesIdList.indexOf(speciesId) > -1) {
//        if (speciesId === 'metagross') {
//          console.log('已經加入過了')
//        }
        return true
      }
      addedSpeciesIdList.push(speciesId)

      // ------------
      
      let p = this.speciesIdToData[speciesId]
//      if (speciesId === 'ferrothorn') {
//        console.log('cp', p)
//      }
      
      let topMaxIncludable = false
      if (cp === 'cp1500' && p.gStar === '4*') {
        topMaxIncludable = true
      }
      else if (cp === 'cp2500' && p.uStar === '4*') {
        topMaxIncludable = true
      }
      
      if (topMaxIncludable === false
              || p.isShadow === true) {
        count++
//        if (speciesId === 'metagross') {
//          console.log(p.topMaxIncludable, p.isShadow)
//        }
        return true
      }
      else if ( cp === 'cp1500' && this.exclude1500.indexOf(speciesId) > -1 
              && !(p.uStar !== "4*" && p.isUBetterAfterTrading === false) ) {
        // 請幫我確認另一個是否是位於 1. 非 max; 2. 交換後會worser
        count++
        return true
      }
      else if ( cp === 'cp2500' && this.exclude2500.indexOf(speciesId) > -1 
              && !(p.gStar !== "4*" && p.isGBetterAfterTrading === false) ) {
        // 請幫我確認另一個是否是位於 1. 非 max; 2. 交換後會worser
        count++
        return true
      }
      else {
        //let iv = p.defaultIVs[cp]
        let iv = this.getIV(cp, speciesId)
        
//        if (speciesId === 'metagross') {
//          console.log('metagross', iv)
//        }
        
        if (iv[1] !== 15 
                || iv[2] !== 15 
                || iv[3] !== 15) {
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
    
//    if (cp === 'cp1500') {
//      console.log(sourceRankings.length)
//    }
    
    for (let i = 0; i < sourceRankings.length; i++) {
      let r = sourceRankings[i]
      let speciesId = r.speciesId
      //console.log(speciesId)
      
      if (addRanking(speciesId) === false) {
        continue
      }
      if (count > this.topLimit) {
        break
      }
    }
    
    let includeList = this.include1500
    if (cp === 'cp2500') {
      includeList = this.include2500
      //console.log(includeList)
    }
    
    
    for (let i = 0; i < includeList.length; i++) {
      let speciesId = includeList[i]
//      if (speciesId === 'metagross') {
//        console.log('metagross')
//      }
      if (addRanking(speciesId) === false) {
        continue
      }
    }
    
//    console.log(ranking.normal.filter(p => p.speciesId === 'metagross'))
    
    return ranking
  },
  computedBuildTopNotMaxPokemons: function (sourceRankings, cp) {
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
      if (typeof(speciesId) !== 'string') {
        return false
      }
      
      if (this.isEndsWithXLorXS(speciesId)) {
        return true
      }
      
      let p = this.speciesIdToData[speciesId]
      //console.log(p.tags)
      
//      if (speciesId === 'metagross') {
//        console.log(p)
//      }
      
      if (p.topMaxIncludable === true
            || p.isNotSpecial === false
            || p.isShadow === true ) {
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
        if (iv[1] === 15 
                && iv[2] === 15 
                && iv[3] === 15) {
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
    
    //console.log(sourceRankings.length)
    for (let i = 0; i < sourceRankings.length; i++) {
      let r = sourceRankings[i]
      let speciesId = r.speciesId
      if (addRanking(speciesId) === false) {
        continue
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
//      if (speciesId === 'metagross') {
//        console.log(speciesId)
//      }
      if (addRanking(speciesId) === false) {
        continue
      }
    }
    //console.log(ranking)
    return ranking
  },
}