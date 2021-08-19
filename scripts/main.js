import {
  getDayNum,
  getDayOfOne,
  getPrevMonth,
  getNextMonth,
  getPrevYear,
  getNextYear,
  getPrevTenYear,
  getNextTenYear,
} from "./utils.js";

import {
  SHOWING_STATE,
  TRANS_TIME
} from "./config.js"

import {
  showToday,
  showCalendar,
  showMonth,
  showNowMonth,
  showYear,
  showClock,
} from './display.js'

import {
  CalendarstateMachine
} from "./statemachine.js"
const myDate = new Date();

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
const todayTime = document.getElementById("today-time").getElementsByTagName("span")[0];
const content = document.getElementsByClassName("content")[0]
const content_head = document.getElementById("show-month")


// 绑定各种事件

// ---绑定页面除了js的异步请求以外的东西加载完成时-------------------------------------
window.addEventListener("DOMContentLoaded", calendarOnload);

// 页面初始化要调用的函数
function calendarOnload() {
  showClock();
  showToday(todayDate, todayTime);
  showCalendar(showDate, todayDate, content, content_head)
}

// -----蓝字部分------------------------------------------
// 发现这里此时的showDate是最最开始的showDate，而且showNowMonth里对showDate的更改根本没传出来，说明这个已经不是一个showDate了,因此这样的
// 绑定事件带引用类型的参数不好。（猜测可能是代码执行到这行的时候，x.bind()直接把后面那一溜参数给了showNowMonth，然后返回了showNowMonth的拷贝，并且参数可能是也进行了拷贝，而不是直接传的，所以才会发生这种情况）
// todayTime.addEventListener("click", showNowMonth.bind(todayTime, showDate, todayDate, content, content_head))

// 因此采用匿名函数,this而且还是指向的不会出问题，但如果真正执行的函数需要this就还是要用call
// (为啥，不是说匿名函数this都指向window吗？看来这里是按对象方法来调用的)
todayTime.addEventListener("click", function () {
  console.log(this)
  showNowMonth(showDate, todayDate, content, content_head)
})

// ----x历头----------------------------------------------
content_head.addEventListener("click", handleContentClick)

// 处理点击 x 历头
function handleContentClick() {
  if (CalendarstateMachine.currentState === SHOWING_STATE.DAY) {
    CalendarstateMachine.toMonthCalendar(showDate, todayDate, content, content_head)
  } else if (CalendarstateMachine.currentState === SHOWING_STATE.MONTH) {
    CalendarstateMachine.toYearCalender(showDate, todayDate, content, content_head)
  }
}


// ----上下键部分------------------
const lastButton = document.getElementsByClassName("arrow-prev")[0]
const nextButton = document.getElementsByClassName("arrow-next")[0]
nextButton.addEventListener("click", showNext)
lastButton.addEventListener("click", showLast)

// 显示上个月x历 
function showLast() {
  if (CalendarstateMachine.currentState === SHOWING_STATE.DAY) { //如果在显示日历
    carouselTrans(document.getElementsByClassName("calender-carousel")[0], "prev", TRANS_TIME)
  } else if (CalendarstateMachine.currentState === SHOWING_STATE.MONTH) { //如果在显示月历
    carouselTrans(document.getElementsByClassName("month_carousel")[0], "prev", TRANS_TIME)
  } else if (CalendarstateMachine.currentState === SHOWING_STATE.YEAR) { //如果在显示年历
    carouselTrans(document.getElementsByClassName("month_carousel")[0], "prev", TRANS_TIME)
  }
}

// 显示下个月x历
function showNext() {
  if (CalendarstateMachine.currentState === SHOWING_STATE.DAY) {
    carouselTrans(document.getElementsByClassName("calender-carousel")[0], "next", TRANS_TIME)
  } else if (CalendarstateMachine.currentState === SHOWING_STATE.MONTH) { //如果在显示月历
    carouselTrans(document.getElementsByClassName("month_carousel")[0], "next", TRANS_TIME)
  } else if (CalendarstateMachine.currentState === SHOWING_STATE.YEAR) { //如果在显示年历
    carouselTrans(document.getElementsByClassName("month_carousel")[0], "next", TRANS_TIME)
  }
}

// 实现过渡效果 先给轮播图加上trans, 再移动top, 移完了，去掉trans,更新日历 
function carouselTrans(carousel, method, time) {
  const table_height = window.getComputedStyle(carousel.getElementsByTagName("table")[0]).height;  // 获取最终元素的style，是只读的，而style是只写的

  carousel.classList.add("trans")

  if (method === "prev") {
    carousel.style.top = `0px` //移动top

    setTimeout(function () {
      carousel.classList.remove("trans")
      if (CalendarstateMachine.currentState === SHOWING_STATE.DAY) { //如果在显示月历
        showDate = getPrevMonth(showDate.year, showDate.month)
        showCalendar(showDate, todayDate, content, content_head)
      } else if (CalendarstateMachine.currentState === SHOWING_STATE.MONTH) { //如果在显示月历
        showDate = getPrevYear(showDate.year, showDate.month)
        showMonth(showDate, todayDate, content, content_head)
      } else if (CalendarstateMachine.currentState === SHOWING_STATE.YEAR) { //如果在显示年历
        showDate = getPrevTenYear(showDate.year, showDate.month)
        showYear(showDate, todayDate, content, content_head)
      }
    }, time * 1000)
  } else if (method === "next") {
    carousel.style.top = `${-2 * table_height.slice(0, -2)}px` //移动top

    setTimeout(function () {
      carousel.classList.remove("trans")
      if (CalendarstateMachine.currentState === SHOWING_STATE.DAY) { //如果在显示月历
        showDate = getNextMonth(showDate.year, showDate.month)
        showCalendar(showDate, todayDate, content, content_head)
      } else if (CalendarstateMachine.currentState === SHOWING_STATE.MONTH) { //如果在显示月历
        showDate = getNextYear(showDate.year, showDate.month)
        showMonth(showDate, todayDate, content, content_head)
      } else if (CalendarstateMachine.currentState === SHOWING_STATE.YEAR) { //如果在显示年历
        showDate = getNextTenYear(showDate.year, showDate.month)
        showYear(showDate, todayDate, content, content_head)
      }
    }, time * 1000)
  }
}



