function test20210511politoed() {

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

}