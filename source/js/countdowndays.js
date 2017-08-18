// CountdownWeekDays
// * Countdown to week days on consistant base.

const titles = {
	days: "Days",
	hours: "Hours",
	mins: "Mins",
	secs: "Secs",
	timerSelector: "timer",
	daysSelector: "days",
	hoursSelector: "hours",
	minsSelector: "mins",
	secsSelector: "secs"

};

const weekDays = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		]

class CountdownWeekDays {
	constructor(selector, days = [], options = {}) {
		this.selector = selector;
		this.options = {
			days: options.days || titles.days,
			hours: options.hours || titles.hours,
			mins: options.mins || titles.mins,
			secs: options.secs || titles.secs,
			template: options.template,
			timerSelector: options.timerSelector || titles.timerSelector,
			daysSelector: options.daysSelector || titles.daysSelector,
			hoursSelector: options.hoursSelector || titles.hoursSelector,
			minsSelector: options.minsSelector || titles.minsSelector,
			secsSelector: options.secsSelector || titles.secsSelector,
			weekDays: options.weekDays || weekDays
		}
		this.dates = this.formatDays(days);
		this._nextDay = this.nextDay();
		this.render();
		this.countdown();
		console.log(this);
	}

	// Sort array
	// -------------------------------------
	formatDays(arr) {
		this.formatTime(arr);
		this.formatDate(arr);
		return arr;
	}

	// Format date
	// --------------------------------------
	formatDate(arr) {
		arr.map((x) => {
			if(!isNaN(x.day)) {
				x.day = parseInt(x.day);
			} else {
				let index = this.options.weekDays.indexOf(x.day);
				x.day = index !== -1 ? index : console.log('%c Wrong day name or number! Please use '+ this.options.weekDays, 'color: red');
			}
		});
		arr.sort((x, y) => {
			let day = x.day - y.day;
			let hours = x.hours - y.hours;
			let mins = x.mins - y.mins;
			if (day !== 0 ){
				return day;
			} else if (hours !== 0 ) {
				return hours;
			}
			return x.mins - y.mins;
		});
		return arr;
	}

	// Splite time into hours, 
	// mins and secs
	// ----------------------------------------
	formatTime(arr){
		arr.map((x) => {
			let splitTime  = x.time.split(":");
			for(let i in splitTime) {
				splitTime[i] = parseInt(splitTime[i]);
			}
			x.hours = splitTime[0];
			x.mins = splitTime[1];
			if(splitTime.length < 3) {
				x.secs = 0;
			} else {
				x.secs = splitTime[2];
			}
		});
		return arr;
	}

	// Run next day
	// ----------------------------
	nextDay(){
		let now = new Date(),
			today = now.getDay(),
			hours = now.getHours(),
			mins = now.getMinutes(),
			secs = now.getSeconds(),
			follow = [],
			nextDate,
			diff;
		
		this.dates.map((x)=> {
			if (x.day > today) {
				follow.push(x);
			} else if (x.day == today ){
				if(hours <= x.hours && mins < x.mins) {
					follow.push(x);
				}
			}
		});

		if (follow.length) {
			nextDate = follow[0];
		} else {
			nextDate = this.dates[0];
		}

		if (nextDate.day > today)
			diff = nextDate.day - today
		else if (nextDate.day === today)
			if (hours < nextDate.hours || hours === nextDate.hours && mins < nextDate.mins)
				diff = 0
			else
				diff = 7 + nextDate.day - today;
		else
			diff = 7 + nextDate.day - today;
		

		return this.getNextDate(diff, nextDate.time);
	}

	// Get next date
	// -------------------------------
	getNextDate(diff, time){
		let date = new Date();
		date.setDate(date.getDate() + diff);
		date = (`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${time}`);
		return new Date(date).getTime();
	}

	get days(){
		return Math.floor(this.distance / (1000 * 60 * 60 * 24));
	}
	get hours(){
		return Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		
	}
	get mins(){
		return Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60)); 
	}
	get secs(){
		return Math.floor((this.distance % (1000 * 60)) / 1000);
	}

	// Render remplate
	// -----------------------------------
	render(){
		if (this.options.template == undefined) {
			this.selector.innerHTML = `
				<div class="${this.options.timerSelector}">
					<div>
						<span class="${this.options.daysSelector}">${this.days}</span>
						<div>${this.options.days}</div>
					</div>
					<div>
						<span class="${this.options.hoursSelector}">${this.hours}</span>
						<div>${this.options.hours}</div>
					</div>
					<div>
						<span class="${this.options.minsSelector}">${this.mins}</span>
						<div>${this.options.mins}</div>
					</div>
					<div>
						<span class="${this.options.secsSelector}">${this.secs}</span>
						<div>${this.options.secs}</div>
					</div>
				</div>
			`
		}
	}

	// Countdown animation
	// ---------------------------------------
	countdown() {
		let timestamp = new Date().getTime();
		let animation = setTimeout(() => {
			requestAnimationFrame(this.countdown.bind(this));
		}, 1000);
		this.distance = this._nextDay - timestamp;
		if(this.distance > 1 ) {
			this.update();
			animation;
		} else {
			this._nextDay = this.nextDay();
			animation;
		}
	}

	// Update timer
	// --------------------------------------
	update(){
		let days = this.selector.querySelector(`.${this.options.daysSelector}`);
		let hours = this.selector.querySelector(`.${this.options.hoursSelector}`);
		let mins = this.selector.querySelector(`.${this.options.minsSelector}`);
		let secs = this.selector.querySelector(`.${this.options.secsSelector}`);
		
		days.innerHTML = this.days;
		hours.innerHTML = this.hours > 9 ? this.hours : `0${this.hours}`;
		mins.innerHTML = this.mins > 9 ? this.mins : `0${this.mins}`;
		secs.innerHTML = this.secs > 9 ? this.secs : `0${this.secs}`;

		if(this.days == 0) {
			days.classList.add('last');
		}
		if(this.days == 0 && this.hours < 5) {
			hours.classList.add('last');
			mins.classList.add('last');
			secs.classList.add('last');
		}
	}
}

// USAGE
// ----------------------

// var new CountdownWeekDays(
// 			document.getElementById('timer'), 
// 			[
// 				{date: 2, time: "10:20"}
//			], 
//			{
// 				days: "Days",
// 				hours: "Hours",
// 				mins: "Mins",
// 				secs: "Secs",
// 				template: false,
// 				timerSelector: "timer",
// 				daysSelector: "days,
// 				hoursSelector: "hours,
// 				minsSelector: "mins",
// 				secsSelector: "secs"
//			}
// 
// });