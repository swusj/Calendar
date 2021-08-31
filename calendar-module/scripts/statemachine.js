import { showCalendar, showMonth, showYear, showHead } from "./display.js";

import { SHOWING_STATE, NUM_OF_NEAR_YEARS } from "./config.js";
import {
	getPrevMonth,
	getNextMonth,
	getPrevYear,
	getNextYear,
	getPrevTenYear,
	getNextTenYear,
	getDayNum,
	getDayOfOne,
	getTimestamp,
} from "./utils.js";

// 为啥这个参数content_head，始终减不了，content_head是因为基本每个操作完了都要更新下head，除非不传head，直接在函数里边取
// 为啥stateMachine减不了，因为所有要更新x历的操作完了都要绑定事件处理函数，事件处理函数又需要stateMachine这个参数
// 。。。但这样传真的好烦。。。绑定事件处理函数写在stateMachine里每次更新再写下绑事件的函数调用  or 原来的

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
	reverseTransition(e, showDate, todayDate, content, content_head, stateMachine) {
		switch (this.currentState) {
			case SHOWING_STATE.DAY:
				const yearRegexp = /(\d*)年/;
				const monthRegexp = /年(\d*)月/;
				const clickYear = yearRegexp.exec(content_head.childNodes[0].nodeValue)[1];
				const clickMonth = monthRegexp.exec(content_head.childNodes[0].nodeValue)[1] - 1;
				const date = e.target.childNodes[0].nodeValue;
				const timestamp = getTimestamp(clickYear, clickMonth, date);
				console.log(timestamp);
				// 点击显示时间戳
				break;
			case SHOWING_STATE.MONTH:
				const month = e.target.childNodes[0].nodeValue.slice(0, -1);
				showDate.month = month - 1;
				console.log(showDate.month);
				console.log(todayDate.month);
				showDate.dayNum = getDayNum(showDate.year, showDate.month);
				showDate.dayOfOne = getDayOfOne(showDate.year, showDate.month);
				this.currentState = SHOWING_STATE.DAY;
				showCalendar(showDate, todayDate, content, content_head, stateMachine);
				break;
			case SHOWING_STATE.YEAR:
				const year = e.target.childNodes[0].nodeValue;
				showDate.year = Number(year);
				showDate.dayNum = getDayNum(showDate.year, showDate.month);
				showDate.dayOfOne = getDayOfOne(showDate.year, showDate.month);
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
