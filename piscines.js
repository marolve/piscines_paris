
$(document).ready(function(){
	
	$('.btnradioday').click(function(){
		updateList();
	});
	
	$('.btnradiohour').click(function(){
		updateList();
	});

	update();
	
});

$(window).focus(function() {
	
	update();
	
});

function update() {
	const currentDayNumber = new Date().getDate();
	$('.btnradiodaynumber'+currentDayNumber).click();
	
	const currentHour = new Date().getHours();
	let hourText = '';
	if (currentHour < 10)
		hourText = '0';
	hourText += currentHour;
	$('#btnradiohour'+hourText).click();

}


function updateList() {
	
	let dayid = '';
	let dayclicked = $('input[name=btnradioday]:checked');
	if (!dayclicked.length) return;
	let dayidclicked = dayclicked.attr('id');
	if (dayidclicked.indexOf('btnradioday') == 0) {
		dayid = dayidclicked.substring(11, 12);
	}
	
	let hourid = '';
	let hourclicked = $('input[name=btnradiohour]:checked');
	if (!hourclicked.length) return;
	let houridclicked = hourclicked.attr('id');
	if (houridclicked.indexOf('btnradiohour') == 0) {
		hourid = houridclicked.substring(12, 14);
	}
	
	if (dayid.length == 0 || hourid.length == 0) return;

	let hour = parseInt(hourid);
	
	$('tbody tr').each(function() {
		
		let scheduleData = $(this).attr('data-schedule-data' + dayid);
		let scheduleText = '';
		
		// schedule datas "420-510;690-810"
		let timestart = hour * 60;
		let timeend = timestart + 59;
		let start = 0;
		let scheduleOK = 0;
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
				let sep = schedule.indexOf('-');
				if (sep != -1) {
					let low = parseInt(schedule.substring(0, sep));
					let high = parseInt(schedule.substring(sep + 1));
					let timestartok = (timestart >= low && timestart < high);
					let timeendok = (timeend >= low && timeend <= high);
					let addText = false;
					if (timestartok && timeendok) {
						scheduleOK = 1;
						addText = true;
					}
					if (scheduleOK == 0) {
						if ((timestartok && !timeendok) || (!timestartok && timeendok)) {
							scheduleOK = 2;
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
		if (scheduleOK == 2)
			$(this).css('font-style', 'italic');
		if (scheduleOK == 1) {
			$(this).css('font-style', 'normal');
			$(this).addClass('table-info');
		}
		if (scheduleOK == 0) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
}