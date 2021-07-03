function test20210519altaria () {
  
    // 七夕青鳥 334 altaria
//    console.log(this.outOfRanking.normal)
    if (this.outOfRanking.normal.indexOf(334) === -1) {
      console.error('outOfRanking 應該要包含334', this.outOfRanking.normal.sort())
    }
    
    if (this.outOfRankingTraded.normal.indexOf(334) > -1) {
      console.error('outOfRankingTraded 應該不要包含334', this.outOfRankingTraded.normal.sort())
    }
    
    // 七夕青鳥 334 altaria
    if (this.top1500.normal.map(p => p.dex).indexOf(334) === -1) {
      console.error('top1500 應該要包含334', this.top1500.normal.map(p => p.dex).sort())
    }
    
    // 七夕青鳥 334 altaria
    if (this.top1500max.normal.map(p => p.dex).indexOf(334) !== -1) {
      console.error('top1500max 應該不要包含334', this.top1500max.normal.map(p => p.dex).sort())
    }
    
//    // 七夕青鳥 334 altaria
//    if (this.top2500.normal.map(p => p.dex).indexOf(334) === -1) {
//      console.error('top2500 應該要包含334', this.top2500.normal.map(p => p.dex).sort())
//    }
    
    // 七夕青鳥 334 altaria
    if (this.top2500max.normal.map(p => p.dex).indexOf(334) !== -1) {
      console.error('top2500max 應該不要包含334', this.top2500max.normal.map(p => p.dex).sort())
    }
    
    // 七夕青鳥 334 altaria
    // topRankingMaxTraded整合到outOfRanking去了
//    if (this.topRankingMaxTraded.normal.indexOf(334) === -1) {
//      console.error('topRankingMaxTraded 應該要包含334', this.topRankingMaxTraded.normal.sort())
//    }
    
}