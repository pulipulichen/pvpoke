var appComputedTrade = {
  top1500TradeBetter: function () {
    //console.log(this.top1500)
    //throw Error('test')
    //return this.
    let result = this.filterTradable(this.top1500NotMax, true, '1500')
    
    // 20210510 要先排除七夕青鳥
//    if (result.normal.map(p => p.dex).indexOf(334) > -1) {
//      console.error('不應該包含334')
//    }
    //console.log('better traded', result.normal.map(p => p.dex).sort())
    
    //console.log('no traded', result.normal.map(p => p.dex).sort())
    //console.log(result)
    return result
  },
  top1500TradeBetterTraded: function () {
    let result = this.filterTradable(this.top1500NotMax, true, '1500', true)
    
    // 20210510 要先排除七夕青鳥
//    console.log('better traded', result.normal.map(p => p.dex).sort())
    
    return result
  },
  top1500TradeBetterSpeciesIDList: function () {
    let result = []
    
    for (let area in this.top1500TradeBetter) {
      this.top1500TradeBetter[area].forEach(p => {
        result.push(p.speciesId)
      })
    }
    
    return result
  },
  top2500TradeBetter: function () {
    return this.filterTradable(this.top2500NotMax, true, '2500')
  },
  top2500TradeBetterTraded: function () {
    return this.filterTradable(this.top2500NotMax, true, '2500', true)
  },
  top2500TradeBetterSpeciesIDList: function () {
    let result = []
    
    for (let area in this.top2500TradeBetter) {
      this.top2500TradeBetter[area].forEach(p => {
        result.push(p.speciesId)
      })
    }
    
    return result
  },
  top1500TradeWorser: function () {
    let result = this.filterTradable(this.top1500NotMax, false, '1500')
    
//    if (result.normal.map(p => p.dex).indexOf(334) === -1) {
//      console.error('20210511 worser traded 應該包含334', result.normal.map(p => p.dex).sort())
//    }
    //console.log('worser traded', result.normal.map(p => p.dex).sort())
    
    return result
  },
  top1500TradeWorserSpeciesIDList: function () {
    let result = []
    
    //console.log(this.top1500TradeWorser)
    
    for (let area in this.top1500TradeWorser) {
      this.top1500TradeWorser[area].forEach(p => {
        result.push(p.speciesId)
      })
    }
    //console.log(result)
    return result
  },
  top1500TradeWorserOverlap: function () {
    let result = {}
    
    // 檢查一下，如果有在better 1500 或 better 2500 內，那就排除
    for (let area in this.top1500TradeWorser) {
      result[area] = this.top1500TradeWorser[area].filter(({speciesId}) => {
        return (this.top1500TradeBetterSpeciesIDList.indexOf(speciesId) === -1 
                && this.top2500TradeBetterSpeciesIDList.indexOf(speciesId) === -1)
      })
    }
    
    //console.log('worser traded', result.normal.map(p => p.dex).sort())
    
    return result
  },
  top2500TradeWorser: function () {
    return this.filterTradable(this.top2500NotMax, false, '2500')
  },
  top2500TradeWorserSpeciesIDList: function () {
    let result = []
    
    for (let area in this.top2500TradeWorser) {
      this.top2500TradeWorser[area].forEach(p => {
        result.push(p.speciesId)
      })
    }
    //console.log(result)
    return result
  },
  top2500TradeWorserOverlap: function () {
    let result = {}
    
    // 檢查一下，如果有在better 1500 或 better 2500 內，那就排除
    for (let area in this.top2500TradeWorser) {
      result[area] = this.top2500TradeWorser[area].filter(({speciesId}) => {
        return (this.top1500TradeBetterSpeciesIDList.indexOf(speciesId) === -1 
                && this.top2500TradeBetterSpeciesIDList.indexOf(speciesId) === -1)
      })
    }
    
    //console.log(result.normal.map(p => p.speciesId))
    
    return result
  },
  topNotMaxTradableListReverseStar: function () {
    //let list = this.computedTopListBuildAreaStarReverseDexMap(this.topNotMaxList)
    let list = this.buildTopListReverseStar(this.top1500TradeBetter, this.top2500TradeBetter, true)
    //console.log(list)
    
    if (list.dex.normal.indexOf(334) > -1) {
      console.error('可交換 不應包括 334')
    }
    
    return list
  },
  topNotMaxTradableListTradedReverseStar: function () {
    //let list = this.computedTopListBuildAreaStarReverseDexMap(this.topNotMaxList)
    let list = this.buildTopListReverseStar(this.top1500TradeBetterTraded, this.top2500TradeBetterTraded, false)
//    console.log(this.top1500TradeBetterTraded.normal.map(p => p.speciesId))
//    console.log(this.top1500TradeBetter.normal.map(p => p.speciesId))
//    
//    console.log(this.top2500TradeBetterTraded.normal.map(p => p.speciesId))
//    console.log(this.top2500TradeBetter.normal.map(p => p.speciesId))
    
    //console.log(this.top1500TradeBetterTraded.normal.map(p => p.dex).sort())
    //console.log(this.top2500TradeBetterTraded.normal.map(p => p.dex).sort())
    
    //console.log(list)
    if (list.star.normal['1*'].indexOf(683) === -1) {
      //throw Error('交換後 排除1* 應包括 683')
      console.error('交換後 排除1* 應包括 683')
    }
    

    return list
  },
  topNotMaxUntradableListReverseStar: function () {
    let tradableDexMap = this.topNotMaxTradableListReverseStar.dex
    //console.log(tradableDexMap)
    
    //let list = this.computedTopListBuildAreaStarReverseDexMap(this.topNotMaxList)
    let list = this.buildTopListReverseStar(this.top1500TradeWorserOverlap, this.top2500TradeWorserOverlap, false, tradableDexMap)
    
    return list
  },
  topTradeBetterList: function () {
    return this.buildTopList(this.top1500TradeBetter, this.top2500TradeBetter, true)
  },
  topTradeWorserList: function () {
    return this.buildTopList(this.top1500TradeWorserOverlap, this.top2500TradeWorserOverlap, false)
  },
//  topNotMaxTradeBetterListReverseStar: function () {
//    //let list = this.computedTopListBuildAreaStarReverseDexMap(this.topNotMaxList)
//    let list = this.buildTopListReverseStar(this.top1500TradeBetter, this.top2500TradeBetter)
//    //console.log(list)
//    return list
//  },
}
