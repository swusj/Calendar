import {
    Week,
} from './config.js'

import {
    getDayNum,
    getDayOfOne,
    getLastMonth,
    addClass
} from "./utils.js";


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

function showClock() {
    window.setInterval(displayTime, 1000);
}

// 显示今天日期的函数
function showToday(TodayDate, node) {
    let today = `${TodayDate.year}年${TodayDate.month + 1}月${TodayDate.date}日`;
    node.innerHTML = today;
}

// 更改日历显示效果
function changeCalendarCss(TodayDate, ShowDate) {
    let CalendarList = document.getElementsByTagName("td")
    for (let i = 0; i < 42; i++) {
        if (i < ShowDate.dayOfOne || i >= (ShowDate.dayOfOne + ShowDate.dayNum)) {
            addClass(CalendarList[i], "NotNow")
        }
    }
    if (ShowDate.year === TodayDate.year && ShowDate.month === TodayDate.month && ShowDate.date === TodayDate.date) {
        addClass(CalendarList[ShowDate.dayOfOne + TodayDate.date - 1], "CurDateItem")
        let str = `<div class="CurDate">${TodayDate.date}</div>`
        CalendarList[ShowDate.dayOfOne + TodayDate.date - 1].innerHTML = str
    }
}


// 显示x历头
function showHead(ShowDate, node) {
    let str = ""
    if (ShowDate.showing === 0) {
        str = `${ShowDate.year}年${ShowDate.month + 1}月`
    } else if (ShowDate.showing === 1) {
        str = `${ShowDate.year}年`
    } else if (ShowDate.showing === 2) {
        str = `${ShowDate.year - ShowDate.year % 10}-${(ShowDate.year - ShowDate.year % 10) + 9}`
    }
    node.innerHTML = str
    console.log(str)
}


// 显示日历骨架
function createCalendar(ShowDate, content) {
    // 获取上个月对象
    let LastMonth = getLastMonth(ShowDate.year, ShowDate.month)
    let Str = ""

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
    let j = 1, k = 1
    for (let i = 0; i < 42; i++) {
        if (i % 7 === 0) {
            Str += "<tr>"
        }
        if (i < ShowDate.dayOfOne) {
            Str += `<td>${LastMonth.dayNum - ShowDate.dayOfOne + i + 1}</td>`
        } else if (i >= ShowDate.dayOfOne && i < ShowDate.dayOfOne + ShowDate.dayNum) {
            Str += `<td>${j}</td>`
            j++
        } else {
            Str += `<td>${k}</td>`
            k++
        }
        if (i % 7 === 6) {
            Str += "</tr>"
        }
    }
    content.innerHTML = ""
    table.innerHTML = Str
    content.appendChild(week)
    content.appendChild(table)
}

// 显示月历骨架
function createMonth(content) {
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
}

// 显示年历骨架
function createYear(ShowDate, content) {
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
    return leftYearIndex
}

// 显示日历
function showCalendar(ShowDate, TodayDate, content, content_head) {
    createCalendar(ShowDate, content)
    changeCalendarCss(TodayDate, ShowDate)
    showHead(ShowDate, content_head)
}

// 处理点击月份
function handleMonthClick(ShowDate, TodayDate, content, content_head) {
    ShowDate.showing = 0
    const month = this.childNodes[0].nodeValue.slice(0, -1)
    ShowDate.month = month - 1
    ShowDate.dayNum = getDayNum(ShowDate.year, ShowDate.month)
    ShowDate.dayOfOne = getDayOfOne(ShowDate.year, ShowDate.month);

    showCalendar(ShowDate, TodayDate, content, content_head)  //更新日历
}

// 更改月历显示效果,绑定事件处理函数
function changeMonthCss(ShowDate, TodayDate, content, content_head) {
    const table = content.getElementsByTagName("table")[0]
    table.className = "month_content"
    const MonthList = table.getElementsByTagName("td")
    for (let i = 0; i < 16; i++) {
        MonthList[i].addEventListener("click", handleMonthClick.bind(MonthList[i], ShowDate, TodayDate, content, content_head))  // 通过bind实现函数传参
        if (i >= 12) {
            addClass(MonthList[i], "NotNow")
        }
    }
    if (ShowDate.year === TodayDate.year && ShowDate.month === TodayDate.month) {
        addClass(MonthList[ShowDate.month], "CurMonthItem")
    }
}

// 处理点击年份
function handleYearClick(ShowDate, TodayDate, content, content_head) {
    ShowDate.showing = 1
    const year = this.childNodes[0].nodeValue
    ShowDate.year = year
    ShowDate.dayNum = getDayNum(ShowDate.year, ShowDate.month)
    ShowDate.dayOfOne = getDayOfOne(ShowDate.year, ShowDate.month);

    showMonth(ShowDate, TodayDate, content, content_head)  //显示月历
}

// 显示月历的函数
function showMonth(ShowDate, TodayDate, content, content_head) {
    createMonth(content)
    changeMonthCss(ShowDate, TodayDate, content, content_head)
    showHead(ShowDate, content_head)
}

// 显示当月日历
function showNowMonth(ShowDate, TodayDate, content, content_head) {
    ShowDate = Object.assign(ShowDate, TodayDate)
    ShowDate.showing = 0
    showCalendar(ShowDate, TodayDate, content, content_head)
}

// 更改年历显示效果，绑定事件处理函数
function changeYearCss(leftYearIndex, ShowDate, TodayDate, content, content_head) {
    const table = content.getElementsByTagName("table")[0]
    table.className = "month_content"
    const YearList = table.getElementsByTagName("td")
    for (let i = 0; i < 16; i++) {
        YearList[i].addEventListener("click", handleYearClick.bind(YearList[i], ShowDate, TodayDate, content, content_head))
        if (i < leftYearIndex || i > leftYearIndex + 9) {
            addClass(YearList[i], "NotNow")
        }
    }
    if (ShowDate.year === TodayDate.year) {
        addClass(YearList[leftYearIndex + TodayDate.year % 10], "CurMonthItem")
    }
}


// 显示年历
function showYear(ShowDate, TodayDate, content, content_head) {
    const leftYearIndex = createYear(ShowDate, content)
    changeYearCss(leftYearIndex, ShowDate, TodayDate, content, content_head)
    showHead(ShowDate, content_head)
}

export {
    displayTime,
    showToday,
    changeCalendarCss,
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
}