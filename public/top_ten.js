const topTenList = document.createElement('ol');
const listElements = [];
const request = new XMLHttpRequest();


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
//---------- drop down player list ------------------------

const dropDownContainer = document.createElement('div');
const dropDownList = document.createElement('ul');
const selectButton = document.createElement('button');

dropDownContainer.id = 'drop-down-container';
dropDownList.id = 'drop-down-list';
selectButton.id = 'select-button';

const dropDownListElements = [];
for (i = 0; i < masterList.length; i++) {
	dropDownListElements.push(document.createElement('li'));
	dropDownListElements[i].innerText = masterList[i].last_name;
	dropDownList.appendChild( dropDownListElements[i] );
}

selectButton.innerText = 'select a player to add';
dropDownContainer.appendChild(selectButton);
dropDownContainer.appendChild(dropDownList);
document.body.appendChild(dropDownContainer);

selectButton.addEventListener('click', () => {

});


//---------------------------------------------------------

for (i = 0; i < 70; i++) {
	listElements.push(document.createElement('li'));
	listElements[i].class = 'item';
	topTenList.appendChild(listElements[i]);
}

request.onload = function() {
	const list = JSON.parse(request.response);
	for (i = 0; i < listElements.length; i++) {
		listElements[i].innerText = `${list[i].first_name} ${list[i].last_name}.....${list[i].current_count}`;
	}	
	const div = document.getElementById('top-ten');
	title = document.createElement('h1');
	title.class = 'title';
	title.innerText = 'Most popular USMNT Twitter follows';
	div.appendChild(title);
	div.appendChild(topTenList);
}

request.open('GET', 'topten', true);
request.send();

