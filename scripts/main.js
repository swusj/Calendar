import {
  getDayNum,
  getDayOfOne,
  getLastMonth,
  getNextMonth,
  getLastYear,
  getNextYear,
  getLastTenYear,
  getNextTenYear,
  addClass,
} from "./utils.js";

import {
  showToday,
  showCalendar,
  showMonth,
  showNowMonth,
  showYear,
  showClock,
} from './display.js'

const myDate = new Date();

// 存当前处于时间的对象
const todayDate = {
  year: myDate.getFullYear(),
  month: myDate.getMonth(),
  date: myDate.getDate(),
  showing: 0
};

// 初始化当前时间对象
todayDate.dayNum = getDayNum(todayDate.year, todayDate.month);
todayDate.dayOfOne = getDayOfOne(todayDate.year, todayDate.month);

// 初始化当前显示时间对象
let ShowDate = {};
ShowDate = Object.assign(ShowDate, todayDate); // 浅拷贝就够了
ShowDate.showing = 0  // 当前显示的是日历还是月历还是年历

// 获取主要要显示内容的元素节点容器
const todayTime = document.getElementById("todayTime");
const content = document.getElementsByClassName("content")[0]
const content_head = document.getElementById("show_month")



// 绑定各种事件

// ---绑定页面加载完成-------------------------------------
window.addEventListener("load", calendarOnload);

// 页面初始化要调用的函数
function calendarOnload() {
  showClock();
  showToday(todayDate, todayTime);
  showCalendar(ShowDate, todayDate, content, content_head)
}

// -----蓝字部分------------------------------------------
todayTime.addEventListener("click", showNowMonth.bind(todayTime, ShowDate, todayDate, content, content_head))

// ----x历头----------------------------------------------
content_head.addEventListener("click", handleContentClick)

// 处理点击 x 历头
function handleContentClick() {
  if (ShowDate.showing < 3) {
    ShowDate.showing++
  }
  if (ShowDate.showing === 1) {
    showMonth(ShowDate, todayDate, content, content_head)
  }
  if (ShowDate.showing === 2) {
    showYear(ShowDate, todayDate, content, content_head)
  }
}

// ----上下键部分------------------
const LastButton = document.getElementsByClassName("arrowLast")[0]
const NextButton = document.getElementsByClassName("arrowNext")[0]
NextButton.addEventListener("click", showNext.bind())
LastButton.addEventListener("click", showLast.bind())

// 显示上个月x历 
function showLast() {
  if (ShowDate.showing === 0) { //如果在显示日历
    carouselTrans(document.getElementsByClassName("calender_carousel")[0], "last", 0.3)
  } else if (ShowDate.showing === 1) { //如果在显示月历
    carouselTrans(document.getElementsByClassName("month_carousel")[0], "last", 0.3)
  } else if (ShowDate.showing === 2) { //如果在显示年历
    carouselTrans(document.getElementsByClassName("month_carousel")[0], "last", 0.3)
  }
}

// 显示下个月x历
function showNext() {
  if (ShowDate.showing === 0) {
    carouselTrans(document.getElementsByClassName("calender_carousel")[0], "next", 0.3)
  } else if (ShowDate.showing === 1) { //如果在显示月历
    carouselTrans(document.getElementsByClassName("month_carousel")[0], "next", 0.3)
  } else if (ShowDate.showing === 2) { //如果在显示年历
    carouselTrans(document.getElementsByClassName("month_carousel")[0], "next", 0.3)
  }
}

// 实现过渡效果 先给轮播图加上trans, 再移动top, 移完了，去掉trans,更新日历 
function carouselTrans(carousel, method, time) {
  const table_height = window.getComputedStyle(carousel.getElementsByTagName("table")[0]).height;  // 获取最终元素的style，是只读的，而style是只写的

  addClass(carousel, "trans")

  if (method === "last") {
    carousel.style.top = `0px` //移动top

    setTimeout(function () {
      carousel.classList.remove("trans")
      if (ShowDate.showing === 0) { //如果在显示月历
        ShowDate = getLastMonth(ShowDate.year, ShowDate.month)
        showCalendar(ShowDate, todayDate, content, content_head)
      } else if (ShowDate.showing === 1) { //如果在显示月历
        ShowDate = getLastYear(ShowDate.year, ShowDate.month)
        showMonth(ShowDate, todayDate, content, content_head)
      } else if (ShowDate.showing === 2) { //如果在显示年历
        ShowDate = getLastTenYear(ShowDate.year, ShowDate.month)
        showYear(ShowDate, todayDate, content, content_head)
      }
    }, time * 1000)
  } else if (method === "next") {
    carousel.style.top = `${-2 * table_height.slice(0, -2)}px` //移动top

    setTimeout(function () {
      carousel.classList.remove("trans")
      if (ShowDate.showing === 0) { //如果在显示月历
        ShowDate = getNextMonth(ShowDate.year, ShowDate.month)
        showCalendar(ShowDate, todayDate, content, content_head)
      } else if (ShowDate.showing === 1) { //如果在显示月历
        ShowDate = getNextYear(ShowDate.year, ShowDate.month)
        showMonth(ShowDate, todayDate, content, content_head)
      } else if (ShowDate.showing === 2) { //如果在显示年历
        ShowDate = getNextTenYear(ShowDate.year, ShowDate.month)
        showYear(ShowDate, todayDate, content, content_head)
      }
    }, time * 1000)
  }
}



