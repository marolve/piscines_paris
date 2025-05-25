
var map;
var markers = [];

$(window).on( 'load', function() {
	
	initMap();
	
	$('.nav-maplist').click(function() {
		event.preventDefault();
		updateNav();
	});

	$('.btnradioday').click(function(){
		updateList();
	});
	
	$('.btnradiohour').click(function(){
		updateList();
	});
	
});

$(window).on( 'pageshow', function() {
	
	update();
	
});


var piscines = [
{ name: 'Piscine Suzanne Berlioux (Les Halles)', x: 48.8626842, y: 2.3440139 },
{ name: 'Piscine Marie-Marvingt', x: 48.8589952, y: 2.3527092 },
{ name: 'Espace Sportif Pontoise', x:48.84907, y: 2.35174 },
{ name: 'Piscine Jean Taris', x: 48.8447357, y: 2.3478780},
{ name: 'Piscine Saint-Germain', x: 48.8519343, y: 2.3358691 },
{ name: 'Piscine Jacqueline Auriol', x: 48.8763571, y: 2.3058331 },
{ name: 'Piscine Paul Valeyre', x: 48.8778547, y: 2.3450664 },
{ name: 'Piscine Georges Drigny', x: 48.8819002, y: 2.3422895 },
{ name: 'Piscine Catherine Lagatu', x: 48.8717232, y: 2.3695017 },
{ name: 'Piscine Château-Landon', x: 48.8833055, y: 2.3634273 },
{ name: 'Piscine Georges Rigal', x: 48.85662, y: 2.39352 },
{ name: 'Piscine de la Cour des Lions', x: 48.8606030, y: 2.3703147 },
{ name: 'Piscine Roger Le Gall', x: 48.84164 , y: 2.41259 },
{ name: 'Piscine Jean Boiteux', x: 48.84216 , y: 2.38926 },
{ name: 'Piscine de la Butte aux cailles', x: 48.82735, y: 2.35237 },
{ name: 'Piscine Château des Rentiers', x: 48.83068, y: 2.36307 },
{ name: 'Piscine Joséphine-Baker', x: 48.8361, y: 2.37601 },
{ name: 'Piscine Dunois', x: 48.83305, y: 2.36683 },
{ name: 'Piscine Didot', x: 48.8246156, y: 2.3095480 },
{ name: 'Piscine Thérèse et Jeanne Brulé', x: 48.82146, y: 2.32609 },
{ name: 'Piscine Aspirant Dunand', x: 48.83182, y: 2.32617 },
{ name: 'Piscine Blomet', x: 48.84314, y: 2.30776 },
{ name: 'Piscine René et André Mourlon', x: 48.84875, y: 2.28476 },
{ name: 'Piscine La Plaine', x:  48.8276269, y: 2.2935826 },
{ name: 'Piscine Keller', x: 48.84744, y: 2.28223 },
{ name: 'Piscine Emile Anthoine', x: 48.8557538, y: 2.2906075 },
{ name: 'Piscine Armand Massard', x:  48.8432854, y: 2.3234991 },
{ name: 'Piscine d\'Auteuil', x: 48.85693, y: 2.26056 },
{ name: 'Piscine Henry de Montherlant', x: 48.86738, y: 2.27154 },
{ name: 'Piscine Bernard Lafay', x: 48.89437, y: 2.31875 },
{ name: 'Piscine Marjorie Gestring (Ex : Piscine Champerret)', x: 48.88863, y: 2.29567 },
{ name: 'Piscine Bertrand Dauvin', x: 48.89961, y: 2.34241 },
{ name: 'Piscine Hébert', x: 48.8940930, y: 2.3635225 },
{ name: 'Piscine des Amiraux', x: 48.89433, y: 2.35098 },
{ name: 'Piscine Georges Hermant', x: 48.88255, y: 2.38980 },
{ name: 'Piscine Mathis', x: 48.8907179, y: 2.3749478 },
{ name: 'Piscine Rouvet', x: 48.8930004, y: 2.3849571 },
{ name: 'Piscine Edouard Pailleron', x: 48.88081, y: 2.37797 },
{ name: 'Piscine Yvonne Godard', x: 48.86136, y: 2.41041 },
{ name: 'Piscine Georges-Vallerey', x: 48.87541, y: 2.40632 },
{ name: 'Piscine Alfred Nakache', x: 48.87145, y: 2.37892 }
];

function initMap() {
	var lat = 48.8621;
	var lon = 2.3397;
	map = L.map('map').setView([lat, lon], 12);

	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap'
	}).addTo(map);
	
/*	L.control.locate({
		drawCircle: true
	}).addTo(map);
	*/
}

function findPiscine(name) {
	var result = null;
	piscines.forEach( piscine => {
		if (piscine.name.indexOf(name) == 0)
			result = piscine;
	});
	return result;
}

function removeAllMarkers() {
	markers.forEach(marker => {
		map.removeLayer(marker);
	});
	markers = [];
}

function addMarker(lat, lon, text, openLevel) {
	marker = L.marker([lat, lon]).addTo(map);
	marker.bindPopup(text);
	marker._icon.classList.add("openlevel" + openLevel);
	markers.push(marker);
	return marker;
}


function update() {
	
	updateNav();

	let dayclicked = $('input[name=btnradioday]:checked');
	if (!dayclicked.length) {
		const dayidPrevious = $('#btngroupday').attr('data-dayselected');
		if (dayidPrevious) {
			$('#btnradioday'+dayidPrevious).click();
		} else {
			const currentDayNumber = new Date().getDate();
			$('.btnradiodaynumber'+currentDayNumber).click();
		}
	}
	
	let hourclicked = $('input[name=btnradiohour]:checked');
	if (!hourclicked.length) {
		const houridPrevious = $('#btngrouphour').attr('data-hourselected');
		if (houridPrevious) {
			$('#btnradiohour'+houridPrevious).click();
		} else {
			const currentHour = new Date().getHours();
			let hourText = '';
			if (currentHour < 10)
				hourText = '0';
			hourText += currentHour;
			$('#btnradiohour'+hourText).click();
		}
	}
}

function updateNav() {
	let clicked = $('.nav-tabs button.active');
	let showMap = clicked.attr('id') == 'map-tab';
	if (showMap) {
		$('#tablecontainer').addClass('d-none');	// hide
		$('#mapcontainer').removeClass('d-none');	// show
		map.invalidateSize();
	} else {
		$('#mapcontainer').addClass('d-none');	// hide
		$('#tablecontainer').removeClass('d-none');	// show
	}
}

function updateList() {
	
	removeAllMarkers();
	
	let dayid = '';
	let dayclicked = $('input[name=btnradioday]:checked');
	if (!dayclicked.length) return;
	let dayidclicked = dayclicked.attr('id');
	if (dayidclicked.indexOf('btnradioday') == 0) {
		dayid = dayidclicked.substring(11);
	}
	
	let hourid = '';
	let hourclicked = $('input[name=btnradiohour]:checked');
	if (!hourclicked.length) return;
	let houridclicked = hourclicked.attr('id');
	if (houridclicked.indexOf('btnradiohour') == 0) {
		hourid = houridclicked.substring(12);
	}
	
	if (dayid.length == 0 || hourid.length == 0) return;
	$('#btngroupday').attr('data-dayselected', dayid);
	$('#btngrouphour').attr('data-hourselected', hourid);

	let hour = parseInt(hourid);
	
	$('#tablecontainer tbody tr').each(function() {
		
		let piscineName = $(this).attr('data-name');
		let piscineLink = $(this).attr('data-link');
		let scheduleData = $(this).attr('data-schedule-data' + dayid);
		let scheduleTextComplete = $(this).attr('data-schedule-text' + dayid);
		let scheduleText = '';
		
		// schedule datas "420-510;690-810"
		let timestart = hour * 60;
		let timeend = timestart + 59;
		let start = 0;
		let openLevel = -1;
		while (start != -1) {
			let schedule = '';
			let sep = scheduleData.indexOf(';', start);
			if (sep == -1) {
				schedule = scheduleData.substring(start);
				start = -1;
			}
			else {
				schedule = scheduleData.substring(start, sep);
				start = sep + 1;
			}
			if (schedule.length > 0) {
				if (openLevel == -1)
					openLevel = 0;
				let sep = schedule.indexOf('-');
				if (sep != -1) {
					let low = parseInt(schedule.substring(0, sep));
					let high = parseInt(schedule.substring(sep + 1));
					let timestartok = (timestart >= low && timestart < high);
					let timeendok = (timeend >= low && timeend <= high);
					let addText = false;
					if (timestartok && timeendok) {
						openLevel = 1;
						addText = true;
					}
					if (openLevel == 0) {
						if ((timestartok && !timeendok) || (!timestartok && timeendok)) {
							openLevel = 2;
							addText = true;
						}
					}
					if (addText) {
						if (scheduleText.length > 0)
							scheduleText += '<br/>';
						let lowhour = (Math.floor(low/60)).toLocaleString('fr-FR', {minimumIntegerDigits: 2});
						let lowminute = (low%60).toLocaleString('fr-FR', {minimumIntegerDigits: 2});
						let highhour = (Math.floor(high/60)).toLocaleString('fr-FR', {minimumIntegerDigits: 2});
						let highminute = (high%60).toLocaleString('fr-FR', {minimumIntegerDigits: 2});
						scheduleText += lowhour + ':' + lowminute + ' à ' + highhour + ':' + highminute;
					}
				}
			}
		}
		$(this).find('.schedulecell').html(scheduleText);
		$(this).removeClass('table-info');
		if (openLevel == 2)
			$(this).css('font-style', 'italic');
		if (openLevel == 1) {
			$(this).css('font-style', 'normal');
			$(this).addClass('table-info');
		}
		if (openLevel <= 0) {
			$(this).hide();
		} else {
			$(this).show();
		}
		if (openLevel >= 0) {
			let piscine = findPiscine(piscineName);
			if (piscine != null) {
				let piscineText = '<h6><a href="' + piscineLink + '">' + piscine.name + '</a></h6><br/>' + scheduleTextComplete;
				addMarker(piscine.x, piscine.y, piscineText, openLevel);
			}
		}
	});
}