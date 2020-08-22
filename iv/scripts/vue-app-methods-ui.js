var appMethodsUI = {
  sleep: function (ms = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, ms)
    })
  },
  downloadBeskIV: async function () {
    let blob = new Blob([this.bestIVCSV], {type: "text/csv;charset=utf-8"});
    saveAs(blob, 'best_' + (new Date()).mmddhhmm()  + '.csv', true);
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
}