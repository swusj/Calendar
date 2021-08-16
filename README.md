# 日历

问题1：如何正确显示当前日期日历？
首先api获取当前年月日，但要正常显示在6*7格子中，需要了解这个月有多少天，1号是周几，才好排列
（上个月（主要是上个月有多少天）和下个月的日期也要显示几个）

1. 因此首先要有个对象，存当前处于时间（年月日，天数，一号为周几）。const NowDate (day,month,year,dayNum,weekOfDayOne)
2. 第二个对象（年月日，天数，一号为周几），存当前显示的时间。const ShowDate  (day,month,year,dayNum,DayOfOne)

显示函数：

1. 根据年份获取月份天数的函数     getDayNum
2. 获得某年某月的 1号 是星期几的函数   getDayOfOne
3. 刷新显示日历的函数， showCalendar  (ShowDate)
根据第二个Date对象，调用前面的函数获取上中下三个月日期；分别三个循环，第一个生成
前一月的html代码；第二个生成当月代码；第三个生成下月代码；其中注意不同日期不同显示效果，最后将字符串
设置为xx.innerhtml
