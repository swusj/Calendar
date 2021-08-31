// 使用方

import Calendar from "./calendar-module/index.js";

const myCalendar = new Calendar();

myCalendar.install("#xx", { isDragable: true });
myCalendar.install("#mm");

// myCalendar.unload("#mm");
// /**
//  * 这个函数是用来做。。。。
//  * @param {number} a
//  * @param {string} b
//  * @returns 数组，里面year 是年，state代表高亮不高亮，0代表暗，1代表高亮
//  * @example
//  * [{year: 2018, state: 0}, {year: 2019, state: 1},]
//  */
// function createYears(a, b) {
//   // do...

//   return [
//     {
//       year: 2017,
//       state: 0,
//     },
//     {
//       year: 2018,
//       state: 0,
//     },
//     {
//       year: 2019,
//       state: 0,
//     },
//     {
//       year: 2020,
//       state: 1,
//     },
//     // ....
//   ];
// }

// function renderYearsInTable(years) {
//   const table = document.createElement("table");

//   return table;
// }
