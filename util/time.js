/**
 * 时间序列生成器
 * @param opts
 * @returns {Array}
 * @constructor
 */
export const TimeSeq = (start, opts) => {
  let separator = opts.separator == null ? '' : opts.separator;
  let slot = opts.slot == null ? 1 : parseInt(opts.slot);
  let defaultMaxValue = '23' + separator + '59';
  let maxValue = opts.maxValue == null ? defaultMaxValue : opts.maxValue;
  let hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(('' + (100 + i)).substr(1, 2));
  }
  let minutes = [];
  for (let i = 0; i < 60; i++) {
    minutes.push(('' + (100 + i)).substr(1, 2));
  }

  let times = [];

  hours.forEach(hour => {
    minutes.forEach(min => {
      times.push(hour + separator + min);
    });
  });
  if (slot > 1) {
    times = times.filter((time, index, array) => {
      return index % slot === 0;
    });
  }

  if (maxValue !== defaultMaxValue) {
    times = times.filter(time => time <= maxValue);
  }
  return times;
}
