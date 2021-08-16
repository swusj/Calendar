import {
  isLeapYear,
  getDayNum,
  getDayOfOne,
  getLastMonth,
  getNextMonth,
  getLastYear,
  getNextYear,
  getLastTenYear,
  getNextTenYear,
  addClass
} from "./utils.js";

import {
  MonthOfLeapYear,
  MonthOfComYear,
  DayChange,
  Week,
  ShowList
} from './config.js'

import {
  displayTime,
  showToday,
  changeCalendarCss,
  showHead,
  createCalendar,
  createMonth,
  createYear
} from './display.js'

const MyDate = new Date();
let showing = 0   // 当前显示的是日历还是月历还是年历

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

// 实现时钟的函数
function showClock() {
  window.setInterval(displayTime, 1000);
}

let todayTime = document.getElementById("todayTime");

const content = document.getElementsByClassName("content")[0]

let content_head = document.getElementById("show_month")



// 显示当前日历
function showCalendar() {
  createCalendar(ShowDate, content)
  changeCalendarCss(TodayDate, ShowDate)
  showHead(ShowDate, content_head, showing)
}


// 页面初始化要调用的函数
function calendarOnload() {
  showClock();
  showToday(TodayDate.year, TodayDate.month + 1, TodayDate.date, todayTime);
  showCalendar()
}

// 页面加载完成后就要调用的函数
window.addEventListener("load", calendarOnload);


// -----下面是交互部分------------

// -----蓝字部分------------------------------------------
todayTime.addEventListener("click", showNowMonth)

// 显示当月日历
function showNowMonth() {
  ShowDate = Object.assign(ShowDate, TodayDate)
  showing = 0
  showCalendar()
}

// ----内容头----------------------------------------------

content_head.addEventListener("click", handleContentClick)


// 处理点击事件
function handleContentClick() {
  if (showing < 3) {
    showing++
  }
  if (showing === 1) {
    showMonth()
  }
  if (showing === 2) {
    showYear()
  }
}

// 显示月历的函数
function showMonth() {
  createMonth(content)
  showHead(ShowDate, content_head, showing)
  changeMonthCss(ShowDate, TodayDate)
}

// 更改月历显示效果,绑定事件处理函数
function changeMonthCss(ShowDate, TodayDate) {
  const table = content.getElementsByTagName("table")[0]
  table.className = "month_content"
  const MonthList = table.getElementsByTagName("td")
  for (let i = 0; i < 16; i++) {
    MonthList[i].addEventListener("click", handleMonthClick)
    if (i >= 12) {
      addClass(MonthList[i], "NotNow")
    }
  }
  if (ShowDate.year === TodayDate.year && ShowDate.month === TodayDate.month) {
    addClass(MonthList[ShowDate.month], "CurMonthItem")
  }
}

// 处理点击月份
function handleMonthClick() {
  showing = 0
  const month = this.childNodes[0].nodeValue.charAt(0)
  ShowDate.month = month - 1
  ShowDate.dayNum = getDayNum(ShowDate.year, ShowDate.month)
  ShowDate.dayOfOne = getDayOfOne(ShowDate.year, ShowDate.month);
  showHead(ShowDate, content_head, showing) //更新日历头
  showCalendar()  //更新日历
}


// 显示年历
function showYear() {
  const leftYearIndex = createYear(ShowDate, content)
  showHead(ShowDate, content_head, showing)
  changeYearCss(leftYearIndex)
}

// 更改年历显示效果，绑定事件处理函数
function changeYearCss(leftYearIndex) {
  const table = content.getElementsByTagName("table")[0]
  table.className = "month_content"
  const YearList = table.getElementsByTagName("td")
  for (let i = 0; i < 16; i++) {
    YearList[i].addEventListener("click", handleYearClick)
    if (i < leftYearIndex || i > leftYearIndex + 9) {
      addClass(YearList[i], "NotNow")
    }
  }
  if (ShowDate.year === TodayDate.year) {
    addClass(YearList[leftYearIndex + TodayDate.year % 10], "CurMonthItem")
  }
}

// 处理点击年份
function handleYearClick() {
  showing = 1
  const year = this.childNodes[0].nodeValue
  ShowDate.year = year
  ShowDate.dayNum = getDayNum(ShowDate.year, ShowDate.month)
  ShowDate.dayOfOne = getDayOfOne(ShowDate.year, ShowDate.month);
  showHead(ShowDate, content_head, showing) //更新日历头
  showMonth()  //显示月历
}

// ----上下键部分------------------
const ButtonList = document.getElementsByClassName("button")
const NextButton = ButtonList[1]
const LastButton = ButtonList[0]
NextButton.addEventListener("click", showNext)
LastButton.addEventListener("click", showLast)

// 显示上个月日历
function showLast() {
  if (showing === 0) { //如果在显示日历
    ShowDate = getLastMonth(ShowDate.year, ShowDate.month)
    showCalendar()
  } else if (showing === 1) { //如果在显示月历
    ShowDate = getLastYear(ShowDate.year, ShowDate.month)
    showMonth()
  } else if (showing === 2) { //如果在显示年历
    ShowDate = getLastTenYear(ShowDate.year, ShowDate.month)
    showYear()
  }
}

// 显示下个月日历
function showNext() {
  if (showing === 0) {
    ShowDate = getNextMonth(ShowDate.year, ShowDate.month)
    showCalendar()
  } else if (showing === 1) { //如果在显示月历
    ShowDate = getNextYear(ShowDate.year, ShowDate.month)
    showMonth()
  } else if (showing === 2) { //如果在显示年历
    ShowDate = getNextTenYear(ShowDate.year, ShowDate.month)
    showYear()
  }
}




