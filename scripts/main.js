const MyDate = new Date();
const MonthOfLeapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MonthOfComYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DayChange = [6, 0, 1, 2, 3, 4, 5];

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

// 显示今天日期的函数
function showToday(year, month, day) {
  let today = `${year}年${month}月${day}日`;
  let todayTime = document.getElementById("todayTime");
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


// 显示当前日历
function showCalendar(ShowDate) {
  // 获取上个月对象
  let LastMonth = getLastMonth(ShowDate.year, ShowDate.month)
  let Calender = document.getElementById("calender_content")
  let LastStr = "<tr>",
    NowStr = "",
    NextStr = ""
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
  Calender.innerHTML = LastStr + NowStr + NextStr
  changeCalendarCss(ShowDate.dayOfOne, ShowDate.dayNum)
}

// 更改日历显示效果
function changeCalendarCss(dayOfOne, dayNum) {
  let CalendarList = document.getElementsByTagName("td")
  let i = 0
  for (i; i < dayOfOne; i++) {
    CalendarList[i].className += " NotNowMonth"
  }
  i--
  for (i = dayOfOne + dayNum; i < 42; i++) {
    CalendarList[i].className += " NotNowMonth"
  }
}

// 显示日历头
function showMonth(year, month) {
  let ShowMonth = document.getElementById("show_month")
  let str = `${year}年${month + 1}月`
  ShowMonth.innerHTML = str
}

// 页面初始化要调用的函数
function calendarOnload() {
  showClock();
  showToday(TodayDate.year, TodayDate.month + 1, TodayDate.date);
  showMonth(ShowDate.year, ShowDate.month)
  showCalendar(ShowDate)

}

// 页面加载完成后就要调用的函数
window.addEventListener("load", calendarOnload);


//-----下面是交互部分------------

const ButtonList = document.getElementsByClassName("button")
const NextButton = ButtonList[0]
const LastButton = ButtonList[1]
NextButton.addEventListener("click",showNextMonth)
LastButton.addEventListener("click",showLastMonth)

// 显示上个月日历
function showLastMonth(){
  ShowDate = getLastMonth(ShowDate.year,ShowDate.month)
  showCalendar(ShowDate)
  showMonth(ShowDate.year, ShowDate.month)
}

// 显示下个月日历
function showNextMonth(){
  ShowDate = getNextMonth(ShowDate.year,ShowDate.month)
  showCalendar(ShowDate)
  showMonth(ShowDate.year, ShowDate.month)
}






