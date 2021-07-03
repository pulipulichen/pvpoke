/* global test20210519altaria, test20210511politoed, test20210703quagsire, test20210524gyarados */

var appMethodsTest = {
  test20210511: function () {
    
    //
    // --------------------
    this.test20210511politoed()
    this.test20210519altaria()
//    this.test20210519outOfRangeTraded()
    this.test20210524gyarados()
    
    this.test20210703quagsire()
  },
//  test20210519outOfRangeTraded () {
//    
//    // 七夕青鳥 334 altaria
//    if (this.outOfRankingTraded.normal.indexOf(334) > -1) {
//      console.error('outOfRankingTraded 不應該要包含334', this.outOfRankingTraded.normal.sort())
//    }
//    
//  },
  test20210519altaria,
  test20210511politoed,
  test20210524gyarados,
  test20210703quagsire
}