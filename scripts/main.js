import {
  getDayNum,
  getDayOfOne,
  getLastMonth,
  getNextMonth,
  getLastYear,
  getNextYear,
  getLastTenYear,
  getNextTenYear,
} from "./utils.js";

import {
  displayTime,
  showToday,
  showCalendar,
  showMonth,
  showNowMonth,
  showYear,
} from './display.js'

const MyDate = new Date();

// 存当前处于时间的对象
const TodayDate = {
  year: MyDate.getFullYear(),
  month: MyDate.getMonth(),
  date: MyDate.getDate(),
};

// 初始化当前时间对象
TodayDate.dayNum = getDayNum(TodayDate.year, TodayDate.month);
TodayDate.dayOfOne = getDayOfOne(TodayDate.year, TodayDate.month);

// 初始化当前显示时间对象
let ShowDate = {};
ShowDate = Object.assign(ShowDate, TodayDate); // 浅拷贝就够了
ShowDate.showing = 0  // 当前显示的是日历还是月历还是年历

// 实现时钟的函数
function showClock() {
  window.setInterval(displayTime, 1000);
}

const todayTime = document.getElementById("todayTime");
const content = document.getElementsByClassName("content")[0]
const content_head = document.getElementById("show_month")


// 页面初始化要调用的函数
function calendarOnload() {
  showClock();
  showToday(TodayDate.year, TodayDate.month + 1, TodayDate.date, todayTime);
  showCalendar(ShowDate, TodayDate, content, content_head)
}

// 页面加载完成后就要调用的函数
window.addEventListener("load", calendarOnload);


// -----下面是交互部分------------

// -----蓝字部分------------------------------------------
todayTime.addEventListener("click", showNowMonth.bind(todayTime, ShowDate, TodayDate, content, content_head))

// ----内容头----------------------------------------------

content_head.addEventListener("click", handleContentClick)


// 处理点击事件
function handleContentClick() {
  if (ShowDate.showing < 3) {
    ShowDate.showing++
  }
  if (ShowDate.showing === 1) {
    showMonth(ShowDate, TodayDate, content, content_head)
  }
  if (ShowDate.showing === 2) {
    showYear(ShowDate, TodayDate, content, content_head)
  }
}


// ----上下键部分------------------
const ButtonList = document.getElementsByClassName("button")
const NextButton = ButtonList[1]
const LastButton = ButtonList[0]
NextButton.addEventListener("click", showNext)
LastButton.addEventListener("click", showLast)

// 显示上个月日历
function showLast(ShowDate, TodayDate, content, content_head) {
  console.log(ShowDate.showing)
  if (ShowDate.showing === 0) { //如果在显示日历
    ShowDate = getLastMonth(ShowDate.year, ShowDate.month)
    showCalendar(ShowDate, TodayDate, content, content_head)
  } else if (ShowDate.showing === 1) { //如果在显示月历
    ShowDate = getLastYear(ShowDate.year, ShowDate.month)
    showMonth(ShowDate, TodayDate, content, content_head)
  } else if (ShowDate.showing === 2) { //如果在显示年历
    ShowDate = getLastTenYear(ShowDate.year, ShowDate.month)
    showYear(ShowDate, TodayDate, content, content_head)
  }
}

// 显示下个月日历
function showNext(ShowDate, TodayDate, content, content_head) {
  if (ShowDate.showing === 0) {
    ShowDate = getNextMonth(ShowDate.year, ShowDate.month)
    showCalendar(ShowDate, TodayDate, content, content_head)
  } else if (ShowDate.showing === 1) { //如果在显示月历
    ShowDate = getNextYear(ShowDate.year, ShowDate.month)
    showMonth(ShowDate, TodayDate, content, content_head)
  } else if (ShowDate.showing === 2) { //如果在显示年历
    ShowDate = getNextTenYear(ShowDate.year, ShowDate.month)
    showYear(ShowDate, TodayDate, content, content_head)
  }
}




