import {
  WEEK,
  NUMOF_CANLENDER_ITEM,
  NUMOF_CANLENDER_ROW_ITEM,
  NUMOF_MONTH_YEAR_ROW_ITEM,
  NUMOF_MONTH_YEAR_ITEM,
  NUM_OF_NEAR_YEARS,
  MONTH_NUM_OF_YEAR,
  NUMOF_TABLE,
  SHOWING_STATE,
} from "./config.js";

import { getDayNum, getDayOfOne, getPrevMonth, getNextMonth } from "./utils.js";

// import {
//     stateMachine
// } from "./statemachine.js"

// 显示当前时间的函数
function displayTime(container) {
  const nowDate = new Date();
  let hour = nowDate.getHours();
  let minute = nowDate.getMinutes();
  minute = minute < 10 ? `0${minute}` : minute;
  let second = nowDate.getSeconds();
  second = second < 10 ? `0${second}` : second;
  let clockStr = `${hour}:${minute}:${second}`;
  let clock = container.getElementsByClassName("clock")[0];
  clock.innerHTML = clockStr;
}

function showClock(container) {
  window.setInterval(function () {
    displayTime(container);
  }, 1000);
}

// 显示今天日期的函数
function showToday(todayDate, node) {
  console.log(node);
  let today = `${todayDate.year}年${todayDate.month + 1}月${todayDate.date}日`;
  node.innerHTML = today;
}

// 显示x历头
function showHead(showDate, node, stateMachine) {
  console.log(stateMachine);
  let str = "";
  if (stateMachine.currentState === SHOWING_STATE.DAY) {
    str = `${showDate.year}年${showDate.month + 1}月`;
  } else if (stateMachine.currentState === SHOWING_STATE.MONTH) {
    str = `${showDate.year}年`;
  } else if (stateMachine.currentState === SHOWING_STATE.YEAR) {
    str = `${showDate.year - (showDate.year % NUM_OF_NEAR_YEARS)}-${
      showDate.year - (showDate.year % NUM_OF_NEAR_YEARS) + NUM_OF_NEAR_YEARS - 1
    }`;
  }
  node.innerHTML = str;
}

// 生成一个月的日历骨架
function createSingleMonth(showDate) {
  // 获取上个月对象
  let LastMonth = getPrevMonth(showDate.year, showDate.month);
  let table = document.createElement("table");
  let Str = "";
  // 生成表内容
  table.classList.add("calender-content");
  let j = 1,
    k = 1;
  for (let i = 0; i < NUMOF_CANLENDER_ITEM; i++) {
    if (i % NUMOF_CANLENDER_ROW_ITEM === 0) {
      Str += "<tr>";
    }
    if (i < showDate.dayOfOne) {
      Str += `<td>${LastMonth.dayNum - showDate.dayOfOne + i + 1}</td>`;
    } else if (i >= showDate.dayOfOne && i < showDate.dayOfOne + showDate.dayNum) {
      Str += `<td>${j}</td>`;
      j++;
    } else {
      Str += `<td>${k}</td>`;
      k++;
    }
    if (i % NUMOF_CANLENDER_ROW_ITEM === NUMOF_CANLENDER_ROW_ITEM - 1) {
      Str += "</tr>";
    }
  }
  table.innerHTML = Str;
  return table;
}

// 显示全部日历骨架
function createCalendar(showDate, content) {
  // 生成表头
  let week = document.createElement("div");
  week.classList.add("week");
  for (let k = 0; k < NUMOF_CANLENDER_ROW_ITEM; k++) {
    let item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = WEEK[k];
    week.appendChild(item);
  }

  // 生成三个表
  const table_last = createSingleMonth(getPrevMonth(showDate.year, showDate.month));
  const table_now = createSingleMonth(showDate);
  const table_next = createSingleMonth(getNextMonth(showDate.year, showDate.month));

  // 轮播图容器
  const carousel_container = document.createElement("div");
  carousel_container.setAttribute("class", "carousel-container");

  // 轮播图
  const calender_carousel = document.createElement("div");
  calender_carousel.setAttribute("class", "calender-carousel");
  calender_carousel.appendChild(table_last);
  calender_carousel.appendChild(table_now);
  calender_carousel.appendChild(table_next);

  carousel_container.appendChild(calender_carousel);

  content.innerHTML = "";
  content.appendChild(week);
  content.appendChild(carousel_container);
  console.log("createCalendar");
}

// 更改日历显示效果
function changeCalendarCss(todayDate, showDate, content) {
  const table = content.getElementsByTagName("table")[1];
  let calendarList = table.getElementsByTagName("td");
  for (let i = 0; i < NUMOF_CANLENDER_ITEM; i++) {
    if (i < showDate.dayOfOne || i >= showDate.dayOfOne + showDate.dayNum) {
      calendarList[i].classList.add("not-now");
    }
  }
  if (showDate.year === todayDate.year && showDate.month === todayDate.month) {
    calendarList[showDate.dayOfOne + todayDate.date - 1].classList.add("curdate-item");
    let str = `<div class="curdate">${todayDate.date}</div>`;
    calendarList[showDate.dayOfOne + todayDate.date - 1].innerHTML = str;
  }
}

// 显示日历
function showCalendar(showDate, todayDate, content, content_head, stateMachine) {
  console.log("showCalendar");
  console.log(stateMachine);
  createCalendar(showDate, content);
  changeCalendarCss(todayDate, showDate, content);
  showHead(showDate, content_head, stateMachine);
}

// 显示月历骨架
function createMonth(content) {
  // 生成一个表格
  let str = "<table>";
  for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM; i++) {
    if (i % NUMOF_MONTH_YEAR_ROW_ITEM === 0) {
      str += "<tr>";
    }
    str += `<td>${(i % MONTH_NUM_OF_YEAR) + 1}月</td>`;
    if (i % NUMOF_MONTH_YEAR_ROW_ITEM === NUMOF_MONTH_YEAR_ROW_ITEM - 1) {
      str += "</tr>";
    }
  }
  str += "</table>";

  // 生成轮播图
  const month_carousel = document.createElement("div");
  month_carousel.classList.add("month_carousel");
  month_carousel.innerHTML = str + str + str;

  content.innerHTML = "";
  content.appendChild(month_carousel);
}

// 更改月历显示效果,绑定事件处理函数
function changeMonthCss(showDate, todayDate, content, content_head, stateMachine) {
  const tableList = content.getElementsByTagName("table");
  for (let i = 0; i < NUMOF_TABLE; i++) {
    tableList[i].classList.add("month-content");
  }
  const monthList = tableList[1].getElementsByTagName("td");
  for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM; i++) {
    monthList[i].addEventListener("click", function () {
      handleMonthClick.call(monthList[i], showDate, todayDate, content, content_head, stateMachine);
    });
    if (i >= MONTH_NUM_OF_YEAR) {
      monthList[i].classList.add("not-now");
    }
  }
  if (showDate.year === todayDate.year && showDate.month === todayDate.month) {
    monthList[showDate.month].classList.add("curmonth-item");
  }
}

// 显示月历的函数
function showMonth(showDate, todayDate, content, content_head, stateMachine) {
  createMonth(content);
  changeMonthCss(showDate, todayDate, content, content_head, stateMachine);
  showHead(showDate, content_head, stateMachine);
}

// 显示年历骨架
function createYear(showDate, content) {
  // 生成表格骨架
  let index = [3, 0, 1, 2];
  let leftYear = showDate.year - (showDate.year % NUM_OF_NEAR_YEARS);
  let leftYearIndex = index[leftYear % NUMOF_MONTH_YEAR_ROW_ITEM];
  let str = "";
  const firstYear = leftYear - leftYearIndex - NUMOF_MONTH_YEAR_ITEM;
  for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM * NUMOF_TABLE; i++) {
    if (i % NUMOF_MONTH_YEAR_ITEM === 0) {
      str += "<table>";
    }
    if (i % NUMOF_MONTH_YEAR_ROW_ITEM === 0) {
      str += "<tr>";
    }
    str += `<td>${firstYear + i}</td>`;
    if (i % NUMOF_MONTH_YEAR_ROW_ITEM === NUMOF_MONTH_YEAR_ROW_ITEM - 1) {
      str += "</tr>";
    }
    if (i % NUMOF_MONTH_YEAR_ITEM === NUMOF_MONTH_YEAR_ITEM - 1) {
      str += "</table>";
    }
  }

  // 生成轮播图
  const month_carousel = document.createElement("div");
  month_carousel.classList.add("month_carousel");
  month_carousel.innerHTML = str;

  content.innerHTML = "";
  content.appendChild(month_carousel);

  return leftYearIndex;
}

// 更改年历显示效果，绑定事件处理函数
function changeYearCss(leftYearIndex, showDate, todayDate, content, content_head, stateMachine) {
  const tableList = content.getElementsByTagName("table");
  for (let i = 0; i < NUMOF_TABLE; i++) {
    tableList[i].classList.add("month-content");
  }
  const YearList = tableList[1].getElementsByTagName("td");
  for (let i = 0; i < NUMOF_MONTH_YEAR_ITEM; i++) {
    YearList[i].addEventListener("click", function () {
      handleYearClick.call(YearList[i], showDate, todayDate, content, content_head, stateMachine);
    });
    if (i < leftYearIndex || i >= leftYearIndex + NUM_OF_NEAR_YEARS) {
      YearList[i].classList.add("not-now");
    }
  }
  if (showDate.year === todayDate.year) {
    YearList[leftYearIndex + (todayDate.year % NUM_OF_NEAR_YEARS)].classList.add("curmonth-item");
  }
}

// 显示年历
function showYear(showDate, todayDate, content, content_head, stateMachine) {
  const leftYearIndex = createYear(showDate, content);
  changeYearCss(leftYearIndex, showDate, todayDate, content, content_head, stateMachine);
  showHead(showDate, content_head, stateMachine);
}

// 处理点击月份
function handleMonthClick(showDate, todayDate, content, content_head, stateMachine) {
  const month = this.childNodes[0].nodeValue.slice(0, -1);
  showDate.month = month - 1;
  showDate.dayNum = getDayNum(showDate.year, showDate.month);
  showDate.dayOfOne = getDayOfOne(showDate.year, showDate.month);
  stateMachine.toDayCalendar(showDate, todayDate, content, content_head, stateMachine);
}

// 处理点击年份
function handleYearClick(showDate, todayDate, content, content_head, stateMachine) {
  const year = this.childNodes[0].nodeValue;
  showDate.year = Number(year);
  showDate.dayNum = getDayNum(showDate.year, showDate.month);
  showDate.dayOfOne = getDayOfOne(showDate.year, showDate.month);
  stateMachine.toMonthCalendar(showDate, todayDate, content, content_head, stateMachine);
}

// 显示当月日历
function showNowMonth(showDate, todayDate, content, content_head, stateMachine) {
  showDate = Object.assign(showDate, todayDate);
  console.log("showNowMonth");
  console.log(stateMachine);
  stateMachine.toDayCalendar(showDate, todayDate, content, content_head, stateMachine);
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
};
