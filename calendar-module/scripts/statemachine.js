import { showCalendar, showMonth, showYear, showHead } from "./display.js";

import { SHOWING_STATE, NUM_OF_NEAR_YEARS } from "./config.js";
import { getPrevMonth, getNextMonth, getPrevYear, getNextYear, getPrevTenYear, getNextTenYear } from "./utils.js";
class CalendarstateMachine {
	constructor() {
		this.currentState = SHOWING_STATE.DAY;
	}
	forwordTransition(showDate, todayDate, content, content_head, stateMachine) {
		switch (this.currentState) {
			case SHOWING_STATE.DAY:
				this.currentState = SHOWING_STATE.MONTH;
				showMonth(showDate, todayDate, content, content_head, stateMachine);
				break;
			case SHOWING_STATE.MONTH:
				this.currentState = SHOWING_STATE.YEAR;
				showYear(showDate, todayDate, content, content_head, stateMachine);
				break;
			case SHOWING_STATE.YEAR:
				return;
		}
		this.updateHead(showDate, content_head);
	}
	reverseTransition(showDate, todayDate, content, content_head, stateMachine) {
		switch (this.currentState) {
			case SHOWING_STATE.DAY:
				break;
			case SHOWING_STATE.MONTH:
				this.currentState = SHOWING_STATE.DAY;
				showCalendar(showDate, todayDate, content, content_head, stateMachine);
				break;
			case SHOWING_STATE.YEAR:
				this.currentState = SHOWING_STATE.MONTH;
				showMonth(showDate, todayDate, content, content_head, stateMachine);
				break;
		}
		this.updateHead(showDate, content_head);
	}
	updateHead(showDate, content_head) {
		let headStr = "";
		switch (this.currentState) {
			case SHOWING_STATE.DAY:
				headStr = `${showDate.year}年${showDate.month + 1}月`;
				break;
			case SHOWING_STATE.MONTH:
				headStr = `${showDate.year}年`;
				break;
			case SHOWING_STATE.YEAR:
				headStr = `${showDate.year - (showDate.year % NUM_OF_NEAR_YEARS)}-${
					showDate.year - (showDate.year % NUM_OF_NEAR_YEARS) + NUM_OF_NEAR_YEARS - 1
				}`;
				break;
		}
		showHead(headStr, content_head);
	}
	init(showDate, todayDate, content, content_head, stateMachine) {
		showDate = Object.assign(showDate, todayDate);
		this.currentState = SHOWING_STATE.DAY;
		showCalendar(showDate, todayDate, content, content_head, stateMachine);
		this.updateHead(showDate, content_head);
	}
	prev(showDate, todayDate, content, content_head, container, stateMachine, time) {
		let carousel = container.querySelector(".J_carousel");
		carousel.classList.add("trans");
		carousel.style.top = `0px`; //移动top
		let trans = null;
		switch (this.currentState) {
			case SHOWING_STATE.DAY:
				trans = function () {
					showDate = Object.assign(showDate, getPrevMonth(showDate.year, showDate.month));
					showCalendar(showDate, todayDate, content, content_head, stateMachine);
					this.updateHead(showDate, content_head);
				};
				break;
			case SHOWING_STATE.MONTH:
				trans = function () {
					showDate = Object.assign(showDate, getPrevYear(showDate.year, showDate.month));
					showMonth(showDate, todayDate, content, content_head, stateMachine);
					this.updateHead(showDate, content_head);
				};
				break;
			case SHOWING_STATE.YEAR:
				trans = function () {
					showDate = Object.assign(showDate, getPrevTenYear(showDate.year, showDate.month));
					showYear(showDate, todayDate, content, content_head, stateMachine);
					this.updateHead(showDate, content_head);
				};
				break;
		}
		var that = this;
		setTimeout(function () {
			carousel.classList.remove("trans");
			trans.call(that, showDate, todayDate, content, content_head, stateMachine);
		}, time * 1000);
	}
	next(showDate, todayDate, content, content_head, container, stateMachine, time) {
		let carousel = container.querySelector(".J_carousel");
		const table_height = window.getComputedStyle(carousel.querySelector(".J_showing_table")).height; // 获取最终元素的style，是只读的，而style是只写的
		carousel.classList.add("trans");
		carousel.style.top = `${-2 * table_height.slice(0, -2)}px`; //移动top
		let trans = null;
		switch (this.currentState) {
			case SHOWING_STATE.DAY:
				trans = function () {
					showDate = Object.assign(showDate, getNextMonth(showDate.year, showDate.month));
					showCalendar(showDate, todayDate, content, content_head, stateMachine);
					this.updateHead(showDate, content_head);
				};
				break;
			case SHOWING_STATE.MONTH:
				trans = function () {
					showDate = Object.assign(showDate, getNextYear(showDate.year, showDate.month));
					showMonth(showDate, todayDate, content, content_head, stateMachine);
					this.updateHead(showDate, content_head);
				};
				break;
			case SHOWING_STATE.YEAR:
				trans = function () {
					showDate = Object.assign(showDate, getNextTenYear(showDate.year, showDate.month));
					showYear(showDate, todayDate, content, content_head, stateMachine);
					this.updateHead(showDate, content_head);
				};
				break;
		}
		var that = this;
		setTimeout(function () {
			carousel.classList.remove("trans");
			trans.call(that, showDate, todayDate, content, content_head, stateMachine);
		}, time * 1000);
	}
}

export { CalendarstateMachine };
