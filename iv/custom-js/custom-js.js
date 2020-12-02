// https://docs.google.com/spreadsheets/d/1mfXbZRvfYl1mAF2cjX2ueIXo9wYdZrbmZCInkhjylSI/edit?folder=1Fchm-5uXC1qQrAOcvVyVUcMOp7JN_M6K#gid=1069329069

let onlyCustom = false
let autoStartCompare = false

let customPokemons = {
	//"azumarill": "瑪力露chrome-extension://nbhcbdghjpllgmfilhnhkllmkecfmpld/options.html麗",
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

let excludeSpecies = [
	//'gourgeist'
]

const url = new URL(location.href);
let paramsEntries = url.searchParams
let params = {}
for (let pair of paramsEntries.entries()) {
  let key = pair[0]
  let value = pair[1]
	params[key] = value
}

let customLeague = params.league
if (params.id) {
	customPokemons = {}
	customPokemons[params.id] = 'Pokemon'
	autoStartCompare = true
	onlyCustom = true
}
if (params.all) {
	customPokemons = {}
	autoStartCompare = true
	onlyCustom = false
}

let compareConfig = {
	//start: 83,
	//end: 38
}
let cacheBattleResultMinutes = 24 * 60 * 7

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
	
	//console.log(Object.keys(customPokemons))
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
let setupCompareResultTable = async function () {
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
				<th>DEFAULT_XL</th>
				<th>MAX</th>
				<th>b2x</th>
				<th>b2d</th>
				<th>b2m</th>
				<th>x2d</th>
				<th>x2m</th>
				<th>d2m</th>
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
	console.log(customList)
	processedID = []
	for (let i = start; i < end; i++) {
		let SpeciesID = options.eq(i).attr('value')
		if (SpeciesID.endsWith('_xl')) {
			continue
		}
		if (excludeSpecies.indexOf(SpeciesID) > -1) {
			//continue
		}
		
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
			<td class="default-xl"></td>
			<td class="max"></td>
			<td class="b2x"></td>
			<td class="b2d"></td>
			<td class="b2m"></td>
			<td class="x2d"></td>
			<td class="x2m"></td>
			<td class="d2m"></td>
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
		
		// 取得DEFAULT參數
		let defaultStats = getStats()
		tr.find('.default').html(defaultStats)
		
		// 開放等級上限
		if ($('.modal-container:visible .level-cap-group:visible div.on.check[value="50"]').length === 0) {
	 		$('.modal-container:visible .level-cap-group:visible div.check[value="50"]').click()
			await sleep(500)
		}
		
		// 取得BEST參數
		try {
			$(".maximize-stats:visible")[0].dispatchEvent(new Event("click"))
		}
		catch (e) {
			i--
			console.error('不知道為什麼框框被關掉了', i)
			return false
			tr.remove()
			await sleep(1000)
			$('.add-poke-btn:first').click()
			await sleep(1000)
			select = $('.poke-select:visible:first')
			continue
		}
		await sleep(500)
		let bestStats = getStats()
		tr.find('.best').html(bestStats)
		
		// 取得MAX參數
		let fields = $('.modal-container:visible .advanced-section:visible .fields:visible .ivs')
		fields.find(".iv[iv='atk']").val(15)[0].dispatchEvent(new Event("change"))
		await sleep(200)
		fields.find(".iv[iv='def']").val(15)[0].dispatchEvent(new Event("change"))
		await sleep(200)
		fields.find(".iv[iv='hp']").val(15)[0].dispatchEvent(new Event("change"))
		await sleep(200)
		let maxStats = getStats()
		tr.find('.max').html(maxStats)
		
		// 取得MOVESSET
		let moveset = getMovesetIndex()
		tr.find('.movesset').html(moveset)
		
		// 取得DEFAULT_XL參數
		let SpeciesIDXL = SpeciesID + '_xl'
		let defaultXLStats = ''
		//console.log(SpeciesIDXL)
	
		if ($('.modal-container:visible select.poke-select option[value="' + SpeciesIDXL + '"]').length > 0) {
			select.val(SpeciesIDXL)[0].dispatchEvent(new Event("change"))
			await sleep(1000)
			
			defaultXLStats = getStats()
		}
		tr.find('.default-xl').html(defaultXLStats)
		
		// 為了測試，以下戰鬥不做
		//continue
		
		//console.log('有資料嗎？')
		//throw new Error("有資料嗎？")
		//return false
		
		// B X D M
		// BX
		// BD
		// BM
		// XD
		// XM
		// DM
		
		// ------------------------
		
		let battles = {
			'b2x': [bestStats, defaultXLStats, null],
			'b2d': [bestStats, defaultStats, null],
			'b2m': [bestStats, maxStats, null],
			'x2d': [defaultXLStats, defaultStats, null],
			'x2m': [defaultXLStats, maxStats, null],
			'd2m': [defaultStats, maxStats, null],
		}
		
		
		// B D X M
		let winsCount = {
			m: 0,
			d: 0,
			x: 0,
			b: 0,
		}
		
		for (let b in battles) {
			console.log('[START BATTLE] ' + b)
			let result = await getStatusBattleResult(battles[b][0], battles[b][1], battle, SpeciesID, moveset)
			tr.find('.' + b).html(result.html)
			battles[b][2] = result.score
			
			let s = b.split('2')[1]
			if (result.score > 0) {
				s = b.split('2')[0]
			}
			winsCount[s]++
		}
		
		// -----------------------
		// 找出最佳勝利者
		let bestWinnerLabel = 'm'
		let bestWinnerCount = winsCount[bestWinnerLabel]
		for (let label in winsCount) {
			if (label === 'm') {
				continue
			}
			
			let count = winsCount[label]
			if (count > bestWinnerCount) {
				bestWinnerLabel = label
				bestWinnerCount = count
			}
		}
		
		// -------------------------------------------------
		// 輸出
		
		let statsList = {
			b: bestStats,
			d: defaultStats,
			x: defaultXLStats,
			m: maxStats
		}
		
		let color = '#CCC'
		if (bestWinnerLabel === 'm') {
			color = 'green'
		}
		
		tr.find('.final-class').addClass('winner-' + bestWinnerLabel).css("background-color", color).html(bestWinnerLabel.toUpperCase())
		tr.find('.final-iv').addClass('winner-' + bestWinnerLabel).css("background-color", color).html(statsList[bestWinnerLabel])
		
	}	// for (let i = start; i < end; i++) {
	
	//if (onlyCustom === true) {
		console.log('跑完了')
		$(".modal-close").click()
		document.title = `!` + params.id 
	//}
}

let getStatusBattleResult = async (stats1, stats2, battle, SpeciesID, moveset) => {
	if (stats1 === '') {
		return {
	  	html: '-',
	  	score: -1
	  }
	}
	else if (stats2 === '') {
		return {
	  	html: '-',
	  	score: 1
	  }
	}
	
	let url = `/battle/${battle}/${SpeciesID}-${stats1}-4-4-1/${SpeciesID}-${stats2}-4-4-1/22/${moveset}/${moveset}/`
	console.log('BATTLE URL: ',url)
	let result
	//console.log('d2m', defaultStats, maxStats, (defaultStats !== maxStats))
	
	// 去掉等級後做比較
	let stats1IV = stats1.slice(stats1.indexOf('-') + 1)
	let stats2IV = stats2.slice(stats2.indexOf('-') + 1)
	console.log(stats1IV, stats2IV)
	
	if (stats1IV !== stats2IV) {
		result = await loadBattleResult(url)
  }
  else {
  	result = 0
  }
  return {
  	html: '<a href="' + url + '" target="_blank">' + result + '%</a>',
  	score: result
  }
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
	let key = 'battle-result-' + url
	let cached = localStorage.getItem(key)
	console.log('cached', cached)
	if (cached !== null) {
		cached = JSON.parse(cached)
		console.log((new Date).getTime() - cached.time, cacheBattleResultMinutes * 60 * 1000)
		if (((new Date).getTime() - cached.time) < cacheBattleResultMinutes * 60 * 1000) {
			return cached.result
		}
	}
	
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
						// 看起來是有錯誤
						iframe.remove()
						resolve(await loadBattleResult(url))
						return false
					}
					
					//a.eq(dataI).html(result + '%')
					iframe.remove()
					//lscache.set(key, result + '', cacheBattleResultMinutes)
					localStorage.setItem(key, JSON.stringify({
						time: (new Date()).getTime(),
						result: result
					}))
					
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
	// https://pvpoketw.com/team-builder/?league=2500&id=gengar_mega
	//console.log(customLeague)
	if (customLeague === '2500') {
		setTimeout(() => {
			$(".league-select").val(customLeague)
			$(".league-select")[0].dispatchEvent(new Event("change"))
			$(".league-select").change()
			
			setTimeout(() => {
				startCompare()
			}, 5000)
		}, 5000)
	}
	else {
		//console.log(customLeague)
		//return false
		setTimeout(() => {
			startCompare()
		}, 5000)
	}
}
