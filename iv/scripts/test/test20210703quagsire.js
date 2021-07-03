function test20210703quagsire () {
  
    // 沼王 195 quagsire
    if (this.top1500NotMax.normal.map(p => p.dex).indexOf(195) === -1) {
      console.error('top1500NotMax normal 應該包含195 沼王', this.top1500NotMax.normal.map(p => p.dex))
    }
    
    //console.log(this.top1500TradeBetter)
    if (this.top1500TradeBetter.normal.map(p => p.dex).indexOf(195) > -1) {
      console.error('top1500TradeBetter normal 不應該包含195 沼王', this.top1500TradeBetter.normal.map(p => p.dex))
    }
    
    //if (this.top1500NotMax.star.normal['0*'].indexOf(195) > -1) {
    //  console.error('topNotMaxTradableListReverseStar 0* 不應該包含195 沼王', this.topNotMaxTradableListReverseStar.star.normal['0*'].sort())
    //}
    
    if (this.topNotMaxTradableListReverseStar.star.normal['0*'].indexOf(195) > -1) {
      console.error('topNotMaxTradableListReverseStar 0* 不應該包含195 沼王', this.topNotMaxTradableListReverseStar.star.normal['0*'].sort())
    }
    
    // ------------------------
    //console.log(this.top1500TradeBetter)
    if (this.top1500TradeWorser.normal.map(p => p.dex).indexOf(195) === -1) {
      console.error('top1500TradeWorser normal 應該包含195 沼王', this.top1500TradeWorser.normal.map(p => p.dex))
    }
    
    // 沼王 195 quagsire
    if (this.topNotMaxUntradableListReverseStar.star.normal['0*,3*'].indexOf(195) === -1) {
      console.error('topNotMaxUntradableListReverseStar 0*,3* 應該包含195 沼王', this.topNotMaxUntradableListReverseStar.star.normal['0*,3*'].sort())
    }
    
    //console.log(this.topNotMaxTradableListReverseStar.star)
    /*
    if (this.outOfRanking.normal.indexOf(130) > -1) {
      console.error('outOfRanking 不應該要包含130 暴鯉龍', this.outOfRanking.normal.sort())
    }
     */
}