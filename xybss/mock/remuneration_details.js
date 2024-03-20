const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@integer(1, 1000)',

    'month_id|1': [
      '202312',
      '202311',
      '202310',
      '202309',
      '202401',
      '202302'
    ],

    'project_name|1': [
      '11月C类开店人员代扣保险',
      '2023年11月业务稽核追溯考核明细',
      '11月安全生产检查考核'
    ],

    total_charge: '@integer(-5000, 5000)',

    initiating_time: '@datetime',

    'initiating_deparement|1': [
      '人力',
      '企信',
      '渠道'
    ],

    'org_name|1': [
      '仙来西大道城西主营业厅经营团队',
      '团结西路新钢营业厅经营团队',
      '旺阳华为钤阳中路手机卖场经营团队',
      '分宜工业园电信专营店经营团队',
      '莫漠昌山南路营维一体经营团队'
    ],

    'org_id|1': [
      '9790002402',
      '9790010303',
      '9790011102',
      '979070866',
      '9790496907'
    ],

    charge: '@integer(-5000, 5000)',

    'agent_name|1': [
      '李腾兰',
      '钟小花',
      '施露'
    ],

    acc_nbr: '18079008981',

    'remark|1': [
      '未满1年以上追溯一次性佣金的50%',
      '未按稽核口径回单',
      '受理差错'
    ],

    'unit_name1|1': [
      '城区分局',
      '渝水分局',
      '分宜县分公司'
    ],

    'unit_name2|1': [
      '城东支局',
      '城西支局',
      '双林支局',
      '罗坊支局'
    ],

    'unit_name3|1': [
      '片区1',
      '片区2',
      '片区3',
      '片区4'
    ],

    // title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/remuneration_details/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items.filter(items => items.id >= Number(20))
        }
      }
    }
  }
]
