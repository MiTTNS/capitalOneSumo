const app = document.getElementById('root');
const perameeters = ['general search', 
'center', 
'description', 
'description 508', 
'keywords', 
'location', 
'media type', 
'nasa id', 
'photographer', 
'secondary creator', 
'title', 
'year start', 
'year end']


function createVideo(item, container) {
	// load video and info and present in a card

	fetch(encodeURI(item.href)).then(function(response2) {
		if (response2.status != 200) {
			console.log('video not found');
			return;
		}

		response2.json().then(function(data2) {
			const card = document.createElement('div');
			card.setAttribute('class', 'card');

			const vid = document.createElement('video');
			var i;
			for (i = 0; i < data2.length; i++) {
				if (getFileExtension(data2[i]) == 'mp4') {
					vid.src = data2[i];
					break;
				}
			}

			vid.loop = false;
			vid.controls = true;

			const h1 = document.createElement('h1');
			h1.textContent = item.data[0].title;

			const p = document.createElement('p');
			description = item.data[0].description.substring(0, 300);
			p.textContent = `${description}...`;

			container.appendChild(card);
			card.appendChild(vid);
			card.appendChild(h1);
			card.appendChild(p);
			card.appendChild(getLocationString(item));
			card.appendChild(getTagString(item));
		});
	})
}


function createImage(item, container) { 
	// load image and info and present in a card

	fetch(encodeURI(item.href)).then(function(response2) {
		if (response2.status != 200) {
			console.log('image not found');
			return;
		}

		response2.json().then(function(data2) {
			const card = document.createElement('div');
			card.setAttribute('class', 'card');

			const pic = document.createElement('img');

			for (i = 0; i < data2.length; i++) {
				if (getFileExtension(data2[i]) == 'jpg') {
					pic.src = data2[i];
					break;
				}
			}

			const h1 = document.createElement('h1');
			h1.textContent = item.data[0].title;

			const p = document.createElement('p');
			description = item.data[0].description.substring(0, 300);
			p.textContent = `${description}...`

			container.appendChild(card);
			card.appendChild(pic);
			card.appendChild(h1);
			card.appendChild(p);
			card.appendChild(getLocationString(item));
			card.appendChild(getTagString(item));
		});
	})
}


function createAudio(item, container) {
	// load audio and info and present in a card

	fetch(item.href).then(function(response2) {
		if (response2.status != 200) {
			console.log('audio not found');
			return;
		}

		response2.json().then(function(data2) {
			const card = document.createElement('div');
			card.setAttribute('class', 'card');

			const audio = document.createElement('audio');
			//audio.src = data2[2];

			for (i = 0; i < data2.length; i++) {
				if (getFileExtension(data2[i]) == 'mp3') {
					audio.src = data2[i];
					break;
				}
			}

			audio.autoplay = false;
			//audio.muted = true;
			audio.loop = true;
			audio.controls = true;

			const h1 = document.createElement('h1');
			h1.textContent = item.data[0].title;

			const p = document.createElement('p');
			description = item.data[0].description.substring(0, 300);
			p.textContent = `${description}...`

			container.appendChild(card);
			card.appendChild(audio);
			card.appendChild(h1);
			card.appendChild(p);
			card.appendChild(getLocationString(item));
			card.appendChild(getTagString(item));
		});
	})
}

function getFileExtension(filename) {
	// returns the file extension of a file
	return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

function getTagString(item) {
	// return a clickable string of tags
	const tags = document.createElement('p');
	tags.setAttribute('class', 'tags');
	tags.textContent = 'keywords: ';

	var i;

	for (i = 0; i < item.data[0].keywords.length; i++) {
		if (i == item.data[0].keywords.length - 1) {
			const div = document.createElement('div');
			div.setAttribute('class', 'tag');
			div.setAttribute('onclick', 'doSearchWith(tagURL(this.textContent))')
			div.textContent = ' ' + item.data[0].keywords[i];
			tags.appendChild(div);
		} else {
			const div = document.createElement('div');
			div.setAttribute('class', 'tag');
			div.setAttribute('onclick', 'doSearchWith(tagURL(this.textContent))')
			div.textContent = ' ' + item.data[0].keywords[i] + ',';
			tags.appendChild(div);
		}
	}
	return tags;
}

function getLocationString(item) {
	// return a clickable location link
	const locationText = document.createElement('p');
	locationText.setAttribute('class', 'tags');
	locationText.textContent = 'Location: ';

	const div = document.createElement('div');

	if (item.data[0].location != undefined) {
		div.setAttribute('class', 'tag');
		div.setAttribute('onclick', 'doSearchWith(tagURL(this.textContent))');
		div.textContent = ' ' + item.data[0].location;
	} else {
		div.textContent = 'unknown'
	}
	
	locationText.appendChild(div);

	return locationText;
}

function doSearchWith(url) {
	app.innerHTML = "";

	const container = document.createElement('div');
	container.setAttribute('class', 'container');
	app.appendChild(container);

	fetch(url).then(function(response) {
		if (response.status != 200) {
			console.log('search failed');
			return;
		}

		response.json().then(function(data) {
			var items = data.collection.items;

			if (items.length == 0) {
				window.alert('no results returned for this search');
			}

			items.forEach(item => {				
				if (item.data[0].media_type == 'image') {
					createImage(item, container);
				} else if (item.data[0].media_type == 'video') {
					createVideo(item, container);
				} else if (item.data[0].media_type == 'audio') {
					createAudio(item, container);
				}
			})

			if (data.collection.links.length == 1) {
				if (data.collection.links[0].rel == 'next') {
					const div = document.createElement('div');
					div.setAttribute('class', 'nextPageBtn');
					div.setAttribute('onclick', `doSearchWith('${data.collection.links[data.collection.links.length - 1].href}')`); 
					div.textContent = 'load next page';
					app.appendChild(div);
				} else {
					const div = document.createElement('div');
					div.setAttribute('class', 'nextPageBtn');
					div.setAttribute('onclick', `doSearchWith('${data.collection.links[data.collection.links.length - 1].href}')`); 
					div.textContent = 'load previous page';
					app.appendChild(div);
				}
			} else {
				const div = document.createElement('div');
				div.setAttribute('class', 'nextAndBack');

				const back = document.createElement('div');
				back.setAttribute('class', 'nextAndBackBtn');
				back.setAttribute('onclick', `doSearchWith('${data.collection.links[0].href}')`);
				back.textContent = 'load previous page';

				const next = document.createElement('div');
				next.setAttribute('class', 'nextAndBackBtn');
				next.setAttribute('onclick', `doSearchWith('${data.collection.links[data.collection.links.length - 1].href}')`); 
				next.textContent = 'load next page';

				app.appendChild(div);
				div.appendChild(back);
				div.appendChild(next);

			}
		});
	})
	.catch(function(err) {
		console.log(err);
	});
}

function tagURL(searchTerm) {
	// return a url for a tag
	var searchURL = 'https://images-api.nasa.gov/search?';

	fixedSearchTerm = searchTerm.split(',').join('');

	var encodedSearchTerm = encodeURI(fixedSearchTerm);
	searchURL += 'q=' + encodedSearchTerm;

	return searchURL;
}

function form2URL() {
	// retrun the url for the search form
	var searchURL = 'https://images-api.nasa.gov/search?';
	var form = document.getElementById('form2');
	var i;

	for (i = 0; i < form2.elements.length - 2; i++) {
		if (i % 2 == 0) {
			if (form.elements[i].value != '') {
				var searchTerm = form.elements[i].value;
				var searchType = form.elements[i+1].value;

				if (searchType == 'general search') {
					searchURL += 'q=' + searchTerm;
				} else if (searchType == 'keywords' || searchType == 'media type') {
					var fixedKeywords = [];
					const splitSearchTerm = searchTerm.split(',');

					for (j=0; j < splitSearchTerm.length; j++) {
						if (splitSearchTerm[j][0] == ' ') {
							fixedKeywords.push(splitSearchTerm[j].replace(' ', ''));
						} else {
							fixedKeywords.push(splitSearchTerm[j]);
						}
					}

					const fixedSearchType = searchType.split(' ').join('_');

					searchURL += '&' + fixedSearchType + '=' + encodeURI(fixedKeywords.join(','));
				} else {
					const fixedSearchType = searchType.split(' ').join('_');
					searchURL += '&' + fixedSearchType + '=' + encodeURI(searchTerm);
				}
			}
		} 
	}
	return searchURL;
}

function addSearchParameter() {
	// add a search field to the search form
	var form = document.getElementById('form2');
	var searches = document.getElementById('searches')

	const div = document.createElement('div');
	div.setAttribute('class', 'searchContainer');

	const input = document.createElement('input');
	input.setAttribute('class', 'genericBar');
	input.setAttribute('type', 'text');
	input.setAttribute('placeholder', 'Search');

	const select = document.createElement('select');
	select.setAttribute('class', 'genericSelect');

	searches.appendChild(div);
	div.appendChild(input);
	div.appendChild(select);

	for (i = 0; i < perameeters.length; i++) {
		const option = document.createElement('option');

		option.textContent = perameeters[i];
		
		select.appendChild(option);
	}

	const p = document.createElement('p');
	p.setAttribute('class', 'remove');
	p.setAttribute('onclick', 'removeSearchParameter(this.parentNode)');
	p.textContent = 'remove';

	div.appendChild(p);
}

function loadForm2() {
	// put year ranges in the start/end year drop-downs
	var form = document.getElementById('form2'); // form.elements[2] is day of the month
	var i;

	for (i = 0; i < perameeters.length; i++) {
		const option = document.createElement('option');

		option.textContent = perameeters[i];
		
		form.elements[1].appendChild(option);
	}
}

function removeSearchParameter(parentNode) {
	parentNode.remove(0);
}