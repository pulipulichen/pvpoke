var appComputedMax = {
  
  top1500max: function () {
    let top = this.computedBuildTopMaxPokemons(this.rankings1500Selection, "cp1500")
    //console.log('top1500max')
    //console.log(top)
    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'raichu'))
//    }
    
    return top
  },
  top2500max: function () {
    let top = this.computedBuildTopMaxPokemons(this.rankings2500Selection, "cp2500")
    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'machamp'))
//    }
    
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'metagross'))
//    }
    
    return top
  },
  top1500NotMax: function () {
    let top = this.computedBuildTopNotMaxPokemons(this.rankings1500Selection, "cp1500")
    //console.log('top1500notmax')
    
    //console.log(top.normal.map(p => p.dex).sort())
    
    return top
  },
  top2500NotMax: function () {
    let top = this.computedBuildTopNotMaxPokemons(this.rankings2500Selection, "cp2500")
//    if (top.normal) {
//      console.log(top.normal.filter(p => p.speciesId === 'politoed'))
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
  topRankingMax: function () {
    if (this.ready === false) {
      return {}
    }
    
    let exclusiveList = {}
    
    // 我需要先列一個排除的清單
    let top = {}
    
//    let dexList = this.top1500max.normal.map(p => p.dex)
//    dexList.sort()
//    console.log(dexList)
    
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
        
//        if (speciesId === 'swampert') {
//          console.log('speciesId', isAnotherMax, p)
//        }
        
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
  topRankingMaxTraded: function () {
    if (this.ready === false) {
      return {}
    }
    
    let exclusiveList = {}
    
    // 我需要先列一個排除的清單
    let top = {}
    
//    let dexList = this.top1500max.normal.map(p => p.dex)
//    dexList.sort()
//    console.log(dexList)
    
    let addedSpeciesIdList = []
    Object.keys(this.top1500max).forEach((area) => {
      if (Array.isArray(top[area]) === false) {
        top[area] = []
      }
      
      this.top1500max[area].forEach(p => {
        let isAnotherMax = (p.uStar === '4*')
        let isAnotherTradable = p.isUBetterAfterTrading
        let speciesId = p.speciesId
        
        if (isAnotherTradable === true && isAnotherMax === false) {
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
        let isAnotherTradable = p.isGBetterAfterTrading
        
//        if (speciesId === 'swampert') {
//          console.log('speciesId', isAnotherMax, p)
//        }
        
//        if (p.dex === 186) {
//          console.log(p)
//        }
        
        if (isAnotherTradable === true && isAnotherMax === false) {
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
}
