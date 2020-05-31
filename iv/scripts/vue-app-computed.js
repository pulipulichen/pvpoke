var appComputed = {
  all1500 () {
    return this.rankings1500.map(p => p.speciesId)
  },
  top1500 () {
    let top = []
    let topPokemons = []
    let dexList = this.rankings1500.filter(p => p.topIncludable)
    for (let i = 0; i < dexList.length; i++) {
      let pokemon = dexList[i]
      let dex = dexList[i].dex
      if (top.indexOf(dex) > -1) {
        continue
      }
      top.push(dex)
      topPokemons.push(pokemon)
      if (top.length >= this.topLimit) {
        break
      }
    }
    //topPokemons.sort((a, b) => (a.dex - b.dex))
    return topPokemons
  },
  top1500dex () {
    return this.top1500.map(p => p.dex)
  },
  top1500dexFamily () {
    let output = []
    this.top1500dex.forEach(dex => {
      if (Array.isArray(this.evolutionFamily[dex + ''])) {
        output = output.concat(this.evolutionFamily[dex + ''])
      }
      else {
        output.push(dex)
        console.error('Lost family config: ' + dex)
      }
    })
    return output
  },
  all2500 () {
    return this.rankings2500.map(p => p.speciesId)
  },
  top2500 () {
    let top = []
    let topPokemons = []
    let dexList = this.rankings2500.filter(p => p.topIncludable)
    for (let i = 0; i < dexList.length; i++) {
      let pokemon = dexList[i]
      let dex = dexList[i].dex
      if (top.indexOf(dex) > -1) {
        continue
      }
      top.push(dex)
      topPokemons.push(pokemon)
      if (top.length >= this.topLimit) {
        break
      }
    }
    //topPokemons.sort((a, b) => (a.dex - b.dex))
    return topPokemons
  },
  top2500dex () {
    return this.top2500.map(p => p.dex)
  },
  top2500dexFamily () {
    let output = []
    this.top2500dex.forEach(dex => {
      if (Array.isArray(this.evolutionFamily[dex + ''])) {
        output = output.concat(this.evolutionFamily[dex + ''])
      }
      else {
        output.push(dex)
        console.error('Lost family config: ' + dex)
      }
    })
    return output
  },
  topMixedDex () {
    let output = []
    this.top1500dex.forEach(dex => {
      if (output.indexOf(dex) === -1) {
        output.push(dex)
      }
    })
    this.top2500dex.forEach(dex => {
      if (output.indexOf(dex) === -1) {
        output.push(dex)
      }
    })
    
    let nullEF = []
    output.forEach((dex) => {
      if (Array.isArray(this.evolutionFamily[dex]) === false) {
        nullEF.push(dex)
      }
    })
    
    if (nullEF.length > 0) {
      console.log(nullEF.map(dex => '\t"' + dex + '": []').join(',\n'))
    }
    
    return output
  },
  topOverlap () {
    return this.top1500dex.filter(dex => {
      return (this.top2500dex.indexOf(dex) > -1)
    })
  },
  starClassList () {
    let output = []
    //console.log(this.topMixedDex)
    this.topMixedDex.forEach(dex => {
      let o = []
      this.top1500.filter(p => p.dex === dex).forEach(({starClass}) => {
        if (o.indexOf(starClass) === -1) {
          o.push(starClass)
        }
      })
      
      this.top2500.filter(p => p.dex === dex).forEach(({starClass}) => {
        if (o.indexOf(starClass) === -1) {
          o.push(starClass)
        }
      })
      
      o.sort()
      o = o.join(',')
      
      if (output.indexOf(o) === -1) {
        output.push(o)
      }
    })
    output.sort()
    return output
  },
  removableOutOfRankingDexList () {
    let dexList = [].concat(this.top1500dexFamily)
    this.top2500dexFamily.forEach(dex => {
      if (dexList.indexOf(dex) === -1) {
        dexList.push(dex)
      }
    })
    dexList.sort((a,b) => a-b)
    return dexList
  },
  removableOutOfRanking () {
    if (this.removableOutOfRankingDexList.length === 0) {
      return ''
    }
    //console.log(this.removableOutOfRankingDexList)
    let prefix = '!4*&距離0-10&!交換&!e&!c&!U&!G&!暗影&!淨化&!傳說的寶可夢&!特殊&!幻&!異色&!亮晶晶&!'
    return prefix + this.removableOutOfRankingDexList.join('&!')
  },
  removableOutOfStarClassPrefix () {
    return "!4*&距離0-10&!交換&!e&!c&&!U&!G!暗影&!淨化&!傳說的寶可夢&!特殊&!幻&!異色&!亮晶晶&"
  },
  starClassDexList () {
    //let output = []
    //console.log(this.top1500)
    let output = []
    
    this.starClassList.forEach(starClass => {
      let dexList = this.top1500.filter(p => p.starClass === starClass).map(p => p.dex)
      this.top2500.filter(p => p.starClass === starClass).forEach(p => {
        if (dexList.indexOf(p.dex) === -1) {
          dexList.push(p.dex)
        }
      })
      //dexList.sort((a,b) => a-b)
      if (dexList.length > 0) {
        output.push({
          starClass,
          dexList
        })
      }
    })
    return output
  },
  starClassDexFamilyList () {
    return this.starClassDexList.map(({starClass, dexList}) => {
      let output = []
      
      dexList.forEach(dex => {
        if (Array.isArray(this.evolutionFamily[dex + ''])) {
          output = output.concat(this.evolutionFamily[dex + ''])
        }
        else {
          output.push(dex)
          console.error('Lost family config: ' + dex)
        }
      })
      
      dexList = output
      return {
        starClass,
        dexList
      }
    })
  },
  removableOutOfStarClassList () {
    //console.log(this.starClass1.length)
    return this.starClassDexFamilyList.map(({starClass, dexList}) => {
      let filterStarClass = starClass
      if (filterStarClass.indexOf(',') > - 1) {
        filterStarClass = filterStarClass.replace(',', '&!')
      }
      
      dexList.sort((a,b) => a - b)
      
      return {
        starClass,
        query: this.removableOutOfStarClassPrefix + '!' + filterStarClass + '&' + dexList.join(',')
      }
    })
    //return this.removableOutOfStarClassPrefix + '!2*&' + this.starClass2.join(',')
  },
  checkStarClassList () {
    //console.log(this.starClass1.length)
    //let prefix = ""
    return this.starClassDexFamilyList.map(({starClass, dexList}) => {
      let filterStarClass = starClass
      
      return {
        starClass,
        query: filterStarClass + '&' + dexList.join(',')
      }
    })
    //return this.removableOutOfStarClassPrefix + '!2*&' + this.starClass2.join(',')
  },
  calc1500list () {
    if (this.querySpeciesId === '') {
      return []
    }
    
    let battle = new Battle()
    battle.setCP(1500)
    
    let pokemon
    
    try {
      pokemon = new Pokemon(this.querySpeciesId, 1, battle);
    }
    catch (e) {
      return []
    }
    
    let list = pokemon.generateIVCombinations("overall", 2, 4096, null, 0)
//    console.log(list[0])
//    list.sort((a, b) => {
//      return b.overall - a.overall
//    })
    
    return list.map(({ivs, level, cp, overall}, rank) => {
      let {atk, def, hp} = ivs
      
      return {
        overall,
        rank: (rank + 1),
        atk,
        def,
        hp,
        cp,
        starClass: this.calcStar(ivs),
        level,
        stardust: this.lvStarDust[(level + '')],
        candy: this.lvCandy[(level + '')],
        exchange: this.calcIncludeExchange(ivs) ? 'Y' : 'N',
        lucky: this.calcIncludeLucky(ivs) ? 'Y' : 'N'
      }
    })
  },
  match1500ranking () {
    let atk = this.queryATK
    let def = this.queryDEF
    let hp = this.queryHP
    //console.log(def)
    let output = this.calc1500list.filter(item => {
      return (item.atk === atk
              && item.def === def
              && item.hp === hp)
    })
    //console.log(output)
    return output
  },
  max1500ranking () {
    if (15 === this.queryATK 
              && 15 === this.queryDEF
              && 15 === this.queryHP) {
        return []
    }
    
    return this.calc1500list.filter(item => {
      return (item.atk === 15
              && item.def === 15
              && item.hp === 15)
    })
  },
  match2500ranking () {
    let atk = this.queryATK
    let def = this.queryDEF
    let hp = this.queryHP
    //console.log(def)
    let output = this.calc2500list.filter(item => {
      return (item.atk === atk
              && item.def === def
              && item.hp === hp)
    })
    //console.log(output)
    return output
  },
  max2500ranking () {
    if (15 === this.queryATK 
              && 15 === this.queryDEF
              && 15 === this.queryHP) {
        return []
    }
    
    return this.calc2500list.filter(item => {
      return (item.atk === 15
              && item.def === 15
              && item.hp === 15)
    })
  },
  selectedPokemon () {
    if (!this.gm || !this.gm.data.pokemon) {
      return 
    }
    
    for (let i = 0; i < this.gm.data.pokemon.length; i++) {
      let pokemon = this.gm.data.pokemon[i]
      if (pokemon.speciesId === this.querySpeciesId) {
        return pokemon
      }
    }
  },
  best1500ranking () {
    if (!this.selectedPokemon) {
      return []
    }
    
    let ivs = this.selectedPokemon.defaultIVs['cp1500']
    let atk = ivs[1]
    let def = ivs[2]
    let hp = ivs[3]
    
    if (atk === this.queryATK 
              && def === this.queryDEF
              && hp === this.queryHP) {
        return []
    }
    
    return this.calc1500list.filter(item => {
      return (item.atk === atk
              && item.def === def
              && item.hp === hp)
    })
  },
  best2500ranking () {
    if (!this.selectedPokemon) {
      return []
    }
    
    let ivs = this.selectedPokemon.defaultIVs['cp2500']
    let atk = ivs[1]
    let def = ivs[2]
    let hp = ivs[3]
    
    if (atk === this.queryATK 
              && def === this.queryDEF
              && hp === this.queryHP) {
        return []
    }
    
    return this.calc2500list.filter(item => {
      return (item.atk === atk
              && item.def === def
              && item.hp === hp)
    })
  },
  calc2500list () {
    if (this.querySpeciesId === '') {
      return []
    }
    
    let battle = new Battle()
    battle.setCP(2500)
    let pokemon
    
    try {
      pokemon = new Pokemon(this.querySpeciesId, 0, battle);
    }
    catch (e) {
      return []
    }
    
    let list = pokemon.generateIVCombinations("overall", 1, 4096, null, 0)
    
    return list.map(({ivs, level, cp}, rank) => {
      let {atk, def, hp} = ivs
      
      return {
        rank: (rank + 1),
        atk,
        def,
        hp,
        cp,
        starClass: this.calcStar(ivs),
        level,
        stardust: this.lvStarDust[(level + '')],
        candy: this.lvCandy[(level + '')],
        exchange: this.calcIncludeExchange(ivs) ? 'Y' : 'N',
        lucky: this.calcIncludeLucky(ivs) ? 'Y' : 'N'
      }
    })
  },
  rankingBest () {
    let best = {}
    if (this.match1500ranking.length > 0) {
      let b
      this.match1500ranking.forEach(({rank}) => {
        if (!b || rank < b) {
          b = rank
        }
      })
      
      /*
      if (b > 3000) {
        b = '3K'
      }
      else if (b > 2000) {
        b = '2K'
      }
      else if (b > 1000) {
        b = '1K'
      }
      */
      best['G'] = b
    }
    if (this.match2500ranking.length > 0) {
      let b
      this.match2500ranking.forEach(({rank}) => {
        if (!b || rank < b) {
          b = rank
        }
      })
      
      /*
      if (b > 3000) {
        b = '3K'
      }
      else if (b > 2000) {
        b = '2K'
      }
      else if (b > 1000) {
        b = '1K'
      }
       */
      best['U'] = b
    }
    
    if (best['G'] > 1000 & best['U'] > 1000) {
      return 'GU>1K'
    }
    else if (best['G'] > 1000) {
      return 'U' + best['U']
    }
    else if (best['U'] > 1000) {
      return 'G' + best['G']
    }
    else if (best['G'] <= best['U']) {
      if (best['U'] < 100) {
        return 'G' + best['G'] + ' U' + best['U']
      }
      else {
        return 'G' + best['G']
      }
    }
    else if (best['U'] < best['G']) {
      if (best['G'] < 100) {
        return 'U' + best['U'] + ' G' + best['G']
      }
      else {
        return 'U' + best['U']
      }
    }
  },
  searchSpeciesIdContent () {
    /*
    var content = [
      { 
        title: 'Andorra',
        description: 'Andorra Andorra Andorra'
      },
      { 
        title: 'BBB',
        description: 'BBB BBB CCC'
      },
      // etc
    ];
     */
    if (!this.gm.data.pokemon) {
      return []
    } 
    
    return this.gm.data.pokemon.map(({dex, speciesName, speciesId}) => {
      //let title = `${speciesId}: ${speciesName} ${this.pokemonNameTW[speciesId]}`
      let title = `${speciesName} ${this.pokemonNameTW[speciesId]}`
      let description = [
        
      ]
      
      //console.log()
      this.evolutionFamily[dex + ''].map(d => {
        if (d === dex) {
          return false
        }
        
        let id = this.dexToID[d]
        description.push(this.pokemonName[id])
        description.push(this.pokemonNameTW[id])
      })
      
      return {
        title,
        price: '#' + dex,
        description: description.join(' '),
        speciesId: speciesId
      }
    })
  }
}