const https = require('https');
const cheerio = require('cheerio');
const http = require('http');
const fs = require('fs');
const path = require('path');

// load html from paris.fr
function callParisfr(callback) {
	https.get('https://www.paris.fr/lieux/piscines/tous-les-horaires', (resp) => {
		let data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			callback(null, data);
		});

	}).on("error", (err) => {
		console.log("Error: " + err.message);
		callback(err);
	});
}

// parse data from html
// return array
// {
//    name: 'Piscine Henry de Montherlant',
//    arrondissement: '16ᵉ',
//    link: 'https://www.paris.fr/lieux/piscine-henry-de-montherlant-2939',
//    schedules: [
//      [ {starthour: 10, startminute: 30, endhour: 12, endminute : 00 },
//	      {starthour: 16, startminute: 30, endhour: 18, endminute : 30 }
//      ],
//      [ {starthour: 8, startminute: 00, endhour: 18, endminute : 00 }
//      ],
//      [
//      ],
//      ...
//    ]
//  }
function analyzeParisfr(html) {
	
	const $ = cheerio.load(html);
	
	let table = $('.equipments-timetables-desktop');
	
	let tableheaders = $(table).find('thead th');

	// extract header dates
	var dates = [];
	let yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	tableheaders.each((i, tableheader) => {
		if (i > 0) {
			let text = $(tableheader).html();			// example:"   mer. 06/12  "
			let pos = text.indexOf('/');
			if (pos != -1 && pos > 1 && text.length > (pos + 2)) {
				let day = parseInt(text.substring(pos - 2, pos), 10);
				let month = parseInt(text.substring(pos + 1, pos + 3), 10);
				if (day > 0 && day < 32 && month > 0 && month < 13) {
					let date = new Date(yesterday.getFullYear(), month - 1, day);
					if (date < yesterday) { // in case of a new year
						date = new Date(yesterday.getFullYear() + 1, month - 1, day);
					}
					dates.push(date);
				} else {
					console.log('Error :Invalid header date while parsing html : ' + text);
					return null;
				}
			} else {
				console.log('Error :Invalid header while parsing html : ' + text);
				return null;
			}
		}
	});

	// extract piscine and schedules
	var piscines = [];
	let tableitems = $(table).find('tbody .paris-table-tr');
	
	tableitems.each((i, tableitem) => {
		let piscine = { 
			name: $(tableitem).attr('data-name').trim(),
			arrondissement: '',
			link: '',
			schedules: []
		};
		piscines.push(piscine);
		let divs = $(tableitem).find('div');
		divs.each((j, div) => {
			let schedules = [];
			let text = $(div).html();
			if (j == 0) {
				// arrondissement and link
				let pos = text.indexOf('ᵉ');
				if (pos != -1 && pos > 1) {
					piscine.arrondissement = text.substring(pos - 2, pos + 1);
				} else if (text.indexOf('Paris centre') != -1) {
					piscine.arrondissement = 'Paris centre';
				}
				let posstart = text.indexOf('href="');
				let posend = text.indexOf('">');
				if (posstart != -1 && posend != -1 && posstart < posend) {
					piscine.link = 'https://www.paris.fr' + text.substring(posstart + 6, posend);
				}
			} else {
				// schedules - example: "Période scolaire 07:00 à 08:30 11:30 à 13:30 16:30 à 18:00"
				let pos = text.indexOf('à');
				while (pos != -1 && pos > 4 && pos < text.length - 4) {
					let posbefore = text.indexOf(':', pos - 5);
					let posafter = text.indexOf(':', pos);
					if (posbefore != -1 && posbefore > 1 && posafter != -1 && posafter < text.length - 2) {
						let hourstart = text.substring(posbefore - 2, posbefore);
						let minutestart = text.substring(posbefore + 1, posbefore + 3);
						let hourend = text.substring(posafter - 2, posafter);
						let minuteend = text.substring(posafter + 1, posafter + 3);
						schedules.push({ 
							starthour: parseInt(hourstart),
							startminute: parseInt(minutestart),
							endhour: parseInt(hourend),
							endminute: parseInt(minuteend),
							start: hourstart + ':' + minutestart,
							end: hourend + ':' + minuteend
						});
					}
					pos = text.indexOf('à', pos + 1);
				}
				piscine.schedules.push(schedules);
			}
		});
	});
	
	return {
		dates: dates,
		piscines: piscines
	};
}

// Load Html File
function loadHtml(callback) {
	fs.readFile('piscines.html', (err, data) => {
		if (!err) {
			callback(null, data.toString());
		} else {
			callback(err);
		}
	});
}

// Fill Html with piscines Data
function fillHtml(html, data) {
	
	html = html.replace('%datecreated%', new Date().toISOString());
	
	if (data.dates.length < 6) return '';
	let day = '\n			<input type="radio" class="btn-check btnradioday btnradiodaynumber%daynumber%" name="btnradioday" id="btnradioday%i%" autocomplete="off" data-day-number="%daynumber%">';
	day += '\n			<label class="btn btn-outline-primary" for="btnradioday%i%">%label%</label>';
	let days = '';
	for (let i = 0; i < 10; i++) {
		let dayName = data.dates[i].toLocaleDateString('fr-FR', {weekday: 'short'});
		let dayNumber = data.dates[i].getDate();
		days += day.replace(/%i%/g, '' + (i + 1)).replace('%label%', dayName + ' ' + dayNumber).replace(/%daynumber%/g, '' + dayNumber);
	}
	html = html.replace('%days%', days);
	
	let hour = '\n			<input type="radio" class="btn-check btnradiohour" name="btnradiohour" id="btnradiohour%i2%" autocomplete="off">';
	hour += '\n			<label class="btn btn-outline-primary" for="btnradiohour%i2%">%i%h</label>';
	let hours = '';
	for (let i = 6; i < 24; i++) {
		let i2 = '' + i;
		if (i2.length < 2)
			i2 = '0' + i;
		hours += hour.replace(/%i2%/g, i2).replace('%i%', '' + i);
	}
	html = html.replace('%hours%', hours);
	
	let piscineRows = '';
	// schedule labels : 'data-schedule-text1="07:00 à 08:30<br/>11:30 à 13:30" 
	// schedule datas : data-schedule-data1="420-510;690-810"
	let row = '\n					<tr data-name="%name%" data-link="%link%" %schedulelabels% %scheduledatas%> <td>%arr%</td> <td><a href="%link%">%name%</a></td> <td class="schedulecell"></td> </tr>';
	for (const piscine of data.piscines) {
		if (piscine.schedules.length > 7) {
			let scheduleLabels = '';
			let scheduleDatas = '';
			for (let i = 0; i < 10; i++) {
				let scheduleLabel = '';
				let scheduleData = '';
				for (const schedule of piscine.schedules[i]) {
					if (scheduleLabel.length > 0)
						scheduleLabel += '<br/>';
					scheduleLabel += schedule.start +  ' à ' + schedule.end;
					if (scheduleData.length > 0)
						scheduleData += ';';
					scheduleData += '' + (schedule.starthour*60 + schedule.startminute) + '-' + (schedule.endhour*60 + schedule.endminute);
				}
				scheduleLabels += ' data-schedule-text' + (i + 1) + '="' + scheduleLabel + '"';
				scheduleDatas += ' data-schedule-data' + (i + 1) + '="' + scheduleData + '"';
			}
			piscineRows += row.replace('%arr%', piscine.arrondissement).replace(/%name%/g, piscine.name).replace(/%link%/g, piscine.link).replace('%schedulelabels%', scheduleLabels).replace('%scheduledatas%', scheduleDatas);
		}
	};
	html = html.replace('%rows%', piscineRows);
	
	return html;
}

// main
var server = http.createServer((req, res) => {
	if (req.url == '/') {
			
		res.writeHead(200, { 'Content-Type': 'text/html' }); 

		callParisfr((err, parisHtml) => {
			if (!err) {
				let data = analyzeParisfr(parisHtml);

				loadHtml((err, html) => {
					if (!err) {
						res.write(fillHtml(html, data));
						res.end();
					} else {
						res.end(err.message);
					}
				});
			}
			else {
				res.end(err.message);
			}
		});
	}
	else {
		let filePath = '.' + req.url;
		var extname = path.extname(filePath);
		var contentType = 'text/html';
		switch (extname) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
			case '.json':
				contentType = 'application/json';
				break;
		}

		fs.readFile(filePath, function(error, content) {
			if (error) {
				res.end('Invalid request');
			}
			else {
				res.writeHead(200, { 'Content-Type': contentType });
				res.end(content, 'utf-8');
			}
		});
	}
});


server.listen(5000);

console.log('listening at port 5000...');