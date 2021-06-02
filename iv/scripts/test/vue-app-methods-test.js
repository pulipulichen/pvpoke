var appMethodsTest = {
  test20210511: function () {
    
    
    // --------------------
    this.test20210511politoed()
    this.test20210519altaria()
    this.test20210519outOfRangeTraded()
    this.test20210524gyarados()
  },
  test20210519outOfRangeTraded () {
    
    // 七夕青鳥 334 altaria
    if (this.outOfRankingTraded.normal.indexOf(334) > -1) {
      console.error('outOfRankingTraded 不應該要包含334', this.outOfRankingTraded.normal.sort())
    }
    
  },
  test20210519altaria () {
    
    // 七夕青鳥 334 altaria
    if (this.outOfRanking.normal.indexOf(334) === -1) {
      console.error('outOfRanking 應該要包含334', this.outOfRanking.normal.sort())
    }
    
    // 七夕青鳥 334 altaria
    if (this.top1500max.normal.indexOf(334) !== -1) {
      console.error('top1500max 應該不要包含334', this.top1500max.normal.sort())
    }
    
    // 七夕青鳥 334 altaria
    if (this.top2500max.normal.indexOf(334) !== -1) {
      console.error('top2500max 應該不要包含334', this.top2500max.normal.sort())
    }
    
    // 七夕青鳥 334 altaria
    if (this.topRankingMaxTraded.normal.indexOf(334) === -1) {
      console.error('topRankingMaxTraded 應該要包含334', this.topRankingMaxTraded.normal.sort())
    }
  },
  test20210511politoed () {
    
    // ## 蚊香蛙皇 168 politoed
    let dex = 186
    
    // G 不建議交換 1*
    // U Max
    
    
    // 排名內可換星級不符
    // 未交換
    // n 0*
    // n 2*
    // n 3*
    if (this.top1500.normal.map(p => p.dex).indexOf(dex) === -1) {
      console.error('this.top1500 應該包含' + dex, this.top1500.normal.map(p => p.dex).sort())
    }
    
    if (this.top1500NotMax.normal.map(p => p.dex).indexOf(dex) === -1) {
      console.error('this.top1500NotMax 應該包含' + dex, this.top1500NotMax.normal.map(p => p.dex).sort())
    }
    
    if (this.top1500TradeBetter.normal.map(p => p.dex).indexOf(dex) === -1) {
      console.error('this.top1500TradeBetter 應該包含' + dex, this.top1500TradeBetter.normal.map(p => p.dex).sort())
    }
    
    // --------------------
    
    if (this.outOfRanking.normal.indexOf(dex) === -1) {
      console.error('this.outOfRanking.normal應該要包含' + 186, this.outOfRanking.normal.sort())
    }
    
  },
  test20210524gyarados () {
    
    // 暴鯉龍 130 gyarados
    if (this.top2500max.normal.map(p => p.dex).indexOf(130) > -1) {
      console.error('top2500max 不應該要包含130 暴鯉龍', this.top2500max.normal.map(p => p.dex).sort())
    }
    
    // 暴鯉龍 130 gyarados
    if (this.top1500max.normal.map(p => p.dex).indexOf(130) > -1) {
      console.error('top1500max 不應該要包含130 暴鯉龍', this.top1500max.normal.map(p => p.dex).sort())
    }
    
    // 暴鯉龍 130 gyarados
    if (this.top2500.normal.map(p => p.dex).indexOf(130) > -1) {
      console.error('top2500 不應該要包含130 暴鯉龍', this.top2500.normal.map(p => p.dex).sort())
    }
    
    // 暴鯉龍 130 gyarados
    if (this.outOfRanking.normal.indexOf(130) > -1) {
      console.error('outOfRanking 不應該要包含130 暴鯉龍', this.outOfRanking.normal.sort())
    }
    
  },
}