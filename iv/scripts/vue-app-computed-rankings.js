var appComputedRankings = {
  rankings1500Selection: function () {
    return this.getRankingsSelection(this.rankings1500)
  },
  rankings2500Selection: function () {
    return this.getRankingsSelection(this.rankings2500)
  },
  rankings1500SpeciesId: function () {
    return this.rankings1500Selection.map(r => r.speciesId)
  },
  rankings2500SpeciesId: function () {
    return this.rankings2500Selection.map(r => r.speciesId)
  },
}
