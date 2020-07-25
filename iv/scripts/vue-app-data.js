var appData = {
  ready: false,
  gm: null,
  battle: null,
  //message: 'hello',
  bestIVCSV: null,
  pokemonNameTW: {},
  pokemonName: {},
  dexToID: {},
  topLimit: 100,
  area: ['normal', 'alolan', 'galarian'],
  //top1500: [],
  //top2500: [],
  rankings1500: [],
  rankings2500: [],
  
  // 社群日的 https://pokemongo.fandom.com/wiki/Community_Day
  // 御三家的 
  include1500: ['raichu', 'dragonair', 'dragonair_shadow', 'dragonite_shadow'
    , 'ivysaur', 'ivysaur_shadow', 'venusaur', 'venusaur_shadow'
    , 'charizard', 'charizard_shadow'
    , 'blastoise', 'blastoise_shadow'
    , 'umbreon'
    , 'meganium'
    , 'typhlosion'
    , 'sceptile'
    , 'blaziken'
    , 'vigoroth'
    , 'marshtomp', 'marshtomp_shadow', 'swampert', 'swampert_shadow'
    , 'gardevoir_shadow'
    , 'grotle', 'grotle_shadow', 'torterra', 'torterra_shadow'
    , 'prinplup' , 'empoleon'
    , 'flygon', 'flygon_shadow'
    , 'shiftry', 'shiftry_shadow'
    , 'beedrill', 'beedrill_shadow'
    , 'haunter'],
  exclude1500: [
    'ivysaur',
    'hariyama',
    'bellossom',
    'tangrowth',
    'gloom'
  ],
  include2500: ['dragonite', 'dragonite_shadow'
    , 'venusaur', 'venusaur_shadow'
    , 'ampharos', 'ampharos_shadow'
    , 'charizard', 'charizard_shadow'
    , 'blastoise', 'blastoise_shadow'
    , 'umbreon'
    , 'meganium'
    , 'metagross'
    , 'typhlosion'
    , 'feraligatr'
    , 'mamoswine'
    , 'sceptile'
    , 'salamence'
    , 'blaziken'
    , 'swampert', 'swampert_shadow'
    , 'gardevoir_shadow', 'gallade', 'gallade_shadow'
    , 'torterra', 'torterra_shadow'
    , 'infernape'
    , 'empoleon'
    , 'flygon', 'flygon_shadow'
    , 'shiftry', 'shiftry_shadow'
    , 'gengar'],
  exclude2500: [
    'hariyama'
  ],
  evolutionFamily: {},
  evolutionFamilySort: {},
  lvStarDust: {},
  lvCandy: {},
  //starClassList: [],
  //starClassDexList: {}
  //starClass1: [],
  //starClass12: [],
  //starClass2: [],
  //starClass3: [],
  //querySpeciesId: 'cobalion',
  querySpeciesId: '', // speciesId
  queryATK: 0,
  queryDEF: 0,
  queryHP: 0,
  //gIncludeSpeciesID: ["raichu_alolan", "raichu"],
  //uIncludeSpeciesID: [],
  //gExcludeSpeciesID: [],
  //uExcludeSpeciesID: []
}