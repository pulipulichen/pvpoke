/* global GameMaster */

var appMethodsInit = {
  loadPokemonData: async function () {

  },
  initPokemons: function () {
    
    return new Promise(async (resolve) => {
      await this.initIV()
      this.gm = GameMaster.getInstance()
      let lostIDList1500 = []
      let lostIDList2500 = []
      if (this.gm.data.pokemon) {
        let pokemonName = {}
        
        this.gm.data.pokemon.forEach(({dex, speciesId, speciesName}, i) => {
          //this.gm.data.pokemon[i].gIV = this.gm.data.pokemon[i].defaultIVs.cp1500.slice(1)
          //this.gm.data.pokemon[i].uIV = this.gm.data.pokemon[i].defaultIVs.cp2500.slice(1)
          try {
            this.gm.data.pokemon[i].gIV = this.get1500IV(speciesId).slice(1)
          }
          catch (e) {
            lostIDList1500.push(speciesId)
          }
          try {
            this.gm.data.pokemon[i].uIV = this.get2500IV(speciesId).slice(1)
          }
          catch (e) {
            lostIDList2500.push(speciesId)
            return false
            throw new Error('2500 IV is not defiend: ' + speciesId + '\n'
                      + `https://pvpoketw.com/team-builder/?league=2500&id=${speciesId}`)
          }
          this.gm.data.pokemon[i].gStar = this.calcGStar(this.gm.data.pokemon[i])
          this.gm.data.pokemon[i].uStar = this.calcUStar(this.gm.data.pokemon[i])
          this.gm.data.pokemon[i].topIncludable = this.isTopIncludable(this.gm.data.pokemon[i])
          this.gm.data.pokemon[i].topMaxIncludable = this.isTopMaxIncludable(this.gm.data.pokemon[i])
          this.gm.data.pokemon[i].isNotSpecial = this.isNotSpecial(this.gm.data.pokemon[i])
          
          //if (speciesId === 'glaceon') {
          //  console.log(this.gm.data.pokemon[i])
          //}
          
          pokemonName[speciesId] = speciesName
        })
        
        if (lostIDList1500.length > 0 || lostIDList2500.length > 0) {
          lostIDList1500.forEach(speciesId => {
            console.error(`https://pvpoketw.com/team-builder/?league=1500&id=${speciesId}`)
          })
          lostIDList2500.forEach(speciesId => {
            console.error(`https://pvpoketw.com/team-builder/?league=2500&id=${speciesId}`)
          })
          throw new Error('IV is not defiend')
        }
        
        this.pokemonName = pokemonName
      }
      else {
        setTimeout(async () => {
          await this.initPokemons()
          resolve(true)
        }, 100)
        return false
      }
      
      $.getJSON('data/evolution-family.json', (family) => {
        this.evolutionFamily = family
        
        $.getJSON('data/evolution-family-sort.json', (familySort) => {
        this.evolutionFamilySort = familySort
          $.getJSON('data/pvpoke.tw/gamemaster.json', (data) => {
            let trans = {}
            let dexToID = {}
            data.pokemon.forEach(({dex, speciesName, speciesId}) => {
              trans[speciesId] = speciesName

              if (!dexToID[dex + '']
                      && !speciesId.endsWith('_alolan')
                      && !speciesId.endsWith('_galarian')
                      && !speciesId.endsWith('_shadow')) {
                dexToID[dex + ''] = speciesId
            }

            })
            this.dexToID = dexToID
            this.pokemonNameTW = trans

            $.getJSON('data/lv-stardust-candy.json', (data) => {
              let stardust = {}
              let candy = {}
              Object.keys(data).forEach(lv => {
                stardust[lv] = data[lv][0] / 1000
                if (stardust[lv] < 1) {
                  stardust[lv] = (stardust[lv] + '').slice(1)
                }
                candy[lv] = data[lv][1]
              })

              this.lvStarDust = stardust
              this.lvCandy = candy

              resolve(true)
            })
          })
        })
      })
    })
  },
  initRanks: function () {
    return new Promise(resolve => {
      $.getJSON('../src/data/all/overall/rankings-1500.json', (rankings1500) => {
        this.rankings1500 = rankings1500
        $.getJSON('../src/data/all/overall/rankings-2500.json', (rankings2500) => {
          this.rankings2500 = rankings2500
          $.getJSON('data/area-group-dex.json', (group) => {
            this.areaGroupDex = group
            resolve(true)
          })
        })
      })
    })
  },
  initIV: function () {
    return new Promise(resolve => {
      //console.log('1AAA')
      $.get('./data/IV1500.csv', (iv1500csv) => {
        //console.log('2AAA')
        this.iv1500 = this.speieceIDtoIV(iv1500csv)
        
        $.get('data/IV2500.csv', (iv2500csv) => {
          this.iv2500 = this.speieceIDtoIV(iv2500csv)
          //console.log('3AAA')
          resolve(true)
        })
      })
    })
  },
  speieceIDtoIV: function (csv) {
    let lines = csv.trim().split('\n')
    let map = {}
    let keys = []
    let speciesK
    
    lines.forEach((line, i) => {
      let cells = line.trim().split(',').map(cell => cell.trim())
      if (i === 0) {
        keys = cells
        speciesK = keys.indexOf('SpeciesID')
        return false
      }
      
      let species = cells[speciesK]
      let poke = {}
      cells.forEach((cell, k) => {
        let key = keys[k]
        poke[key] = cell
      })
      map[species] = poke['RESULT'].split('-').map(d => Number(d))
    })
    
    return map
  }
}