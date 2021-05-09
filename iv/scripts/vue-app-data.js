/* global exclude2500, exclude1500, include2500, include1500, excludeSelection */

var appData = {
  ready: false,
  gm: null,
  battle: null,
  //message: 'hello',
  bestIVCSV: null,
  featureEnable: {
    allData: true
  },
  iv1500: {},
  iv2500: {},
  pokemonNameTW: {},
  pokemonName: {},
  dexToID: {},
  distanceBase: '0-10',
  dayInterval: 15,
  topLimit: 100,
  area: ['normal', 'alolan', 'galarian'],
  //top1500: [],
  //top2500: [],
  rankings1500: [],
  rankings2500: [],
  hasXL1500: [],
  hasXL2500: [],
  
  // 編號
  // 社群日的 https://pokemongo.fandom.com/wiki/Community_Day
  // 御三家的 
  include1500: include1500,
  // 排除不使用的
  exclude1500: exclude1500,
  include2500: include2500,
  exclude2500: exclude2500,
  excludeSelection: excludeSelection,
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
  ivTableProgress: null,
  areaGroupDex: {},
  //gIncludeSpeciesID: ["raichu_alolan", "raichu"],
  //uIncludeSpeciesID: [],
  //gExcludeSpeciesID: [],
  //uExcludeSpeciesID: []
}