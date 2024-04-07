<template>
  <div class="app-container">

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      stripe
    >

      <el-table-column align="center" label="账期" prop="month_id" sortable="true">
        <template v-slot="scope">
          {{ scope.row.accountPeriod }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" min-width="150px">
        <template v-slot="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>

      <el-table-column label="发生时间" align="center" sortable>
        <template v-slot="scope">
          {{ scope.row.occurrenceTime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="发起部门">
        <template v-slot="scope">
          {{ scope.row.agentDepartment }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="经办人">
        <template v-slot="scope">
          {{ scope.row.agent }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="厅店" min-width="175px">
        <template v-slot="scope">
          {{ scope.row.merchantName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="金额">
        <template v-slot="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template v-slot="scope">
          <!--          <el-button size="small" @click="goIssue(scope.row)">明细</el-button>-->
          <el-button size="small" type="primary" @click="delSingle(scope.row)">删除</el-button>
        </template>

      </el-table-column>

    </el-table>

    <div class="app-footer">

      <el-col style="margin-left: 1%;margin-top: 10px" :span="2"><el-tag size="large">当前选择总金额：{{ Amount }}</el-tag></el-col>
      <el-col style="margin-left: 2%;margin-top: 10px" :span="2">
        <el-button type="primary" size="small" @click="postIssue">核发</el-button>
      </el-col>

    </div>

  </div>

</template>

<script>
import Vue from 'vue'
import { addIssueInfo } from '@/api/remuneration'

export default {
  filters: {
    // statusFilter(status) {
    //   const statusMap = {
    //     published: 'success',
    //     draft: 'gray',
    //     deleted: 'danger'
    //   }
    //   return statusMap[status]
    // }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      multipleSelection: [],
      drawer: false,
      direction: 'rtl'
    }
  },

  computed: {
    // 计算当前选择总金额
    Amount() {
      let sum = 0
      this.list.forEach((item) => {
        sum += parseFloat(item.amount)
      })
      return sum
    }
  },
  created() {
    this.fetchData()

    // this.list = Vue.prototype.$globalArray
    this.listLoading = false
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.list = Vue.prototype.$globalAllList
      Object.freeze(this.list)

      console.log(this.list)

      // getCommissionIssueInfos(Vue.prototype.$globalArray).then(response => {
      //   this.list = response.data
      //   this.listLoading = false
      //   console.log(this.list)
      // })
    },
    postIssue() {
      console.log('提交更新')
      this.listLoading = true
      const issueList = []
      const moment = require('moment')
      const dateString = moment(new Date()).format('YYYYMMDD')
      const accountperiod = moment(new Date()).format('YYYYMM')

      this.list.forEach((item) => {
        issueList.push({
          flowId: item.flowId,
          commissionId: item.commissionId,
          issueAmount: item.amount,
          isIssued: '1',
          issueBatch: dateString,
          accountPeriod: accountperiod
        })
      })

      console.log(issueList)
      addIssueInfo(issueList).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.$message({
            message: response.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
      this.listLoading = false
    }

  }
}
</script>

<style scoped>
.app-footer{
  //position: fixed;
  //bottom: 0;
  justify-content: center;
  width: 100%;
  background-color: #ffffff;
  //height: 12%;
  //z-index: 1;
}

</style>

