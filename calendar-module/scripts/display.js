import {
	WEEK,
	NUMOF_CANLENDER_ITEM,
	NUMOF_CANLENDER_ROW_ITEM,
	NUMOF_MONTH_YEAR_ROW_ITEM,
	NUMOF_MONTH_YEAR_ITEM,
	NUM_OF_NEAR_YEARS,
	MONTH_NUM_OF_YEAR,
	NUMOF_TABLE,
	SHOWING_STATE,
	ITEM_STATE,
} from "./config.js";

import { getDayNum, getDayOfOne, getPrevMonth, getNextMonth, getPrevYear, getNextYear } from "./utils.js";

import { createClockStr } from "./time.js";

// 渲染时钟的函数
function renderClock(container) {
	let clock = container.querySelector(".clock");
	clock.innerHTML = createClockStr();
}

// 让时钟动起来
function showClock(container) {
	window.setInterval(function () {
		renderClock(container);
	}, 1000);
}

// 显示今天日期的函数
function showToday(todayDate, node) {
	let today = `${todayDate.year}年${todayDate.month + 1}月${todayDate.date}日`;
	node.innerHTML = today;
}

// 显示x历头
function showHead(showDate, node, stateMachine) {
	let str = "";
	if (stateMachine.currentState === SHOWING_STATE.DAY) {
		str = `${showDate.year}年${showDate.month + 1}月`;
	} else if (stateMachine.currentState === SHOWING_STATE.MONTH) {
		str = `${showDate.year}年`;
	} else if (stateMachine.currentState === SHOWING_STATE.YEAR) {
		str = `${showDate.year - (showDate.year % NUM_OF_NEAR_YEARS)}-${
			showDate.year - (showDate.year % NUM_OF_NEAR_YEARS) + NUM_OF_NEAR_YEARS - 1
		}`;
	}
	node.innerHTML = str;
}

// 求一个月的日历数据
function createCalendarData(showDate, todayDate) {
	let calData = [];
	let LastMonth = getPrevMonth(showDate.year, showDate.month);
	let j = 1,
		k = 1;

	for (let i = 0; i < NUMOF_CANLENDER_ITEM; i++) {
		if (i < showDate.dayOfOne) {
			//上个月的
			calData.push({
				date: LastMonth.dayNum - showDate.dayOfOne + i + 1,
				state: ITEM_STATE.NEARLY,
			});
		} else if (i >= showDate.dayOfOne && i < showDate.dayOfOne + showDate.dayNum) {
			//中间的
			if (showDate.year === todayDate.year && showDate.month === todayDate.month && j === todayDate.date) {
				//当天
				calData.push({
					date: j,
					state: ITEM_STATE.CURRENT,
				});
			} else {
				calData.push({
					date: j,
					state: ITEM_STATE.MIDDLE,
				});
			}
			j++;
		} else {
			//下个月的
			calData.push({
				date: k,
				state: ITEM_STATE.NEARLY,
			});
			k++;
		}
	}
	return calData;
}

// 创建一个月的日历骨架
function createCalendarDOM(calData) {
	let table = document.createElement("table");
	table.classList.add("calender-content");
	let str = "";
	for (let i = 0; i < NUMOF_CANLENDER_ITEM; i++) {
		if (i % NUMOF_CANLENDER_ROW_ITEM === 0) {
			str += "<tr>";
		}
		str += `<td>${calData[i].date}</td>`;
		if (i % NUMOF_CANLENDER_ROW_ITEM === NUMOF_CANLENDER_ROW_ITEM - 1) {
			str += "</tr>";
		}
	}
	table.innerHTML = str;
	return table;
}

// 生成日历表头
function createCalHead() {
	let week = document.createElement("div");
	week.classList.add("week");
	for (let k = 0; k < NUMOF_CANLENDER_ROW_ITEM; k++) {
		let item = document.createElement("div");
		item.classList.add("item");
		item.innerHTML = WEEK[k];
		week.appendChild(item);
	}
	return week;
}

// 创建轮播图日历骨架
function createCaroCalDOM(calData_last, calData_now, calData_next) {
	// 生成三个表
	const table_last = createCalendarDOM(calData_last);
	const table_now = createCalendarDOM(calData_now);
	const table_next = createCalendarDOM(calData_next);

	// 轮播图容器
	const carousel_container = document.createElement("div");
	carousel_container.setAttribute("class", "carousel-container");

	// 轮播图
	const calender_carousel = document.createElement("div");
	calender_carousel.setAttribute("class", "calender-carousel");
	calender_carousel.appendChild(table_last);
	calender_carousel.appendChild(table_now);
	calender_carousel.appendChild(table_next);

	carousel_container.appendChild(calender_carousel);

	return carousel_container;
}

// 将日历骨架加入到页面
function createCalendar(calData_last, calData_now, calData_next, container) {
	const week = createCalHead();
	const CaroCalDOM = createCaroCalDOM(calData_last, calData_now, calData_next);
	container.innerHTML = "";
	container.appendChild(week);
	container.appendChild(CaroCalDOM);
}

// css根据数据渲染轮播图日历

function renderCalender(container, calData) {
	const table = container.getElementsByTagName("table")[1];
	let calendarList = table.getElementsByTagName("td");
	for (let i = 0; i < NUMOF_CANLENDER_ITEM; i++) {
		if (calData[i].state === ITEM_STATE.NEARLY) {
			calendarList[i].classList.add("not-now");
		} else if (calData[i].state === ITEM_STATE.CURRENT) {
			calendarList[i].classList.add("curdate-item");
			let str = `<div class="curdate">${calData[i].date}</div>`;
			calendarList[i].classList.innerHTML = str;
		}
	}
}

// 显示日历
function showCalendar(showDate, todayDate, container, content_head, stateMachine) {
	// 调用函数，获取三个月数据
	const calData_prev = createCalendarData(getPrevMonth(showDate.year, showDate.month), todayDate);
	const calData_now = createCalendarData(showDate, todayDate);
	const calData_next = createCalendarData(getNextMonth(showDate.year, showDate.month), todayDate);
	// 根据数据创建日历并将其加到页面
	createCalendar(calData_prev, calData_now, calData_next, container);
	// 根据数据渲染日历
	renderCalender(container, calData_now);
	// 显示日历头
	showHead(showDate, content_head, stateMachine);
}

// ============================月历=================================

// 显示月历骨架
function createMonth(content) {
	// 生成一个表格
	let str = "<table>";
	for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM; i++) {
		if (i % NUMOF_MONTH_YEAR_ROW_ITEM === 0) {
			str += "<tr>";
		}
		str += `<td>${(i % MONTH_NUM_OF_YEAR) + 1}月</td>`;
		if (i % NUMOF_MONTH_YEAR_ROW_ITEM === NUMOF_MONTH_YEAR_ROW_ITEM - 1) {
			str += "</tr>";
		}
	}
	str += "</table>";

	// 生成轮播图
	const month_carousel = document.createElement("div");
	month_carousel.classList.add("month_carousel");
	month_carousel.innerHTML = str + str + str;

	content.innerHTML = "";
	content.appendChild(month_carousel);
}

// 更改月历显示效果,绑定事件处理函数
function changeMonthCss(showDate, todayDate, content, content_head, stateMachine) {
	const tableList = content.getElementsByTagName("table");
	for (let i = 0; i < NUMOF_TABLE; i++) {
		tableList[i].classList.add("month-content");
	}
	const monthList = tableList[1].getElementsByTagName("td");
	for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM; i++) {
		monthList[i].addEventListener("click", function () {
			handleMonthClick.call(monthList[i], showDate, todayDate, content, content_head, stateMachine);
		});
		if (i >= MONTH_NUM_OF_YEAR) {
			monthList[i].classList.add("not-now");
		}
	}
	if (showDate.year === todayDate.year && showDate.month === todayDate.month) {
		monthList[showDate.month].classList.add("curmonth-item");
	}
}

// 获取月份数据
function createMonthData(showDate, todayDate) {
	let monthData = [];
	for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM; i++) {
		// 如果当年
		if (i < MONTH_NUM_OF_YEAR - 1) {
			// 如果当月
			if (showDate.year === todayDate.year && showDate.month === todayDate.month) {
				monthData.push({ date: i + 1, state: ITEM_STATE.CURRENT });
			}
			monthData.push({ date: i + 1, state: ITEM_STATE.MIDDLE });
		} else {
			monthData.push({ date: (i % MONTH_NUM_OF_YEAR) + 1, state: ITEM_STATE.NEARLY });
		}
	}
	debugger;
}

// 显示月历的函数
function showMonth(showDate, todayDate) {
	// 获取月份数据
	const monthData_prev = createMonthData(getPrevYear(showDate), todayDate);
	const monthData_now = createMonthData(showDate, todayDate);
	const monthData_next = createMonthData(getNextYear(showDate), todayDate);
	// 根据数据创建月历并将其加到页面
	createMonthDOM();
	// 根据数据渲染月历
	// 显示月历头
}
// function showMonth(showDate, todayDate, content, content_head, stateMachine) {
// 	createMonth(content);
// 	changeMonthCss(showDate, todayDate, content, content_head, stateMachine);
// 	showHead(showDate, content_head, stateMachine);
// }

// 显示年历骨架
function createYear(showDate, content) {
	// 生成表格骨架
	let index = [3, 0, 1, 2];
	let leftYear = showDate.year - (showDate.year % NUM_OF_NEAR_YEARS);
	let leftYearIndex = index[leftYear % NUMOF_MONTH_YEAR_ROW_ITEM];
	let str = "";
	const firstYear = leftYear - leftYearIndex - NUMOF_MONTH_YEAR_ITEM;
	for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM * NUMOF_TABLE; i++) {
		if (i % NUMOF_MONTH_YEAR_ITEM === 0) {
			str += "<table>";
		}
		if (i % NUMOF_MONTH_YEAR_ROW_ITEM === 0) {
			str += "<tr>";
		}
		str += `<td>${firstYear + i}</td>`;
		if (i % NUMOF_MONTH_YEAR_ROW_ITEM === NUMOF_MONTH_YEAR_ROW_ITEM - 1) {
			str += "</tr>";
		}
		if (i % NUMOF_MONTH_YEAR_ITEM === NUMOF_MONTH_YEAR_ITEM - 1) {
			str += "</table>";
		}
	}

	// 生成轮播图
	const month_carousel = document.createElement("div");
	month_carousel.classList.add("month_carousel");
	month_carousel.innerHTML = str;

	content.innerHTML = "";
	content.appendChild(month_carousel);

	return leftYearIndex;
}

// 更改年历显示效果，绑定事件处理函数
function changeYearCss(leftYearIndex, showDate, todayDate, content, content_head, stateMachine) {
	const tableList = content.getElementsByTagName("table");
	for (let i = 0; i < NUMOF_TABLE; i++) {
		tableList[i].classList.add("month-content");
	}
	const YearList = tableList[1].getElementsByTagName("td");
	for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM; i++) {
		YearList[i].addEventListener("click", function () {
			handleYearClick.call(YearList[i], showDate, todayDate, content, content_head, stateMachine);
		});
		if (i < leftYearIndex || i >= leftYearIndex + NUM_OF_NEAR_YEARS) {
			YearList[i].classList.add("not-now");
		}
	}
	if (showDate.year === todayDate.year) {
		YearList[leftYearIndex + (todayDate.year % NUM_OF_NEAR_YEARS)].classList.add("curmonth-item");
	}
}

// 显示年历
function showYear(showDate, todayDate, content, content_head, stateMachine) {
	const leftYearIndex = createYear(showDate, content);
	changeYearCss(leftYearIndex, showDate, todayDate, content, content_head, stateMachine);
	showHead(showDate, content_head, stateMachine);
}

// 处理点击月份
function handleMonthClick(showDate, todayDate, content, content_head, stateMachine) {
	const month = this.childNodes[0].nodeValue.slice(0, -1);
	showDate.month = month - 1;
	showDate.dayNum = getDayNum(showDate.year, showDate.month);
	showDate.dayOfOne = getDayOfOne(showDate.year, showDate.month);
	stateMachine.toDayCalendar(showDate, todayDate, content, content_head, stateMachine);
}

// 处理点击年份
function handleYearClick(showDate, todayDate, content, content_head, stateMachine) {
	const year = this.childNodes[0].nodeValue;
	showDate.year = Number(year);
	showDate.dayNum = getDayNum(showDate.year, showDate.month);
	showDate.dayOfOne = getDayOfOne(showDate.year, showDate.month);
	stateMachine.toMonthCalendar(showDate, todayDate, content, content_head, stateMachine);
}

// 显示当月日历
function showNowMonth(showDate, todayDate, content, content_head, stateMachine) {
	showDate = Object.assign(showDate, todayDate);
	stateMachine.toDayCalendar(showDate, todayDate, content, content_head, stateMachine);
}

export {
	showToday,
	// changeCalendarCss,
	showHead,
	createCalendar,
	createMonth,
	createYear,
	showCalendar,
	handleMonthClick,
	changeMonthCss,
	handleYearClick,
	showMonth,
	showNowMonth,
	changeYearCss,
	showYear,
	showClock,
};
