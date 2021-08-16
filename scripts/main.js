const MyDate = new Date();
const MonthOfLeapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MonthOfComYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DayChange = [6, 0, 1, 2, 3, 4, 5];
const Week = ["一", "二", "三", "四", "五", "六", "日"]
const ShowList = ["day", "month", "year"]
let showing = 0   // 当前显示的是日历还是月历还是年历

// 存当前处于时间的对象
const TodayDate = {
  year: MyDate.getFullYear(),
  month: MyDate.getMonth(),
  date: MyDate.getDate(),
};
let ShowDate = {};

// 判断是不是闰年的函数
function isLeapYear(year) {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  } else {
    return false;
  }
}

// 根据年份和月份获取月份天数的函数
function getDayNum(year, month) {
  if (isLeapYear(year)) {
    return MonthOfLeapYear[month];
  } else {
    return MonthOfComYear[month];
  }
}

// 获得某年某月的 1号 是星期几的函数
function getDayOfOne(year, month) {
  const tmp = new Date(year, month, 1);
  return DayChange[tmp.getDay()];
}

TodayDate.dayNum = getDayNum(TodayDate.year, TodayDate.month);
TodayDate.dayOfOne = getDayOfOne(TodayDate.year, TodayDate.month);

ShowDate = Object.assign(ShowDate, TodayDate); // 浅拷贝就够了

console.log(TodayDate);
console.log(ShowDate);

// 显示当前时间的函数
function displayTime() {
  const NowDate = new Date();
  let hour = NowDate.getHours();
  let minute = NowDate.getMinutes();
  minute = minute < 10 ? `0${minute}` : minute;
  let second = NowDate.getSeconds();
  second = second < 10 ? `0${second}` : second;
  let ClockStr = `${hour}:${minute}:${second}`;
  let clock = document.getElementById("clock");
  clock.innerHTML = ClockStr;
}

// 时钟函数
function showClock() {
  window.setInterval("displayTime()", 1000);
}

let todayTime = document.getElementById("todayTime");
// 显示今天日期的函数
function showToday(year, month, day) {
  let today = `${year}年${month}月${day}日`;
  todayTime.innerHTML = today;
}


// 获取上个月日期对象的函数
function getLastMonth(year, month) {
  let LastMonth = {}
  if (month === 0) { //如果是一月份
    LastMonth.month = 11
    LastMonth.year = year - 1
  } else {
    LastMonth.month = month - 1
    LastMonth.year = year
  }
  LastMonth.dayNum = getDayNum(LastMonth.year, LastMonth.month)
  LastMonth.dayOfOne = getDayOfOne(LastMonth.year, LastMonth.month)
  return LastMonth
}

// 获取下个月日期对象的函数
function getNextMonth(year, month) {
  let NextMonth = {}
  if (month === 11) { //如果是12月份
    NextMonth.month = 1
    NextMonth.year = year + 1
  } else {
    NextMonth.month = month + 1
    NextMonth.year = year
  }
  NextMonth.dayNum = getDayNum(NextMonth.year, NextMonth.month)
  NextMonth.dayOfOne = getDayOfOne(NextMonth.year, NextMonth.month)
  return NextMonth
}

// 获取上一年日期对象的函数
function getLastYear(year, month) {
  let LastYear = {}
  if (year === 0) {
    LastYear.year = year
  } else {
    LastYear.year = year - 1
  }
  LastYear.month = month
  LastYear.dayNum = getDayNum(LastYear.year, LastYear.month)
  LastYear.dayOfOne = getDayOfOne(LastYear.year, LastYear.month)
  return LastYear
}

// 获取下一年日期对象的函数
function getNextYear(year, month) {
  let NextYear = {}
  NextYear.year = year + 1
  NextYear.month = month
  NextYear.dayNum = getDayNum(NextYear.year, NextYear.month)
  NextYear.dayOfOne = getDayOfOne(NextYear.year, NextYear.month)
  return NextYear
}

// 获取前十年日期对象的函数
function getLastTenYear(year, month) {
  let LastTenYear = {}
  if (year - 10 < 0) {
    LastTenYear.year = 0
  } else {
    LastTenYear.year = year - 10
  }
  LastTenYear.month = month
  LastTenYear.dayNum = getDayNum(LastTenYear.year, LastTenYear.month)
  LastTenYear.dayOfOne = getDayOfOne(LastTenYear.year, LastTenYear.month)
  return LastTenYear
}

// 获取后十年日期对象的函数
function getNextTenYear(year, month) {
  let NextTenYear = {}
  NextTenYear.year = year + 10
  NextTenYear.month = month
  NextTenYear.dayNum = getDayNum(NextTenYear.year, NextTenYear.month)
  NextTenYear.dayOfOne = getDayOfOne(NextTenYear.year, NextTenYear.month)
  return NextTenYear
}

const content = document.getElementsByClassName("content")[0]
// 显示当前日历
function showCalendar() {
  // 获取上个月对象
  let LastMonth = getLastMonth(ShowDate.year, ShowDate.month)
  // let Calender = document.getElementById("calender_content")
  let LastStr = "<tr>",
    NowStr = "",
    NextStr = ""

  // 生成表头
  let week = document.createElement("div")
  week.setAttribute("id", "week")
  for (let k = 0; k < 7; k++) {
    let item = document.createElement("div")
    item.setAttribute("class", "item")
    item.innerHTML = Week[k]
    week.appendChild(item)
  }

  // 生成表内容
  let table = document.createElement("table")
  table.setAttribute("id", "calender_content")
  let i = 0
  for (i; i < ShowDate.dayOfOne; i++) {
    LastStr += `<td>${LastMonth.dayNum - ShowDate.dayOfOne + i + 1}</td>`
  }
  i--
  for (let j = 1; j <= ShowDate.dayNum; j++) {
    // console.log(i)
    i++
    if (i % 7 === 0) {
      NowStr += "<tr>"
    }
    NowStr += `<td>${j}</td>`
    if (i % 7 === 6) {
      NowStr += "</tr>"
    }
  }
  let k = 1
  for (i = i + 1; i < 42; i++) {
    if (i % 7 === 0) {
      NextStr += "<tr>"
    }
    NextStr += `<td>${k}</td>`
    k++
    if (i % 7 === 6) {
      NextStr += "</tr>"
    }
  }
  content.innerHTML = ""
  table.innerHTML = LastStr + NowStr + NextStr
  content.appendChild(week)
  content.appendChild(table)
  changeCalendarCss(ShowDate.dayOfOne, ShowDate.dayNum)
  showHead(ShowDate.year, ShowDate.month)
}

// 更改日历显示效果
function changeCalendarCss(dayOfOne, dayNum) {
  let CalendarList = document.getElementsByTagName("td")
  for (let i = 0; i < 42; i++) {
    if (i < dayOfOne || i >= (dayOfOne + dayNum)) {
      addClass(CalendarList[i], "NotNow")
    }
  }
  if (ShowDate.year === TodayDate.year && ShowDate.month === TodayDate.month && ShowDate.date === TodayDate.date) {
    addClass(CalendarList[dayOfOne+TodayDate.date-1],"CurDateItem")
    let str = `<div class="CurDate">${TodayDate.date}</div>`
    CalendarList[dayOfOne+TodayDate.date-1].innerHTML = str
  }
}

let content_head = document.getElementById("show_month")
// 显示日历头
function showHead(year, month) {
  let str = ""
  if (showing === 0) {
    str = `${year}年${month + 1}月`
  } else if (showing === 1) {
    str = `${year}年`
  } else if (showing === 2) {
    str = `${year - year % 10}-${(year - year % 10) + 9}`
  }
  content_head.innerHTML = str
}

// 页面初始化要调用的函数
function calendarOnload() {
  showClock();
  showToday(TodayDate.year, TodayDate.month + 1, TodayDate.date);
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
  let str = "<table>"
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      str += "<tr>"
    }
    str += `<td>${i + 1}月</td>`
    if (i % 4 === 3) {
      str += "</tr>"
    }
  }
  str += "</table>"
  content.innerHTML = str
  showHead(ShowDate.year)
  changeMonthCss()
}

// 更改月历显示效果,绑定事件处理函数
function changeMonthCss() {
  const table = content.getElementsByTagName("table")[0]
  table.className = "month_content"
  const MonthList = table.getElementsByTagName("td")
  for (let i = 0; i < 16; i++) {
    MonthList[i].addEventListener("click", handleMonthClick)
    if (i >= 12) {
      addClass(MonthList[i], "NotNow")
    }
  }
  
}

// 处理点击月份
function handleMonthClick() {
  showing = 0
  const month = this.childNodes[0].nodeValue.charAt(0)
  ShowDate.month = month - 1
  ShowDate.dayNum = getDayNum(ShowDate.year, ShowDate.month)
  ShowDate.dayOfOne = getDayOfOne(ShowDate.year, ShowDate.month);
  showHead(ShowDate.year, ShowDate.month) //更新日历头
  showCalendar()  //更新日历
}

// 显示年历
function showYear() {
  let index = [3, 0, 1, 2]
  let leftYear = ShowDate.year - ShowDate.year % 10
  let leftYearIndex = index[leftYear % 4]
  let str = "<table>"
  const FirstYear = leftYear - leftYearIndex
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      str += "<tr>"
    }
    str += `<td>${FirstYear + i}</td>`
    if (i % 4 === 3) {
      str += "</tr>"
    }
  }
  str += "</table>"
  content.innerHTML = str
  showHead(ShowDate.year)
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
}

// 处理点击年份
function handleYearClick() {
  showing = 1
  const year = this.childNodes[0].nodeValue
  ShowDate.year = year
  ShowDate.dayNum = getDayNum(ShowDate.year, ShowDate.month)
  ShowDate.dayOfOne = getDayOfOne(ShowDate.year, ShowDate.month);
  showHead(ShowDate.year, ShowDate.month) //更新日历头
  showMonth()  //显示月历
}

// 为节点添加类
function addClass(node, className) {
  if (node.className) {
    node.className += ` ${className}`
  } else {
    node.className = className
  }
}

// ----上下键部分------------------
const ButtonList = document.getElementsByClassName("button")
const NextButton = ButtonList[1]
const LastButton = ButtonList[0]
NextButton.addEventListener("click", showNext)
LastButton.addEventListener("click", showLast)

// 显示上个月日历
function showLast() {
  console.log(showing)
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




