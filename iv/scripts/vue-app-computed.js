var appComputed = {
  rankings1500SpeciesId: function () {
    return this.rankings1500.map(r => r.speciesId)
  },
  rankings2500SpeciesId: function () {
    return this.rankings2500.map(r => r.speciesId)
  },
  speciesIdToData: function () {
    if (this.ready === false) {
      return {}
    }
    
    let data = {}
    
    this.gm.data.pokemon.forEach(p => {
      let tags = p.tags
      
      p.isAlolan = false
      p.isGalarian = false
      p.isShadow = false
      
      if (Array.isArray(tags)) {
        p.isAlolan = (tags.indexOf('alolan') > -1)
        p.isGalarian = (tags.indexOf('galarian') > -1)
        p.isShadow = (tags.indexOf('shadow') > -1)
        
      }
      
      data[p.speciesId] = p
    })
    
    return data
  },
  top1500: function () {
    return this.computedBuildTopPokemons(this.rankings1500, "cp1500")
  },
  top2500: function () {
    return this.computedBuildTopPokemons(this.rankings2500, "cp2500")
  },
  top1500Shadow: function () {
    return this.computedBuildTopShadowPokemons(this.rankings1500, "cp1500")
  },
  top2500Shadow: function () {
    return this.computedBuildTopShadowPokemons(this.rankings2500, "cp2500")
  },
  topMix: function () {
    let data = {}
    
    let includedSpeciesId = []
   
    let add = (top) => {
      Object.keys(top).forEach((area) => {
        if (Array.isArray(data[area]) === false) {
          data[area] = []
        }

        top[area].forEach(p => {
          let speciesId = p.speciesId

          if (includedSpeciesId.indexOf(speciesId) === -1) {
            data[area].push(p)
            includedSpeciesId.push(speciesId)
          }
        })
      })
    }
    
    //console.log(this.top1500)
    add(this.top1500)
    add(this.top2500)
    add(this.top1500Shadow)
    add(this.top2500Shadow)
    
    // 排序
    Object.keys(data).forEach((area) => {
      data[area].sort((a, b) => {
        if (a.dex !== b.dex) {
          return a.dex - b.dex
        }
        else if (a.tags.indexOf('shadow') > -1) {
          return 1
        }
        else {
          return 0
        }
      })
    })
    
    return data
  },
  topMixFamilyDex: function () {
    let data = {}
    
    Object.keys(this.topMix).forEach(area => {
      let list = []
      this.topMix[area].forEach(p => {
        let familyDex = this.evolutionFamily[p.dex]
        familyDex.forEach(d => {
          if (list.indexOf(d) === -1) {
            list.push(d)
          }
        })
      })
      data[area] = list
    })
    
    return data
  },
  outOfRanking: function () {
    if (this.ready === false) {
      return {}
    }
    
    let exclusiveList = {}
    
    Object.keys(this.top1500).forEach((area) => {
      this.computedOutOfRankingAddDex(area, this.top1500[area], exclusiveList)
    })
    Object.keys(this.top2500).forEach((area) => {
      this.computedOutOfRankingAddDex(area, this.top2500[area], exclusiveList)
    })
    
    Object.keys(exclusiveList).forEach(a => {
      exclusiveList[a].sort((a, b) => {
        return Number(a) - Number(b)
      })
    })
    
    return exclusiveList
  },
  outOfRankingShadow: function () {
    if (this.ready === false) {
      return {}
    }
    
    let exclusiveList = {}
    
    Object.keys(this.top1500Shadow).forEach((area) => {
      this.computedOutOfRankingAddDex(area, this.top1500Shadow[area], exclusiveList)
    })
    Object.keys(this.top2500Shadow).forEach((area) => {
      this.computedOutOfRankingAddDex(area, this.top2500Shadow[area], exclusiveList)
    })
    
    Object.keys(exclusiveList).forEach(a => {
      exclusiveList[a].sort((a, b) => {
        return Number(a) - Number(b)
      })
    })
    
    return exclusiveList
  },
  topList: function () {
    if (this.ready === false) {
      return {}
    }
    
    let areaDexStarMap = {}
    let areaDexIVAttMap = {}
    
    
    Object.keys(this.top1500).forEach(area => {
      this.top1500[area].forEach(pokemon => {
        let iv = pokemon.gIV.slice(0,2)
        let star = pokemon.gStar
        let dex = pokemon.dex
        this.computedTopListAddDex(area, dex, star, iv, areaDexStarMap, areaDexIVAttMap)
      })
    })
    
    Object.keys(this.top2500).forEach(area => {
      this.top2500[area].forEach(pokemon => {
        let iv = pokemon.uIV.slice(0,2)
        let star = pokemon.uStar
        let dex = pokemon.dex
        this.computedTopListAddDex(area, dex, star, iv, areaDexStarMap, areaDexIVAttMap)
      })
    })
    
    //console.log(areaDexStarMap)
    
    // ----------------------------
    
    // 再轉換成以星級為主的列表
    let areaStarDexMap = this.computedTopListBuildAreaStarDexMap(areaDexStarMap)
    
    
    // ----------------------------
    
    // 再轉換成以攻擊為主的列表
    let areaAttDexMap = this.computedTopListBuildAreaAttDexMap(areaDexIVAttMap)
    
    return {
      star: areaStarDexMap,
      att: areaAttDexMap
    }
  },
  topShadowList: function () {
    if (this.ready === false) {
      return {}
    }
    
    let areaDexStarMap = {}
    let areaDexIVAttMap = {}
    
    Object.keys(this.top1500Shadow).forEach(area => {
      this.top1500Shadow[area].forEach(pokemon => {
        let iv = pokemon.gIV
        let star = pokemon.gStar
        let dex = pokemon.dex
        this.computedTopListAddDex(area, dex, star, iv, areaDexStarMap, areaDexIVAttMap)
      })
    })
    
    Object.keys(this.top2500Shadow).forEach(area => {
      this.top2500Shadow[area].forEach(pokemon => {
        let iv = pokemon.uIV
        let star = pokemon.uStar
        let dex = pokemon.dex
        this.computedTopListAddDex(area, dex, star, iv, areaDexStarMap, areaDexIVAttMap)
      })
    })
    
    //console.log(areaDexStarMap)
    
    // ----------------------------
    
    // 再轉換成以星級為主的列表
    let areaStarDexMap = this.computedTopListBuildAreaStarDexMap(areaDexStarMap)
    
    
    // ----------------------------
    
    // 再轉換成以攻擊為主的列表
    let areaAttDexMap = this.computedTopListBuildAreaAttDexMap(areaDexIVAttMap)
    
    return {
      star: areaStarDexMap,
      att: areaAttDexMap
    }
  },
  bestIVCells: function () {
    if (this.ready === false) {
      //console.log('等待中')
      return ''
    }
    //console.log('開始計算')
    
    let rows = []
    
    // 先處理要移除的全部
    let outOfRankingPrefixNotTraded = "!交換&!4*&距離0-10&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let outOfRankingPrefixTraded = "交換&!4*&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let outOfRankingPrefixTradedBadLucky = "交換&2*&亮晶晶&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    
    let header = '臺北(0-10)'
    this.computedBestIVCellsOutOfRange(rows, this.outOfRanking, header, outOfRankingPrefixNotTraded, outOfRankingPrefixTraded, outOfRankingPrefixTradedBadLucky)
    
    // ----------------------
    // 來處理排名內，但不在星級內的名單
    
    let starMap = this.topList.star
    let topRankingStarIncorrPrefixNotTraded = "!交換&距離0-10&!4*&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let topRankingStarIncorrPrefixTraded = "交換&!4*&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let topRankingStarIncorrPrefixTradedBadLucky = "交換&2*&亮晶晶&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    
    this.computedBestIVCellsStarMap(rows, starMap, topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, topRankingStarIncorrPrefixTradedBadLucky)
    
    // -------------------
    // 來處理排名內，符合星級，不過要注意Att是否相符的名單
    
    let attMap = this.topList.att
    let topRankingStarCorrAttPrefixNotTraded = "!交換&距離0-10&!4*&!f&!p&!U&!G&!傳說的寶可夢&!幻&"
    let topRankingStarCorrAttPrefixTraded = "交換&!4*&!f&!p&!U&!G&!傳說的寶可夢&!幻&"
    let topRankingStarCorrAttPrefixAllDistance = "!暗影&!4*&!傳說的寶可夢&!幻&"
    
    this.computedBestIVCellsAttMap(rows, attMap, topRankingStarCorrAttPrefixNotTraded, topRankingStarCorrAttPrefixTraded, topRankingStarCorrAttPrefixAllDistance)
    
    rows.push([])
    // -----------------
    
    this.computedBestIVCellsAll(rows, attMap, topRankingStarCorrAttPrefixNotTraded, topRankingStarCorrAttPrefixTraded, topRankingStarCorrAttPrefixAllDistance)
    
    for (let i = 0; i < 10; i++) {
      rows.push('-\t-\t-\t-\t-\t-\t-')
    }
    
    //console.log('計算完畢', rows)
    return rows.join("\n")
  },
  bestIVCellsTainan: function () {
    return this.bestIVCells.split('&距離0-10').join('&距離200-300')
  },
  bestIVCellsTaichung: function () {
    return this.bestIVCells.split('&距離0-10').join('&距離100-200')
  },
  bestIVShadowCells: function () {
    if (this.ready === false) {
      //console.log('等待中')
      return ''
    }
    //console.log('開始計算')
    
    let rows = []
    
    // 先處理要移除的全部
    let outOfRankingPrefixNotTraded = "!4*&暗影&!傳說的寶可夢&!幻&!異色&"
    let outOfRankingPrefixTraded = outOfRankingPrefixNotTraded
    let outOfRankingPrefixTradedBadLucky = outOfRankingPrefixNotTraded
    
    let header = '暗影'
    
    this.computedBestIVCellsOutOfRange(rows, this.outOfRankingShadow, header, outOfRankingPrefixNotTraded, outOfRankingPrefixTraded, outOfRankingPrefixNotTraded)
    
    
    // ----------------------
    // 來處理排名內，但不在星級內的名單
    
    let starMap = this.topShadowList.star
    let topRankingStarIncorrPrefixNotTraded = "!4*&暗影&!傳說的寶可夢&!幻&!異色&"
    let topRankingStarIncorrPrefixTraded = topRankingStarIncorrPrefixNotTraded
    
    this.computedBestIVCellsStarMap(rows, starMap, topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, outOfRankingPrefixNotTraded)
    
    // -------------------
    // 來處理排名內，符合星級，不過要注意Att是否相符的名單
    
    let attMap = this.topShadowList.att
    let topRankingStarCorrAttPrefixNotTraded = "!4*&暗影&!傳說的寶可夢&!幻&!異色&"
    let topRankingStarCorrAttPrefixTraded = topRankingStarCorrAttPrefixNotTraded
    let topRankingStarCorrAttPrefixAllDistance = ""
    
    this.computedBestIVCellsAttMap(rows, attMap, topRankingStarCorrAttPrefixNotTraded, topRankingStarCorrAttPrefixTraded, topRankingStarCorrAttPrefixAllDistance)
    
    for (let i = 0; i < 10; i++) {
      rows.push('-\t-\t-\t-\t-\t-\t-')
    }
    
    //console.log('計算完畢', rows)
    return rows.join("\n")
  },
  bestIVAll () {
    if (typeof(this.bestIVCSV) === 'string') {
      let result = this.bestIVCSV.replace(new RegExp(",","gm"), "\t")
      //console.log(result)
      return result
    }
  }
}
