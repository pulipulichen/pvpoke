/* global postMessageAPI, XLSX, GameMaster */

var appMethods = {
  loadPokemonData: async function () {

  },
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
    return false


    var gm = this.gm
    //gm.loadRankingData($('#app'), "overall", 2500, "all");

    //console.log(gm.data.pokemon.length)

    let header = [
      'name_tw',
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

      let glvInfo = gBestIV.level
      if (glvInfo < 40) {
        glvInfo = glvInfo + ' (' + this.lvStarDust[(gBestIV.level + '')] + '&' + this.lvCandy[(gBestIV.level + '')] + ')'
      }
      
      let ulvInfo = uBestIV.level
      if (ulvInfo < 40) {
        ulvInfo = ulvInfo + ' (' + this.lvStarDust[(uBestIV.level + '')] + '&' + this.lvCandy[(uBestIV.level + '')] + ')'
      }

      rows.push([
        this.pokemonNameTW[dataPokemon.speciesId],
        '#' + dataPokemon.dex,
        this.getFamilyNameTW(dataPokemon.dex, dataPokemon.speciesId),
        `${rank1500}: ${gBestIV.ivs.atk}/${gBestIV.ivs.def}/${gBestIV.ivs.hp} (${gStar})`,
        glvInfo,
        `${rank2500}: ${uBestIV.ivs.atk}/${uBestIV.ivs.def}/${uBestIV.ivs.hp} (${uStar})`,
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
            rankings1500[(rank1500 - 1)].exchange = this.calcIncludeExchange(gBestIV.ivs)
          }

        }
        if (rank2500 !== 9999) {
          rankings2500[(rank2500 - 1)].topIncludable = topIncludable
          rankings2500[(rank2500 - 1)].dex = dex
          if (topIncludable
                  && uStar !== '4*') {
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

    let dexFieldIndex = 1
    rows.sort((a, b) => {
      return Number(a[dexFieldIndex].slice(1)) - Number(b[dexFieldIndex].slice(1))
    })

    this.rankings1500 = this.rankings1500.slice(0, 0).concat(rankings1500)
    this.rankings2500 = this.rankings1500.slice(0, 0).concat(rankings2500)

    //console.log(this.rankings1500.slice(0, 5))

    let csv = rows.map(row => row.join(',')).join('\n')
    this.bestIVCSV = csv
    //console.log(this.top1500)
    //return console.log(csv)

  },
  calcGStar: function (pokemon) {
    //console.log(pokemon.defaultIVs.cp1500.slice(1))
    return this.calcStar(pokemon.defaultIVs.cp1500.slice(1))
  },
  calcUStar: function (pokemon) {
    return this.calcStar(pokemon.defaultIVs.cp2500.slice(1))
  },
  isTopIncludable: function (pokemon) {
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
    
    return (
              ((gStar !== '4*') // 1500不是100%
              || (uStar !== '4*'))
              && (isShadow === false)
              && (isSpecial === false)
              )
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
      //console.log(text)
      this.$refs.copyTextarea.value = text
      this.$refs.copyTextarea.select();
      document.execCommand("Copy");
    }, 0)
  },
  copyRichText(text) {
    setTimeout(() => {
      function listener(e) {
        e.clipboardData.setData("text/html", text);
        e.clipboardData.setData("text/plain", text);
        e.preventDefault();
      }
      document.addEventListener("copy", listener);
      document.execCommand("copy");
      document.removeEventListener("copy", listener);
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

    try {
      return family.map(dex => {
        let id = this.dexToID[dex + '']
        id = this.pokemonNameTW[id]
        return id
      }).join(';')
    }
    catch (e) {
      throw `Evolution Family not found. dex: ${dex}`
    }
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
  copyInRankQuery () {
    let output = [
      ['starClass','remove','[]']
    ]
    
    for (let i = 0; i < this.removableOutOfStarClassList.length; i++) {
      let remove = this.removableOutOfStarClassList[i]
      
      
      output.push([
        'remove ' + remove.starClass + ` [${remove.count}]`,
        remove.query,
        `[${remove.count}]`,
      ])
    }
    
    for (let i = 0; i < this.exchangableOutOfStarClassList.length; i++) {
      let remove = this.exchangableOutOfStarClassList[i]
      
      output.push([
        'ex ' + remove.starClass + ` [${remove.count}]`,
        remove.query,
        `[${remove.count}]`,
      ])
    }
    
    for (let i = 0; i < this.checkInStarClassList.length; i++) {
      let remove = this.checkInStarClassList[i]
      
      output.push([
        'check ' + remove.starClass + ` [${remove.count}]`,
        remove.query,
        `[${remove.count}]`,
      ])
    }
    
    output = output.map(row => '<td>' + row.join('</td><td>') + '</td>').join('</tr><tr>')
    output = `<table><tr>${output}</tr></table>`
    
    this.copyRichText(output)
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
  },
  computedBuildTopPokemons: function (sourceRankings, cp = "cp1500") {
    if (this.ready === false) {
      return {}
    }
    
    let ranking = {
      //"normal": [],
      //"alolan": [],
      //"galarian": []
    }
    
    let count = 0
    
    for (let i = 0; i < sourceRankings.length; i++) {
      let r = sourceRankings[i]
      let speciesId = r.speciesId
      
      let p = this.speciesIdToData[speciesId]
      
      if (p.topIncludable === false) {
        continue;
      }
      else {
        let iv = p.defaultIVs[cp]
        if (iv[1] === 15 
                || iv[2] === 15 
                || iv[3] === 15) {
          continue;
        }
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
      
      count++
      if (count > this.topLimit) {
        break
      }
    }
    
    return ranking
  },
  computedBuildTopShadowPokemons: function (sourceRankings, cp = "cp1500") {
    if (this.ready === false) {
      return {}
    }
    
    let ranking = {
    }
    
    let count = 0
    
    for (let i = 0; i < sourceRankings.length; i++) {
      let r = sourceRankings[i]
      let speciesId = r.speciesId

      let p = this.speciesIdToData[speciesId]
      //console.log(r.topIncludable, r.isShadow)
      if (p.topIncludable === false) {
        
          
        if (p.isShadow) {
          
          let iv = p.defaultIVs[cp]
          if (iv[1] === 15 
                  || iv[2] === 15 
                  || iv[3] === 15) {
            continue;
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
        }
      }
      else {
        let iv = p.defaultIVs[cp]
        if (iv[1] === 15 
                || iv[2] === 15 
                || iv[3] === 15) {
          continue;
        }
        
        count++
        if (count > this.topLimit) {
          break
        }
      }
    }
    
    //console.log(ranking)
    return ranking
  },
  computedOutOfRankingAddDex: function (a, top, exclusiveList) {
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
    iv = iv.slice(0,1) // 只取攻擊
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
  computedTopListBuildAreaAttDexMap: function (areaDexIVAttMap) {
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
    
    return areaAttDexMap
  },
  computedBestIVCellsSortRowsByCount: function (rowsToAdd, rows) {
    rowsToAdd.sort((a, b) => {
      return b.count - a.count
    }).forEach((row, i) => {
      i = i % 6
      rows.push(i + ":" + row.cells)
    })
  },
  computedBestIVCellsOutOfRange: function (rows, outOfRanking, outOfRankingPrefixNotTraded, outOfRankingPrefixTraded, outOfRankingPrefixTradedBadLucky) {
    rows.push("不在排名內的\t未交換\t數量\t已交換\t數量\t亮晶晶2*\t數量")
    
    let rowsToAdd = []
    for (let area in outOfRanking) {
      let dexList = outOfRanking[area]
      let count = dexList.length
      let ivList = dexList.map(dex => '!' + dex).join('&')
      let areaQuery = this.computedAreaQuery(area)
      
      let cells = [
        area,
        areaQuery + outOfRankingPrefixNotTraded + ivList,
        `[${count}]`,
        areaQuery + outOfRankingPrefixTraded + ivList,
        `[${count}]`,
        areaQuery + outOfRankingPrefixTradedBadLucky + ivList,
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
  },
  computedBestIVCellsStarMap: function (rows, starMap, topRankingStarIncorrPrefixNotTraded, topRankingStarIncorrPrefixTraded, topRankingStarIncorrPrefixTradedBadLucky) {
    
    rows.push("排名內但星級不符\t未交換\t數量\t已交換\t數量\t亮晶晶2*\t數量")
    
    let rowsToAdd = []
    
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
          starExclusiveQuery + areaQuery + topRankingStarIncorrPrefixTradedBadLucky + ivList,
          `[${count}]`,
        ].join('\t')

        rowsToAdd.push({
          count: count,
          cells
        })
      })
    }
    
    this.computedBestIVCellsSortRowsByCount(rowsToAdd, rows)
    rows.push("") // 空一行
  },
  computedBestIVCellsAttMap: function (rows, attMap, topRankingStarCorrAttPrefixNotTraded, topRankingStarCorrAttPrefixTraded, topRankingStarCorrAttPrefixAllDistance) {
    let rowsToAdd = []
    
    rows.push("排名內星級符，過濾攻防IV格(A:0-5/B:6-10/C:11-15)\t未交換\t數量\t已交換\t數量\t全部\t數量")
    
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
          areaQuery + topRankingStarCorrAttPrefixAllDistance + ivList,
          `[${count}]`,
        ].join('\t')

        rowsToAdd.push({
          count: count,
          cells
        })
      })
    }
    
    this.computedBestIVCellsSortRowsByCount(rowsToAdd, rows)
    
  },
  computedAreaQuery: function (area) {
    if (area === 'normal') {
      return '!阿羅拉&!galar&'
    }
    else if (area === "alolan") {
      return "阿羅拉&"
    }
    else if (area === "galarian") {
      return "galar&"
    }
  },
  computedStarExclusiveQuery: function (starListString) {
    let starList = starListString.split(',')
    
    if (starList.length === 0) {
      return ''
    }
    else {
      return starList.map(s => "!" + s).join('&') + '&'
    }
  }
}