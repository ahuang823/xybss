<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      stripe
    >
      <el-table-column align="center" label="工单编号" width="175" prop="flowCode" sortable class="table-container">
        <template v-slot="scope">
          {{ scope.row.flowCode }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="账期" prop="accountPeriod" sortable="true">
        <template v-slot="scope">
          {{ scope.row.accountPeriod }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template v-slot="scope">
          {{ scope.row.flowName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="项目总金额">
        <template v-slot="scope">
          {{ scope.row.projectAmount }}
        </template>
      </el-table-column>

      <el-table-column label="发起时间" align="center" sortable>
        <template v-slot="scope">
          {{ scope.row.createDate }}
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

      <el-table-column align="center" label="操作">
        <template v-slot="scope">
          <el-button size="small" @click="goApprove(scope.row)">审批</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getRelatedFlowInfos } from '@/api/remuneration'

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
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        auditorId: 1
      },
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getRelatedFlowInfos(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        console.log('this.list', this.list)
      })
    },
    goApprove(row) {
      console.log('审批')
      // console.log(row)
      // this.$router.push({ path: 'example/remuneration_details', query: { id: '388' }})
      this.$router.push({ path: `remuneration_details/${row.flowId}`, query: { row }})
      console.log(this.$router)
    }
  }
}
</script>

<style>

</style>
