const topTenList = document.createElement('ol');
const listElements = [];
const request = new XMLHttpRequest();

for (i = 0; i < 10; i++) {
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

