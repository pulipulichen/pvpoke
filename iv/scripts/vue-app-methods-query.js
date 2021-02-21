/* global postMessageAPI, XLSX, GameMaster, dayInterval */

var appMethodsQuery = {
  computedBuildTopPokemons: function (sourceRankings, cp, limitTrade) {
    if (this.ready === false) {
      return {}
    }
    
    let ranking = {
      //"normal": [],
      //"alolan": [],
      //"galarian": []
    }
    
    let count = 0
    
    let addedList = []
    
    let needQueryXL1500 = []
    let needQueryXL2500 = []
    
    let addRanking = (speciesId) => {
      if (speciesId.endsWith('_xl')) {
        let sId = speciesId.slice(0, -3)
        
        if (sId.endsWith('__shadow')) {
          sId = sId.slice(0, -8) + '_shadow'
        }
        
        if (cp === 'cp1500') {
          if (this.hasXL1500.indexOf(sId) === -1) {
            needQueryXL1500.push(sId)
          }
        }
        else if (cp === 'cp2500') {
          if (this.hasXL2500.indexOf(sId) === -1) {
            needQueryXL2500.push(sId)
          }
        }
        
        return true
      }
      
      if (speciesId.endsWith('_xl')) {
        speciesId = speciesId.slice(0, -3)
        //console.log(speciesId)
        
        if (speciesId.endsWith('__shadow')) {
          speciesId = speciesId.slice(0, -8) + '_shadow'
        }
      }
      
      if (addedList.indexOf(speciesId) > -1) {
        return true
      }
      
      //console.log(speciesId)
      
      let p = this.speciesIdToData[speciesId]
      
      if (!p) {
        throw new Error('SpeciesID is not found: ' + speciesId + '.\n' 
                + ' Please update /src/data/gamemaster.json with https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster.json')
      }
      
      
      if (p.isShadow) {
        count++
        return true
      }
      
      
//      if (speciesId === 'machamp') {
//        console.log(1500, this.exclude1500.indexOf(speciesId))
//        console.log(2500, this.exclude1500.indexOf(speciesId))
//      }
      
      if (p.topIncludable === false) {
        count++
        return true
      }
      else if ( (cp === 'cp1500' && this.exclude1500.indexOf(speciesId) > -1) 
              || (cp === 'cp2500' && this.exclude2500.indexOf(speciesId) > -1) ) {
        count++
        return true
      }
      else {
        //let iv = p.defaultIVs[cp]
        let iv = this.getIV(cp, speciesId)
        /*
        if (iv[1] === 15 
                && iv[2] === 15 
                && iv[3] === 15) {
          count++
          return true
        }
         */
      }
      
      // 接下來我要看，這個pokemon它屬於哪一個類型
      
      if (p.isAlolan) {
        if (Array.isArray(ranking.alolan) === false) {
          ranking.alolan = []
        }
        ranking.alolan.push(p)
      }
      else if (p.isGalarian) {
        if (Array.isArray(ranking.galarian) === false) {
          ranking.galarian = []
        }
        ranking.galarian.push(p)
      }
      else {
        if (Array.isArray(ranking.normal) === false) {
          ranking.normal = []
        }
        ranking.normal.push(p)
      }
      
      //if (p.dex === 3) {
      //  console.log("妙蛙花加入了")
      //}
      
      addedList.push(speciesId)
      
      count++
    }
    
    //console.log(sourceRankings.length)
    for (let i = 0; i < sourceRankings.length; i++) {
      let r = sourceRankings[i]
      let speciesId = r.speciesId
      //if (speciesId === 'diggersby') {
        //console.log(speciesId)
      //}
      if (addRanking(speciesId) === false) {
        continue
      }
      if (count > this.topLimit) {
        break
      }
    }
    
    let includeList = this.include1500
    if (cp === 'cp2500') {
      includeList = this.include2500
    }
    
    for (let i = 0; i < includeList.length; i++) {
      let speciesId = includeList[i]
      if (addRanking(speciesId) === false) {
        continue
      }
    }
    
    // -------------------------------
    
    // 全部跑完後，確認有沒有多的錯誤訊息要處理
    if (needQueryXL1500.length > 0 || needQueryXL2500.length > 0) {
      // https://pvpoketw.com/team-builder/?league=1500&id=mr_mime_galarian
      needQueryXL1500.forEach(sID => {
        console.error(`https://pvpoke.com/team-builder/?league=1500&id=` + sID)
      })
      needQueryXL2500.forEach(sID => {
        console.error(`https://pvpoke.com/team-builder/?league=2500&id=` + sID)
      })
      
      throw Error('Need add XL data to CP1500-IV.csv and CP2500-IV.csv')
    }
    
    return ranking
  },
  computedBuildTopShadowPokemons: function (sourceRankings, cp) {
    if (this.ready === false) {
      return {}
    }
    
    //SOURCE_RANKINGS = sourceRankings
    
    let ranking = {}
    
    let count = 0
    
    let excludeList = this.exclude1500
    if (cp === 'cp2500') {
      excludeList = this.exclude2500
    }
    
    let addedList = []
    
    let addRanking = (speciesId) => {
      //console.log(speciesId)
//      if (speciesId.startsWith('p')) {
//        console.log(speciesId)
//      }
      
      if (speciesId.endsWith('_xl')) {
        speciesId = speciesId.slice(0, -3)
        //console.log(speciesId)
        
        if (speciesId.endsWith('__shadow')) {
          speciesId = speciesId.slice(0, -8) + '_shadow'
        }
      }
      
      if (addedList.indexOf(speciesId) > -1) {
//        if (speciesId.startsWith('politoed')) {
//          console.log('已經加入過了 排除')
//        }
        return true
      }
      addedList.push(speciesId)
      
      if (speciesId.endsWith('_xl') || excludeList.indexOf(speciesId) > -1) {
//        if (speciesId.startsWith('politoed')) {
//          console.log('xl 排除')
//        }
        return true
      }
      
      let p = this.speciesIdToData[speciesId]
      
      
      let iv = this.getIV(cp, speciesId)
      //if (speciesId === 'gliscor_shadow') {
      //  console.log(iv)
      //}
      if (iv[1] === 15 
              && iv[2] === 15 
              && iv[3] === 15) {
        //count++
        // 因為是暗影的，所以不交換
        return true
      }
      
      if (p.isShadow && p.isNotSpecial) {

        //let iv = p.defaultIVs[cp]
        /*
        let iv = this.getIV(cp, speciesId)
        if (iv[1] === 15 
                && iv[2] === 15 
                && iv[3] === 15) {
          return false
        }
        */

        // 接下來我要看，這個pokemon它屬於哪一個類型

        if (p.isAlolan) {
          if (Array.isArray(ranking.alolan) === false) {
            ranking.alolan = []
          }
          ranking.alolan.push(p)
        }
        else if (p.isGalarian) {
          if (Array.isArray(ranking.galarian) === false) {
            ranking.galarian = []
          }
          ranking.galarian.push(p)
        }
        else {
          if (Array.isArray(ranking.normal) === false) {
            ranking.normal = []
          }
          ranking.normal.push(p)
        }
      }
    }
    
    let addedSpeciesIdList = []
    
    for (let i = 0; i < sourceRankings.length; i++) {
      let r = sourceRankings[i]
      let speciesId = r.speciesId
      
//      if (speciesId.startsWith('politoed')) {
//        console.log(speciesId)
//      }
      
      // ---------------
      
      if (speciesId.endsWith('_xl')) {
        speciesId = speciesId.slice(0, -3)
        //console.log(speciesId)
        
        if (speciesId.endsWith('__shadow')) {
          speciesId = speciesId.slice(0, -8) + '_shadow'
        }
      }

      if (speciesId.endsWith('_xl.')) {
        speciesId = speciesId.slice(0, -4)
        
        if (speciesId.endsWith('__shadow')) {
          speciesId = speciesId.slice(0, -8) + '_shadow'
        }
      }
      
      if (addedSpeciesIdList.indexOf(speciesId) > -1) {
        continue
      }
      addedSpeciesIdList.push(speciesId)
      
      // ---------------
      
      let p = this.speciesIdToData[speciesId]
      //console.log(r.topIncludable, r.isShadow)
//      if (speciesId.startsWith('politoed')) {
//        console.log(p)
//      }
      
      if (typeof p.topIncludable === 'undefined') {
        //console.log('缺設定資料!?', p.speciesId, p)
        p.topIncludable = !(p.tags.indexOf('shadow') > -1)
        p.isShadow = (p.tags.indexOf('shadow') > -1)
        p.isNotSpecial = !(p.tags.indexOf('legendary') > -1
              || p.tags.indexOf('untradeable') > -1
              || p.tags.indexOf('mythical') > -1)
        //console.log(p.topIncludable)
      }
      
      let iv = this.getIV(cp, speciesId)
      //if (speciesId === 'gliscor_shadow') {
      //  console.log(iv)
      //}
//      if (speciesId.startsWith('politoed')) {
//        console.log(speciesId, iv)
//      }
      if (iv[1] === 15 
              && iv[2] === 15 
              && iv[3] === 15) {
        count++
        // 因為是暗影的，所以不交換
        continue;
      }
      
      if (p.topIncludable === false) {
        count++
//        if (speciesId.startsWith('politoed')) {
//          console.log(speciesId, iv)
//        }
        addRanking(speciesId)
      }
      else {
        //let iv = p.defaultIVs[cp]
        /*
        let iv = this.getIV(cp, speciesId)
        if (speciesId === 'gliscor_shadow') {
          console.log(iv)
        }
        if (iv[1] === 15 
                && iv[2] === 15 
                && iv[3] === 15) {
          count++
          // 因為是暗影的，所以不交換
          continue;
        }
        */
        
        count++
        if (count > this.topLimit) {
          break
        }
      }
    }
    
    let includeList = this.include1500
    if (cp === 'cp2500') {
      includeList = this.include2500
    }
    
    for (let i = 0; i < includeList.length; i++) {
      let speciesId = includeList[i]
      addRanking(speciesId)
    }
    
    //console.log(ranking)
    return ranking
  },
  filterTradable (top, isTradeBetter) {
    let result = {}
    for (let r in top) {
      let list = top[r]
      
      for (let i = 0; i < list.length; i++) {
        let p = list[i]
        
        if (p.isBetterAfterTrading === isTradeBetter) {
          if (!result[r]) {
            result[r] = []
          }
          result[r].push(p)
        }
      }
    }
    //console.log(result, isTradeBetter)
    return result
  },
  computedOutOfRankingAddDex: function (a, top, exclusiveList) {
    if (!top) {
      return false
    }
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
  },
  computedBuildIVGrid: function (iv) {
    //iv = iv.slice(0,2) // 攻擊,防禦
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
  },
  computedTopListAddDex: function (area, dex, star, iv, areaDexStarMap, areaDexIVAttMap) {
    let family = this.evolutionFamily[dex]
    
    if (!iv) {
      throw Error('iv is undefined')
    }

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

      let ivGrid = this.computedBuildIVGrid(iv)
      //console.log(ivGrid)
      //ivGrid = ivGrid.join('/')
      if (areaDexIVAttMap[area][d].indexOf(ivGrid) === -1) {
        areaDexIVAttMap[area][d].push(ivGrid)
      }
    })
  },
  computedTopListBuildAreaStarDexMap: function (areaDexStarMap) {
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
    
    return areaStarDexMap
  },
  computedTopListBuildAreaStarReverseDexMap: function (areaDexStarMap) {
    let areaStarDexMap = {}
    
    let getReverseStars = (stars) => {
      return ['0*', '1*', '2*', '3*'].filter(s => {
        return (stars.indexOf(s) === -1)
      })
    }
    
    for (let area in areaDexStarMap) {
      for (let dex in areaDexStarMap[area]) {
        
        let dexNumber = Number(dex)
        getReverseStars(areaDexStarMap[area][dex]).forEach(starList => {
          
          if (!areaStarDexMap[area]) {
            areaStarDexMap[area] = {}
          }

          if (Array.isArray(areaStarDexMap[area][starList]) === false) {
            areaStarDexMap[area][starList] = []
          }

          if (areaStarDexMap[area][starList].indexOf(dexNumber) === -1) {
            areaStarDexMap[area][starList].push(dexNumber)
          }
        })
      } // for (let dex in areaDexStarMap[area]) {
      
      // 檢查是否有完全一樣的情況發生
      let map = {}
      Object.keys(areaStarDexMap[area]).forEach(starList => {
        let baseMap = areaStarDexMap[area][starList]
        let baseMapString = baseMap.join(',')
        let matchStars = [starList]
        
        Object.keys(areaStarDexMap[area]).forEach(s => {
          if (matchStars.indexOf(s) > -1) {
            return false
          }
          
          if (areaStarDexMap[area][s].join(',') === baseMapString) {
            matchStars.push(s)
          }
        })
        
        let matchStarsString = matchStars.sort().join(',')
        if (Array.isArray(map[matchStarsString]) === false) {
          map[matchStarsString] = baseMap
        }
      })
      
      areaStarDexMap[area] = map
    }
    
    return areaStarDexMap
  },
  computedTopListBuildAreaAttDexMap: function (areaDexIVAttMap) {
    let areaAttDexMap = {}
    let areaAttHPMap = {}
    
    for (let area in areaDexIVAttMap) {
      for (let dex in areaDexIVAttMap[area]) {
        let hpList = {}
        
        let attList = areaDexIVAttMap[area][dex].sort().map(att => {
          let iv = att.split('/')
          
          let ivList = iv.slice(0, 2).join('/')
          let hp = iv[2]
          if (Array.isArray(hpList[ivList]) === false) {
            hpList[ivList] = []
          }
          
          if (hpList[ivList].indexOf(hp) === -1) {
            hpList[ivList].push(hp)
          }
          //console.log(iv, hp)
          
          return ivList
        }).filter((value, index, self) => {
          return self.indexOf(value) === index
        }).join(',')
        
        
        // -------------------------
        
        if (!areaAttHPMap[area]) {
          areaAttHPMap[area] = {}
        }
        if (!areaAttHPMap[area][attList]) {
          areaAttHPMap[area][attList] = {}
        }
        
        Object.keys(hpList).sort().forEach(att => {
          
          if (Array.isArray(areaAttHPMap[area][attList][att]) === false) {
            areaAttHPMap[area][attList][att] = []
          }
          
          hpList[att].forEach(hp => {
            if (areaAttHPMap[area][attList][att].indexOf(hp) === -1) {
              areaAttHPMap[area][attList][att].push(hp)
            }
          })
        })
        
        // -------------------------
        
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
    //console.log()
    let areaAttHPDexMap = {}
    
    Object.keys(areaAttDexMap).forEach(area => {
      if (!areaAttHPDexMap[area]) {
        areaAttHPDexMap[area] = {}
      }
      
      Object.keys(areaAttDexMap[area]).forEach(attList => {
        let dexList = areaAttDexMap[area][attList]
        
        let attHPList = areaAttHPMap[area][attList]
        
        attList = attList.split(',').map(att => {
          let hpList = attHPList[att].sort().join('')
          //console.log(hpList)
          if (hpList === 'ABC') {
            return att
          }
          
          if (hpList === '') {
            throw new Error('hpList is empty.' + ' ' + area + ' ' + att)
          }
          
          return att + '/' + hpList
        }).join(',')
        
        areaAttHPDexMap[area][attList] = dexList
      })
    })
    //console.log(areaAttHPDexMap)
    return areaAttHPDexMap
  },
  computedBestIVCellsSortRowsByCount: function (rowsToAdd, rows) {
    rowsToAdd.sort((a, b) => {
      return b.count - a.count
    }).forEach((row, i) => {
      i = i % 6
      rows.push(i + ":" + row.cells)
    })
  },
  computedBestIVCellsSortRowsByAreaCount: function (rowsToAdd, rows) {
    rowsToAdd.sort((a, b) => {
      if (a.area === b.area) {
        return b.count - a.count
      }
      else {
        if (a.area === 'normal') {
          return 1
        }
        else if (b.area === 'normal') {
          return -1
        }
        else if (a.area === 'alolan') {
          return 1
        }
        else if (b.area === 'alolan') {
          return -1
        }
      }
    }).forEach((row, i) => {
      i = i % 6
      rows.push(i + ":" + row.cells)
    })
  },
  computedBestIVCellsOutOfRange: function (rows, outOfRanking, header, outOfRankingPrefixNotTraded, outOfRankingPrefixTraded, outOfRankingPrefixTradedBadLucky, outOfRankingPrefixAll) {
    rows.push(header + (new Date()).mmdd() + "\t未交換\t數量\t已交換\t數量\t全部\t數量\t可交換\t數量")
    
    let rowsToAdd = []
    for (let area in outOfRanking) {
      let dexList = outOfRanking[area]
      //console.log(dexList.slice(0,3))
      if (Array.isArray(dexList) === false) {
        throw new Error("dexList is not array")
      }
      let count = dexList.length
      let countName = this.computedCountName(dexList)
      let day = "&日數0-"
      let dayInterval = "&日數0-" + (this.dayInterval + 2)
      let dayIntervalTrade = "&日數1-" + (this.dayInterval + 2)
      
      if (area !== 'normal') {
        dayInterval = dayInterval.slice(0, dayInterval.indexOf('-')+1)
        dayIntervalTrade = dayIntervalTrade.slice(0, dayIntervalTrade.indexOf('-')+1)
      }
      
      let distance = "&距離" + this.distanceBase
      
      let ivList = dexList.map(dex => '!' + dex).join('&')
      let areaQuery = this.computedAreaQuery(area)
      
      let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰
      
      let cells = [
        area,
        'cO' + this.getMMDD() + ',' + areaQuery + outOfRankingPrefixNotTraded + ivList + excludeCollection + distance + dayInterval + '&',
        countName,
        'tO' + this.getMMDD() + ',' + areaQuery + outOfRankingPrefixTraded + ivList + excludeCollection + day,
        countName,
        areaQuery + outOfRankingPrefixTradedBadLucky + ivList + day,
        countName,
        //areaQuery + outOfRankingPrefixAll + ivList + day,
        'eO' + this.getMMDD() + ',' + areaQuery + outOfRankingPrefixNotTraded + ivList + excludeCollection + distance + dayIntervalTrade + '&',
        countName,
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
    
    //rows.push("") // 空一行
    this.insertRowHr(rows)
  },
  computedBestIVCellsShadowOutOfRange: function (rows, outOfRanking, header, outOfRankingPrefixNotTraded, outOfRankingPrefixTraded, outOfRankingPrefixTradedBadLucky, outOfRankingPrefixAll) {
    rows.push(header + (new Date()).mmdd() + "\t未交換\t數量\t已交換\t數量\t全部\t數量\t整理\t數量")
    
    let rowsToAdd = []
    for (let area in outOfRanking) {
      let dexList = outOfRanking[area]
      //console.log(dexList.slice(0,3))
      if (Array.isArray(dexList) === false) {
        throw new Error("dexList is not array")
      }
      let count = dexList.length
      let countName = this.computedCountName(dexList)
      let day = "&日數0-"
      //let dayInterval = "&日數0-" + (this.dayInterval + 2)
      
      let ivList = dexList.map(dex => '!' + dex).join('&')
      let areaQuery = this.computedAreaQuery(area)
      
      let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰

      let cells = [
        area,
        'p' + this.getMMDD() +',' + areaQuery + outOfRankingPrefixNotTraded + ivList + excludeCollection + day,
        countName,
        '-',
        '-',
        '-',
        '-',
        '-',
        '-'
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
    
    //rows.push("") // 空一行
    this.insertRowHr(rows)
  },
  computedBestIVCellsTopRankMax: function (rows,outOfRanking,  header, outOfRankingPrefixNotTraded, outOfRankingPrefixTraded, outOfRankingPrefixTradedBadLucky, outOfRankingPrefixAll) {
    rows.push(header + "\t未交換\t數量\t已交換\t數量\t全部\t數量\t整理\t數量")
    
    let rowsToAdd = []
    for (let area in outOfRanking) {
      let dexList = outOfRanking[area]
      //console.log(dexList.slice(0,3))
      if (Array.isArray(dexList) === false) {
        throw new Error("dexList is not array")
      }
      let count = dexList.length
      let countName = this.computedCountName(dexList)
      let day = "&日數0-"
      let dayInterval = day + (this.dayInterval + 1)
      
      if (area !== 'normal') {
        dayInterval = dayInterval.slice(0, dayInterval.indexOf('-')+1)
      }
      
      let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰

      let distance = "&距離" + this.distanceBase
      
      let ivList = dexList.join(',')
      let areaQuery = this.computedAreaQuery(area)
      
      let cells = [
        area,
        "eR!M" + this.getMMDD() + "," + areaQuery + outOfRankingPrefixNotTraded + ivList + excludeCollection + distance + dayInterval + '&',
        countName,
        "tR!M" + this.getMMDD() + "," + areaQuery + outOfRankingPrefixTraded + ivList + excludeCollection + day,
        countName,
        areaQuery + outOfRankingPrefixTradedBadLucky + ivList + excludeCollection + day,
        countName,
        areaQuery + outOfRankingPrefixAll + ivList + excludeCollection + distance + day,
        countName,
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
    
    //rows.push("") // 空一行
    this.insertRowHr(rows)
  },
  insertRowHr: function (rows) {
    rows.push('-\t-\t-\t-\t-\t-\t-\t-\t-')
  },
  computedBestIVCellsStarMap: function (rows, starMap, topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, topRankingStarIncorrPrefixTradedBadLucky, topRankingStarIncorrPrefixNotTradedFilter = '') {
    
    rows.push("排名內但星級不符\t未交換\t數量\t已交換\t數量\t亮晶晶2*\t數量\t整理\t數量")
    
    let rowsToAdd = []
    
    for (let area in starMap) {
      Object.keys(starMap[area]).sort().forEach(starList => {
        let dexList = starMap[area][starList]
        let count = dexList.length
        let countName = this.computedCountName(dexList)
        
        let day = "&日數0-"
        let dayInterval = day + (this.dayInterval + 3)
        
        if (area !== 'normal') {
          dayInterval = dayInterval.slice(0, dayInterval.indexOf('-')+1)
        }
        
        let ivList = dexList.join(',')
        
        let areaQuery = this.computedAreaQuery(area)
        let starExclusiveQuery = this.computedStarExclusiveQuery(starList)
        
        let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰

        let cells = [
          area.slice(0, 1) + ' ' + starList,
          'e],' + starExclusiveQuery + areaQuery + topRankingStarIncorrPrefixNotTraded + ivList + excludeCollection + dayInterval + '&',
          countName,
          't],' + starExclusiveQuery + areaQuery + topRankingStarIncorrPrefixTraded + ivList + excludeCollection + day,
          countName,
          starExclusiveQuery + areaQuery + topRankingStarIncorrPrefixTradedBadLucky + ivList + day,
          countName,
          starExclusiveQuery + areaQuery + topRankingStarIncorrPrefixNotTradedFilter + ivList + day,
          countName,
        ].join('\t')

        rowsToAdd.push({
          count: count,
          area,
          cells
        })
      })
    }
    
    this.computedBestIVCellsSortRowsByCount(rowsToAdd, rows)
    //rows.push("") // 空一行
    this.insertRowHr(rows)
  },
  computedBestIVCellsStarMapAll: function (rows, starMap, topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, topRankingStarIncorrPrefixTradedBadLucky, topRankingStarIncorrPrefixNotTradedFilter = '') {
    
    rows.push("排名內準備排除用\t未交換\t數量\t全部\t數量\t亮晶晶2*\t數量\t整理\t數量")
    
    let rowsToAdd = []
    
    for (let area in starMap) {
      Object.keys(starMap[area]).sort().forEach(starList => {
        let dexList = starMap[area][starList]
        let count = dexList.length
        let countName = this.computedCountName(dexList)
        
        let day = "&日數0-"
        let dayInterval = day + (this.dayInterval + 3)
        
        if (area !== 'normal') {
          dayInterval = dayInterval.slice(0, dayInterval.indexOf('-')+1)
        }
        
        let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰

        let distance = "&距離" + this.distanceBase
        
        let ivList = dexList.join(',')
        
        let areaQuery = this.computedAreaQuery(area)
        let cells = [
          area.slice(0, 1) + ' ' + starList,
          'e' + (new Date()).mmdd() + ',' + areaQuery + starList + '&' + topRankingStarIncorrPrefixNotTraded + ivList + excludeCollection + distance + day,
          countName,
          'a' + (new Date()).mmdd() + ',' + areaQuery + starList + '&' + topRankingStarIncorrPrefixTradedBadLucky + ivList + excludeCollection + day,
          countName,
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
        ].join('\t')

        rowsToAdd.push({
          count: count,
          area,
          cells
        })
      })
    }
    
    this.computedBestIVCellsSortRowsByCount(rowsToAdd, rows)
    //rows.push("") // 空一行
    this.insertRowHr(rows)
  },
  computedBestIVCellsShadowStarMap: function (rows, starMap, topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, topRankingStarIncorrPrefixTradedBadLucky, topRankingStarIncorrPrefixNotTradedFilter = '') {
    
    rows.push("排名必須符合\t未交換\t數量\t已交換\t數量\t亮晶晶2*\t數量\t整理\t數量")
    
    let rowsToAdd = []
    
    let allIvList = []
    
    for (let area in starMap) {
      Object.keys(starMap[area]).sort().forEach(starList => {
        let dexList = starMap[area][starList]
        let count = dexList.length
        let countName = this.computedCountName(dexList)
        
        allIvList = allIvList.concat(dexList)
        
      })
    }
    
    
    //allIvList = allIvList.join(',')

    let cells = [
      'ALL',
      topRankingStarIncorrPrefixNotTraded + allIvList.join(','),
      '['+ allIvList.length + ']',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
    ].join('\t')

    rowsToAdd.push({
      count: allIvList.length,
      area: 'ALL',
      cells
    })
    
    this.computedBestIVCellsSortRowsByCount(rowsToAdd, rows)
    //rows.push("") // 空一行
    this.insertRowHr(rows)
  },
  
  computedBestIVCellsShadowStarExclusiveMap: function (rows, starMap, topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, topRankingStarIncorrPrefixTradedBadLucky, topRankingStarIncorrPrefixNotTradedFilter = '') {
    
    rows.push("排名內但星級不符\t未交換\t數量\t已交換\t數量\t亮晶晶2*\t數量\t整理\t數量")
    
    let rowsToAdd = []
    
    for (let area in starMap) {
      Object.keys(starMap[area]).sort().forEach(starList => {
        let dexList = starMap[area][starList]
        let count = dexList.length
        let countName = this.computedCountName(dexList)
        
        let day = "&日數0-"
        let dayInterval = day + (this.dayInterval + 3)
        
        if (area !== 'normal') {
          dayInterval = dayInterval.slice(0, dayInterval.indexOf('-')+1)
        }
        
        let ivList = dexList.join(',')
        
        let areaQuery = this.computedAreaQuery(area)
        let starExclusiveQuery = this.computedStarExclusiveQuery(starList)
        
        let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰

        let cells = [
          area.slice(0, 1) + ' ' + starList,
          'p],' + starExclusiveQuery + areaQuery + topRankingStarIncorrPrefixNotTraded + ivList + excludeCollection + dayInterval,
          countName,
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
        ].join('\t')

        rowsToAdd.push({
          count: count,
          area,
          cells
        })
      })
    }
    
    this.computedBestIVCellsSortRowsByCount(rowsToAdd, rows)
    //rows.push("") // 空一行
    this.insertRowHr(rows)
  },
  computedBestIVCellsStarReverseMap: function (header, prefix, rows, starMap, topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, topRankingStarIncorrPrefixTradedBadLucky, topRankingStarIncorrPrefixNotTradedFilter = '') {
    
    rows.push(header + "\t未交換\t數量\t已交換\t數量\t亮晶晶2*\t數量\t整理\t數量")
    
    let rowsToAdd = []
    
    for (let area in starMap) {
      Object.keys(starMap[area]).sort().forEach(starList => {
        let dexList = starMap[area][starList]
        let count = dexList.length
        let countName = this.computedCountName(dexList)
        
        let areaQuery = this.computedAreaQuery(area)
        let starExclusiveQuery =  '&' + starList
        
        let day = "&日數0-" 
        let dayInterval = day + (this.dayInterval + 4)
        
        if (area !== 'normal') {
          dayInterval = dayInterval.slice(0, dayInterval.indexOf('-')+1)
        }
        
        let ivList = dexList.join(',') + starExclusiveQuery
        
        let distance = "&距離" + this.distanceBase
        
        let starListTag = starList.split(',').join('')
        
        let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰

        let cells = [
          area.slice(0,1) + ' ' + starList,
          prefix + 'R!' + starListTag + this.getMMDD() + ',' + areaQuery + topRankingStarIncorrPrefixNotTraded + ivList + excludeCollection + distance + dayInterval,
          countName,
          'tR!' + starListTag + this.getMMDD() + ',' + areaQuery + topRankingStarIncorrPrefixTraded + ivList + excludeCollection + day,
          countName,
          areaQuery + topRankingStarIncorrPrefixTradedBadLucky + ivList + excludeCollection + day,
          countName,
          areaQuery + topRankingStarIncorrPrefixNotTradedFilter + ivList + excludeCollection + distance + day,
          countName,
        ].join('\t')

        //rowsToAdd.push({
        //  count: count,
        //  cells
        //})
        rows.push(cells)
      })
    }
    
    //this.computedBestIVCellsSortRowsByCount(rowsToAdd, rows)
    //rows.push("") // 空一行
    this.insertRowHr(rows)
  },
  computedBestIVCellsAttMap: function (rows, header, attMap, topRankingStarCorrAttPrefixNotTraded, topRankingStarCorrAttPrefixTraded, topRankingStarCorrAttPrefixAllDistance, topRankingStarCorrAttPrefixNotTradedFilter = '') {
    let rowsToAdd = []
    
    //rows.push("排名內星級符，過濾攻防IV格(A:0-5/B:6-10/C:11-15)\t未交換\t數量\t已交換\t數量\t全部\t數量\t整理\t數量")
    rows.push(header)
    
    for (let area in attMap) {
      Object.keys(attMap[area]).sort().forEach(attList => {
        let dexList = attMap[area][attList]
        let countName = this.computedCountName(dexList)
        let count = dexList.length
        
        let day = "&日數0-"
        let dayInterval = day + (this.dayInterval + 5)
        
        if (area !== 'normal') {
          dayInterval = dayInterval.slice(0, dayInterval.indexOf('-')+1)
        }
        
        let ivList = dexList.join(',') + "&![" + attList + "]"
        
        let areaQuery = this.computedAreaQuery(area)
        
        let attListTag = attList.split(',').join('') 
        
        let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰

        let cells = [
          area.slice(0,1) + ' ' + attList,
          'cR ' + attListTag + this.getMMDD() + ',' + areaQuery + topRankingStarCorrAttPrefixNotTraded + ivList + excludeCollection + dayInterval,
          countName,
          'tcR ' + attListTag + this.getMMDD() + ',' + areaQuery + topRankingStarCorrAttPrefixTraded + ivList + excludeCollection + day,
          countName,
          areaQuery + topRankingStarCorrAttPrefixAllDistance + ivList + excludeCollection + day,
          countName,
          areaQuery + topRankingStarCorrAttPrefixNotTradedFilter + ivList + excludeCollection + day,
          countName,
        ].join('\t')

        rowsToAdd.push({
          count: count,
          area,
          cells
        })
      })
    }
    
    this.computedBestIVCellsSortRowsByAreaCount(rowsToAdd, rows)
    
  },
  computedBestIVUntradableCellsAttMap: function (rows, header, attMap, topRankingStarCorrAttPrefixNotTraded, topRankingStarCorrAttPrefixTraded, topRankingStarCorrAttPrefixAllDistance, topRankingStarCorrAttPrefixNotTradedFilter = '') {
    let rowsToAdd = []
    
    //rows.push("排名內星級符，過濾攻防IV格(A:0-5/B:6-10/C:11-15)\t未交換\t數量\t已交換\t數量\t全部\t數量\t整理\t數量")
    rows.push(header)
    
    for (let area in attMap) {
      Object.keys(attMap[area]).sort().forEach(attList => {
        let dexList = attMap[area][attList]
        let countName = this.computedCountName(dexList)
        let count = dexList.length
        
        let day = "&日數0-"
        let dayInterval = day + (this.dayInterval + 5)
        
        if (area !== 'normal') {
          dayInterval = dayInterval.slice(0, dayInterval.indexOf('-')+1)
        }
        
        let ivList = dexList.join(',') + "&![" + attList + "]"
        
        let areaQuery = this.computedAreaQuery(area)
        
        let attListTag = attList.split(',').join('') 
        let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰

        let cells = [
          area.slice(0,1) + ' ' + attList,
          'uR ' + attListTag + this.getMMDD() + ',' + areaQuery + topRankingStarCorrAttPrefixNotTraded + ivList + excludeCollection + dayInterval,
          countName,
          'tuR ' + attListTag + this.getMMDD() + ',' + areaQuery + topRankingStarCorrAttPrefixTraded + ivList + excludeCollection + dayInterval,
          countName,
          areaQuery + topRankingStarCorrAttPrefixAllDistance + ivList + excludeCollection + day,
          countName,
          areaQuery + topRankingStarCorrAttPrefixNotTradedFilter + ivList + excludeCollection + day,
          countName,
        ].join('\t')

        rowsToAdd.push({
          count: count,
          area,
          cells
        })
      })
    }
    
    this.computedBestIVCellsSortRowsByAreaCount(rowsToAdd, rows)
  },
  
  computedBestIVCellsAll: function (rows, attMap, allNotTraded, allTraded, allAllDistance, allNotTradedFilter) {
    let rowsToAdd = []
    
    rows.push("排名內\t全部\t數量\t全部4*\t數量")
    
    let ivListAll = []
    
    for (let area in attMap) {
      let allDexList = []
      let allCount = 0
      Object.keys(attMap[area]).sort().forEach(attList => {
        let dexList = attMap[area][attList]
        allDexList = allDexList.concat(dexList)
        let count = dexList.length
        allCount = allCount + count
      })
      
      ivListAll = ivListAll.concat(allDexList)
      
    }
    
    ivListAll = ivListAll.join(',')
    let countName = '[' + ivListAll.length + ']'
    
    let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰

    let cells = [
      area,
      allAllDistance + ivListAll + excludeCollection,
      countName,
      allAllDistance + ivListAll + excludeCollection + '&4*',
      countName,
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
    ].join('\t')

    rowsToAdd.push({
      count: ivListAll.length,
      area: 'all',
      cells
    })
    
    
    this.computedBestIVCellsSortRowsByCount(rowsToAdd, rows)
    
  },
  computedCountName: function (dexList) {
    //if (dexList === undefined) {
    // return ""
    //}
    
    let count = dexList.length
    //console.log(count)
    let trans = dexList.slice(0,3)
    trans = trans.map((dex) => {
      dex = dex + ''
      let id = this.dexToID[dex]
      if (typeof(this.pokemonNameTW[id]) !== "string") {
        throw "id not found: " + id
      }
      
      let name = this.pokemonNameTW[id]
      let firstWord = name.slice(0,1)
      let lastWord = name.slice(-1)
      if (firstWord === lastWord) {
        lastWord = name.slice(1,2)
      }
      
      return firstWord + lastWord
    })
    
    return `[${count}] ${trans.join(",")}`
  },
  
  computedStarExclusiveQuery: function (starListString) {
    let starList = starListString.split(',')
    
    if (starList.length === 0) {
      return ''
    }
    else {
      return starList.map(s => "!" + s).join('&') + '&'
    }
  },
  computedQueryNotTopAreaAll: function (rows, attMap, topAll) {
    rows.push("非排名內分區\t全部\t數量\t-\t-\t-\t-\t-\t-")
    
    for (let area in attMap) {
      if (area !== 'normal') {
        continue
      }
      
      let topDexList = []
      //let allCount = 0
      Object.keys(attMap[area]).sort().forEach(attList => {
        let dexList = attMap[area][attList]
        topDexList = topDexList.concat(dexList)
        //let count = dexList.length
        //allCount = allCount + count
      })
      
      // 我們取得了topList
      Object.keys(this.areaGroupDex).forEach(a => {
        let areaDexList = this.areaGroupDex[a]
        
        areaDexList = areaDexList.filter(dex => {
          return (topDexList.indexOf(dex) === - 1)
        })
        
        let ivList = areaDexList.join(',') + "&日數0-"
        let countName = this.computedCountName(areaDexList)
        let areaQuery = this.computedAreaQuery(area)
        
        let excludeCollection = '&!327&!201'  // 排除晃晃斑跟未知圖騰

        let cells = [
          a,
          areaQuery + topAll + ivList + excludeCollection,
          countName,
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
        ].join('\t')

        rows.push(cells)
      })
      
        
    }
  },
  buildTopList (top1500, top2500) {
    if (this.ready === false) {
      return {}
    }
    
    let areaDexStarMap = {}
    let areaDexIVAttMap = {}
    
    Object.keys(top1500).forEach(area => {
      top1500[area].forEach(pokemon => {
        let iv = pokemon.gIV
        let star = pokemon.gStar
        let dex = pokemon.dex
        this.computedTopListAddDex(area, dex, star, iv, areaDexStarMap, areaDexIVAttMap)
      })
    })
    
    Object.keys(top2500).forEach(area => {
      top2500[area].forEach(pokemon => {
        let iv = pokemon.uIV
        let star = pokemon.uStar
        let dex = pokemon.dex
        this.computedTopListAddDex(area, dex, star, iv, areaDexStarMap, areaDexIVAttMap)
      })
    })
    
    //console.log(areaDexStarMap)
    
    // ----------------------------
    
    // 再轉換成以星級為主的列表
    let areaStarDexMap = this.computedTopListBuildAreaStarDexMap(areaDexStarMap)
    
    // ----------------------------
    
    // 再轉換成以攻擊為主的列表
    let areaAttDexMap = this.computedTopListBuildAreaAttDexMap(areaDexIVAttMap)
    
    return {
      star: areaStarDexMap,
      att: areaAttDexMap
    }
  },
  buildTopListReverseStar (top1500, top2500) {
    if (this.ready === false) {
      return {}
    }
    
    let areaDexStarMap = {}
    let areaDexIVAttMap = {}
    
    Object.keys(top1500).forEach(area => {
      top1500[area].forEach(pokemon => {
        if (!pokemon.gIV) {
          pokemon.gIV = this.get1500IV(pokemon.speciesId).slice(1)
        }
        
        let iv = pokemon.gIV
        if (!iv) {
          console.error(pokemon)
          throw Error(pokemon.speciesId + ' IV is undefined')
        }
        
        if (!pokemon.gStar) {
          pokemon.gStar = this.calcGStar(pokemon)
        }
        
        let star = pokemon.gStar
        
        
        let dex = pokemon.dex
        this.computedTopListAddDex(area, dex, star, iv, areaDexStarMap, areaDexIVAttMap)
      })
    })
    
    Object.keys(top2500).forEach(area => {
      top2500[area].forEach(pokemon => {
        if (!pokemon.uIV) {
          pokemon.uIV = this.get2500IV(pokemon.speciesId).slice(1)
        }
        
        if (!pokemon.uStar) {
          pokemon.uStar = this.calcUStar(pokemon)
        }
        
        
        let iv = pokemon.uIV
        
        let star = pokemon.uStar
        let dex = pokemon.dex
        this.computedTopListAddDex(area, dex, star, iv, areaDexStarMap, areaDexIVAttMap)
      })
    })
    
    //console.log(areaDexStarMap)
    
    // ----------------------------
    
    // 再轉換成以星級為主的列表
    let areaStarDexMap = this.computedTopListBuildAreaStarReverseDexMap(areaDexStarMap)
    
    // ----------------------------
    
    // 再轉換成以攻擊為主的列表
    let areaAttDexMap = this.computedTopListBuildAreaAttDexMap(areaDexIVAttMap)
    
    return {
      star: areaStarDexMap,
      att: areaAttDexMap
    }
  }
}