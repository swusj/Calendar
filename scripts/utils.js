import {
  MonthOfLeapYear,
  MonthOfComYear,
  DayChange,
  Week,
  ShowList
} from './config.js'

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


// 为节点添加类
function addClass(node, className) {
  if (node.className) {
    node.className += ` ${className}`
  } else {
    node.className = className
  }
}

export {
  getLastMonth,
  getNextMonth,
  isLeapYear,
  getDayNum,
  getDayOfOne,
  getLastYear,
  getNextYear,
  getLastTenYear,
  getNextTenYear,
  addClass,
}