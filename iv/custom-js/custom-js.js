// https://docs.google.com/spreadsheets/d/1mfXbZRvfYl1mAF2cjX2ueIXo9wYdZrbmZCInkhjylSI/edit?folder=1Fchm-5uXC1qQrAOcvVyVUcMOp7JN_M6K#gid=1069329069
let customPokemons = {
	"dugtrio_shadow": "三地鼠 暗影化",
	/*
	"shiftry": "狡猾天狗",
	"munchlax": "小卡比獸",
	"vigoroth": "過動猿",
	"medicham": "恰雷姆",
	"wigglytuff": "胖可丁",
	"victreebel_shadow": "大食花 暗影化",
	"clefable": "皮可西",
	"stunfisk": "泥巴魚",
	"raichu_alolan": "雷丘 阿羅拉型態",
	"gardevoir_shadow": "沙奈朵 暗影化",
	"toxicroak": "毒骷蛙",
	"lanturn": "電燈怪",
	*/
	//"skarmory": "盔甲鳥"
}

const url = new URL(location.href);
let paramsEntries = url.searchParams
let params = {}
for (let pair of paramsEntries.entries()) {
  let key = pair[0]
  let value = pair[1]
	params[key] = value
}

let onlyCustom = true
let autoStartCompare = false
let customLeague = params.league
if (params.id) {
	customPokemons = {}
	customPokemons[params.id] = 'Pokemon'
	autoStartCompare = true
	onlyCustom = true
}



// ----------------

$('.rate-btn.button').click(() => {
	changeLinkToTwoShields()
})

let copyButton = $('<button type="button">COPY</button>')
let changeLinkToTwoShields = () => {
	setTimeout(async () => {
		await appendCustomRows()
		//return false
	  $('.table-container:first a.rating[href][target="blank"]').each((i, ele) => {
		  let linkParts = ele.href.split("/")
		  linkParts[7] = '22'
		  ele.href = linkParts.join("/")
		})
		
		copyButton.click(copyTable)
		$('.table-container:first thead tr:first td:first').append(copyButton)
		copyButton.hide()
		
		grabResult()
	}, 3000)
}

let appendCustomRows = async function () {
	let tbody = $('.table-container:first tbody')
	let lastRow = tbody.find('tr:last').clone()
	
	if (onlyCustom) {
		tbody.empty()
	}
	
	console.log(Object.keys(customPokemons))
	let speciesIdList = Object.keys(customPokemons)
	for (let i = 0; i < speciesIdList.length; i++) {
		let speciesId = speciesIdList[i]
		let name = customPokemons[speciesId]
		console.log(speciesId, name)
		
		let tr = lastRow.clone()
		let moves = await getMoveset(speciesId)
		tr.find('th.name').html(name)
		let ratings = tr.find('a.rating')
		for (let j = 0; j < ratings.length; j++) {
			let ele = ratings.eq(j)[0]
			$(ele).addClass('extra')
			let linkParts = ele.href.split('/')
			linkParts[5] = speciesId
			linkParts[8] = moves
			ele.href = linkParts.join('/')
			ele.innerText = '?'
		}
		
		tbody.append(tr)
	}
}

let getMovesetIndex = () => {
	let fastMoveIndex = $(".modal-content .move-select.fast option").index($(".modal-content .move-select.fast option:checked"))
	
	let chargedMovesIndex1 = $(".modal-content .move-select.charged:eq(0) option").index($(".modal-content .move-select.charged:eq(0) option:checked"))
	
	let chargedMovesIndex2 = $(".modal-content .move-select.charged:eq(1) option").index($(".modal-content .move-select.charged:eq(1) option:checked"))
	
	return `${fastMoveIndex}-${chargedMovesIndex1}-${chargedMovesIndex2}`
}

let getMoveset = async function (speciesId) {
	
	$(".team-build.poke-select-container .name-container:first").click()
	//console.log("有嗎？", $(".team-build.poke-select-container .name-container:first").length)
	await sleep(500)
	
	// gardevoir_shadow
	//console.log($(".modal-content .poke-select").length)
	$(`.modal-content .poke-select option[value="${speciesId}"]`)[0].selected = true
	$(`.modal-content .poke-select`)[0].dispatchEvent(new Event("change"))
	await sleep(500)
	
	let index = getMovesetIndex()
	$(".modal-close").click()
	await sleep(500)
	//console.log(speciesId, `${fastMoveIndex}-${chargedMovesIndex1}-${chargedMovesIndex2}`)
	return index
	/*
	console.log(GameMaster)
	
	let b = new window.Battle()
	b.setCP(1500)
	let p = new window.Pokemon(speciesId, 0, b)
	p.autoSelectMoves()
	
	let fastMoveId = c.fastMove.moveId
	let fastMoveIndex
	for (let i = 0; i < c.fastMovePool.length; i++) {
		if (c.fastMovePool[i].moveId === fastMoveId) {
			fastMoveIndex = i
			break
		}
	}
	
	let chargedMovesId = c.chargedMoves.map(m => m.moveId)
	let chargedMovesIndex
	for (let i = 0; i < c.chargedMovePool.length; i++) {
		let moveId = c.chargedMovePool[i].moveId
		if (chargedMovesId.indexOf(moveId) > -1) {
			chargedMovesIndex.push(i)
			if (chargedMovesIndex.length === 2) {
				break
			}
		}
	}
	chargedMovesIndex.sort()
	
	return `${fastMoveIndex}-${chargedMovesIndex[0]}-${chargedMovesIndex[1]}`
	*/
}

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let copyTable = () => {
	let output = []
	let table = $('.table-container:first')
	
	let thead = []
	table.find('thead > tr > td').each((i, ele) => {
		if (i === 0) {
			thead.push(location.href)
			thead.push('rank')
		}
		else {
			thead.push(ele.innerText)
		}
	})
	output.push(thead)
	
	table.find('tbody > tr').each((i, tr) => {
		let line = [
			(i+1)
		]
		$(tr).children().each((j, ele) => {
			line.push(ele.innerText.trim())
		})
		
		output.push(line)
	})
	
	output = output.map(l => l.join('\t')).join('\n')
	copyToClipboard(output)
}

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

//changeLinkToTwoShields()

let grabResult = async function () {
	//console.log($('.table-container:first a.rating[href][target="blank"]').length)
	let a = $('.table-container:first a.rating[href][target="blank"]')
	let loadingCount = 0
	
	let parallel = 1
	
	for (let i = 0; i < a.length; i++) {
		
		while (loadingCount >= parallel) {
			await sleep(1000)
		}
		  let ele = a.eq(i)[0]
			let link = ele.href.slice(5)
		  
			var iframe = $(`<iframe src="${link}" data-i="${i}" class="grab-result"></iframe>`)
			let loaded = false
			iframe.on('load', function () {
				//console.log('loaded')
				
				if (loaded === true) {
					return false
				}
				loaded = true
				
				let lastPoke0
				let lastPoke1
				
				let grab = () => {
					setTimeout(() => {
						if (!this.contentWindow) {
							grab()
							return false
						}
						
						var doc = $(this.contentWindow.document.body)
						
						var poke0text = doc.find('.poke.single:eq(0) .poke-stats .hp.bar-back .stat').text().split(' / ')
						var poke0 = Math.round(Number(poke0text[0]) / Number(poke0text[1]) * 100)
						if (poke0 !== lastPoke0) {
							lastPoke0 = poke0
							grab()
							return
						}
						
						
						var poke1text = doc.find('.poke.single:eq(1) .poke-stats .hp.bar-back .stat').text().split(' / ')
						var poke1 = Math.round(Number(poke1text[0]) / Number(poke1text[1]) * 100)
						
						if (poke1 !== lastPoke1) {
							lastPoke1 = poke1
							grab()
							return
						}
						
						let result = poke1
						if (poke1 === 0) {
							result = (poke0 * -1)
						}
						
						let dataI = Number($(this).attr('data-i'))
						console.log(dataI, result)
						if (result === 100) {
							i--
							iframe.remove()
							loadingCount--
							return false
						}
						
						a.eq(dataI).html(result + '%')
						
						iframe.remove()
						loadingCount--
					}, 1000)
				}
				
				grab()
			})
			
		loadingCount++
		iframe.appendTo('body')
		while (loadingCount >= parallel) {
			await sleep(1000)
		}
	}
	
	while (loadingCount > 0) {
		await sleep(1000)
	}
  copyTable()
  copyButton.show()
}

// https://pvpoketw.com/battle/1500/swampert/cherrim_sunny/22/0-2-4/0-4-3/

//Math.round(Number($('.poke.single:eq(1) .poke-stats .hp.bar-back .stat').text().split(' / ')[0]) / Number($('.poke.single:eq(1) .poke-stats .hp.bar-back .stat').text().split(' / ')[1]) * 100)

// -------------------------------------------------

let setupCompareButton = async function () {
	let button = $(`<button type="button" class="compare-button">開始比較</button>`)
	button.appendTo('body')
	
	button.click(startCompare)
	
	//await sleep(1000)
	//startCompare()
}

let compareResultTable
let compareResultTableTbody
let setupCompareResultTable = function () {
	compareResultTable = $('#compareResultTable')
	
	if (compareResultTable.length === 0) {
		compareResultTable = $(`<table id="compareResultTable" border="1">
		<thead>
			<tr>
				<th>
					<button type="button" class="copy-button">COPY</button>
					<button type="button" class="copy-button-csv">COPY-CSV</button>
				</th>
					
				<th>
					LeagueCP
				</th>
				<th>
					Name
				</th>
				<th>SpeciesID</th>
				<th>Moves Set</th>
				
				<th>BEST</th>
				<th>DEFAULT</th>
				<th>MAX</th>
				<th>BvsD</th>
				<th>DvsM</th>
				<th>BvsM</th>
				<th>RESULT</th>
				<th>IV</th>
			</tr>
		</thead>
		<tbody></tbody>
		</table>`).appendTo('body')
		
		compareResultTableTbody = compareResultTable.find('tbody:first')
		compareResultTable.find('.copy-button').click(copyResultTable)
		compareResultTable.find('.copy-button-csv').click(copyResultTableCSV)
	}
}

let copyResultTable = function () {
	let output = []
	let table = compareResultTable
	
	let thead = []
	table.find('thead > tr > th').each((i, ele) => {
		if (i === 0) {
			thead.push('#')
		}
		else {
			thead.push(ele.innerText)
		}
	})
	output.push(thead)
	
	table.find('tbody > tr').each((i, tr) => {
		let line = [
		]
		$(tr).children().each((j, ele) => {
			line.push(ele.innerText.trim())
		})
		
		output.push(line)
	})
	
	output = output.map(l => l.join('\t')).join('\n')
	copyToClipboard(output)
}

let copyResultTableCSV = function () {
	let output = []
	let table = compareResultTable
	
	table.find('tbody > tr').each((i, tr) => {
		let line = [
		]
		$(tr).children().each((j, ele) => {
			if (j === 1 || j === 4 || j === 11) {
				return
			}
			line.push(ele.innerText.trim())
		})
		
		output.push(line)
	})
	
	output = output.map(l => l.join(',')).join('\n')
	copyToClipboard(output)
}

let compareConfig = {
	//start: 37,
	//end: 38
}

let processedID = []

let startCompare = async function () {
	
	setupCompareResultTable()
	
	$('.add-poke-btn:first').click()
	
	await sleep(1000)
	
	let select = $('.poke-select:visible:first')
	let options = select.children(':not([disabled])')
	//console.log(options.length)
	
	let battle = $(".league-select").val()
	let end = options.length
	if (compareConfig.end && compareConfig.end < end) {
		end = compareConfig.end
	}
	
	let start = compareConfig.start
	if (!start) {
		start = 0
	}
	
	let customList = Object.keys(customPokemons)
	//console.log(customList)
	processedID = []
	for (let i = start; i < end; i++) {
		let SpeciesID = options.eq(i).attr('value')
		console.log(i, SpeciesID, customList, customList.indexOf(SpeciesID))
		if (onlyCustom === true && customList.indexOf(SpeciesID) === -1) {
			continue
		}
		if (processedID.indexOf(SpeciesID) > -1) {
			continue
		}
		processedID.push(SpeciesID)
		let name = options.eq(i).text().trim()
		
		let leagueCP = $('.league-select').val()
		
		let tr = $(`<tr>
			<td class="count">${i}</td>
			<td class="league">${leagueCP}</td>
			<td class="name">${name}</td>
			<td class="species-id">${SpeciesID}</td>
			<td class="movesset"></td>
			
			<td class="best"></td>
			<td class="default"></td>
			<td class="max"></td>
			<td class="b2d"></td>
			<td class="d2m"></td>
			<td class="b2m"></td>
			<td class="final-class"></td>
			<td class="final-iv"></td>
		</tr>`).appendTo(compareResultTableTbody)
		
		document.title = Math.round(((i - start) / (end - start)) * 100) + '% IV Compare...'
		
		select.val(SpeciesID)[0].dispatchEvent(new Event("change"))
		
		await sleep(1000)
		
		let section = $('.advanced-section:visible')
		
		if (section.hasClass("active") === false) {
			$('.advanced-section:visible .advanced:visible')[0].dispatchEvent(new Event("click"))
			await sleep(1000)
		}
		
		// ----------------------
		
		let defaultStats = getStats()
		tr.find('.default').html(defaultStats)
		
		$(".maximize-stats:visible")[0].dispatchEvent(new Event("click"))
		await sleep(500)
		let bestStats = getStats()
		tr.find('.best').html(bestStats)
		
		let fields = $('.modal-container:visible .advanced-section:visible .fields:visible .ivs')
		fields.find(".iv[iv='atk']").val(15)[0].dispatchEvent(new Event("change"))
		await sleep(200)
		fields.find(".iv[iv='def']").val(15)[0].dispatchEvent(new Event("change"))
		await sleep(200)
		fields.find(".iv[iv='hp']").val(15)[0].dispatchEvent(new Event("change"))
		await sleep(200)
		let maxStats = getStats()
		tr.find('.max').html(maxStats)
		
		let moveset = getMovesetIndex()
		tr.find('.movesset').html(moveset)
		
		// ------------------------
		
		let b2dURL = `/battle/${battle}/${SpeciesID}-${bestStats}-4-4-1/${SpeciesID}-${defaultStats}-4-4-1/22/${moveset}/${moveset}/`
		let b2dResult
		if (bestStats !== defaultStats) {
			b2dResult = await loadBattleResult(b2dURL)
	  }
	  else {
	  	b2dResult = 0
	  }
		tr.find('.b2d').html('<a href="' + b2dURL + '" target="_blank">' + b2dResult + '%</a>')
		
		// -------------------------
		
		let d2mURL = `/battle/${battle}/${SpeciesID}-${defaultStats}-4-4-1/${SpeciesID}-${maxStats}-4-4-1/22/${moveset}/${moveset}/`
		let d2mResult
		//console.log('d2m', defaultStats, maxStats, (defaultStats !== maxStats))
		if (defaultStats !== maxStats) {
			d2mResult = await loadBattleResult(d2mURL)
	  }
	  else {
	  	d2mResult = 0
	  }
		tr.find('.d2m').html('<a href="' + d2mURL + '" target="_blank">' + d2mResult + '%</a>')
		
		// ------------
		
		let b2mURL = `/battle/${battle}/${SpeciesID}-${bestStats}-4-4-1/${SpeciesID}-${maxStats}-4-4-1/22/${moveset}/${moveset}/`
		let b2mResult
		//console.log('b2m', bestStats, maxStats, (bestStats !== maxStats))
		if (bestStats !== maxStats) {
			b2mResult = await loadBattleResult(b2mURL)
	  }
	  else {
	  	b2mResult = 0
	  }
		tr.find('.b2m').html('<a href="' + b2mURL + '" target="_blank">' + b2dResult + '%</a>')
		
		// -----------------------
		let win = [0,0,0]
		
		if (b2dResult > 0) {
			win[0]++
		}
		else {
			win[1]++
		}
		
		if (d2mResult > 0) {
			win[1]++
		}
		else {
			win[2]++
		}
		
		if (b2mResult > 0) {
			win[0]++
		}
		else {
			win[2]++
		}
		
		if (win[0] === 2) {
			tr.find('.final-class').addClass("default").css("background-color", "#CCC").html('B')
			tr.find('.final-iv').addClass("best").css("background-color", "yellow").html(bestStats)
		}
		else if (win[1] === 2) {
			tr.find('.final-class').addClass("default").css("background-color", "#CCC").html('D')
			tr.find('.final-iv').addClass("default").css("background-color", "#CCC").html(defaultStats)
		}
		else {
			tr.find('.final-class').addClass("max").css("background-color", "green").html('M')
			tr.find('.final-iv').addClass("max").css("background-color", "green").html(maxStats)
		}
	}
	
	$(".modal-close").click()
	document.title = `!` + params.id 
}

let getStats = () => {
	let fields = $('.modal-container:visible .advanced-section:visible .fields:visible .ivs')
	//console.log(fields.length)
	let lv = fields.find(".level").val()
	let atk = fields.find(".iv[iv='atk']").val()
	let def = fields.find(".iv[iv='def']").val()
	let hp = fields.find(".iv[iv='hp']").val()
	
	return `${lv}-${atk}-${def}-${hp}`
}

let loadBattleResult = (url) => {
	//return -10;
	return new Promise(async (resolve) => {
		
		var iframe = $(`<iframe src="${url}" class="grab-result"></iframe>`)
		let loaded = false
		iframe.on('load', function () {
			//console.log('loaded')
			
			if (loaded === true) {
				return false
			}
			loaded = true
			
			let lastPoke0
			let lastPoke1
			
			let grab = () => {
				setTimeout(async () => {
					if (!this.contentWindow) {
						grab()
						return false
					}
					
					var doc = $(this.contentWindow.document.body)
					
					var poke0text = doc.find('.poke.single:eq(0) .poke-stats .hp.bar-back .stat').text().split(' / ')
					var poke0 = Math.round(Number(poke0text[0]) / Number(poke0text[1]) * 100)
					if (poke0 !== lastPoke0) {
						lastPoke0 = poke0
						grab()
						return
					}
					
					
					var poke1text = doc.find('.poke.single:eq(1) .poke-stats .hp.bar-back .stat').text().split(' / ')
					var poke1 = Math.round(Number(poke1text[0]) / Number(poke1text[1]) * 100)
					
					if (poke1 !== lastPoke1) {
						lastPoke1 = poke1
						grab()
						return
					}
					
					console.log('=================')
					console.log(poke0, poke1)
					let result = poke0
					if (poke0 === 0) {
						result = (poke1 * -1)
					}
					
					//let dataI = Number($(this).attr('data-i'))
					//console.log(dataI, result)
					if (result === 100) {
						iframe.remove()
						resolve(await loadBattleResult(url))
						return false
					}
					
					//a.eq(dataI).html(result + '%')
					iframe.remove()
					resolve(result)
				}, 1000)
			}
			
			grab()
		})
		iframe.appendTo('body')
	})
		  
}

setupCompareButton()

if (autoStartCompare) {
	$(".league-select").val(customLeague)[0].dispatchEvent(new Event("change"))
	//console.log(customLeague)
	//return false
	setTimeout(() => {
		startCompare()
	}, 5000)
}