export const calibers = [
  {name: 'DN15', val: 15, color: '#c5ff0a', icon: 'icon-syj'},
  {name: 'DN20', val: 20, color: '#c5ff0a', icon: 'icon-syj'},
  {name: 'DN25', val: 25, color: '#c5ff0a', icon: 'icon-syj'},
  {name: 'DN32', val: 32, color: '#c5ff0a', icon: 'icon-syj'},
  {name: 'DN40', val: 40, color: '#99FF00', icon: 'icon-syj'},
  {name: 'DN50', val: 50, color: '#7FFF00', icon: 'icon-syj'},
  {name: 'DN65', val: 65, color: '#00FF7F', icon: 'icon-syj'},
  {name: 'DN80', val: 80, color: '#00A57C', icon: 'icon-syj'},
  {name: 'DN100', val: 100, color: '#00A529', icon: 'icon-syj'},
  {name: 'DN150', val: 150, color: '#00BFFF', icon: 'icon-syj'},
  {name: 'DN200', val: 200, color: '#007FFF', icon: 'icon-syj'},
  {name: 'DN250', val: 250, color: '#9F7FFF', icon: 'icon-syj'},
  {name: 'DN300', val: 300, color: '#BF00FF', icon: 'icon-syj'},
  {name: 'DN350', val: 350, color: '#FF00BF', icon: 'icon-syj'},
  {name: 'DN400', val: 400, color: '#FF003F', icon: 'icon-syj'},
  {name: 'DN450', val: 450, color: '#ff1059', icon: 'icon-syj'},
  {name: 'DN500', val: 500, color: '#A50052', icon: 'icon-syj'},
  {name: 'DN600', val: 600, color: '#FF3F00', icon: 'icon-syj'},
  {name: 'DN700', val: 700, color: '#FFBF00', icon: 'icon-syj'},
  {name: 'DN800', val: 800, color: '#FFFF00', icon: 'icon-syj'},
  {name: 'DN900', val: 900, color: '#fffacd', icon: 'icon-syj'},
  {name: 'DN1000', val: 1000, color: '#fffcec', icon: 'icon-syj'},
  {name: 'DN1100', val: 1100, color: '#fffcec', icon: 'icon-syj'},
  {name: 'DN1200', val: 1200, color: '#fffcec', icon: 'icon-syj'}

]
export const caliberMap = {}
calibers.forEach(item => {
  caliberMap[item.val] = item
})

export const lineTypes = [
  {name: '现有管网', val: 0, color: '#0586FF', icon: 'icon-gx'},
  {name: '废弃管网', val: 1, color: '#b6a2de', icon: 'icon-gx'},
  {name: '规划管网', val: 2, color: '#0a915d', icon: 'icon-gx'}
]
export const lineTypeMap = {}
lineTypes.forEach(item => {
  lineTypeMap[item.val] = item
})

export const lineMaterial = [
  {name: '铸铁', val: 0, color: '#00A57C', icon: 'icon-caizhi'},
  {name: 'PVC', val: 1, color: '#FF00BF', icon: 'icon-feiqiguancai'},
  {name: '钢管', val: 2, color: '#007FFF', icon: 'icon-caizhi'},
  {name: 'PE', val: 3, color: '#FFBF00', icon: 'icon-feiqiguancai'},
  {name: '镀锌管', val: 4, color: '#00FFFF', icon: 'icon-caizhi'},
  {name: '铝塑管', val: 5, color: '#ff8456', icon: 'icon-caizhi'},
  {name: '球管', val: 6, color: '#FC3B3B', icon: 'icon-gxsz'},
  {name: '球墨铸铁', val: 7, color: '#FC0000', icon: 'icon-gxsz'},
  {name: 'PPR', val: 8, color: '#FC0000', icon: 'icon-gxsz'},
]
export const lineMaterialMap = {}
lineMaterial.forEach(item => {
  lineMaterialMap[item.val] = item
})

export const lineYearMap = {
  0: '#FBF2F2',
  1: '#FEC5C5',
  2: '#FCA1A1',
  3: '#FB8181',
  4: '#FC5F5F',
  5: '#FC3B3B',
  6: '#FC0000',
}

export const meter = [
  {name: '机械表', val: 0, color: '#6699ff'},
  {name: '超声波表', val: 1, color: '#b6a2de'},
  {name: '电磁表', val: 2, color: '#0a915d'}

]
export const meterMap = {}
meter.forEach(item => {
  meterMap[item.val] = item
})

export const valveType = [
  {name: '闸阀', val: 0, color: '#0a915d'},
  {name: '蝶阀', val: 1, color: '#b6a2de'},
  {name: '球阀', val: 2, color: '#6699ff'},
  {name: '加密阀', val: 3, color: '#c4f5ff'}
]
export const valveTypeMap = {}
valveType.forEach(item => {
  valveTypeMap[item.val] = item
})

export const deviceType = [
  {
    name: '进水口',
    val: 1,
    enName: 'waterEntrance',
    src: '/images/marker/node.png',
    icon: 'icon-syj'
  },
  {
    name: '源水',
    val: 2,
    enName: 'sourceWater',
    src: '/images/marker/yuan.png',
    icon: 'icon-sy'
  },
  {
    name: '消防栓',
    val: 3,
    enName: 'fireHydrant',
    src: '/images/marker/fire.png',
    icon: 'icon-xf'
  },
  {
    name: '减压阀',
    val: 4,
    enName: 'pressureValve',
    src: '/images/marker/pressure.png',
    icon: 'icon-jyf'
  },
  {
    name: '排气阀',
    val: 5,
    enName: 'exhaustValve',
    src: '/images/marker/exhaust.png',
    icon: 'icon-pqf'
  },
  {
    name: '排泥阀',
    val: 6,
    enName: 'drainValve',
    src: '/images/marker/drain.png',
    icon: 'icon-pnf'
  },
]

export const deviceTypeMap = {}
deviceType.forEach(item => {
  deviceTypeMap[item.val] = item
})

export const meterMes = {
  name: '流量计',
  val: 8,
  enName: 'meter',
  src: '/images/marker/node.png',
  icon: 'icon-sb'
}
export const valveMes = {
  name: '阀门',
  val: 9,
  enName: 'meter',
  src: '/images/marker/node.png',
  icon: 'icon-famen'
}
export const userMes = {
  name: '水表',
  val: 10,
  enName: 'user',
  src: '/images/marker/node.png',
  icon: 'icon-user'
}
