import { getDayNum, getDayOfOne, createCss } from "./utils.js";

import { TRANS_TIME } from "./config.js";

import { showToday, showClock, drag } from "./display.js";

import { CalendarstateMachine } from "./statemachine.js";
let clocks = {};
// 页面初始化要调用的函数
function calendarOnload(showDate, todayDate, content, content_head, todayTime, container, stateMachine) {
	let clock = showClock(container);
	showToday(todayDate, todayTime);
	stateMachine.init(showDate, todayDate, content, content_head, stateMachine);
	return clock;
}

class Calendar {
	// constructor() {
	//   this.clocks = {};
	// }
	install(idName, options = { isDragable: false }) {
		const htmlstr = `
    <div class="calender">
        <div class="dragable"></div>
        <div class="top">
            <div class="clock">
                00:00:00
            </div>
            <div class="today-time">
                <span class="today-font js_todaytime">2021年8月12日 七月初五</span>
            </div>
        </div>
        <div class="main">
            <div class="calendar-top">
                <div class="description">
                    <span class="show-month" class="clickable">2021年8月</span>
                    <div class="button">
                        <div class="arrow clickable arrow-next js_arrow_down"></div>
                    </div>
                    <div class="button">
                        <div class="arrow clickable arrow-prev js_arrow_up"></div>
                    </div>
                </div>
            </div>
            <div class="content">
            </div>
        </div>
    </div>`;
		createCss("calendar-module/styles/basic.css");
		const container = document.querySelector(idName);
		container.innerHTML = htmlstr;

		const myDate = new Date();
		const stateMachine = new CalendarstateMachine();
		// 存当前处于时间的对象
		const todayDate = {
			year: myDate.getFullYear(),
			month: myDate.getMonth(),
			date: myDate.getDate(),
		};

		// 初始化当前时间对象
		todayDate.dayNum = getDayNum(todayDate.year, todayDate.month);
		todayDate.dayOfOne = getDayOfOne(todayDate.year, todayDate.month);

		// 初始化当前显示时间对象
		let showDate = {};
		showDate = Object.assign(showDate, todayDate); // 浅拷贝就够了
		// 获取主要要显示内容的元素节点容器
		const todayTime = container.querySelector(".js_todaytime");
		const content = container.querySelector(".content");
		const content_head = container.querySelector(".show-month");

		// 首部拖拽
		if (options.isDragable) {
			const dragableTop = container.querySelector(".dragable");
			dragableTop.style.cursor = "pointer";
			dragableTop.addEventListener("mousedown", function (e) {
				drag(e, idName);
			});
		}

		window.addEventListener("DOMContentLoaded", function () {
			clocks[idName] = calendarOnload(showDate, todayDate, content, content_head, todayTime, container, stateMachine);
		});
		// 绑定蓝字
		todayTime.addEventListener("click", function () {
			stateMachine.init(showDate, todayDate, content, content_head, stateMachine);
		});

		// ----x历头----------------------------------------------
		content_head.addEventListener("click", function () {
			stateMachine.forwordTransition(showDate, todayDate, content, content_head, stateMachine);
		});

		// ----上下键部分------------------

		const lastButton = container.querySelector(".js_arrow_up");
		const nextButton = container.querySelector(".js_arrow_down");
		nextButton.addEventListener("click", function () {
			stateMachine.next(showDate, todayDate, content, content_head, container, stateMachine, TRANS_TIME);
		});
		lastButton.addEventListener("click", function () {
			stateMachine.prev(showDate, todayDate, content, content_head, container, stateMachine, TRANS_TIME);
		});
	}
	// 这里执行顺序的问题，怎么解决
	unload(idName) {
		console.log("clocksid");
		console.log(clocks[idName]);
		clearInterval(clocks[idName]); //清除interval定时器
		clocks[idName] = null;
		console.log("clockunload");
		const container = document.querySelector(idName);
		container.innerHTML = "";
	}
}

export default Calendar;
