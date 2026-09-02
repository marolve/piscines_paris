
var map;
var circleIcon;

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
{ name: 'Piscine de la Butte aux Cailles', x: 48.82735, y: 2.35237 },
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
{ name: 'Piscine Solita Salgado', x: 48.895947, y: 2.335289 },
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

	circleIcon = L.icon({
			iconUrl: 'circle16.png',
			iconSize: [16, 16],
			iconAnchor: [8, 8],
	});
	
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
	piscines.forEach( piscine => {
		if (piscine.marker) {
			map.removeLayer(piscine.marker);
			piscine.marker = null;
		}
	});
}

function addMarker(piscine, isCircle, textInformation, openLevel) {
	if (piscine.marker) {
		map.removeLayer(marker);
		piscine.marker = null;
	}
	var lat = piscine.x;
	var lon = piscine.y;
	var text = '';
	if (piscine.link) {
		text += '<h6><a href="' + piscine.link + '">' + piscine.name + '</a></h6>';
	} else {
		text += piscine.name;
	}
	if (textInformation) {
		text += textInformation;
	}
	var marker;
	if (!isCircle) {
		marker = L.marker([lat, lon]).addTo(map);
		marker._icon.classList.add("openlevel" + openLevel);
	} else {
		marker = L.marker([lat, lon], { 
				icon: circleIcon
			}).addTo(map);
		marker._icon.classList.add("circle");
	}
	marker.bindPopup(text);
	piscine.marker = marker;
	return marker;
}


function update() {
	
	updateNav();
	
	var currentDayNumber = new Date().getDate();
	var currentHour = new Date().getHours();
	if (currentHour < 6)
		currentHour = 6;

	let dayclicked = $('input[name=btnradioday]:checked');
	if (!dayclicked.length) {
		const dayidPrevious = $('#btngroupday').attr('data-dayselected');
		if (dayidPrevious) {
			$('#btnradioday'+dayidPrevious).click();
		} else {
			$('.btnradiodaynumber'+currentDayNumber).click();
		}
	}
	
	let hourclicked = $('input[name=btnradiohour]:checked');
	if (!hourclicked.length) {
		const houridPrevious = $('#btngrouphour').attr('data-hourselected');
		if (houridPrevious) {
			$('#btnradiohour'+houridPrevious).click();
		} else {
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

const MonthLabels = [ "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre" ];

function getLabelDate(label, monthNumber) {
	// lun. 12 -> lundi 12
	label = label.replace('lun.', 'lundi').replace('mar.', 'mardi').replace('mer.', 'mercredi').replace('jeu.', 'jeudi').replace('ven.', 'vendredi').replace('sam.', 'samedi').replace('dim.', 'dimanche');
	label += ' ' + MonthLabels[monthNumber - 1];
	return label;
}

const TimeStatus = {
	TS_BEFORE: 'TS_BEFORE',						// Avant
	TS_WITHIN: 'TS_WITHIN',						// Pendant
	TS_OVERLAPPING: 'TS_OVERLAPPING',	// Entre deux horaires
	TS_AFTER: 'TS_AFTER',							// Après
	TS_ANOTHERDAY: 'TS_ANOTHERDAY'		// Un autre jour
};

function analyseSchedule(daystart, scheduleDatas, hour) {
	// scheduleData "420-510;690-810"
	let timeStatus;
	let text = '';
	for (i = 0; i < scheduleDatas.length; i++) {
		scheduleData = scheduleDatas[i];
		let timestart = (i == 0) ? hour * 60 : 0;
		let timeend = timestart + 59;
		let start = 0;
		let addText = false;
		let lastSchedule = false;
		let textAllDay = '';
		let btnradiodayId = 'btnradioday' + (daystart + i);
		let textDay = getLabelDate( $('label[for="' + btnradiodayId + '"]').text(), $('#' + btnradiodayId).attr('data-month-number'));
		while (start != -1) {
			let schedule = '';
			let sep = scheduleData.indexOf(';', start);
			if (sep == -1) {
				schedule = scheduleData.substring(start);
				start = -1;
				lastSchedule = true;
			}
			else {
				schedule = scheduleData.substring(start, sep);
				start = sep + 1;
			}
			if (schedule.length > 0) {
				let sep = schedule.indexOf('-');
				if (sep != -1) {
					let low = parseInt(schedule.substring(0, sep));
					let high = parseInt(schedule.substring(sep + 1));
					let timestartok = (timestart >= low && timestart < high);
					let timeendok = (timeend >= low && timeend <= high);
					if (!timeStatus) {
						if (timestart < low) {
							timeStatus = TimeStatus.TS_BEFORE;
							addText = true;
						}
						if (lastSchedule) {
							if (timestart > high) {
								timeStatus = TimeStatus.TS_AFTER;
								addText = true;
							}
						}
						if (i == 0) {
							if (timestartok && timeendok) {
								timeStatus = TimeStatus.TS_WITHIN;
								addText = true;
							}
							if ((timestartok && !timeendok) || (!timestartok && timeendok)) {
								timeStatus = TimeStatus.TS_OVERLAPPING;
								addText = true;
							}
						}
					}
					let lowhour = (Math.floor(low/60)).toLocaleString('fr-FR', {minimumIntegerDigits: 2});
					let lowminute = (low%60).toLocaleString('fr-FR', {minimumIntegerDigits: 2});
					let highhour = (Math.floor(high/60)).toLocaleString('fr-FR', {minimumIntegerDigits: 2});
					let highminute = (high%60).toLocaleString('fr-FR', {minimumIntegerDigits: 2});
					let textOnce = lowhour + ':' + lowminute + ' à ' + highhour + ':' + highminute;
					if (textAllDay.length > 0)
						textAllDay += '<br/>';
					textAllDay += textOnce;
					if (addText && lastSchedule) {
						if (text.length > 0)
							text += '<br/>';
						if (i > 0) {
							timeStatus = TimeStatus.TS_ANOTHERDAY;
							text += 'Prochaine ouverture : ';
						}
						text += textDay;
						if (text.length > 0)
							text += '<br/>';
						text += textAllDay;
					}
				}
			}
		}
	}
	return {
		timeStatus: timeStatus,
		text: text
	};
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
		let scheduleDatas = [];
		for (daytemp = Number(dayid); daytemp <= 10; daytemp++) {
			scheduleDatas.push( $(this).attr('data-schedule-data' + daytemp));
		}
		
		let piscine = findPiscine(piscineName);
		if (piscine) {
			piscine.link = piscineLink;
		}

		let scheduleInfo = analyseSchedule(Number(dayid), scheduleDatas, hour);
		
		let openLevel = -1;
		if (scheduleInfo.timeStatus == TimeStatus.TS_WITHIN)
			openLevel = 1;
		if (scheduleInfo.timeStatus == TimeStatus.TS_OVERLAPPING)
			openLevel = 2;
		if (scheduleInfo.timeStatus == TimeStatus.TS_BEFORE)
			openLevel = 0;
		if (scheduleInfo.timeStatus == TimeStatus.TS_AFTER)
			openLevel = 0;
		if (scheduleInfo.timeStatus == TimeStatus.TS_ANOTHERDAY)
			openLevel = 3;
		let scheduleText = scheduleInfo.text;
		let scheduleTextPopup = '';
		if (scheduleText.length > 0) {
			scheduleTextPopup += scheduleText;
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
			if (piscine != null) {
				addMarker(piscine, false, scheduleTextPopup, openLevel);
			}
		}
	});
	
	piscines.forEach( piscine => {
		if (!piscine.marker) {
			addMarker(piscine, true, 'Fermée');
		}
	});
}