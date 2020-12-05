var appComputedPerfectTable = {
  
  perfectTable () {
    
    // 先按照dex排序，不分地區
    let minDex, maxDex
    let dexSpeMap = {}
    
    let result1500 = this.buildDexSpeciesMap(dexSpeMap, minDex, maxDex, this.top1500)
    minDex = result1500.minDex
    maxDex = result1500.maxDex
    
    let result2500 = this.buildDexSpeciesMap(dexSpeMap, minDex, maxDex, this.top2500)
    if (minDex > result2500.minDex) {
      minDex = result2500.minDex
    }
    if (maxDex < result2500.maxDex) {
      maxDex = result2500.maxDex
    }
    
    return this.buildPerfectTable(minDex, maxDex, dexSpeMap)
  },
  perfectShadowTable () {
    
    // 先按照dex排序，不分地區
    let minDex, maxDex
    let dexSpeMap = {}
    
    let result1500 = this.buildDexSpeciesMap(dexSpeMap, minDex, maxDex, this.top1500Shadow)
    minDex = result1500.minDex
    maxDex = result1500.maxDex
    
    let result2500 = this.buildDexSpeciesMap(dexSpeMap, minDex, maxDex, this.top2500Shadow)
    if (minDex > result2500.minDex) {
      minDex = result2500.minDex
    }
    if (maxDex < result2500.maxDex) {
      maxDex = result2500.maxDex
    }
    
    return this.buildPerfectTable(minDex, maxDex, dexSpeMap)
  }
}
