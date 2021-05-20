var appComputedInfo = {
  speciesIdToData: function () {
    if (this.ready === false) {
      return {}
    }
    
    let data = {}
    
    this.gm.data.pokemon.forEach(p => {
      let tags = p.tags
      
      if (this.isEndsWithXLorXS(p.speciesId)) {
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
    let top = this.computedBuildTopPokemons(this.rankings1500Selection, "cp1500")
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
    let top = this.computedBuildTopPokemons(this.rankings2500Selection, "cp2500")
    
    //console.log('top2500')
    //this.reportTop(top)
    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'metagross'))
//    }
    
    return top
  },
  
  top1500Shadow: function () {
    let top = this.computedBuildTopShadowPokemons(this.rankings1500Selection, "cp1500")
    
//    if (top.normal) {
//      console.log(top.normal)
//      console.log(top.normal.filter(p => p.speciesId === 'politoed_shadow'))
//    }
    
    return top
  },
  top2500Shadow: function () {
    let top = this.computedBuildTopShadowPokemons(this.rankings2500Selection, "cp2500")
    
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
  
  topMixShadowFamilyDex: function () {
    let data = {}
    //console.log(this.topMix)
    Object.keys(this.topMixShadow).forEach(area => {
      let list = []
      this.topMixShadow[area].forEach(p => {
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
    
//    let dexList = this.top1500.normal.map(p => p.dex)
//    dexList.sort()
//    console.log(dexList)
    
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
    
//    Object.keys(this.top1500TradeBetter).forEach((area) => {
//      this.computedOutOfRankingAddDex(area, this.top1500TradeBetter[area], exclusiveList)
//    })
//    Object.keys(this.top2500TradeBetter).forEach((area) => {
//      this.computedOutOfRankingAddDex(area, this.top2500TradeBetter[area], exclusiveList)
//    })
//    
//    Object.keys(this.top1500TradeWorser).forEach((area) => {
//      this.computedOutOfRankingAddDex(area, this.top1500TradeWorser[area], exclusiveList)
//    })
//    Object.keys(this.top2500TradeWorser).forEach((area) => {
//      this.computedOutOfRankingAddDex(area, this.top2500TradeWorser[area], exclusiveList)
//    })
    
    Object.keys(exclusiveList).forEach(a => {
      exclusiveList[a].sort((a, b) => {
        return Number(a) - Number(b)
      })
    })
    
//    if (exclusiveList.normal.indexOf(334) === -1) {
//      console.error('應該要包含334', exclusiveList.normal.sort())
//    }
    
    return exclusiveList
  },
  
  outOfRankingTraded: function () {
    let output = {}
    
    Object.keys(this.outOfRanking).forEach(area => {
      if (!this.topRankingMaxTraded[area]) {
        output[area] = this.outOfRanking[area]
        return false
      }
      
      output[area] = this.outOfRanking[area].filter(dex => {
        // dex必須不在topRankingMaxTraded
        return (this.topRankingMaxTraded[area].indexOf(dex) === -1)
      })
    })
    
    return output
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
  
  topShadowList: function () {
    return this.buildTopList(this.top1500Shadow, this.top2500Shadow)
  },
  
}
