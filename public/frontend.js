import Chart from 'chart.js/auto'
let i;

//---------------------------------------------------------
//--------  load master list of players -------------------
//---- in order of twitter followers (descending) ---------

let masterList = [];
const masterListRequest = new XMLHttpRequest();

masterListRequest.onload = function() {
	//console.log(masterListRequest.response);
	const tempList = JSON.parse(masterListRequest.response);
	tempList.forEach(x => {
		const y = Object.assign( {}, x);
		masterList.push( y );
	});
}

masterListRequest.open('GET', 'master', false);
masterListRequest.send();

//---------------------------------------------------------
//-------------  utilities--------- -----------------------
function createDate(columnString) {
	const bits = columnString.split('-');
	return new Date(bits[0], bits[1], bits[2], bits[3]);
}

function daysSinceLaunch(d) {
	const launch = new Date(2023, 0, 26, 23);
	return ( d.getTime() - launch.getTime() ) / (24*60*60*1000);
}

function dateFromLaunch(d) {
// inverse of daysSinceLaunch
	const msecSinceLaunch = d*1000*60*60*24;
	const launch = new Date(2023, 0, 26, 23);
	const day = new Date(launch.getTime() + msecSinceLaunch);	
	return `${day.getMonth()+1}-${day.getDate()}`;
}

function loadPlayer(player) {
	if (list.includes(player))
		return;
	list.push(player);
	const newNode = document.createElement('div');
	newNode.setAttribute('class', 'player');
	newNode.innerHTML = `${player.first_name} ${player.last_name}:   ${player.current_count}`;
	stage.appendChild(newNode);
	listNodes.push(newNode);

	const recordRequest = new XMLHttpRequest();
	recordRequest.onload = function() {
	//	records.push(JSON.parse(recordRequest.response));
		const row = JSON.parse(recordRequest.response)[0];
		const unNeededColumns = [
			'id', 'first_name', 'last_name',
			'twitter_name', 'current_count'
		];
		const data = [];
		for (const property in row) {
			if (!unNeededColumns.includes(property)) {
				data.push({
					x: daysSinceLaunch(createDate(property)),
					y: row[property]
				});
			}
		}
		const player = {
			id: row.id,
			first_name: row.first_name,
			last_name: row.last_name,
			twitter_name: row.twitter_name,
			current_count: row.current_count
		}

		records.push({bio: player, info: data});
		
	}
	recordRequest.open('GET', `/id/${player.id}`, true);
	recordRequest.send();
}

function removePlayer(player) {
	for (i = 0; i < list.length; i++) {
		if (list[i].id == player.id) {
			list.splice(i, 1);
			listNodes[i].remove();
			listNodes.splice(i, 1);
			records.splice(i, 1);
		}
	}
}

function filterInfo(data, x) {
	const dx = data.length / x;
	const shorterArray = [];
	for (i = 0; i < x; i++) {
		const index = Math.floor(i*dx);
		shorterArray.push(data[index]);
	}
	return shorterArray;
}

//---------------------------------------------------------
//-------- manage stage list ------------------------------

const add = document.getElementById('add');
const remove = document.getElementById('remove');
const stage = document.getElementById('stage-list');
const topTen = document.getElementById('top-ten');
const clear = document.getElementById('clear');
const graph = document.getElementById('graph');
const graphWrapper = document.getElementById('graph-wrapper');
graphWrapper.style.display = 'none';


let myChart;
let list = [];
let listNodes = [];
let records = [];

add.addEventListener('click', () => {
	const names = prompt('add who?').split(' ');
	masterList.forEach( p => {
		if ( (p.first_name.toUpperCase() == names[0].toUpperCase()) 
			&& (p.last_name.toUpperCase() == names[1].toUpperCase()) ) {
			loadPlayer(p)
		}
	});
});
remove.addEventListener('click', () => {
	const names = prompt('remove who?').split(' ');
	for (i = 0; i < list.length; i++) {
		if ((list[i].first_name.toUpperCase() == names[0].toUpperCase())
		 && (list[i].last_name.toUpperCase() == names[1].toUpperCase())) {
			removePlayer(list[i]);
		}
	}
});
topTen.addEventListener('click', () => {
	for (i = 0; i < 10; i++) {
		loadPlayer(masterList[i]);
	}
});
clear.addEventListener('click', () => {
	const max = list.length;
	for (i = max-1; i >= 0; i--) {
		listNodes[i].remove();
		list.pop();
		records.pop();
		listNodes.pop();
	}
	myChart.destroy();
	graphWrapper.style.display = 'none';
});
graph.addEventListener('click', () => {
	if (myChart)
		myChart.destroy();
	drawGraph();
});

//---------------------------------------------------------
//--------------- graph -----------------------------------

async function drawGraph() {
	graphWrapper.style.display = 'none';
	if (records.length == 0) return;
	graphWrapper.style.display = 'block';

	console.log('XX');

	const recs = [];
	records.forEach( rec => {
		recs.push({label: rec.bio.twitter_name, data: filterInfo(rec.info, 40)})
	});

	const dates = recs[0].data.map( z => dateFromLaunch(z.x));
	console.log(dates);

  myChart = new Chart(
    document.getElementById('line-graph'),
    {
      type: 'line',
      options: {
      	scales: {
      		x: {
      			type: 'linear',
      			ticks: {
      				callback: function(value, index, ticks){
      					return dateFromLaunch(value);
      				}
      			}
      		}
      	}
      },
      data:{
      	datasets: recs
      }
    }
  );
}



