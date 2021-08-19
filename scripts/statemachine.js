import {
    showCalendar,
    showMonth,
    showYear,
} from './display.js'

import {
    SHOWING_STATE
} from './config.js'

var CalendarstateMachine = {
    // 当前状态
    currentState: SHOWING_STATE.DAY,
    toDayCalendar: function (showDate, todayDate, content, content_head) {
        this.currentState = SHOWING_STATE.DAY
        showCalendar(showDate, todayDate, content, content_head)
    },
    toMonthCalendar: function (showDate, todayDate, content, content_head) {
        this.currentState = SHOWING_STATE.MONTH
        showMonth(showDate, todayDate, content, content_head)
    },
    toYearCalender: function (showDate, todayDate, content, content_head) {
        this.currentState = SHOWING_STATE.YEAR
        showYear(showDate, todayDate, content, content_head)
    }
}

export {
    CalendarstateMachine
}