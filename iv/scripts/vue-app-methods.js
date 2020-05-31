/* global postMessageAPI, XLSX, GameMaster */

var appMethods = {
  loadPokemonData: async function () {

  },
  calcStar: function (ivs) {
    let sum = ivs.atk + ivs.def + ivs.hp
    if (sum === 45) {
      return '4*'
    } else if (sum <= 44 && sum >= 37) {
      return '3*'
    } else if (sum <= 36 && sum >= 30) {
      return '2*'
    } else if (sum <= 29 && sum >= 23) {
      return '1*'
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
  initPokemons: function () {
    
    return new Promise(resolve => {
      this.gm = GameMaster.getInstance();
      if (this.gm.data.pokemon) {
        let pokemonName = {}

        this.gm.data.pokemon.forEach(({dex, speciesId, speciesName}) => {
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
        $.getJSON('data/gamemaster-tw.json', (data) => {
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
  },
  initRanks: function () {
    return new Promise(resolve => {
      $.getJSON('../src/data/all/overall/rankings-1500.json', (rankings1500) => {
        this.rankings1500 = rankings1500
        $.getJSON('../src/data/all/overall/rankings-2500.json', (rankings2500) => {
          this.rankings2500 = rankings2500
          resolve(true)
        })
      })
    })
  },
  initBestIV: async function () {
    await this.initRanks()


    var gm = this.gm
    //gm.loadRankingData($('#app'), "overall", 2500, "all");

    //console.log(gm.data.pokemon.length)

    let header = [
      'dex',
      'name',
      'family',
      'name_tw',
      'family_tw',
      'shadow',
      'special',
      'in_top',
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
      'u_url'
    ]

    let rows = []
    rows.push(header)

    let rankings1500 = this.rankings1500
    let rankings2500 = this.rankings2500

    let starClassList = []

    let limit = gm.data.pokemon.length
    //let limit = 10
    for (let i = 0; i < limit; i++) {
      let dataPokemon = gm.data.pokemon[i]

      this.battle.setCP(1500)
      let gPokemon = new Pokemon(dataPokemon.speciesId, 0, this.battle);

      let gBestIV = gPokemon.generateIVCombinations("overall", 1, 4096, null, 0).filter(({ivs}) => {
        let {atk, def, hp} = ivs
        return (atk === dataPokemon.defaultIVs.cp1500[1]
                && def === dataPokemon.defaultIVs.cp1500[2]
                && hp === dataPokemon.defaultIVs.cp1500[3])
      })[0]
      let gStar = this.calcStar(gBestIV.ivs)
      //console.log(bestIV)

      this.battle.setCP(2500)
      let uPokemon = new Pokemon(dataPokemon.speciesId, 0, this.battle);

      let uBestIV = uPokemon.generateIVCombinations("overall", 1, 4096, null, 0).filter(({ivs}) => {
        let {atk, def, hp} = ivs
        return (atk === dataPokemon.defaultIVs.cp2500[1]
                && def === dataPokemon.defaultIVs.cp2500[2]
                && hp === dataPokemon.defaultIVs.cp2500[3])
      })[0]
      let uStar = this.calcStar(uBestIV.ivs)
      //console.log(bestIV)

      let isShadow = false
      let isSpecial = false
      if (Array.isArray(dataPokemon.tags)) {
        isShadow = (dataPokemon.tags.indexOf('shadow') > -1)
        isSpecial = (dataPokemon.tags.indexOf('legendary') > -1
                || dataPokemon.tags.indexOf('untradeable') > -1
                || dataPokemon.tags.indexOf('mythical') > -1)
      }

      let id = dataPokemon.speciesId
      let dex = Number(dataPokemon.dex)
      let rank1500 = this.getRank1500(id)
      let rank2500 = this.getRank2500(id)


      let topIncludable = (
              (gStar !== '4*') // 1500不是100%
              && (isShadow === false)
              && (isSpecial === false)
              )

      rows.push([
        dataPokemon.dex,
        dataPokemon.speciesName,
        this.getFamilyName(dataPokemon.dex, dataPokemon.speciesId),
        this.pokemonNameTW[dataPokemon.speciesId],
        this.getFamilyNameTW(dataPokemon.dex, dataPokemon.speciesId),
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
        this.buildQueryURL(gBestIV.speciesId, gBestIV.ivs),
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
        this.buildQueryURL(gBestIV.speciesId, gBestIV.ivs),
      ])

      // ---------------


      //if (dex === 260) {
      //  console.log(rows[rows.length - 1])
      //  console.log(topIncludable, isShadow, isSpecial, (gStar !== '4*'))
      //}

      let starClass = []
      if (rank1500 !== 9999 && gStar !== '4*') {
        starClass.push(gStar)
      }
      if (rank2500 !== 9999 && gStar !== uStar && uStar !== '4*') {
        starClass.push(uStar)
      }
      starClass = starClass.sort().join(',')

      try {
        if (rank1500 !== 9999) {
          rankings1500[(rank1500 - 1)].topIncludable = topIncludable
          rankings1500[(rank1500 - 1)].dex = dex
          if (topIncludable
                  && gStar !== '4*') {
            //rankings1500[(rank1500 - 1)].starClass = starClass
            rankings1500[(rank1500 - 1)].starClass = gStar
          }

        }
        if (rank2500 !== 9999) {
          rankings2500[(rank2500 - 1)].topIncludable = topIncludable
          rankings2500[(rank2500 - 1)].dex = dex
          if (topIncludable
                  && uStar !== '4*') {
            //rankings2500[(rank2500 - 1)].starClass = starClass
            rankings2500[(rank2500 - 1)].starClass = uStar
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

    rows.sort((a, b) => {
      return a[0] - b[0]
    })

    this.rankings1500 = this.rankings1500.slice(0, 0).concat(rankings1500)
    this.rankings2500 = this.rankings1500.slice(0, 0).concat(rankings2500)

    //console.log(this.rankings1500.slice(0, 5))

    let csv = rows.map(row => row.join(',')).join('\n')
    this.bestIVCSV = csv
    //console.log(this.top1500)
    //return console.log(csv)

  },
  getRank1500: function (id) {
    let rank = (this.all1500.indexOf(id) + 1)
    if (rank === 0) {
      rank = 9999
    }
    return rank
  },
  getRank2500: function (id) {
    let rank = (this.all2500.indexOf(id) + 1)
    if (rank === 0) {
      rank = 9999
    }
    return rank
  },
  downloadBeskIV: async function () {
    let blob = new Blob([this.bestIVCSV], {type: "text/csv;charset=utf-8"});
    saveAs(blob, 'best.csv', true);
  },
  onInputFocus(event) {
    //console.log(event)
//    let ele = event.currentTarget
//    setTimeout(() => {
//      ele.select()
//    }, 500)
    this.copyText(event.target.value)

    let ele = event.target
    setTimeout(() => {
      ele.select()
    }, 0)
    event.stopPropagation()
    event.preventDefault()
    //event.target.select()
    //console.log(event.currentTarget)

    //T = event.currentTarget

  },
  updateTitle () {
    document.title = $(this.$refs.QuerySpeciesId).find('input').val() 
      + ' ' 
      + this.queryATK + '/'
      + this.queryDEF + '/'
      + this.queryHP
      + ': ' + this.rankingBest
  },
  copyText(text) {
    setTimeout(() => {
      console.log(text)
      this.$refs.copyTextarea.value = text
      this.$refs.copyTextarea.select();
      document.execCommand("Copy");
    }, 0)
  },
  getFamilyName(dex) {
    let family = this.evolutionFamily[dex]
    //console.log(family)
    return family.map(dex => {
      let id = this.dexToID[dex + '']

      return id
    }).join(';')
  },
  getFamilyNameTW(dex) {
    let family = this.evolutionFamily[dex]

    return family.map(dex => {
      let id = this.dexToID[dex + '']
      id = this.pokemonNameTW[id]
      return id
    }).join(';')
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
  initQuerySearch () {
    
    let element = this.$refs.QuerySpeciesId
    $(element).click(function () {
      $(this).find('input').select()
    }).search({
      source: this.searchSpeciesIdContent,
      searchFields   : [
        'title',
        'price',
        'category',
        'description'
      ],
      onSelect: (result) => {
        console.log(result.speciesId)
        //this.querySpeciesId = ''
        //setTimeout(() => {
          this.querySpeciesId = result.speciesId
        //  this.$forceUpdate()
        //}, 100)
      }
    })
    
    //console.log(this.searchSpeciesIdContent[0])
  }
}