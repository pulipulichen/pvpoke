var appComputedOutput = {
  bestIVCells: function () {
    if (this.ready === false) {
      //console.log('等待中')
      return ''
    }
    //console.log('開始計算')
    
    let rows = []
    
    // 先處理要移除的全部
    let outOfRankingPrefixNotTraded = "!交換&!4*&!f&!p&!*&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    
    //let outOfRankingPrefixTraded = "交換&!4*&!f&!p&!*&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let outOfRankingPrefixTraded = "交換&!4*&!f&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&" // 20210508
    //let outOfRankingPrefixTradedBadLucky = "交換&2*&亮晶晶&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    //let outOfRankingPrefixAll = "!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let outOfRankingPrefixAll = "!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let outOfRankingPrefixNotTradedFilter = "!*&!交換&!4*&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    
    let header = "臺北(" + this.distanceBase + ")"
    this.computedBestIVCellsOutOfRange(rows, this.outOfRanking, header, outOfRankingPrefixNotTraded, outOfRankingPrefixTraded, outOfRankingPrefixAll, outOfRankingPrefixNotTradedFilter)
    
    // ----------------------
    // 來處理排名內，100%的
    
    let topRankMaxStar012NotTraded = outOfRankingPrefixNotTraded.split('&!4*&').join('&!3*&!4*&')
    let topRankMaxStar012Traded = outOfRankingPrefixTraded.split('&!4*&').join('&!3*&!4*&')
    let topRankMaxStar012All = outOfRankingPrefixAll.split('&!4*&').join('&!3*&!4*&')
    let topRankMaxStar012NotTradedFilter = outOfRankingPrefixNotTradedFilter.split('&!4*&').join('&!3*&!4*&')
    
    //console.log(this.topRankingMaxTraded)
    
    this.computedBestIVCellsTopRankMax(rows, this.topRankingMax, this.topRankingMaxTraded, '排名100% 0*-2*', topRankMaxStar012NotTraded, topRankMaxStar012Traded, topRankMaxStar012All, topRankMaxStar012NotTradedFilter)
    this.computedBestIVCellsTopRankMax(rows, this.topRankingMax, this.topRankingMaxTraded, '排名100% !4*', outOfRankingPrefixNotTraded, outOfRankingPrefixTraded, outOfRankingPrefixAll, outOfRankingPrefixNotTradedFilter)
    
    // ----------------------
    // 來處理排名內，交換了可能有用，但不在星級內的名單
    
    let starMap = this.topNotMaxTradableListReverseStar.star
    let topRankingStarIncorrPrefixNotTraded = "!交換&!4*&!f&!p&!*&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    //let topRankingStarIncorrPrefixTraded = "交換&!4*&!f&!p&!*&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let topRankingStarIncorrPrefixTraded = "交換&!4*&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&" // 20210508
    let topRankingStarIncorrPrefixTradedBadLucky = "交換&2*&亮晶晶&!f&!p&!*&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let topRankingStarIncorrPrefixNotTradedFilter = "!交換&!f&!p&!U&!G&!4*&!*&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    
    //this.computedBestIVCellsStarMap(rows, starMap, topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, topRankingStarIncorrPrefixTradedBadLucky, topRankingStarIncorrPrefixNotTradedFilter)
    this.computedBestIVCellsStarReverseMap('排名內可換星級不符', 'e'
      , rows, starMap
      , topRankingStarIncorrPrefixNotTraded
      , topRankingStarIncorrPrefixTraded
      , topRankingStarIncorrPrefixTradedBadLucky
      , topRankingStarIncorrPrefixNotTradedFilter)
    
    this.computedBestIVCellsStarReverseMap('排名內 請傳送 不換但星級不符', 'u'
      , rows, this.topNotMaxUntradableListReverseStar.star
      , topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, topRankingStarIncorrPrefixTradedBadLucky
      , topRankingStarIncorrPrefixNotTradedFilter)
    
    this.computedBestIVCellsStarReverseMap('排名內 只看交換 星級不符', 'u'
      , rows, this.topNotMaxTradableListTradedReverseStar.star
      , topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, topRankingStarIncorrPrefixTradedBadLucky
      , topRankingStarIncorrPrefixNotTradedFilter)
    
    
    // ------------------------
    
    // -------------------
    // 來處理排名內，符合星級，交換了可能有用，不過要注意Att是否相符的名單
    this.outputBestInStatTradable(rows)
    
    this.outputBestInStatUntradable(rows)
    
    // -----------------
    // 列出所有名單，這是為了要找出排除用的
    
    let allNotTraded = "!交換&!f&!*&!傳說的寶可夢&!幻&"
    let allTraded = "交換&!f&!p&!*&!U&!G&!異色&!暗影&!淨化&!傳說的寶可夢&!幻&"
    //let allAllDistance = "!暗影&!淨化&!4*&!傳說的寶可夢&!幻&" // 不可以加上「&!t&!e&!w&!c&」，因為這會讓交換之後的寶可夢無法納入判斷
    let allAllDistance = "!傳說的寶可夢&!幻&" // 不可以加上「&!t&!e&!w&!c&」，因為這會讓交換之後的寶可夢無法納入判斷
    let allNotTradedFilter = "!*&!交換&!f&!p&!U&!G&!異色&!暗影&!淨化&!傳說的寶可夢&!幻&"
    
    //  this.computedBestIVCellsAll(rows, attMap, allNotTraded, allTraded, allAllDistance, allNotTradedFilter)
    this.computedBestIVCellsStarMapAll(rows, this.topList.star, allNotTraded, allTraded, allAllDistance, allNotTradedFilter)
    
    this.insertRowHr(rows)
    
    // -------------------
    
    let attMap = this.topList.att
    let topAll = "!暗影&!淨化&!傳說的寶可夢&!幻&" // 不可以加上「&!t&!e&!w&!c&」，因為這會讓交換之後的寶可夢無法納入判斷
    this.computedQueryNotTopAreaAll(rows, attMap, topAll)
    
    // -------------------
    
    for (let i = 0; i < 10; i++) {
      //rows.push('-\t-\t-\t-\t-\t-\t-\t-\t-\t-')
      this.insertRowHr(rows)
    }
    
    //console.log('計算完畢', rows)
    return rows.join("\n")
  },
  bestIVCellsTainan: function () {
    return this.bestIVCells.split('&距離' + this.distanceBase).join('&距離200-300')
  },
  bestIVCellsTaichung: function () {
    return this.bestIVCells.split('&距離' + this.distanceBase).join('&距離100-200')
  },
  bestIVShadowCells: function () {
    if (this.ready === false) {
      //console.log('等待中')
      return ''
    }
    //console.log('開始計算')
    
    let rows = []
    
    // 先處理要移除的全部
    let outOfRankingPrefixNotTraded = "暗影,淨化&!傳說的寶可夢&!幻&"
    let outOfRankingPrefixTraded = outOfRankingPrefixNotTraded
    //let outOfRankingPrefixTradedBadLucky = outOfRankingPrefixNotTraded
    
    let header = '暗影'
    
    this.computedBestIVCellsShadowOutOfRange(rows, this.outOfRankingShadow, header, outOfRankingPrefixNotTraded, outOfRankingPrefixTraded, outOfRankingPrefixNotTraded)
    
    
    // ----------------------
    // 來處理排名內，但不在星級內的名單
    
    let starMap = this.topShadowList.star
    let topRankingStarIncorrPrefixNotTraded = "暗影,淨化&!傳說的寶可夢&!幻&"
    let topRankingStarIncorrPrefixTraded = topRankingStarIncorrPrefixNotTraded
//    
    //this.computedBestIVCellsShadowStarExclusiveMap(rows, starMap, topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, outOfRankingPrefixNotTraded)
    
    // -------------------
    // 來處理排名內，符合星級，不過要注意Att是否相符的名單
//    this.outputBestAll(rows)
//    
//    this.insertRowHr(rows)
    
    // ---------------------
    // 找出最後排名用的
    
    let allRankingStarIncorrPrefixNotTraded = "暗影,淨化&!傳說的寶可夢&!幻&"
    
    this.computedBestIVCellsShadowStarMap(rows, this.topShadowList.star, allRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, outOfRankingPrefixNotTraded)
    
    rows.push('暗影&異色&@遷怒\t-\t-\t-\t-\t-\t-\t-\t-\t-')
    
    // -------------------------
    // 最後補上空白
    
    for (let i = 0; i < 10; i++) {
      rows.push('-\t-\t-\t-\t-\t-\t-\t-\t-\t-')
    }
    
    //console.log('計算完畢', rows)
    return rows.join("\n")
  },
  bestIVAll () {
    //console.log('aaa', this.ivTableProgress)
    if (this.ivTableProgress !== null) {
      return this.ivTableProgress
    }
    if (typeof(this.bestIVCSV) === 'string') {
      //console.log('bestIVCSV', this.bestIVCSV)
      let result = this.bestIVCSV.replace(new RegExp(",","gm"), "\t")
      //console.log(result)
      return result
    }
  }
}
