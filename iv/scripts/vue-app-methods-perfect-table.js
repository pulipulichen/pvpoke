/* global GameMaster */

var appMethodsPerfectTable = {
  buildDexSpeciesMap (dexSpeMap, minDex, maxDex, top) {
    for (let r in top) {
      top[r].forEach(p => {
        let speciesId = p.speciesId
        let dex = p.dex
        let iv = p.gIV

        if (!minDex) {
          minDex = dex
        }
        else if (minDex > dex) {
          minDex = dex
        }

        if (!maxDex) {
          maxDex = dex
        }
        else if (maxDex < dex) {
          maxDex = dex
        }

        if (!dexSpeMap[dex]) {
          dexSpeMap[dex] = {}
        }

        if (!dexSpeMap[dex][speciesId]) {
          dexSpeMap[dex][speciesId] = {}
        }
        dexSpeMap[dex][speciesId].gIV = iv
        dexSpeMap[dex][speciesId].gStar = p.gStar
      })
    }
    
    return {minDex, maxDex}
  },
  buildPerfectTable (minDex, maxDex, dexSpeMap) {
    
    // dex, tw name, speicesID, gIV, uIV, P, J
    let rows = []
    
    let header = [
      'name',
      'gIV',
      'gStar',
      'P 1500',
      'J 1500',
      'uIV',
      'uStar',
      'P 2500',
      'J 2500',
      'P MAX',
      'J MAX',
      'dex',
      'speicesID',
    ]
    rows.push(header.join('\t'))
    
    for (let i = minDex; i <= maxDex; i++) {
      if (!dexSpeMap[i]) {
        continue
      }
      
      for (let speciesId in dexSpeMap[i]) {
        let p = dexSpeMap[i][speciesId]
        let name = this.pokemonNameTW[speciesId]
        
        let {gIV = '-', uIV = '-', gStar = '-', uStar = '-'} = p
        let dex = i
        
        let row = [
          name,
          gIV,
          gStar,
          '',
          '',
          uIV,
          uStar,
          '',
          '',
          '',
          '',
          dex,
          speciesId,
        ]
        rows.push(row.join('\t'))
      }
    }
    
    return rows.join('\n')
  }
}