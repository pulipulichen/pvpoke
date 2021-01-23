var appComputedInfo = {
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
      
      if (p.speciesId.endsWith('_xl')) {
        return false
      }
      
//      if (p.dex === 660) {
//        console.log(p)
//      }
      
      if (!p.gIV) {
        p.gIV = this.get1500IV(p.speciesId).slice(1)
      }

      if (!p.gStar) {
        p.gStar = this.calcGStar(p)
      }
      
      
      if (!p.uIV) {
        p.uIV = this.get2500IV(p.speciesId).slice(1)
      }

      if (!p.uStar) {
        p.uStar = this.calcUStar(p)
      }
      
      p.isAlolan = false
      p.isGalarian = false
      p.isShadow = false
      
      if (Array.isArray(tags) && tags.length > 0) {
        //console.log(tags)
        p.isAlolan = (tags.indexOf('alolan') > -1)
        p.isGalarian = (tags.indexOf('galarian') > -1)
        p.isShadow = (tags.indexOf('shadow') > -1)
      }
      
      data[p.speciesId] = p
    })
    
    return data
  },
  top1500: function () {
    let top = this.computedBuildTopPokemons(this.rankings1500, "cp1500")
    //console.log(`top1500`)
    //console.log(top)
    ///console.log('top1500')
    //this.reportTop(top)
//    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'machamp'))
//    }
//    
    return top
  },
  top2500: function () {
    let top = this.computedBuildTopPokemons(this.rankings2500, "cp2500")
    
    //console.log('top2500')
    //this.reportTop(top)
    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'metagross'))
//    }
    
    return top
  },
  top1500TradeBetter: function () {
    //console.log(this.top1500)
    //throw Error('test')
    //return this.
    return this.filterTradable(this.top1500NotMax, true)
  },
  top2500TradeBetter: function () {
    return this.filterTradable(this.top2500NotMax, true)
  },
  top1500TradeWorser: function () {
    return this.filterTradable(this.top1500NotMax, false)
  },
  top2500TradeWorser: function () {
    return this.filterTradable(this.top2500NotMax, false)
  },
  top1500max: function () {
    let top = this.computedBuildTopMaxPokemons(this.rankings1500, "cp1500")
    //console.log('top1500max')
    //console.log(top)
    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'raichu'))
//    }
    
    return top
  },
  top2500max: function () {
    let top = this.computedBuildTopMaxPokemons(this.rankings2500, "cp2500")
    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'machamp'))
//    }
    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'metagross'))
//    }
    
    return top
  },
  top1500NotMax: function () {
    let top = this.computedBuildTopNotMaxPokemons(this.rankings1500, "cp1500")
    //console.log('top1500notmax')
    //console.log(top)
    
    return top
  },
  top2500NotMax: function () {
    let top = this.computedBuildTopNotMaxPokemons(this.rankings2500, "cp2500")
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'metagross'))
//    }
    return top
  },
  top1500Shadow: function () {
    let top = this.computedBuildTopShadowPokemons(this.rankings1500, "cp1500")
    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'machamp'))
//    }
    
    return top
  },
  top2500Shadow: function () {
    let top = this.computedBuildTopShadowPokemons(this.rankings2500, "cp2500")
    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'machamp'))
//    }
    
    return top
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

//          if (speciesId === 'machamp_shadow') {
//            console.log(p)
//            return false
//          }

          if (includedSpeciesId.indexOf(speciesId) === -1) {
            data[area].push(p)
            includedSpeciesId.push(speciesId)
          }
        })
      })
    }
    
    //console.log(this.top1500)
//    console.log('top1500')
    add(this.top1500)
//    
//    console.log('top2500')
    add(this.top2500)
//    add(this.top1500Shadow)
//    add(this.top2500Shadow)
    
    // 排序
    Object.keys(data).forEach((area) => {
      data[area].sort((a, b) => {
        try {
          if (a.dex !== b.dex) {
            return a.dex - b.dex
          }
          else if (Array.isArray(a.tags) 
                  && a.tags.indexOf('shadow') > -1) {
            return 1
          }
          else {
            return 0
          }
        }
        catch (e) {
          console.error(a)
          console.error(e)
        }
      })
    })
    
    return data
  },
  topMixShadow: function () {
    let data = {}
    
    let includedSpeciesId = []
   
    let add = (top) => {
      Object.keys(top).forEach((area) => {
        if (Array.isArray(data[area]) === false) {
          data[area] = []
        }

        top[area].forEach(p => {
          let speciesId = p.speciesId

//          if (speciesId === 'machamp_shadow') {
//            console.log(p)
//          }

          if (includedSpeciesId.indexOf(speciesId) === -1) {
            data[area].push(p)
            includedSpeciesId.push(speciesId)
          }
        })
      })
    }
    
    //console.log(this.top1500)
    add(this.top1500Shadow)
    add(this.top2500Shadow)
    
    // 排序
    Object.keys(data).forEach((area) => {
      data[area].sort((a, b) => {
        try {
          if (a.dex !== b.dex) {
            return a.dex - b.dex
          }
          else if (Array.isArray(a.tags) 
                  && a.tags.indexOf('shadow') > -1) {
            return 1
          }
          else {
            return 0
          }
        }
        catch (e) {
          console.error(a)
          console.error(e)
        }
      })
    })
    
    return data
  },
  topMixFamilyDex: function () {
    let data = {}
    //console.log(this.topMix)
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
    
    Object.keys(this.top1500max).forEach((area) => {
      this.computedOutOfRankingAddDex(area, this.top1500max[area], exclusiveList)
    })
    Object.keys(this.top2500max).forEach((area) => {
      this.computedOutOfRankingAddDex(area, this.top2500max[area], exclusiveList)
    })
    
    Object.keys(exclusiveList).forEach(a => {
      exclusiveList[a].sort((a, b) => {
        return Number(a) - Number(b)
      })
    })
    
    return exclusiveList
  },
  topRankingMax: function () {
    if (this.ready === false) {
      return {}
    }
    
    let exclusiveList = {}
    
    // 我需要先列一個排除的清單
    let top = {}
    
    let addedSpeciesIdList = []
    Object.keys(this.top1500max).forEach((area) => {
      if (Array.isArray(top[area]) === false) {
        top[area] = []
      }
      
      this.top1500max[area].forEach(p => {
        let isAnotherMax = (p.uStar === '4*')
        let speciesId = p.speciesId
        
        
        
        if (isAnotherMax === false) {
          let isInAnotherRank = (this.top2500[area] && this.top2500[area].filter(p2 => (p2.speciesId === p.speciesId)).length === 1)
          if (isInAnotherRank === true) {
            return false
          }
        }
        
        if (addedSpeciesIdList.indexOf(speciesId) > -1) {
          return false
        }
        addedSpeciesIdList.push(speciesId)
        top[area].push(p)
      })
    })
    
    Object.keys(this.top2500max).forEach((area) => {
      if (Array.isArray(top[area]) === false) {
        top[area] = []
      }
      
      this.top2500max[area].forEach(p => {
        let isAnotherMax = (p.gStar === '4*')
        let speciesId = p.speciesId
        
        if (speciesId === 'swampert') {
          console.log('speciesId', isAnotherMax, p)
        }
        
        if (isAnotherMax === false) {
          let isInAnotherRank = (this.top1500[area] && this.top1500[area].filter(p2 => (p2.speciesId === p.speciesId)).length === 1)
          if (isInAnotherRank === true) {
            return false
          }
        }
        
        if (addedSpeciesIdList.indexOf(speciesId) > -1) {
          return false
        }
        addedSpeciesIdList.push(speciesId)
        top[area].push(p)
      })
    })
    
    /*
    Object.keys(this.top1500max).forEach((area) => {
      this.computedOutOfRankingAddDex(area, this.top1500max[area], exclusiveList)
    })
    
    //console.log(this.top2500max)
    Object.keys(this.top2500max).forEach((area) => {
      this.computedOutOfRankingAddDex(area, this.top2500max[area], exclusiveList)
    })
    */
    Object.keys(top).forEach((area) => {
      this.computedOutOfRankingAddDex(area, top[area], exclusiveList)
    })
    
    Object.keys(exclusiveList).forEach(a => {
      exclusiveList[a].sort((a, b) => {
        return Number(a) - Number(b)
      })
    })
    
    //console.log(exclusiveList)
    
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
    return this.buildTopList(this.top1500, this.top2500)
  },
  topNotMaxList: function () {
    let list = this.buildTopList(this.top1500NotMax, this.top2500NotMax)
    //console.log(list)
    return list
  },
  topNotMaxListReverseStar: function () {
    //let list = this.computedTopListBuildAreaStarReverseDexMap(this.topNotMaxList)
    let list = this.buildTopListReverseStar(this.top1500NotMax, this.top2500NotMax)
    //console.log(list)
    return list
  },
  topNotMaxTradableListReverseStar: function () {
    //let list = this.computedTopListBuildAreaStarReverseDexMap(this.topNotMaxList)
    let list = this.buildTopListReverseStar(this.top1500TradeBetter, this.top2500TradeBetter)
    //console.log(list)
    return list
  },
  topNotMaxUntradableListReverseStar: function () {
    //let list = this.computedTopListBuildAreaStarReverseDexMap(this.topNotMaxList)
    let list = this.buildTopListReverseStar(this.top1500TradeWorser, this.top2500TradeWorser)
    //console.log(list)
    return list
  },
  topTradeBetterList: function () {
    return this.buildTopList(this.top1500TradeBetter, this.top2500TradeBetter)
  },
  topTradeWorserList: function () {
    return this.buildTopList(this.top1500TradeWorser, this.top2500TradeWorser)
  },
  topShadowList: function () {
    return this.buildTopList(this.top1500Shadow, this.top2500Shadow)
  },
  
}
