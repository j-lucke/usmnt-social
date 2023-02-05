
//---------------------------------------------------------
//--------  load master list of players -------------------
//---- in order of twitter followers (descending) ---------

let masterList = [];
const masterListRequest = new XMLHttpRequest();

masterListRequest.onload = function() {
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
		records.push(JSON.parse(recordRequest.response));
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

//---------------------------------------------------------
//-------- manage stage list ------------------------------

const add = document.getElementById('add');
const remove = document.getElementById('remove');
const stage = document.getElementById('stage-list');
const topTen = document.getElementById('top-ten');
const clear = document.getElementById('clear');

let list = [];
let listNodes = [];
let records = [];

add.addEventListener('click', () => {
	console.log('add')
	const names = prompt('add who?').split(' ');
	masterList.forEach( p => {
		if ( (p.first_name == names[0]) && (p.last_name == names[1]) ) {
			loadPlayer(p)
		}
	});
});

remove.addEventListener('click', () => {
	console.log('remove')
	const names = prompt('remove who?').split(' ');
	for (i = 0; i < list.length; i++) {
		if ((list[i].first_name == names[0]) && (list[i].last_name == names[1])) {
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
	console.log('clear');
	console.log(list);
	const max = list.length;
	for (i = max-1; i >= 0; i--) {
		listNodes[i].remove();
		list.pop();
		records.pop();
		listNodes.pop();
	}
});




