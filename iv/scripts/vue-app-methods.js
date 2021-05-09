/* global postMessageAPI, XLSX, GameMaster, appMethodsUI, appMethodsIV, appMethodsInit, appMethodsQuery, appMethodsUtils, appMethodsSearch, appMethodsOutput, appMethodsRank, appMethodsPerfectTable, appMethodsRankSelection */

var appMethods = {
          ...appMethodsUtils,
          ...appMethodsQuery,
          ...appMethodsOutput,
          ...appMethodsRank,
          ...appMethodsInit,
          ...appMethodsIV,
          ...appMethodsUI,
          ...appMethodsSearch,
          ...appMethodsPerfectTable,
          ...appMethodsRankSelection
}