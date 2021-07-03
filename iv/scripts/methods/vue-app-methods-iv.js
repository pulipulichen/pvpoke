var appMethodsIV = {
  initBestIV: async function () {
    await this.initRanks()
    this.initBestCSV()
    return false
  },
  buildQueryURL(id, ivs) {
    return `https://pulipulichen.github.io/pvpoke/iv/calc.html?speciesId=${id}&atk=${ivs.atk}&def=${ivs.def}&hp=${ivs.hp}`
  },
  initQuery() {
    let params = new URL(location.href).searchParams

    if (params.get('speciesId')) {
      this.querySpeciesId = params.get('speciesId')
      
      if (this.pokemonName[this.querySpeciesId]) {
        $(this.$refs.QuerySpeciesId).find('input').val(this.pokemonName[this.querySpeciesId] + ' ' + this.pokemonNameTW[this.querySpeciesId])
      }
    }
    if (params.get('atk')) {
      let iv = Number(params.get('atk'))
      if (isNaN(iv) === false && iv >= 0 && iv <= 15) {
        this.queryATK = iv
      }
    }

    if (params.get('def')) {
      let iv = Number(params.get('def'))
      if (isNaN(iv) === false && iv >= 0 && iv <= 15) {
        this.queryDEF = iv
      }
    }

    if (params.get('hp')) {
      let iv = Number(params.get('hp'))
      if (isNaN(iv) === false && iv >= 0 && iv <= 15) {
        this.queryHP = iv
      }
    }
    
    setTimeout(() => {
      this.initQuerySearch()
    }, 1000)

    setTimeout(() => {
      if (this.calc1500list.length === 0) {
        let id = this.querySpeciesId
        this.querySpeciesId = ''
        setTimeout(() => {
          this.querySpeciesId = id
        }, 0)
        
        if (this.pokemonName[id]) {
          $(this.$refs.QuerySpeciesId).find('input').val(this.pokemonName[id] + ' ' + this.pokemonNameTW[id])
        }
        
      }
    }, 500)
  },
  initBestCSV: async function () {
    //console.log(this.featureEnable)
    if (this.featureEnable.allData === false) {
      return false // 測試用，暫時不運作
    }
    
    //console.log(Object.keys(this.topMixFamilyDex).length)
    if (Object.keys(this.topMixFamilyDex).length === 0) {
      setTimeout(() => {
        this.initBestCSV()
      }, 100)
      return false
    }
    
    var gm = this.gm
    //gm.loadRankingData($('#app'), "overall", 2500, "all");

    //console.log(gm.data.pokemon.length)

    let header = [
      '[' + (new Date()).mmddhhmm() + ']',
      'dex',
      'family_tw',
      'g_ivs',
      'g_lv',
      'u_ivs',
      'u_lv',
      'url',
      'name',
      'family',
      'shadow',
      'special',
      'in_top',
      'area',
      'g_rank',
      'g_star',
      'g_exchange',
      'g_lucky',
      'g_atk',
      'g_def',
      'g_hp',
      'g_level',
      'g_stardust',
      'g_candy',
      'g_cp',
      'g_url',
      'u_rank',
      'u_star',
      'u_exchange',
      'u_lucky',
      'u_atk',
      'u_def',
      'u_hp',
      'u_level',
      'u_stardust',
      'u_candy',
      'u_cp',
      'u_url',
      'speciesId',
      'family_dex',
    ]

    let rows = []
    //rows.push(header)

    //let rankings1500 = this.rankings1500Selection
    //let rankings2500 = this.rankings2500Selection
    
    let rankings1500 = this.rankings1500
    let rankings2500 = this.rankings2500
    
    //console.log(this.topMix)

    let starClassList = []

    let limit = gm.data.pokemon.length
    let rowMap = {}
    
    let addedSpeciesIdList = []
    
    //let limit = 10
    for (let i = 0; i < limit; i++) {
      
      if (i % 100 === 40) {
        let percent = Math.round(i / limit * 100) + '%'
        //console.log('IV table processing: ' + percent)
        this.ivTableProgress = percent
        await this.sleep()
      }
      
      let dataPokemon = gm.data.pokemon[i]

      let id = dataPokemon.speciesId
      
      // --------------
      
      id = this.stripXLorXS(id)
      
      if (addedSpeciesIdList.indexOf(id) > -1) {
        continue
      }
      addedSpeciesIdList.push(id)
      
      // --------------
      
      this.battle.setCP(1500)
      //let gPokemon = new Pokemon(dataPokemon.speciesId, 0, this.battle);

      /*
      let gBestIV = gPokemon.generateIVCombinations("overall", 1, 4096, null, 0).filter(({ivs}) => {
        let {atk, def, hp} = ivs
        return (atk === dataPokemon.defaultIVs.cp1500[1]
                && def === dataPokemon.defaultIVs.cp1500[2]
                && hp === dataPokemon.defaultIVs.cp1500[3])
      })[0]
      */
      let gBestIV = this.buildIVData('cp1500', id)
      let gStar = dataPokemon.gStar
      //console.log(bestIV)

      this.battle.setCP(2500)
      //let uPokemon = new Pokemon(dataPokemon.speciesId, 0, this.battle);

      /*
      let uBestIV = uPokemon.generateIVCombinations("overall", 1, 4096, null, 0).filter(({ivs}) => {
        let {atk, def, hp} = ivs
        return (atk === dataPokemon.defaultIVs.cp2500[1]
                && def === dataPokemon.defaultIVs.cp2500[2]
                && hp === dataPokemon.defaultIVs.cp2500[3])
      })[0]
      */
      let uBestIV = this.buildIVData('cp2500', id)
      let uStar = dataPokemon.uStar
      //console.log(bestIV)

      let isShadow = false
      let isSpecial = false
      if (Array.isArray(dataPokemon.tags)) {
        isShadow = (dataPokemon.tags.indexOf('shadow') > -1)
        isSpecial = (dataPokemon.tags.indexOf('legendary') > -1
                || dataPokemon.tags.indexOf('untradeable') > -1
                || dataPokemon.tags.indexOf('mythical') > -1)
      }

      let dex = Number(dataPokemon.dex)
      let rank1500 = this.getRank1500(id)
      let rank2500 = this.getRank2500(id)


      /*
      let topIncludable = (
              (gStar !== '4*') // 1500不是100%
              && (isShadow === false)
              && (isSpecial === false)
              )
      */
      let topIncludable = (
              //(isShadow === false) && 
              (isSpecial === false)
              )

      let glvInfo = gBestIV.level
      if (glvInfo < 35) {
        glvInfo = '!' + glvInfo + this.getDustCandy(gBestIV.level)
      }
      else if (glvInfo < 40) {
        glvInfo = glvInfo + this.getDustCandy(gBestIV.level)
      }
      
      let ulvInfo = uBestIV.level
      if (ulvInfo < 40) {
        ulvInfo = '!' + ulvInfo + this.getDustCandy(uBestIV.level)
      }
      else if (ulvInfo < 40) {
        ulvInfo = ulvInfo + this.getDustCandy(uBestIV.level)
      }
      
      let r15 = rank1500
      let r25 = rank2500
      
      let inTop = false
      
      let pokemonArea = this.getArea(id)
      let isMega = this.isMega(id)
      
      if (isSpecial === false && isMega === false) {
        
        let mark = '!'
        if (r15 < this.topLimit + 1 
                //&& (gBestIV.ivs.atk + gBestIV.ivs.def + gBestIV.ivs.hp) < 45 ) {
                && (gBestIV.ivs.atk + gBestIV.ivs.def + gBestIV.ivs.hp) < 45 ) {
          
          if (gBestIV.ivs.atk < 5 
                || gBestIV.ivs.def < 5
                || gBestIV.ivs.hp < 5) {
            mark = '@'
          }
          
          r15 = mark + r15
        }
        if (r25 < this.topLimit + 1 
                && (uBestIV.ivs.atk + uBestIV.ivs.def + uBestIV.ivs.hp) < 45 ) {
          
          if (uBestIV.ivs.atk < 5 
                || uBestIV.ivs.def < 5
                || uBestIV.ivs.hp < 5) {
            mark = '@'
          }
          
          r25 = mark + r25
        }
        
        
        
        //console.log(this.topMixFamilyDex)
        if (isShadow === false) {
          for (let area in this.topMixFamilyDex) {
            if (area !== pokemonArea) {
              continue
            }
  //          if (dataPokemon.dex === 334) {
  //            let area = 'normal'
  //            console.log(334, area, this.topMixFamilyDex[area].indexOf(dataPokemon.dex),
  //                    this.topMixFamilyDex[area])
  //          }

            if (this.topMixFamilyDex[area].indexOf(dataPokemon.dex) > -1) {
              inTop = true
              break
            }
          }
          
          if (inTop === false) {
            for (let area in this.topMixShadowFamilyDex) {
              if (area !== pokemonArea) {
                continue
              }
    //          if (dataPokemon.dex === 334) {
    //            let area = 'normal'
    //            console.log(334, area, this.topMixFamilyDex[area].indexOf(dataPokemon.dex),
    //                    this.topMixFamilyDex[area])
    //          }

              if (this.topMixShadowFamilyDex[area].indexOf(dataPokemon.dex) > -1) {
                inTop = true
                break
              }
            }
          }
        }
        else {
          for (let area in this.topMixShadowFamilyDex) {
            if (area !== pokemonArea) {
              continue
            }
  //          if (dataPokemon.dex === 334) {
  //            let area = 'normal'
  //            console.log(334, area, this.topMixFamilyDex[area].indexOf(dataPokemon.dex),
  //                    this.topMixFamilyDex[area])
  //          }

            if (this.topMixShadowFamilyDex[area].indexOf(dataPokemon.dex) > -1) {
              inTop = true
              break
            }
          }
        }
      } // if (isSpecial === false && isMega === false) {
      
      let familyDex = this.getFamilyDex(dataPokemon.dex)

      let name = dataPokemon.speciesId
      if (typeof(this.pokemonNameTW[dataPokemon.speciesId]) === 'string') {
        name = this.pokemonNameTW[dataPokemon.speciesId]
      }
      
      rows.push([
        name,
        dataPokemon.dex,
        this.getFamilyNameTW(dataPokemon.dex, dataPokemon.speciesId),
        `${r15}: ${gBestIV.ivs.atk}/${gBestIV.ivs.def}/${gBestIV.ivs.hp} (${gStar})`,
        glvInfo,
        `${r25}: ${uBestIV.ivs.atk}/${uBestIV.ivs.def}/${uBestIV.ivs.hp} (${uStar})`,
        ulvInfo,
        this.buildQueryURL(dataPokemon.speciesId, gBestIV.ivs),
        dataPokemon.speciesName,
        this.getFamilyName(dataPokemon.dex, dataPokemon.speciesId),
        //dataPokemon.speciesId,
        isShadow,
        isSpecial,
        inTop,
        pokemonArea,
        rank1500,
        gStar,
        this.calcIncludeExchange(gBestIV.ivs),
        this.calcIncludeLucky(gBestIV.ivs),
        gBestIV.ivs.atk,
        gBestIV.ivs.def,
        gBestIV.ivs.hp,
        gBestIV.level,
        this.lvStarDust[(gBestIV.level + '')],
        this.lvCandy[(gBestIV.level + '')],
        gBestIV.cp,
        this.buildQueryURL(dataPokemon.speciesId, gBestIV.ivs),
        rank2500,
        uStar,
        this.calcIncludeExchange(uBestIV.ivs),
        this.calcIncludeLucky(uBestIV.ivs),
        uBestIV.ivs.atk,
        uBestIV.ivs.def,
        uBestIV.ivs.hp,
        uBestIV.level,
        this.lvStarDust[(uBestIV.level + '')],
        this.lvCandy[(uBestIV.level + '')],
        uBestIV.cp,
        this.buildQueryURL(dataPokemon.speciesId, uBestIV.ivs),
        id,
        familyDex,
      ])
      /*
      rowMap[dataPokemon.speciesId] = [
        this.pokemonNameTW[dataPokemon.speciesId],
        dataPokemon.dex,
        this.getFamilyNameTW(dataPokemon.dex, dataPokemon.speciesId),
        `${r15}: ${gBestIV.ivs.atk}/${gBestIV.ivs.def}/${gBestIV.ivs.hp} (${gStar})`,
        glvInfo,
        `${r25}: ${uBestIV.ivs.atk}/${uBestIV.ivs.def}/${uBestIV.ivs.hp} (${uStar})`,
        ulvInfo,
        this.buildQueryURL(dataPokemon.speciesId, gBestIV.ivs),
        dataPokemon.speciesName,
        this.getFamilyName(dataPokemon.dex, dataPokemon.speciesId),
        //dataPokemon.speciesId,
        isShadow,
        isSpecial,
        topIncludable,
        rank1500,
        gStar,
        this.calcIncludeExchange(gBestIV.ivs),
        this.calcIncludeLucky(gBestIV.ivs),
        gBestIV.ivs.atk,
        gBestIV.ivs.def,
        gBestIV.ivs.hp,
        gBestIV.level,
        this.lvStarDust[(gBestIV.level + '')],
        this.lvCandy[(gBestIV.level + '')],
        gBestIV.cp,
        this.buildQueryURL(dataPokemon.speciesId, gBestIV.ivs),
        rank2500,
        uStar,
        this.calcIncludeExchange(uBestIV.ivs),
        this.calcIncludeLucky(uBestIV.ivs),
        uBestIV.ivs.atk,
        uBestIV.ivs.def,
        uBestIV.ivs.hp,
        uBestIV.level,
        this.lvStarDust[(uBestIV.level + '')],
        this.lvCandy[(uBestIV.level + '')],
        uBestIV.cp,
        this.buildQueryURL(dataPokemon.speciesId, uBestIV.ivs),
        id
      ]
      */
      // ---------------


      //if (dex === 260) {
      //  console.log(rows[rows.length - 1])
      //  console.log(topIncludable, isShadow, isSpecial, (gStar !== '4*'))
      //}

      let starClass = []
      /*
      if (rank1500 !== 9999 && gStar !== '4*') {
        starClass.push(gStar)
      }
      if (rank2500 !== 9999 && gStar !== uStar && uStar !== '4*') {
        starClass.push(uStar)
      }
      */
      if (rank1500 !== 9999) {
        starClass.push(gStar)
      }
      if (rank2500 !== 9999) {
        starClass.push(uStar)
      }
      starClass = starClass.sort().join(',')

      try {
        if (rank1500 !== 9999) {
          rankings1500[(rank1500 - 1)].topIncludable = topIncludable
          rankings1500[(rank1500 - 1)].dex = dex
          
          //if (topIncludable
          //        && gStar !== '4*') {
          if (topIncludable) {
            //rankings1500[(rank1500 - 1)].starClass = starClass
            rankings1500[(rank1500 - 1)].starClass = gStar
            rankings1500[(rank1500 - 1)].exchange = this.calcIncludeExchange(gBestIV.ivs)
          }

        }
        if (rank2500 !== 9999) {
          rankings2500[(rank2500 - 1)].topIncludable = topIncludable
          rankings2500[(rank2500 - 1)].dex = dex
          //if (topIncludable
          //        && uStar !== '4*') {
          if (topIncludable) {
            //rankings2500[(rank2500 - 1)].starClass = starClass
            rankings2500[(rank2500 - 1)].starClass = uStar
            rankings2500[(rank2500 - 1)].exchange = this.calcIncludeExchange(uBestIV.ivs)
          }
        }

        if (topIncludable
                && starClass !== ''
                && starClassList.indexOf(starClass) === -1) {
          starClassList.push(starClass)
        }
      } catch (e) {
        console.log(rank1500)
        throw e
      }
    }

    // --------------------------
    // 再來是根據topMix來排序
    /*
    let rowTop = []
    let rowOther = []
    
    this.topMix.forEach(area => {
      row
    })
    
    rows = rows.concat(rowTop).concat(rowOther)
    */
    // ------------------

    let dexFieldIndex = 39
    let inTopFieldIndex = 12
    let areaFieldIndex = 13
    let isShadowFieldIndex = 10
    rows.sort((a, b) => {
      let rootDexA = Math.floor(Number(a[dexFieldIndex]))
      let rootDexB = Math.floor(Number(b[dexFieldIndex]))
      
      if (a[inTopFieldIndex] === b[inTopFieldIndex]) {
        if (rootDexA !== rootDexB) {
          return Number(a[dexFieldIndex]) - Number(b[dexFieldIndex])
        }
        else if (a[areaFieldIndex] !== b[areaFieldIndex]) {
          if (a[areaFieldIndex] === 'normal') {
            return -1
          }
          else if (a[areaFieldIndex] > b[areaFieldIndex]) {
            return -1
          }
          else {
            return 1
          }
        }
        else if (a[isShadowFieldIndex] !== b[isShadowFieldIndex]) {
          if (a[isShadowFieldIndex] === true) {
            return 1
          }
          else {
            return -1
          }
        }
        else {
          return Number(a[dexFieldIndex]) - Number(b[dexFieldIndex])
        }
      }
      else {
        if (a[inTopFieldIndex] === true) {
          return -1
        }
        else {
          return 1
        }
      }
    })
    
    rows = [header].concat(rows)

    this.rankings1500 = this.rankings1500.slice(0, 0).concat(rankings1500)
    this.rankings2500 = this.rankings1500.slice(0, 0).concat(rankings2500)

    //console.log(this.rankings1500.slice(0, 5))

    let csv = rows.map(row => row.join(',')).join('\n')
    this.bestIVCSV = csv
    this.ivTableProgress = null
    //console.log(this.top1500)
    //return console.log(csv)

    //console.log(this.topMix)

  },
  get1500IV: function (speciesId) {
    if (this.isEndsWithXLorXS(speciesId)) {
      throw new Error('XL or XS:' + speciesId)
    }
    
    if (this.ivPredefined.cp1500[speciesId]) {
      return this.ivPredefined.cp1500[speciesId]
    }
    
    let data = this.iv1500[speciesId]
    if (!data) {
      throw new Error('1500 iv is not found: ' + speciesId + '. \n'
              + `https://pvpoke.com/team-builder/?league=1500&id=${speciesId}`)
      //console.log(`https://pvpoketw.com/battle/1500/${speciesId}/${speciesId}11/1-1-1/1-1-1/`)
    }
    
    // 	40-15-15-15
    return data
  },
  get2500IV: function (speciesId) {
    let data = this.iv2500[speciesId]
    
    if (this.ivPredefined.cp2500[speciesId]) {
      return this.ivPredefined.cp2500[speciesId]
    }
    
    // 	40-15-15-15
    return data
  },
  getIV: function (cp, speciesId) {
    if (cp === 'cp1500') {
      return this.get1500IV(speciesId)
    }
    else {
      return this.get2500IV(speciesId)
    }
  },
  buildIVData: function (cp, speciesId) {
    let ivMap
    if (cp === 'cp1500') {
      ivMap = this.iv1500
    }
    else {
      ivMap = this.iv2500
    }
    
    let iv = ivMap[speciesId]
    
    return {
      level: iv[0],
      ivs: {
        atk: iv[1],
        def: iv[2],
        hp: iv[3],
      }
    }
  }
} 