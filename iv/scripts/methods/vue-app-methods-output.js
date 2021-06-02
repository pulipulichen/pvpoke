var appMethodsOutput = {
  outputBestInStatTradable (rows) {
    
    let attMap = this.topTradeBetterList.att
    let topRankingStarCorrAttPrefixNotTraded = "!交換&距離" + this.distanceBase + "&!4*&!f&!p&!U&!G&!異色&!暗影&!淨化&!傳說的寶可夢&!幻&"
    let topRankingStarCorrAttPrefixTraded = "交換&!4*&!f&!p&!U&!G&!異色&!暗影&!淨化&!傳說的寶可夢&!幻&"
    let topRankingStarCorrAttPrefixAllDistance = "!暗影&!淨化&!4*&!傳說的寶可夢&!幻&"
    let topRankingStarCorrAttPrefixNotTradedFilter = "!e&!t&!f&!c&!w&!交換&距離" + this.distanceBase + "&!f&!p&!U&!G&!4*&!異色&!暗影&!淨化&!傳說的寶可夢&!幻&"
    let header = "排名內星級符可交換，過濾攻防IV格(A:0-5/B:6-10/C:11-15)\t未交換\t數量\t已交換\t數量\t全部\t數量\t整理\t數量"

    this.computedBestIVCellsAttMap(rows, header, attMap, topRankingStarCorrAttPrefixNotTraded, topRankingStarCorrAttPrefixTraded, topRankingStarCorrAttPrefixAllDistance, topRankingStarCorrAttPrefixNotTradedFilter)

    //rows.push('-\t-\t-\t-\t-\t-\t-\t-\t-\t-')
    this.insertRowHr(rows)
  },
  outputBestInStatUntradable (rows) {
    
    let attMap = this.topTradeWorserList.att
    let topRankingStarCorrAttPrefixNotTraded = "!交換&距離" + this.distanceBase + "&!4*&!f&!p&!U&!G&!異色&!暗影&!淨化&!傳說的寶可夢&!幻&"
    let topRankingStarCorrAttPrefixTraded = "交換&!4*&!f&!p&!U&!G&!異色&!暗影&!淨化&!傳說的寶可夢&!幻&"
    let topRankingStarCorrAttPrefixAllDistance = "!暗影&!淨化&!4*&!傳說的寶可夢&!幻&"
    let topRankingStarCorrAttPrefixNotTradedFilter = "!e&!t&!f&!c&!w&!交換&距離" + this.distanceBase + "&!f&!p&!U&!G&!4*&!異色&!暗影&!淨化&!傳說的寶可夢&!幻&"
    let header = "排名內星級符不交換，過濾攻防IV格(A:0-5/B:6-10/C:11-15)\t未交換\t數量\t已交換\t數量\t全部\t數量\t整理\t數量"

    this.computedBestIVUntradableCellsAttMap(rows, header, attMap, topRankingStarCorrAttPrefixNotTraded, topRankingStarCorrAttPrefixTraded, topRankingStarCorrAttPrefixAllDistance, topRankingStarCorrAttPrefixNotTradedFilter)

    //rows.push('-\t-\t-\t-\t-\t-\t-\t-\t-\t-')
    this.insertRowHr(rows)
  },
  outputBestAll (rows) {
    
    let attMap = this.topShadowList.att
    let topRankingStarCorrAttPrefixNotTraded = "!4*&暗影,淨化&!傳說的寶可夢&!幻&!異色&"
    let topRankingStarCorrAttPrefixTraded = topRankingStarCorrAttPrefixNotTraded
    let topRankingStarCorrAttPrefixAllDistance = ""
    let header = "全部\t未交換\t數量\t已交換\t數量\t全部\t數量\t整理\t數量"
    
    this.computedBestIVCellsAttMap(rows, header, attMap, topRankingStarCorrAttPrefixNotTraded, topRankingStarCorrAttPrefixTraded, topRankingStarCorrAttPrefixAllDistance)
    
  }
} 