# Demo 讲解

地址，截图，说明

# 开发的思路和细节说明

DEMO 地址：https://swusj.github.io/Calendar/index.html

问题 1：如何正确显示当前日期日历？
首先 api 获取当前年月日，但要正常显示在 6\*7 格子中，需要了解这个月有多少天，1 号是周几，才好排列
（上个月（主要是上个月有多少天）和下个月的日期也要显示几个）

1. 因此首先要有个对象，存当前处于时间（年月日，天数，一号为周几）。const TodayDate (date,month,year,dayNum,dayOfOne)
2. 第二个对象（年月日，天数，一号为周几），存当前显示的时间。let ShowDate (date,month,year,dayNum,dayOfOne)

问题 2：如何点击日历头来切换显示的是日历还是年历？
最开始是用了一个全局变量 showing 来存储当前显示状态，但发现如果将代码拆分到多个文件中去的话，showing 不好更改，因此重新考虑作为 ShowDate 的一个属性 ShowDate.showing 好带着走。

问题 3：怎么实现点击按钮后是滚动切换的效果？
借鉴轮播图的思想。可以先显示 3 个月/年/十年的日历，显示的容器 overflow:hidden，position:relative, size 还是是 x 历该有的大小;内里包含一个放了三个 x 历的 div2，按理来说应该是显示容器的三倍（因为有上中下三个月嘛），设置其 position 为 absolute，top 应该等于负一个 x 历的高度；
滚动就可以 transition: top xs
点击的时候，先给轮播图加上 trans,再更改 div2 的 top，此时 transition 生效开始动画，动画完了(用 settimeout)。去掉 trans,再更改 ShowDate。然后重新渲染 div2 的内容(x 历)
因此所有生成 x 历骨架的函数都要一次性生成三个表格

显示函数：

1. 计时器

1) displayTime 显示当前时刻的函数
2) showClock 用 setInterval 调用 displayTime 实现计时器

2. 蓝字

1) showToday 显示今天日期的函数（蓝字部分）
2) showNowMonth 绑定的点击事件，显示当月日历

3. 日历头

1) showHead 显示 x 历头 (根据当前显示状态不同显示的内容也不同)

3. 显示日历

1) 日历：
   createCalendar 显示全部日历骨架 (先生成 html 骨架)
   changeCalendarCss 更改日历显示效果 (再添加 css)
   showCalendar 显示日历 (调用 createCalendar，changeCalendarCss，showHead)

2) 月历：
   createMonth 显示月历骨架
   changeMonthCss 更改月历显示效果,绑定事件处理函数 handleMonthClick
   showMonth 显示月历(调用 createMonth,changeMonthCss,showHead)

3) 年历：
   createYear 显示年历骨架
   changeYearCss 更改年历显示效果，绑定事件处理函数 handleYearClick
   showYear 显示年历(调用 createYear,changeYearCss,showHead)

交互函数：

1. handleContentClick 处理点击 x 历头 (根据当前状态切换显示日历、年历、月历)
2. handleYearClick 处理点击年份 (显示点击年份的月历)
3. handleMonthClick 处理点击月份 (显示点击月份的日历)
4. showLast 处理点击上箭头，显示上个 x 历 (根据当前状态显示上个日历、年历、月历)
5. showNext 处理点击下箭头，显示下个 x 历 (根据当前状态显示下个日历、年历、月历)

通用工具：

1. isLeapYear 判断是不是闰年的函数
2. getDayNum 根据年份和月份获取月份天数的函数
3. getDayOfOne 获得某年某月的 1 号 是星期几的函数
4. getLastYear 获取上一年日期对象的函数
5. getNextYear 获取下一年日期对象的函数
6. getLastTenYear 获取前十年日期对象的函数
7. getNextTenYear 获取后十年日期对象的函数

onload：

1. calendarOnload 页面初始化要调用的函数(showClock,showToday,showCalendar)

轮播图过渡：

1. carouselTrans 实现过渡效果 先给轮播图加上 trans, 再移动 top, 移完了，去掉 trans,更新日历

# changelog

## 2021
