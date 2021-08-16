import {
    MonthOfLeapYear,
    MonthOfComYear,
    DayChange,
    Week,
    ShowList
} from './config.js'

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

// 显示今天日期的函数
function showToday(year, month, day, node) {
    let today = `${year}年${month}月${day}日`;
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


// 显示日历头
function showHead(ShowDate, node, showing) {
    let str = ""

    if (showing === 0) {
        str = `${ShowDate.year}年${ShowDate.month + 1}月`
    } else if (showing === 1) {
        str = `${ShowDate.year}年`
    } else if (showing === 2) {
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

export {
    displayTime,
    showToday,
    changeCalendarCss,
    showHead,
    createCalendar,
    createMonth,
    createYear,
}