import {
  MONTHOFLEAPYEAR,
  MONTHOFCOMYEAR,
  DAYCHENGE,
} from './config.js'

// 获取上个月日期对象的函数
function getLastMonth(year, month) {
  let lastMonth = {}
  if (month === 0) { //如果是一月份
    lastMonth.month = 11
    lastMonth.year = year - 1
  } else {
    lastMonth.month = month - 1
    lastMonth.year = year
  }
  lastMonth.dayNum = getDayNum(lastMonth.year, lastMonth.month)
  lastMonth.dayOfOne = getDayOfOne(lastMonth.year, lastMonth.month)
  lastMonth.showing = 0
  return lastMonth
}


// 获取下个月日期对象的函数
function getNextMonth(year, month) {
  let nextMonth = {}
  if (month === 11) { //如果是12月份
    nextMonth.month = 1
    nextMonth.year = year + 1
  } else {
    nextMonth.month = month + 1
    nextMonth.year = year
  }
  nextMonth.dayNum = getDayNum(nextMonth.year, nextMonth.month)
  nextMonth.dayOfOne = getDayOfOne(nextMonth.year, nextMonth.month)
  nextMonth.showing = 0
  return nextMonth
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
    return MONTHOFLEAPYEAR[month];
  } else {
    return MONTHOFCOMYEAR[month];
  }
}

// 获得某年某月的 1号 是星期几的函数
function getDayOfOne(year, month) {
  const tmp = new Date(year, month, 1);
  return DAYCHENGE[tmp.getDay()];
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
  LastYear.showing = 1
  return LastYear
}

// 获取下一年日期对象的函数
function getNextYear(year, month) {
  let nextYear = {}
  nextYear.year = year + 1
  nextYear.month = month
  nextYear.dayNum = getDayNum(nextYear.year, nextYear.month)
  nextYear.dayOfOne = getDayOfOne(nextYear.year, nextYear.month)
  nextYear.showing = 1
  return nextYear
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
  LastTenYear.showing = 2
  return LastTenYear
}

// 获取后十年日期对象的函数
function getNextTenYear(year, month) {
  let NextTenYear = {}
  NextTenYear.year = year + 10
  NextTenYear.month = month
  NextTenYear.dayNum = getDayNum(NextTenYear.year, NextTenYear.month)
  NextTenYear.dayOfOne = getDayOfOne(NextTenYear.year, NextTenYear.month)
  NextTenYear.showing = 2
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