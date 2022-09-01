import dateUtil from './date'
import {TimeSeq} from './time'

/**
 * echarts数据处理（分钟）
 * @param data
 * @param rate
 * @returns {Array}
 */
export const wrapperChart = (data, rate = 2) => {
  const rows = []

  data = buildData(data, rate)
  for (let item of data) {

    //异常数据处理
    if (Math.abs(item.fperiodFlow) > 5000 || Math.abs(item.rperiodFlow)
      > 5000) {
      continue
    }

    //数据时间修正
    let time = dateUtil.date(item.collectTime, 'HH:mm')
    let min = parseInt(time[4])
    if (min % rate !== 0) {
      time = time.substr(0, 4) + (min - 1)
    }
    rows.push({
      time: time,
      instFlow: Number(item.instFlow).toFixed(2),
      pressure: Number(item.pressure).toFixed(2),
      fperiodFlow: item.fperiodFlow || '-',
      rperiodFlow: item.rperiodFlow || '-',
    })

  }
  let timeSeq = TimeSeq('00:00', {
    slot: 1,
    separator: ':'
  });

  const finalRows = []

  for (let time of timeSeq) {
    let row = rows.find(val => {
      return val.time === time
    });
    if (row) {
      finalRows.push(row)
    } else {
      finalRows.push({
        time,
        instFlow: '-',
        pressure: '-',
        fperiodFlow: '-',
        rperiodFlow: '-'
      })
    }
  }
  return finalRows
}

export const buildData = (data, rate = 1) => {

  let prev = null
  for (let item of data) {
    item.fperiodFlow = '-'
    item.rperiodFlow = '-'

    if (prev != null) {
      /*判断数据连续性*/
      let continuous = (item.collectHour * 60 + item.collectMinute)
        - (prev.collectHour * 60 + prev.collectMinute) <= rate
      if (continuous) {

        let fperiodFlow = item.ftotalFlow - prev.ftotalFlow;
        item.fperiodFlow = Number(fperiodFlow).toFixed(2)
        let rperiodFlow = item.rtotalFlow - prev.rtotalFlow;
        item.rperiodFlow = Number(rperiodFlow).toFixed(2)
        item.flow = Number(fperiodFlow - rperiodFlow).toFixed(2)
      }
    }

    prev = item
  }

  return data
}

/**
 * echarts数据处理（天）
 * @param data
 * @returns {Array}
 */
export const wrapperDayChart = (data) => {
  const rows = []
  for (let item of data) {
    rows.push({
      time: dateUtil.day(item.dataTime),
      dayFlow: Number(item.dayFlow.toFixed(2)),
      maxFlow: Number(item.maxFlow.toFixed(2)),
      avgPressure: Number(item.avgPressure).toFixed(2),
      forwardDayFlow: Number(item.forwardDayFlow).toFixed(2),
      reverseDayFlow: Number(item.reverseDayFlow).toFixed(2)
    })
  }
  return rows
}

/**
 * echarts数据处理（分钟）
 * @param data
 * @param rate
 * @returns {Array}
 */
export const wrapperInstantChart = (data, rate = 2) => {
  const rows = []

  data = buildData(data, rate)

  for (let item of data) {

    //异常数据处理
    if (Math.abs(item.fperiodFlow) > 5000 || Math.abs(item.rperiodFlow)
      > 5000) {
      continue
    }

    rows.push({
      time: item.collectTime,
      instFlow: Number(item.instFlow).toFixed(2),
      pressure: Number(item.pressure).toFixed(2),
    })

  }
  const finalRows = []
  if (!rows || rows.length === 0) {
    return finalRows
  }
  return rows
}

/**
 * echarts数据处理（分钟）
 * @param data
 * @param rate
 * @returns {Array}
 */
export const wrapperInstantDayChart = (data, rate = 2, meterNo) => {
  const rows = []

  data = buildData(data, rate)

  for (let item of data) {


    //异常数据处理
    if (Math.abs(item.fperiodFlow) > 5000 || Math.abs(item.rperiodFlow)
      > 5000) {
      continue
    }

    //数据时间修正
    let time = dateUtil.date(item.collectTime, 'HH:mm')
    rows.push({
      time: time,
      instFlow: Number(item.instFlow).toFixed(2),
      pressure: Number(item.pressure).toFixed(2),
      fperiodFlow: Number(item.fperiodFlow).toFixed(2),
      rperiodFlow: Number(item.rperiodFlow).toFixed(2),
      day: dateUtil.date(item.collectTime, 'YYYY-MM-DD'),
      meterNo: meterNo ? meterNo : ''
    })

  }
  const finalRows = []
  if (!rows || rows.length === 0) {
    return finalRows
  }
  return rows
}
