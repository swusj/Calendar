import {
    WEEK,
} from './config.js'

import {
    getDayNum,
    getDayOfOne,
    getLastMonth,
    addClass,
    getNextMonth
} from "./utils.js";


// 显示当前时间的函数
function displayTime() {
    const nowDate = new Date();
    let hour = nowDate.getHours();
    let minute = nowDate.getMinutes();
    minute = minute < 10 ? `0${minute}` : minute;
    let second = nowDate.getSeconds();
    second = second < 10 ? `0${second}` : second;
    let clockStr = `${hour}:${minute}:${second}`;
    let clock = document.getElementById("clock");
    clock.innerHTML = clockStr;
}

function showClock() {
    window.setInterval(displayTime, 1000);
}

// 显示今天日期的函数
function showToday(todayDate, node) {
    let today = `${todayDate.year}年${todayDate.month + 1}月${todayDate.date}日`;
    node.innerHTML = today;
}

// 显示x历头
function showHead(showDate, node) {
    let str = ""
    if (showDate.showing === 0) {
        str = `${showDate.year}年${showDate.month + 1}月`
    } else if (showDate.showing === 1) {
        str = `${showDate.year}年`
    } else if (showDate.showing === 2) {
        str = `${showDate.year - showDate.year % 10}-${(showDate.year - showDate.year % 10) + 9}`
    }
    node.innerHTML = str
}

// 生成一个月的日历骨架
function createSingleMonth(showDate) {
    // 获取上个月对象
    let LastMonth = getLastMonth(showDate.year, showDate.month)
    let table = document.createElement("table")
    let Str = ""
    // 生成表内容
    addClass(table, "calender_content")
    let j = 1, k = 1
    for (let i = 0; i < 42; i++) {
        if (i % 7 === 0) {
            Str += "<tr>"
        }
        if (i < showDate.dayOfOne) {
            Str += `<td>${LastMonth.dayNum - showDate.dayOfOne + i + 1}</td>`
        } else if (i >= showDate.dayOfOne && i < showDate.dayOfOne + showDate.dayNum) {
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
    table.innerHTML = Str
    return table
}


// 显示全部日历骨架
function createCalendar(showDate, content) {
    // 生成表头
    let week = document.createElement("div")
    week.setAttribute("id", "week")
    for (let k = 0; k < 7; k++) {
        let item = document.createElement("div")
        item.setAttribute("class", "item")
        item.innerHTML = WEEK[k]
        week.appendChild(item)
    }

    // 生成三个表
    const table_last = createSingleMonth(getLastMonth(showDate.year, showDate.month))
    const table_now = createSingleMonth(showDate)
    const table_next = createSingleMonth(getNextMonth(showDate.year, showDate.month))

    // 轮播图容器
    const carousel_container = document.createElement("div")
    carousel_container.setAttribute("class", "carousel_container")

    // 轮播图
    const calender_carousel = document.createElement("div")
    calender_carousel.setAttribute("class", "calender_carousel")
    calender_carousel.appendChild(table_last)
    calender_carousel.appendChild(table_now)
    calender_carousel.appendChild(table_next)

    carousel_container.appendChild(calender_carousel)

    content.innerHTML = ""
    content.appendChild(week)
    content.appendChild(carousel_container)
}


// 更改日历显示效果
function changeCalendarCss(todayDate, showDate, content) {
    const table = content.getElementsByTagName("table")[1]
    let calendarList = table.getElementsByTagName("td")
    for (let i = 0; i < 42; i++) {
        if (i < showDate.dayOfOne || i >= (showDate.dayOfOne + showDate.dayNum)) {
            addClass(calendarList[i], "NotNow")
        }
    }
    if (showDate.year === todayDate.year && showDate.month === todayDate.month && showDate.date === todayDate.date) {
        addClass(calendarList[showDate.dayOfOne + todayDate.date - 1], "CurDateItem")
        let str = `<div class="CurDate">${todayDate.date}</div>`
        calendarList[showDate.dayOfOne + todayDate.date - 1].innerHTML = str
    }
}


// 显示日历
function showCalendar(showDate, todayDate, content, content_head) {
    // TODO 显示上中下三个月的日历
    createCalendar(showDate, content)
    changeCalendarCss(todayDate, showDate, content)
    showHead(showDate, content_head)
}

// 显示月历骨架
function createMonth(content) {
    // 生成一个表格
    let str = "<table>"
    for (let i = 0; i < 16; i++) {
        if (i % 4 === 0) {
            str += "<tr>"
        }
        str += `<td>${i % 12 + 1}月</td>`
        if (i % 4 === 3) {
            str += "</tr>"
        }
    }
    str += "</table>"

    // 生成轮播图
    const month_carousel = document.createElement("div")
    addClass(month_carousel, "month_carousel")
    month_carousel.innerHTML = str + str + str

    content.innerHTML = ""
    content.appendChild(month_carousel)
}

// 更改月历显示效果,绑定事件处理函数
function changeMonthCss(showDate, todayDate, content, content_head) {
    const tableList = content.getElementsByTagName("table")
    for (let i = 0; i < 3; i++) {
        addClass(tableList[i], "month_content")
    }
    const monthList = tableList[1].getElementsByTagName("td")
    for (let i = 0; i < 16; i++) {
        monthList[i].addEventListener("click", handleMonthClick.bind(monthList[i], showDate, todayDate, content, content_head))  // 通过bind实现函数传参
        if (i >= 12) {
            addClass(monthList[i], "NotNow")
        }
    }
    if (showDate.year === todayDate.year && showDate.month === todayDate.month) {
        addClass(monthList[showDate.month], "CurMonthItem")
    }
}

// 显示月历的函数
function showMonth(showDate, todayDate, content, content_head) {
    createMonth(content)
    changeMonthCss(showDate, todayDate, content, content_head)
    showHead(showDate, content_head)
}

// 显示年历骨架
function createYear(showDate, content) {
    // 生成表格骨架
    let index = [3, 0, 1, 2]
    let leftYear = showDate.year - showDate.year % 10
    let leftYearIndex = index[leftYear % 4]
    let str = ""
    const firstYear = leftYear - leftYearIndex - 16
    for (let i = 0; i < 48; i++) {
        if (i % 16 === 0) {
            str += "<table>"
        }
        if (i % 4 === 0) {
            str += "<tr>"
        }
        str += `<td>${firstYear + i}</td>`
        if (i % 4 === 3) {
            str += "</tr>"
        }
        if (i % 16 === 15) {
            str += "</table>"
        }
    }

    // 生成轮播图
    const month_carousel = document.createElement("div")
    addClass(month_carousel, "month_carousel")
    month_carousel.innerHTML = str

    content.innerHTML = ""
    content.appendChild(month_carousel)

    return leftYearIndex
}

// 更改年历显示效果，绑定事件处理函数
function changeYearCss(leftYearIndex, showDate, todayDate, content, content_head) {
    const tableList = content.getElementsByTagName("table")
    for (let i = 0; i < 3; i++) {
        addClass(tableList[i], "month_content")
    }
    const YearList = tableList[1].getElementsByTagName("td")
    for (let i = 0; i < 16; i++) {
        YearList[i].addEventListener("click", handleYearClick.bind(YearList[i], showDate, todayDate, content, content_head))
        if (i < leftYearIndex || i > leftYearIndex + 9) {
            addClass(YearList[i], "NotNow")
        }
    }
    if (showDate.year === todayDate.year) {
        addClass(YearList[leftYearIndex + todayDate.year % 10], "CurMonthItem")
    }
}

// 显示年历
function showYear(showDate, todayDate, content, content_head) {
    const leftYearIndex = createYear(showDate, content)
    changeYearCss(leftYearIndex, showDate, todayDate, content, content_head)
    showHead(showDate, content_head)
}

// 处理点击月份
function handleMonthClick(showDate, todayDate, content, content_head) {
    showDate.showing = 0
    const month = this.childNodes[0].nodeValue.slice(0, -1)
    showDate.month = month - 1
    showDate.dayNum = getDayNum(showDate.year, showDate.month)
    showDate.dayOfOne = getDayOfOne(showDate.year, showDate.month);

    showCalendar(showDate, todayDate, content, content_head)  //更新日历
}

// 处理点击年份
function handleYearClick(showDate, todayDate, content, content_head) {
    showDate.showing = 1
    const year = this.childNodes[0].nodeValue
    showDate.year = Number(year)
    showDate.dayNum = getDayNum(showDate.year, showDate.month)
    showDate.dayOfOne = getDayOfOne(showDate.year, showDate.month);

    showMonth(showDate, todayDate, content, content_head)  //显示月历
}


// 显示当月日历
function showNowMonth(showDate, todayDate, content, content_head) {
    showDate = Object.assign(showDate, todayDate)
    showDate.showing = 0
    showCalendar(showDate, todayDate, content, content_head)
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