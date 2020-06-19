var appComputed = {
  speciesIdToData: function () {
    let data = {}
    
    this.gm.data.pokemon.forEach(p => {
      let tags = p.tags
      
      p.isAlolan = (tags.indexOf('alolan') > -1)
      p.isGalarian = (tags.indexOf('galarian') > -1)
      
      data[p.speciesId] = p
    })
    
    return data
  },
  top1500: function () {
    return this.computedBuildTopPokemons(this.rankings1500)
  },
  top2500: function () {
    return this.computedBuildTopPokemons(this.rankings2500)
  },
  outOfRanking: function () {
    let exclusiveList = {}
    
    let addDex = (a, top) => {
      top.forEach(pokemon => {
        // 確認pokemon的family
        let dex = pokemon.dex
        let family = this.evolutionFamily[dex]
        
        family.forEach(d => {
          if (Array.isArray(exclusiveList) === false) {
            exclusiveList[a] = []
          }
          
          if (exclusiveList[a].indexOf(d) > -1) {
            return false
          }
          
          exclusiveList[a].push(d)
        })
      })
    }
    
    this.area.forEach(a => {
      addDex(a, this.top1500[a])
      addDex(a, this.top2500[a])
    })
    
    Object.keys(exclusiveList).forEach(a => {
      exclusiveList[a].sort()
    })
    
    return exclusiveList
  },
  topList: function () {
    let areaDexStarMap = {}
    let areaDexIVAttMap = {}
    
    let addDex = (area, dex, star, ivAtt) => {
      let family = this.evolutionFamily[dex]

      family.forEach(d => {
        if (!areaDexStarMap[area]) {
          areaDexStarMap[area] = {}
        }
        
        if (Array.isArray(areaDexStarMap[area][dex]) === false) {
          areaDexStarMap[area][dex] = []
        }
        
        if (areaDexStarMap[area][dex].indexOf(star) === -1) {
          areaDexStarMap[area][dex].push(star)
        }
        
        // -----------
        
        if (!areaDexIVAttMap[area]) {
          areaDexIVAttMap[area] = {}
        }
        
        if (Array.isArray(areaDexIVAttMap[area][dex]) === false) {
          areaDexIVAttMap[area][dex] = []
        }
        
        if (areaDexIVAttMap[area][dex].indexOf(ivAtt) === -1) {
          areaDexIVAttMap[area][dex].push(ivAtt)
        }
      })
    }
    
    this.area.forEach(area => {
      this.top1500[area].forEach(pokemon => {
        let ivAtt = pokemon.gIV[0]
        let star = pokemon.gStar
        let dex = pokemon.dex
        addDex(area, dex, star, ivAtt)
      })
      
      this.top2500[area].forEach(pokemon => {
        let ivAtt = pokemon.uIV[0]
        let star = pokemon.uStar
        let dex = pokemon.dex
        addDex(area, dex, star, ivAtt)
      })
    })
    
    // ----------------------------
    
    // 再轉換成以星級為主的列表
    let areaStarDexMap = {}
    
    for (let area in areaDexStarMap) {
      for (let dex in areaDexStarMap[area]) {
        let starList = areaDexStarMap[area][dex].join(",")
        dex = Number(dex)
        
        if (!areaStarDexMap[area]) {
          areaStarDexMap[area] = {}
        }
        
        if (Array.isArray(areaStarDexMap[area][starList]) === false) {
          areaStarDexMap[area][starList] = []
        }
        
        if (areaStarDexMap[area][starList].indexOf(dex) === -1) {
          areaStarDexMap[area][starList].push(dex)
        }
      }
    }
    
    return areaDexMap
  }
}
