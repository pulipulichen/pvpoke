function test20210524gyarados () {
  
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
    
}