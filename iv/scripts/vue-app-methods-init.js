/* global GameMaster */

var appMethodsInit = {
  loadPokemonData: async function () {

  },
  initPokemons: function () {
    
    return new Promise(resolve => {
      this.gm = GameMaster.getInstance();
      if (this.gm.data.pokemon) {
        let pokemonName = {}

        this.gm.data.pokemon.forEach(({dex, speciesId, speciesName}, i) => {
          this.gm.data.pokemon[i].gIV = this.gm.data.pokemon[i].defaultIVs.cp1500.slice(1)
          this.gm.data.pokemon[i].uIV = this.gm.data.pokemon[i].defaultIVs.cp2500.slice(1)
          this.gm.data.pokemon[i].gStar = this.calcGStar(this.gm.data.pokemon[i])
          this.gm.data.pokemon[i].uStar = this.calcUStar(this.gm.data.pokemon[i])
          this.gm.data.pokemon[i].topIncludable = this.isTopIncludable(this.gm.data.pokemon[i])
          this.gm.data.pokemon[i].isNotSpecial = this.isNotSpecial(this.gm.data.pokemon[i])
          
          pokemonName[speciesId] = speciesName
        })
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
}