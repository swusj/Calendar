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
    displayTime,
    showToday,
    changeCalendarCss,
    showHead,
    createCalendar,
    createMonth,
    createYear,
    showCalendar
} from './display.js'

// 处理点击月份
function handleMonthClick(TodayDate, ShowDate, content, content_head) {
    ShowDate.showing = 0
    const month = this.childNodes[0].nodeValue.slice(0, -1)
    ShowDate.month = month - 1
    ShowDate.dayNum = getDayNum(ShowDate.year, ShowDate.month)
    ShowDate.dayOfOne = getDayOfOne(ShowDate.year, ShowDate.month);

    showCalendar(TodayDate, ShowDate, content, content_head)  //更新日历
}

// 更改月历显示效果,绑定事件处理函数
function changeMonthCss(ShowDate, TodayDate, content, content_head) {
    const table = content.getElementsByTagName("table")[0]
    table.className = "month_content"
    const MonthList = table.getElementsByTagName("td")
    for (let i = 0; i < 16; i++) {
        MonthList[i].addEventListener("click", handleMonthClick.bind(MonthList[i], TodayDate, ShowDate, content, content_head))  // 通过bind实现函数传参
        if (i >= 12) {
            addClass(MonthList[i], "NotNow")
        }
    }
    if (ShowDate.year === TodayDate.year && ShowDate.month === TodayDate.month) {
        addClass(MonthList[ShowDate.month], "CurMonthItem")
    }
}

// 处理点击年份
function handleYearClick(TodayDate, ShowDate, content, content_head) {
    ShowDate.showing = 1
    const year = this.childNodes[0].nodeValue
    ShowDate.year = year
    ShowDate.dayNum = getDayNum(ShowDate.year, ShowDate.month)
    ShowDate.dayOfOne = getDayOfOne(ShowDate.year, ShowDate.month);

    showMonth(ShowDate, TodayDate, content, content_head)  //显示月历
}

export {
    handleMonthClick,
    changeMonthCss,
    handleYearClick,
}