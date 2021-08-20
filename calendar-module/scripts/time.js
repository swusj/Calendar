// 获取当前时间数据
function getCurHourMinSec() {
  const nowDate = new Date();
  const hour = nowDate.getHours();
  const minute = nowDate.getMinutes();
  const second = nowDate.getSeconds();
  return { hour, minute, second };
}

// 格式化时钟文字
function createClockStr() {
  let { hour, minute, second } = getCurHourMinSec();
  minute = minute < 10 ? `0${minute}` : minute;
  second = second < 10 ? `0${second}` : second;
  let clockStr = `${hour}:${minute}:${second}`;
  return clockStr;
}

export { getCurHourMinSec, createClockStr };
