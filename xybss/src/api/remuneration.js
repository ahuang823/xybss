import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/remuneration/list',
    method: 'get',
    params
  })
}

export function getList3(query) {
  return request({
    url: '/vue-admin-template/remuneration/list',
    method: 'get',
    params: query
  })
}

export function getList1(params) {
  return request({
    url: '/vue-admin-template/remuneration/list',
    method: 'get',
    params
  })
}

export function getList2(params) {
  return request({
    url: `/vue-admin-template/remuneration/test`,
    method: 'get',
    params
  })
}

// 厅店及管控人员查询清单
export function getDetailsList(data) {
  return request({
    url: `/commission/getCommissionInfos`,
    method: 'post',
    data
  })
}
// 厅店及管控人员查询清单
export function getCommissionDetailsList(data) {
  return request({
    url: `/commission/getDetailCommissionInfo`,
    method: 'post',
    data
  })
}

export function getCommissionIssueInfos(data) {
  return request({
    url: `/commissionIssue/getCommissionIssueInfosByCid`,
    method: 'post',
    data
  })
}

// 佣金审批：佣金明细清单
export function approveList(data) {
  return request({
    url: `/flow/submit`,
    method: 'post',
    data
  })
}

// 佣金审批：先获取当前流程的ID
export function getFlowInfo(params) {
  return request({
    url: `/flow/getFlowDetailInfo`,
    method: 'post',
    params
  })
}

// 佣金申请新增：佣金明细清单
export function addDetailsList(data) {
  return request({
    url: `/commission/addCommissionInfos`,
    method: 'post',
    data
  })
}

// 佣金申请新增：佣金明细清单
export function getRelatedFlowInfos(params) {
  return request({
    url: `/flow/getRelatedFlowInfos`,
    method: 'get',
    params
  })
}

// 佣金核发：佣金工单
export function getIssueInfo(data) {
  return request({
    url: `/commissionIssue/getPageCommissionIssueInfos`,
    method: 'post',
    data
  })
}
// 佣金核发：加入核发库
export function addIssueInfo(data) {
  return request({
    url: `/commissionIssue/addCommissionIssueInfos`,
    method: 'post',
    data
  })
}

// 获取审批人列表
export function getAuditorInfos(params) {
  return request({
    url: `/flow/getAuditorInfos`,
    method: 'get',
    params
  })
}

// 按批次汇总核发信息
export function getIssueByPeriod(params) {
  return request({
    url: `/commissionIssue/getCommissionIssueInfosByPeriod`,
    method: 'get',
    params
  })
}

export function getFlowStepInfo(params) {
  return request({
    url: `/flow/getFlowInfoDetails`,
    method: 'get',
    params
  })
}
