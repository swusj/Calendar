import {
	WEEK,
	NUMOF_CANLENDER_ITEM,
	NUMOF_CANLENDER_ROW_ITEM,
	NUMOF_MONTH_YEAR_ROW_ITEM,
	NUMOF_MONTH_YEAR_ITEM,
	NUM_OF_NEAR_YEARS,
	MONTH_NUM_OF_YEAR,
	ITEM_STATE,
} from "./config.js";

import { getPrevMonth, getNextMonth, getPrevYear, getNextYear, getPrevTenYear, getNextTenYear } from "./utils.js";

import { createClockStr } from "./time.js";

// 渲染时钟的函数
function renderClock(container) {
	let clock = container.querySelector(".clock");
	clock.innerHTML = createClockStr();
}

// 让时钟动起来
function showClock(container) {
	const clock = window.setInterval(function () {
		renderClock(container);
	}, 1000);
	return clock;
}

// 显示今天日期的函数
function showToday(todayDate, node) {
	let today = `${todayDate.year}年${todayDate.month + 1}月${todayDate.date}日`;
	node.innerHTML = today;
}

// 显示x历头
function showHead(headStr, node) {
	node.innerHTML = headStr;
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
	table_now.classList.add("J_showing_table");
	const table_next = createCalendarDOM(calData_next);

	// 轮播图容器
	const carousel_container = document.createElement("div");
	carousel_container.classList.add("carousel-container");

	// 轮播图
	const calender_carousel = document.createElement("div");
	calender_carousel.classList.add("calender-carousel");
	calender_carousel.classList.add("J_carousel");
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
	for (let i = 0; i < calendarList.length; i++) {
		if (calData[i].state === ITEM_STATE.NEARLY) {
			calendarList[i].classList.add("not-now");
		} else if (calData[i].state === ITEM_STATE.CURRENT) {
			calendarList[i].classList.add("curdate-item");
			const curdate = document.createElement("div");
			curdate.classList.add("curdate");
			curdate.innerHTML = calData[i].date;
			//   let str = `<div class="curdate">${calData[i].date}</div>`;
			calendarList[i].innerHTML = "";
			calendarList[i].appendChild(curdate);
		}
	}
}

// 显示日历
function showCalendar(showDate, todayDate, container) {
	// 调用函数，获取三个月数据
	const calData_prev = createCalendarData(getPrevMonth(showDate.year, showDate.month), todayDate);
	const calData_now = createCalendarData(showDate, todayDate);
	const calData_next = createCalendarData(getNextMonth(showDate.year, showDate.month), todayDate);
	// 根据数据创建日历并将其加到页面
	createCalendar(calData_prev, calData_now, calData_next, container);
	// 根据数据渲染日历
	renderCalender(container, calData_now);
}

// ============================月历=================================
// 获取月份数据
function createMonthData(showDate, todayDate) {
	let monthData = [];
	for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM; i++) {
		// 如果当年
		if (i < MONTH_NUM_OF_YEAR) {
			// 如果当月
			if (showDate.year === todayDate.year && showDate.month === todayDate.month && i + 1 === showDate.month) {
				monthData.push({ date: `${i + 1}月`, state: ITEM_STATE.CURRENT });
			} else {
				monthData.push({ date: `${i + 1}月`, state: ITEM_STATE.MIDDLE });
			}
		} else {
			monthData.push({
				date: `${(i % MONTH_NUM_OF_YEAR) + 1}月`,
				state: ITEM_STATE.NEARLY,
			});
		}
	}
	return monthData;
}

// 创建一个月的月历html;
function createSingleMonthDom(monthData) {
	const monthDom = document.createElement("table");
	let str = "";
	for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM; i++) {
		if (i % NUMOF_MONTH_YEAR_ROW_ITEM === 0) {
			str += "<tr>";
		}
		str += `<td>${monthData[i].date}</td>`;
		if (i % NUMOF_MONTH_YEAR_ROW_ITEM === NUMOF_MONTH_YEAR_ROW_ITEM - 1) {
			str += "</tr>";
		}
	}
	monthDom.innerHTML = str;
	monthDom.classList.add("month-content");
	return monthDom;
}

// 根据数据创建月历并将其加到页面
function createMonthDOM(monthData_prev, monthData_now, monthData_next, container) {
	const prevMonthDom = createSingleMonthDom(monthData_prev);
	const nowMonthDom = createSingleMonthDom(monthData_now);
	nowMonthDom.classList.add("J_showing_table");
	const nextMonthDom = createSingleMonthDom(monthData_next);

	//   生成轮播图;
	const month_carousel = document.createElement("div");
	month_carousel.classList.add("month_carousel");
	month_carousel.classList.add("J_carousel");
	month_carousel.appendChild(prevMonthDom);
	month_carousel.appendChild(nowMonthDom);
	month_carousel.appendChild(nextMonthDom);

	container.innerHTML = "";
	container.appendChild(month_carousel);
}

// 绑定事件处理函数
function bindEventListner(container, showDate, todayDate, content, content_head, stateMachine) {
	const showingDom = container.querySelector(".J_showing_table");
	showingDom.addEventListener("click", function (e) {
		stateMachine.reverseTransition(e, showDate, todayDate, content, content_head, stateMachine);
	});
}

function renderMonthYear(container, calData) {
	const table = container.querySelector(".J_showing_table");
	let calendarList = table.getElementsByTagName("td");
	for (let i = 0; i < calendarList.length; i++) {
		if (calData[i].state === ITEM_STATE.NEARLY) {
			calendarList[i].classList.add("not-now");
		} else if (calData[i].state === ITEM_STATE.CURRENT) {
			calendarList[i].classList.add("curmonth-item");
		}
	}
}
// 显示月历的函数
function showMonth(showDate, todayDate, container, content_head, stateMachine) {
	// 获取月份数据
	const monthData_prev = createMonthData(getPrevYear(showDate.year, showDate.month), todayDate);
	const monthData_now = createMonthData(showDate, todayDate);
	const monthData_next = createMonthData(getNextYear(showDate.year, showDate.month), todayDate);
	// 根据数据创建月历并将其加到页面
	createMonthDOM(monthData_prev, monthData_now, monthData_next, container);
	// 根据数据渲染月历
	renderMonthYear(container, monthData_now);
	// 添加事件处理函数,很多参数可删
	bindEventListner(container, showDate, todayDate, container, content_head, stateMachine);
}

//====================年历=============================
function createYearData(showDate, todayDate) {
	let yearData = [];
	const INDEX = [3, 0, 1, 2];
	let leftYear = showDate.year - (showDate.year % NUM_OF_NEAR_YEARS); // 十年区间的第一年
	let leftYearIndex = INDEX[leftYear % NUMOF_MONTH_YEAR_ROW_ITEM]; // // 十年区间的第一年的位置
	const firstYear = leftYear - leftYearIndex; // 日历显示第一年
	for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM; i++) {
		// 如果当十年
		if (i >= leftYearIndex && i < leftYearIndex + NUM_OF_NEAR_YEARS) {
			// 如果当年
			if (showDate.year === todayDate.year && firstYear + i === todayDate.year) {
				yearData.push({ date: firstYear + i, state: ITEM_STATE.CURRENT });
			} else {
				yearData.push({ date: firstYear + i, state: ITEM_STATE.MIDDLE });
			}
		} else {
			yearData.push({
				date: firstYear + i,
				state: ITEM_STATE.NEARLY,
			});
		}
	}
	return yearData;
}

function showYear(showDate, todayDate, container, content_head, stateMachine) {
	// 获取月份数据
	const YearData_prev = createYearData(getPrevTenYear(showDate.year, showDate.month), todayDate);
	const YearData_now = createYearData(showDate, todayDate);
	const YearData_next = createYearData(getNextTenYear(showDate.year, showDate.month), todayDate);
	// 根据数据创建年历并将其加到页面,和月历用的一个函数
	createMonthDOM(YearData_prev, YearData_now, YearData_next, container);
	// 根据数据渲染年历，和日历暂时用的一个函数
	// TODO 渲染函数
	renderMonthYear(container, YearData_now);
	// 添加事件处理函数
	bindEventListner(container, showDate, todayDate, container, content_head, stateMachine);
}

export { showToday, showHead, createCalendar, showCalendar, showMonth, showYear, showClock };
