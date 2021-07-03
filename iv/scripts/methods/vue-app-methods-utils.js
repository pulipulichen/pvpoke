/* global postMessageAPI, XLSX, GameMaster */

let lostFamilyList = []
let lostFamilyTimer

var appMethodsUtils = {
  
  calcStar: function (ivs) {
    let sum = 0
    if (Array.isArray(ivs)) {
      ivs.forEach(iv => sum = sum + iv)
    }
    else {
      sum = ivs.atk + ivs.def + ivs.hp
    }
    
    if (sum === 45) {
      return '4*'
    } else if (sum <= 44 && sum >= 37) {
      return '3*'
    } else if (sum <= 36 && sum >= 30) {
      return '2*'
    } else if (sum <= 29 && sum >= 23) {
      return '1*'
    }
    else {
      //console.log('0*', ivs)
    }
    return '0*'
  },
  calcIncludeExchange: function (ivs) {
    return (ivs.atk >= 5
            && ivs.def >= 5
            && ivs.hp >= 5)
  },
  calcIncludeLucky: function (ivs) {
    return (ivs.atk >= 12
            && ivs.def >= 12
            && ivs.hp >= 12)
  },
  
  getFamilyDex: function (dex) {
    let familyDex = this.evolutionFamilySort[dex]
    if (Array.isArray(familyDex) === false) {
      familyDex = this.evolutionFamily[dex]
    }
    
    if (Array.isArray(familyDex) === false) {
      //return dex + '-' + dex
      console.log('Not in family:', familyDex, dex)
      
      if (lostFamilyTimer) {
        clearTimeout(lostFamilyTimer)
      }
      
      lostFamilyList.push(dex)
      lostFamilyTimer = setTimeout(() => {
        lostFamilyList.sort()
        
        let jsonConfig = lostFamilyList.map(dex => {
          return `  "${dex}": [${dex}],`
        }).join('\n')
        
        let urlList = lostFamilyList.map(dex => {
          return `https://pokemon.wingzero.tw/pokedex/go/${dex}/tw`
        }).join('\n')
        
        console.error(`=======================================
Evolution Family not found.

${jsonConfig}

${urlList}

Please modify "./iv/data/evolution-family.json"`)
        
      }, 3000)
      
      return dex
    }
    else {
      let min = familyDex[0]
      
      for (let i = 1; i < familyDex.length; i++) {
        if (min > familyDex[i]) {
          min = familyDex[i]
        }
      }
      
      let max = dex
      
      if (min > max) {
        let temp = max
        max = min
        min = temp
      }
     
      
      //return familyDex[0] + '-' + dex
      let dexString = '' + max
      while (dexString.length < 4) {
        dexString = '0' + dexString
      }
      
      let familyPosition = familyDex.indexOf(Number(dex))
      
      let result = Number(min + '.' + familyPosition + dexString)
      if (isNaN(result)) {
        throw Error('Family dex error: ' + dex)
      }
      
      return result
    }
  },
  getFamilyRootDex (dex) {
    if (this.excludeSelection.indexOf(dex) > -1) {
      return dex
    }
    
    let familyDexList = this.evolutionFamilySort[dex]
    let rootDex = false
    if (familyDexList) {
      rootDex = familyDexList[0]
    }
    else {
      familyDexList = this.evolutionFamily[dex]

      if (!familyDexList) {
        this.getFamilyDex(dex)
        return false
      }

      rootDex = familyDexList[0]
    }
    return rootDex
  },
  calcGStar: function (pokemon) {
    //console.log(pokemon.defaultIVs.cp1500.slice(1))
    //return this.calcStar(pokemon.defaultIVs.cp1500.slice(1))
    return this.calcStar(pokemon.gIV)
  },
  calcUStar: function (pokemon) {
    //return this.calcStar(pokemon.defaultIVs.cp2500.slice(1))
    return this.calcStar(pokemon.uIV)
  },
  isTopIncludable: function (pokemon) {
    let isShadow = false
    let isSpecial = false
    if (Array.isArray(pokemon.tags) && pokemon.tags.length > 0) {
      isShadow = (pokemon.tags.indexOf('shadow') > -1)
      isSpecial = (pokemon.tags.indexOf('legendary') > -1
              || pokemon.tags.indexOf('untradeable') > -1
              || pokemon.tags.indexOf('mythical') > -1)
    }
    else {
      //console.log(pokemon, '沒有tags?')
    }

    let gStar = this.calcGStar(pokemon)
    let uStar = this.calcUStar(pokemon)
    
    /*
    return (
              ((gStar !== '4*') // 1500不是100%
              || (uStar !== '4*'))
              && (isShadow === false)
              && (isSpecial === false)
              )
     * 
     */
    return ( (isShadow === false)
              && (isSpecial === false)
              )
  },
  isTopMaxIncludable: function (pokemon) {
    let isShadow = false
    let isSpecial = false
    if (Array.isArray(pokemon.tags)) {
      isShadow = (pokemon.tags.indexOf('shadow') > -1)
      isSpecial = (pokemon.tags.indexOf('legendary') > -1
              || pokemon.tags.indexOf('untradeable') > -1
              || pokemon.tags.indexOf('mythical') > -1)
    }
    else {
      //console.log(pokemon, '沒有tags?')
    }

    let gStar = this.calcGStar(pokemon)
    let uStar = this.calcUStar(pokemon)
    
//    if (pokemon.speciesId === 'metagross') {
//      console.log({
//        gStar,
//        uStar
//      })
//    }
    
    return (((gStar === '4*') // 1500不是100%
              && (uStar === '4*'))
              && (isShadow === false)
              && (isSpecial === false)
              )
  },
  isIncludeTopByLeague: function (pokemon, league = 'cp1500') {
    // 首先要確認這個pokemon的area
    let area = this.getArea(pokemon.speciesId)
    let isShadow = this.isShadow(pokemon.speciesId)
    
    let top
    if (!isShadow) {
      if (league === 'cp1500') {
        top = this.top1500
      }
      else if (league === 'cp2500') {
        top = this.top2500
      }
    }
    else {
      if (league === 'cp1500') {
        top = this.top1500Shadow
      }
      else if (league === 'cp2500') {
        top = this.top2500Shadow
      }
    }
    
    if (Array.isArray(top[area]) === false) {
      return false
    }
    
    return (top[area].map(({speciesId}) => speciesId).indexOf(pokemon.speciesId) > -1)
  },
  isNotSpecial: function (pokemon) {
    let isShadow = false
    let isSpecial = false
    if (Array.isArray(pokemon.tags)) {
      isShadow = false
      isSpecial = (pokemon.tags.indexOf('legendary') > -1
              || pokemon.tags.indexOf('untradeable') > -1
              || pokemon.tags.indexOf('mythical') > -1)
    }
    else {
      //console.log(pokemon, '沒有tags?')
    }

    let gStar = this.calcGStar(pokemon)
    let uStar = this.calcUStar(pokemon)
    
    return (
              ((gStar !== '4*') // 1500不是100%
              || (uStar !== '4*'))
              && (isShadow === false)
              && (isSpecial === false)
              )
  },
  isBetterAfterTrading: function (pokemon, cp) {
    if (this.isNotSpecial(pokemon) === false) {
      return false
    }
    
    for (let i = 0; i < 3; i++) {
      if (cp === '1500' && pokemon.gIV[i] < 5) {
        return false
      }
      else if (cp === '2500' && pokemon.uIV[i] < 5) {
        //return false
        return false
      }
    }
    return true
  },
  getRank1500: function (speciesId) {
    //console.log(id, this.rankings1500)
    let rank = (this.rankings1500SpeciesId.indexOf(speciesId) + 1)
    if (rank === 0) {
      rank = 9999
    }
    return rank
  },
  getRank2500: function (speciesId) {
    let rank = (this.rankings2500SpeciesId.indexOf(speciesId) + 1)
    if (rank === 0) {
      rank = 9999
    }
    return rank
  },
  getFamilyName(dex) {
    let family = this.evolutionFamily[dex]
    if (!family) {
      let errorMessage = `Evolution Family not found. dex: ${dex}.
Query: https://pokemon.wingzero.tw/pokedex/go/${dex}/tw
Please modify "./iv/data/evolution-family.json"`
      //console.error(errorMessage)
      return 'ERROR'
    }
    
    //console.log(family)
    return family.map(dex => {
      let id = this.dexToID[dex + '']

      return id
    }).join(';')
  },
  getFamilyNameTW(dex) {
    let family = this.evolutionFamily[dex]

    try {
      return family.map(dex => {
        let id = this.dexToID[dex + '']
        id = this.pokemonNameTW[id]
        return id
      }).join(';')
    }
    catch (e) {
      let errorMessage = `Evolution Family not found. dex: ${dex}.
Query: https://pokemon.wingzero.tw/pokedex/go/${dex}/tw
Please modify "./iv/data/evolution-family.json"`
      console.error(errorMessage)
      //throw new Error(errorMessage)
    }
  },
  computedAreaQuery: function (area) {
    if (area === 'normal') {
      //return '!阿羅拉&!galar&'
      return '!阿羅拉&!伽勒爾&'
    }
    else if (area === "alolan") {
      return "阿羅拉&"
    }
    else if (area === "galarian") {
      return "伽勒爾&"
    }
  },
  getDustCandy: function (level) {
    let floor = false
    if (level % 1 === 0.5) {
      level = level - 0.5
      floor = true
    }
    
    let dust = this.lvStarDust[(level + '')]
    let candy = this.lvCandy[(level + '')]
    
    if (floor === true) {
      floor = '_'
    }
    else {
      floor = ''
    }
    
    return '(' + floor + dust + '&' + candy + ')'
  },
  /**
   * 檢查要不要移除家庭用
   * @param {type} top
   * @returns {undefined}
   */
  reportTop (top) {
    let output = []
    
    for (let r in top) {
      top[r].forEach((p, i) => {
        //console.log(p.dex, p.speciesId)
        
        output.push({
          dex: p.dex,
          i: i,
          speciesId: p.speciesId
        })
      })
    }
    
    output.sort((a, b) => {
      return a.dex - b.dex
    })
    
    output.forEach(p => {
     console.log(p.dex, p.speciesId, this.pokemonNameTW[p.speciesId], p.i)
    })
  },
  copy (text) {
    var input = document.createElement('textarea');
    input.value = text
    
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
  },
  getMMDD () {
    return '' + (new Date()).mmdd()
  },
  getMMDDhhmm () {
    return '' + (new Date()).mmddhhmm()
  },
  isEndsWithXLorXS (speciesId) {
    if (typeof(speciesId) !== 'string') {
      return false
    }
    return (speciesId.endsWith('_xl')
      || speciesId.endsWith('_xs')
      || speciesId.endsWith('_xl.')
      || speciesId.endsWith('_xs.'))
  },
  stripXLorXS (speciesId) {
    if (typeof(speciesId) !== 'string') {
      return false
    }
    
    if (speciesId.endsWith('_xl')) {
      //console.log(speciesId)
      speciesId = speciesId.slice(0, -3)
      //console.log(speciesId)
      if (speciesId.endsWith('__shadow')) {
        speciesId = speciesId.slice(0, -8) + '_shadow'
      }
      //console.log(speciesId)
    }

    if (speciesId.endsWith('_xl.')) {
      speciesId = speciesId.slice(0, -4)

      if (speciesId.indexOf('__shadow') > -1) {
        speciesId = speciesId.slice(0, -8) + '_shadow'
      }
    }
    
    // -----------------
    
    if (speciesId.endsWith('_xs')) {
      //console.log(speciesId)
      speciesId = speciesId.slice(0, -3)
      //console.log(speciesId)
      if (speciesId.endsWith('__shadow')) {
        speciesId = speciesId.slice(0, -8) + '_shadow'
      }
      //console.log(speciesId)
    }

    if (speciesId.endsWith('_xs.')) {
      speciesId = speciesId.slice(0, -4)

      if (speciesId.indexOf('__shadow') > -1) {
        speciesId = speciesId.slice(0, -8) + '_shadow'
      }
    }
    
    return speciesId
  },
  getArea (speciesId) {
    let p
    if (speciesId.speciesId) {
      p = speciesId
    }
    else {
      speciesId = this.stripXLorXS(speciesId)
      p = this.speciesIdToData[speciesId]
      if (!p) {
        console.error("Species ID is invalid: " + speciesId)
      }
    }
    let tags = p.tags
    
    if (!tags) {
      return 'normal'
    }
    if (tags.indexOf('alolan') > -1) {
      return 'alolan'
    }
    if (tags.indexOf('galarian') > -1) {
      return 'galarian'
    }
    return 'normal'
  },
  isShadow (speciesId) {
    speciesId = this.stripXLorXS(speciesId)
    
    let p = this.speciesIdToData[speciesId]
    let tags = p.tags
    
    if (!tags) {
      return false
    }
    return (tags.indexOf('shadow') > -1)
  },
  isMega (speciesId) {
    speciesId = this.stripXLorXS(speciesId)
    
    let p = this.speciesIdToData[speciesId]
    let tags = p.tags
    
    if (!tags) {
      return false
    }
    return (tags.indexOf('mega') > -1)
  }
}