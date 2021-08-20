import {
  getDayNum,
  getDayOfOne,
  getPrevMonth,
  getNextMonth,
  getPrevYear,
  getNextYear,
  getPrevTenYear,
  getNextTenYear,
  createCss,
} from "./utils.js";

import { SHOWING_STATE, TRANS_TIME } from "./config.js";

import {
  showToday,
  showCalendar,
  showMonth,
  showNowMonth,
  showYear,
  showClock,
} from "./display.js";

import { CalendarstateMachine } from "./statemachine.js";

// 页面初始化要调用的函数
function calendarOnload(
  showDate,
  todayDate,
  content,
  content_head,
  todayTime,
  container,
  stateMachine
) {
  showClock(container);
  showToday(todayDate, todayTime);
  showCalendar(showDate, todayDate, content, content_head, stateMachine);
}

// // 首部拖拽
// const dragableTop = document.querySelector(".dragable")

// dragableTop.addEventListener("")

// -----蓝字部分------------------------------------------
// 发现这里此时的showDate是最最开始的showDate，而且showNowMonth里对showDate的更改根本没传出来，说明这个已经不是一个showDate了,因此这样的
// 绑定事件带引用类型的参数不好。（猜测可能是代码执行到这行的时候，x.bind()直接把后面那一溜参数给了showNowMonth，然后返回了showNowMonth的拷贝，并且参数可能是也进行了拷贝，而不是直接传的，所以才会发生这种情况）
// todayTime.addEventListener("click", showNowMonth.bind(todayTime, showDate, todayDate, content, content_head))

// 因此采用匿名函数,this而且还是指向的不会出问题，但如果真正执行的函数需要this就还是要用call
// (为啥，不是说匿名函数this都指向window吗？看来这里是按对象方法来调用的)
// todayTime.addEventListener("click", function () {
//   console.log(this)
//   showNowMonth(showDate, todayDate, content, content_head)
// })

// // ----x历头----------------------------------------------
// content_head.addEventListener("click", handleContentClick)

// 处理点击 x 历头
function handleContentClick(showDate, todayDate, content, content_head, stateMachine) {
  if (stateMachine.currentState === SHOWING_STATE.DAY) {
    stateMachine.toMonthCalendar(showDate, todayDate, content, content_head, stateMachine);
  } else if (stateMachine.currentState === SHOWING_STATE.MONTH) {
    stateMachine.toYearCalender(showDate, todayDate, content, content_head, stateMachine);
  }
}

// 显示上个月x历
function showLast(showDate, todayDate, content, content_head, container, stateMachine) {
  if (stateMachine.currentState === SHOWING_STATE.DAY) {
    //如果在显示日历
    carouselTrans(
      container.getElementsByClassName("calender-carousel")[0],
      "prev",
      TRANS_TIME,
      showDate,
      todayDate,
      content,
      content_head,
      stateMachine
    );
  } else if (stateMachine.currentState === SHOWING_STATE.MONTH) {
    //如果在显示月历
    carouselTrans(
      container.getElementsByClassName("month_carousel")[0],
      "prev",
      TRANS_TIME,
      showDate,
      todayDate,
      content,
      content_head,
      stateMachine
    );
  } else if (stateMachine.currentState === SHOWING_STATE.YEAR) {
    //如果在显示年历
    carouselTrans(
      container.getElementsByClassName("month_carousel")[0],
      "prev",
      TRANS_TIME,
      showDate,
      todayDate,
      content,
      content_head,
      stateMachine
    );
  }
}

// 显示下个月x历
function showNext(showDate, todayDate, content, content_head, container, stateMachine) {
  if (stateMachine.currentState === SHOWING_STATE.DAY) {
    carouselTrans(
      container.getElementsByClassName("calender-carousel")[0],
      "next",
      TRANS_TIME,
      showDate,
      todayDate,
      content,
      content_head,
      stateMachine
    );
  } else if (stateMachine.currentState === SHOWING_STATE.MONTH) {
    //如果在显示月历
    carouselTrans(
      container.getElementsByClassName("month_carousel")[0],
      "next",
      TRANS_TIME,
      showDate,
      todayDate,
      content,
      content_head,
      stateMachine
    );
  } else if (stateMachine.currentState === SHOWING_STATE.YEAR) {
    //如果在显示年历
    carouselTrans(
      container.getElementsByClassName("month_carousel")[0],
      "next",
      TRANS_TIME,
      showDate,
      todayDate,
      content,
      content_head,
      stateMachine
    );
  }
}

// 实现过渡效果 先给轮播图加上trans, 再移动top, 移完了，去掉trans,更新日历
function carouselTrans(
  carousel,
  method,
  time,
  showDate,
  todayDate,
  content,
  content_head,
  stateMachine
) {
  const table_height = window.getComputedStyle(carousel.getElementsByTagName("table")[0]).height; // 获取最终元素的style，是只读的，而style是只写的

  carousel.classList.add("trans");

  if (method === "prev") {
    carousel.style.top = `0px`; //移动top

    setTimeout(function () {
      carousel.classList.remove("trans");
      if (stateMachine.currentState === SHOWING_STATE.DAY) {
        //如果在显示日历
        showDate = Object.assign(showDate, getPrevMonth(showDate.year, showDate.month));
        showCalendar(showDate, todayDate, content, content_head, stateMachine);
      } else if (stateMachine.currentState === SHOWING_STATE.MONTH) {
        //如果在显示月历
        showDate = Object.assign(showDate, getPrevYear(showDate.year, showDate.month));
        showMonth(showDate, todayDate, content, content_head, stateMachine);
      } else if (stateMachine.currentState === SHOWING_STATE.YEAR) {
        //如果在显示年历
        showDate = Object.assign(showDate, getPrevTenYear(showDate.year, showDate.month));
        showYear(showDate, todayDate, content, content_head, stateMachine);
      }
    }, time * 1000);
  } else if (method === "next") {
    carousel.style.top = `${-2 * table_height.slice(0, -2)}px`; //移动top

    setTimeout(function () {
      carousel.classList.remove("trans");
      if (stateMachine.currentState === SHOWING_STATE.DAY) {
        //如果在显示日历
        showDate = Object.assign(showDate, getNextMonth(showDate.year, showDate.month));
        showCalendar(showDate, todayDate, content, content_head, stateMachine);
      } else if (stateMachine.currentState === SHOWING_STATE.MONTH) {
        //如果在显示月历
        showDate = Object.assign(showDate, getNextYear(showDate.year, showDate.month));
        showMonth(showDate, todayDate, content, content_head, stateMachine);
      } else if (stateMachine.currentState === SHOWING_STATE.YEAR) {
        //如果在显示年历
        showDate = Object.assign(showDate, getNextTenYear(showDate.year, showDate.month));
        showYear(showDate, todayDate, content, content_head, stateMachine);
      }
    }, time * 1000);
  }
}

class Calendar {
  install(idName) {
    const htmlstr = `
    <div class="calender">
        <div class="dragable"></div>
        <div class="top">
            <div class="clock">
                00:00:00
            </div>
            <div class="today-time">
                <span class="today-font js_todaytime">2021年8月12日 七月初五</span>
            </div>
        </div>
        <div class="main">
            <div class="calendar-top">
                <div class="description">
                    <span class="show-month" class="clickable">2021年8月</span>
                    <div class="button">
                        <div class="arrow clickable arrow-next js_arrow_down"></div>
                    </div>
                    <div class="button">
                        <div class="arrow clickable arrow-prev js_arrow_up"></div>
                    </div>
                </div>
            </div>
            <div class="content">
            </div>
        </div>
    </div>`;
    createCss("calendar-module/styles/basic.css");
    const container = document.querySelector(idName);
    container.innerHTML = htmlstr;

    const myDate = new Date();
    const stateMachine = new CalendarstateMachine();
    // 存当前处于时间的对象
    const todayDate = {
      year: myDate.getFullYear(),
      month: myDate.getMonth(),
      date: myDate.getDate(),
    };

    // 初始化当前时间对象
    todayDate.dayNum = getDayNum(todayDate.year, todayDate.month);
    todayDate.dayOfOne = getDayOfOne(todayDate.year, todayDate.month);

    // 初始化当前显示时间对象
    let showDate = {};
    showDate = Object.assign(showDate, todayDate); // 浅拷贝就够了
    // 获取主要要显示内容的元素节点容器
    const todayTime = container.querySelector(".js_todaytime");
    const content = container.querySelector(".content");
    const content_head = container.querySelector(".show-month");

    // // 首部拖拽
    // const dragableTop = container.querySelector(".dragable")

    // dragableTop.addEventListener("")

    window.addEventListener("DOMContentLoaded", function () {
      calendarOnload(
        showDate,
        todayDate,
        content,
        content_head,
        todayTime,
        container,
        stateMachine
      );
    });
    // 绑定蓝字
    todayTime.addEventListener("click", function () {
      showNowMonth(showDate, todayDate, content, content_head, stateMachine);
    });

    // ----x历头----------------------------------------------
    content_head.addEventListener("click", function () {
      handleContentClick(showDate, todayDate, content, content_head, stateMachine);
    });

    // ----上下键部分------------------

    const lastButton = container.querySelector(".js_arrow_up");
    const nextButton = container.querySelector(".js_arrow_down");
    nextButton.addEventListener("click", function () {
      showNext(showDate, todayDate, content, content_head, container, stateMachine);
    });
    lastButton.addEventListener("click", function () {
      showLast(showDate, todayDate, content, content_head, container, stateMachine);
    });
  }
}

export default Calendar;
