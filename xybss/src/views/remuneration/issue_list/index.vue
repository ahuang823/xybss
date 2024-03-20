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

      <el-table-column align="center" label="序号" width="95" prop="id" sortable>
        <template v-slot="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="账期" prop="month_id" sortable="true">
        <template v-slot="scope">
          {{ scope.row.month_id }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template v-slot="scope">
          {{ scope.row.project_name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="项目总金额">
        <template v-slot="scope">
          {{ scope.row.total_charge }}
        </template>
      </el-table-column>

      <el-table-column label="发起时间" align="center" sortable>
        <template v-slot="scope">
          {{ scope.row.initiating_time }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="发起部门">
        <template v-slot="scope">
          {{ scope.row.initiating_deparement }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="经办人">
        <template v-slot="scope">
          {{ scope.row.agent_name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template v-slot="scope">
          <!--          <el-button size="small" @click="goIssue(scope.row)">明细</el-button>-->
          <el-button size="small" type="primary" @click="addSingle(scope.row)">删除</el-button>
        </template>

      </el-table-column>

    </el-table>

    <div class="app-footer">

      <el-col style="margin-left: 1%;margin-bottom: 1%" :span="2"><el-tag size="large">当前选择总金额：{{ Amount }}</el-tag></el-col>
      <el-col style="margin-left: 2%;margin-bottom: 1%" :span="2">
        <el-button type="primary" size="small" @click="onSubmit">核发</el-button>
      </el-col>

    </div>

  </div>

</template>

<script>
import { getCommissionIssueInfos } from '@/api/remuneration'
import Vue from 'vue'

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
      this.multipleSelection.forEach((item) => {
        sum += item.total_charge
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
      getCommissionIssueInfos(Vue.prototype.$globalArray).then(response => {
        this.list = response.data
        this.listLoading = false
        console.log(this.list)
      })
    },
    goIssue(row) {
      console.log('审批')
      // console.log(row)
      // this.$router.push({ path: 'example/remuneration_details', query: { id: '388' }})
      this.$router.push({ path: `issue_details/${row.id}`, query: { row }})
      console.log(this.$router)
    },
    addSingle() {
      console.log('批量加入核发库')

      // console.log('row', row.id)

      // if (!Vue.prototype.$globalArray.includes(row.id)) {
      //   Vue.prototype.$globalArray.push(row.id)
      //   console.log('Vue.prototype.$globalArray', Vue.prototype.$globalArray)
      // }
    },

    // 调整选择明细
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('this.multipleSelection', this.multipleSelection)
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

