var appComputed = {
  speciesIdToData: function () {
    if (this.ready === false) {
      return {}
    }
    
    let data = {}
    
    this.gm.data.pokemon.forEach(p => {
      let tags = p.tags
      
      p.isAlolan = false
      p.isGalarian = false
      
      if (Array.isArray(tags)) {
        p.isAlolan = (tags.indexOf('alolan') > -1)
        p.isGalarian = (tags.indexOf('galarian') > -1)
      }
      
      data[p.speciesId] = p
    })
    
    return data
  },
  top1500: function () {
    return this.computedBuildTopPokemons(this.rankings1500)
  },
  top2500: function () {
    return this.computedBuildTopPokemons(this.rankings2500)
  },
  outOfRanking: function () {
    if (this.ready === false) {
      return {}
    }
    
    let exclusiveList = {}
    
    let addDex = (a, top) => {
      top.forEach(pokemon => {
        // 確認pokemon的family
        let dex = pokemon.dex
        let family = this.evolutionFamily[dex]
        
        family.forEach(d => {
          if (Array.isArray(exclusiveList[a]) === false) {
            exclusiveList[a] = []
          }
          
          if (exclusiveList[a].indexOf(d) === -1) {
            exclusiveList[a].push(d)
          }
        })
      })
    }
    
    Object.keys(this.top1500).forEach((area) => {
      addDex(area, this.top1500[area])
    })
    Object.keys(this.top2500).forEach((area) => {
      addDex(area, this.top2500[area])
    })
    
    Object.keys(exclusiveList).forEach(a => {
      exclusiveList[a].sort()
    })
    
    return exclusiveList
  },
  topList: function () {
    if (this.ready === false) {
      return {}
    }
    
    let buildIVGrid = (iv) => {
      return iv.map((i) => {
        if (i <= 5) {
          return 'A'
        }
        else if (i <= 10) {
          return 'B'
        }
        else {
          return 'C'
        }
      }).join('/')
    }
    
    let areaDexStarMap = {}
    let areaDexIVAttMap = {}
    
    let addDex = (area, dex, star, iv) => {
      let family = this.evolutionFamily[dex]

      family.forEach(d => {
        if (!areaDexStarMap[area]) {
          areaDexStarMap[area] = {}
        }
        
        if (Array.isArray(areaDexStarMap[area][d]) === false) {
          areaDexStarMap[area][d] = []
        }
        
        if (areaDexStarMap[area][d].indexOf(star) === -1) {
          areaDexStarMap[area][d].push(star)
        }
        
        // -----------
        
        if (!areaDexIVAttMap[area]) {
          areaDexIVAttMap[area] = {}
        }
        
        if (Array.isArray(areaDexIVAttMap[area][d]) === false) {
          areaDexIVAttMap[area][d] = []
        }
        
        let ivGrid = buildIVGrid(iv)
        if (areaDexIVAttMap[area][d].indexOf(ivGrid) === -1) {
          areaDexIVAttMap[area][d].push(ivGrid)
        }
      })
    }
    
    Object.keys(this.top1500).forEach(area => {
      this.top1500[area].forEach(pokemon => {
        if (pokemon.dex === 3) {
          //console.log('有確認到妙蛙花')
        }
        
        let iv = pokemon.gIV.slice(0,2)
        let star = pokemon.gStar
        let dex = pokemon.dex
        addDex(area, dex, star, iv)
      })
    })
    
    Object.keys(this.top2500).forEach(area => {
      this.top2500[area].forEach(pokemon => {
        let iv = pokemon.uIV.slice(0,2)
        let star = pokemon.uStar
        let dex = pokemon.dex
        addDex(area, dex, star, iv)
      })
    })
    
    //console.log(areaDexStarMap)
    
    // ----------------------------
    
    // 再轉換成以星級為主的列表
    let areaStarDexMap = {}
    
    for (let area in areaDexStarMap) {
      for (let dex in areaDexStarMap[area]) {
        let starList = areaDexStarMap[area][dex].sort().join(",")
        dex = Number(dex)
        
        if (!areaStarDexMap[area]) {
          areaStarDexMap[area] = {}
        }
        
        if (Array.isArray(areaStarDexMap[area][starList]) === false) {
          areaStarDexMap[area][starList] = []
        }
        
        if (areaStarDexMap[area][starList].indexOf(dex) === -1) {
          areaStarDexMap[area][starList].push(dex)
        }
      }
    }
    
    
    // ----------------------------
    
    // 再轉換成以攻擊為主的列表
    let areaAttDexMap = {}
    
    for (let area in areaDexIVAttMap) {
      for (let dex in areaDexIVAttMap[area]) {
        let attList = areaDexIVAttMap[area][dex].sort().join(",")
        dex = Number(dex)
        
        if (!areaAttDexMap[area]) {
          areaAttDexMap[area] = {}
        }
        
        if (Array.isArray(areaAttDexMap[area][attList]) === false) {
          areaAttDexMap[area][attList] = []
        }
        
        if (areaAttDexMap[area][attList].indexOf(dex) === -1) {
          areaAttDexMap[area][attList].push(dex)
        }
      }
    }
    
    return {
      star: areaStarDexMap,
      att: areaAttDexMap
    }
  },
  bestIVCells: function () {
    if (this.ready === false) {
      //console.log('等待中')
      return ''
    }
    //console.log('開始計算')
    
    let rows = []
    let rowsToAdd
    
    // 先處理要移除的全部
    rows.push("不在排名內的\t未交換\t數量\t已交換\t數量")
    let outOfRankingPrefixNotTraded = "!交換&!4*&距離0-10&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let outOfRankingPrefixTraded = "交換&!4*&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    
    rowsToAdd = []
    for (let area in this.outOfRanking) {
      let dexList = this.outOfRanking[area]
      let count = dexList.length
      let ivList = dexList.map(dex => '!' + dex).join('&')
      let areaQuery = this.computedAreaQuery(area)
      
      let cells = [
        area,
        areaQuery + outOfRankingPrefixNotTraded + ivList,
        `[${count}]`,
        areaQuery + outOfRankingPrefixTraded + ivList,
        `[${count}]`,
      ].join('\t')
      
      rowsToAdd.push({
        count: count,
        cells
      })
    }
    
    rowsToAdd.sort((a, b) => {
      return b.count - a.count
    }).forEach(row => {
      rows.push(row.cells)
    })
    
    rows.push("") // 空一行
    
    // ----------------------
    // 來處理排名內，但不在星級內的名單
    
    let starMap = this.topList.star
    
    rows.push("排名內但星級不符\t未交換\t數量\t已交換\t數量")
    
    rowsToAdd = []
    
    let topRankingStarIncorrPrefixNotTraded = "!交換&距離0-10&!4*&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    let topRankingStarIncorrPrefixTraded = "交換&!4*&!f&!p&!U&!G&!暗影&!淨化&!傳說的寶可夢&!幻&!異色&"
    for (let area in starMap) {
      Object.keys(starMap[area]).sort().forEach(starList => {
        let dexList = starMap[area][starList]
        let count = dexList.length
        let ivList = dexList.join(',')
        
        let areaQuery = this.computedAreaQuery(area)
        let starExclusiveQuery = this.computedStarExclusiveQuery(starList)
        
        let cells = [
          starList + " " + area,
          starExclusiveQuery + areaQuery + topRankingStarIncorrPrefixNotTraded + ivList,
          `[${count}]`,
          starExclusiveQuery + areaQuery + topRankingStarIncorrPrefixTraded + ivList,
          `[${count}]`,
        ].join('\t')

        rowsToAdd.push({
          count: count,
          cells
        })
      })
    }
    
    rowsToAdd.sort((a, b) => {
      return b.count - a.count
    }).forEach((row, i) => {
      i = i % 6
      
      rows.push(i + ":" + row.cells)
    })
    
    rows.push("") // 空一行
    
    // -------------------
    // 來處理排名內，符合星級，不過要注意Att是否相符的名單
    
    rowsToAdd = []
    let attMap = this.topList.att
    
    rows.push("排名內星級符，過濾攻\t未交換\t數量\t已交換\t數量")
    
    let topRankingStarCorrAttPrefixNotTraded = "!交換&!4*&!f&!p&!U&!G&!傳說的寶可夢&!幻&"
    let topRankingStarCorrAttPrefixTraded = "交換&!4*&!f&!p&!U&!G&!傳說的寶可夢&!幻&"
    for (let area in attMap) {
      Object.keys(attMap[area]).sort().forEach(attList => {
        let dexList = attMap[area][attList]
        let count = dexList.length
        let ivList = dexList.join(',')
        
        let areaQuery = this.computedAreaQuery(area)
        
        let cells = [
          attList + " " + area,
          areaQuery + topRankingStarCorrAttPrefixNotTraded + ivList,
          `[${count}]`,
          areaQuery + topRankingStarCorrAttPrefixTraded + ivList,
          `[${count}]`,
        ].join('\t')

        rowsToAdd.push({
          count: count,
          cells
        })
      })
    }
    
    rowsToAdd.sort((a, b) => {
      return b.count - a.count
    }).forEach((row, i) => {
      i = i % 6
      
      rows.push(i + ":" + row.cells)
    })
    
    //console.log('計算完畢', rows)
    return rows.join("\n")
  },
  bestIVCellsTainan: function () {
    return this.bestIVCells.split('&距離0-10').join('&距離200-300')
  },
  bestIVCellsTaichung: function () {
    return this.bestIVCells.split('&距離0-10').join('&距離100-200')
  }
}
