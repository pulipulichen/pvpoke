var appMethodsSearch = {
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
}