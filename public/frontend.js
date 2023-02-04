
//---------------------------------------------------------
//--------  load master list of players -------------------

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
//-------- manage stage list ------------------------------

const add = document.getElementById('add');
const remove = document.getElementById('remove');
let stage = document.getElementById('stage-list');
let list = [];
let listNodes = [];
let dataList = [];

add.addEventListener('click', () => {
	console.log('add')
	const names = prompt('add who?').split(' ');
	masterList.forEach( player => {
		if ( (player.first_name == names[0]) && (player.last_name == names[1]) ) {
			list.push(player);
			const newNode = document.createElement('div');
			newNode.setAttribute('class', 'player');
			newNode.innerHTML = `${player.first_name} ${player.last_name}:   ${player.current_count}`;
			stage.appendChild(newNode);
			listNodes.push(newNode);
		}
	});
});

remove.addEventListener('click', () => {
	console.log('remove')
	const names = prompt('remove who?').split(' ');
	for (i = 0; i < list.length; i++) {
		if ((list[i].first_name == names[0]) && (list[i].last_name == names[1])) {
			list.splice(i, 1);
			listNodes[i].remove();
			listNodes.splice(i, 1);
		}
	}
});

//---------------------------------------------------------
//---------------------------------------------------------

