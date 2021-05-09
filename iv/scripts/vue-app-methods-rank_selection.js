/* global postMessageAPI, XLSX, GameMaster */

var appMethodsRankSelection = {
  getRankingsSelection (rankings) {
    if (Object.keys(this.speciesIdToData).length === 0) {
      return []
    }
    
    // ----------------
    
    let familyBest = {}
    
    // ---------------
    
    let lostFamily = false
    for (let len = rankings.length, i = len; i > 0; i--) {
      let rankNo = (len - i)
      let speciesId = rankings[rankNo].speciesId
      
      let area = this.getArea(speciesId)
      let isShadow = this.isShadow(speciesId)
      
      speciesId = this.stripXLorXS(speciesId)
      
      let p = this.speciesIdToData[speciesId]
      if (!p) {
        throw Error('No data: ' + speciesId)
      }
      let dex = p.dex
      let rootDex = this.getFamilyRootDex(dex)
      
      if (rootDex === false) {
        lostFamily = true
        continue
      }
      
      // ----------------
      
      let rootKey = {
        isShadow,
        area,
        rootDex
      }
      
      rootKey = JSON.stringify(rootKey)
      
      // ----------------
      if (familyBest[rootKey]) {
        // 表示前面已經有人了
        continue
      }
      
      familyBest[rootKey] = {
        rankNo,
        p,
        speciesId
      }
    }
    
    if (lostFamily) {
      throw Error('Lost family')
    }
    
    // -----------------------
    
    // 轉換成陣列
    let familyBestArray = Object.keys(familyBest).map(rootDex => {
      return familyBest[rootDex]
    })
    
    // 排序
    familyBestArray.sort((a, b) => {
      return a.rankNo - b.rankNo
    })
    
    return familyBestArray
  }
}