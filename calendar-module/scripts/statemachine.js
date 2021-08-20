import { showCalendar, showMonth, showYear } from "./display.js";

import { SHOWING_STATE } from "./config.js";

class CalendarstateMachine {
  constructor() {
    this.currentState = SHOWING_STATE.DAY;
  }
  toDayCalendar(showDate, todayDate, content, content_head, stateMachine) {
    this.currentState = SHOWING_STATE.DAY;
    showCalendar(showDate, todayDate, content, content_head, stateMachine);
  }
  toMonthCalendar(showDate, todayDate, content, content_head, stateMachine) {
    this.currentState = SHOWING_STATE.MONTH;
    showMonth(showDate, todayDate, content, content_head, stateMachine);
  }
  toYearCalender(showDate, todayDate, content, content_head, stateMachine) {
    this.currentState = SHOWING_STATE.YEAR;
    showYear(showDate, todayDate, content, content_head, stateMachine);
  }
}

export { CalendarstateMachine };
