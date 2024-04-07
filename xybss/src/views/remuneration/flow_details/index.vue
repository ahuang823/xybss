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

      <el-table-column label="账期" sortable="true" align="center">
        <template v-slot="scope">
          {{ scope.row.accountPeriod }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" min-width="150px">
        <template v-slot="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>

      <el-table-column label="厅店" align="center" min-width="175px">
        <template v-slot="scope">
          {{ scope.row.merchantName }}
        </template>
      </el-table-column>

      <el-table-column label="厅店ID" align="center">
        <template v-slot="scope">
          {{ scope.row.shopMerchantId }}
        </template>
      </el-table-column>

      <el-table-column label="金额" align="center">
        <template v-slot="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>

      <el-table-column label="业务号码" align="center">
        <template v-slot="scope">
          {{ scope.row.businessNumber }}
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center">
        <template v-slot="scope">
          {{ scope.row.comments }}
        </template>
      </el-table-column>

      <el-table-column label="县区分局" align="center">
        <template v-slot="scope">
          {{ scope.row.county }}
        </template>
      </el-table-column>

      <el-table-column label="营业部" align="center">
        <template v-slot="scope">
          {{ scope.row.businessDepartment }}
        </template>
      </el-table-column>

    </el-table>

    <div class="app-footer">

      <el-table
        v-loading="listLoading"
        :data="flowStep"
        element-loading-text="Loading"
        fit
        highlight-current-row
        stripe
      >

        <el-table-column label="流程名称" align="center">
          <template v-slot="scope">
            {{ scope.row.auditTier }}
          </template>
        </el-table-column>

        <el-table-column label="处理人" align="center">
          <template v-slot="scope">
            {{ scope.row.auditUser }}
          </template>
        </el-table-column>

        <el-table-column label="部门" align="center">
          <template v-slot="scope">
            {{ scope.row.auditorDepartment }}
          </template>
        </el-table-column>

        <el-table-column label="审批时间" align="center">
          <template v-slot="scope">
            {{ scope.row.auditDate }}
          </template>
        </el-table-column>

        <el-table-column label="审批结果" align="center">
          <template v-slot="scope">
            {{ scope.row.auditResult }}
          </template>
        </el-table-column>

        <el-table-column label="审批意见" align="center">
          <template v-slot="scope">
            {{ scope.row.auditReason }}
          </template>
        </el-table-column>

      </el-table>

    </div>

  </div>

</template>

<script>
import { getDetailsList, getFlowStepInfo } from '@/api/remuneration'
import { mapGetters } from 'vuex'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {

      list: null,
      listLoading: true,

      listQuery: {
        pageNum: 1,
        pageSize: 10,
        flowId: undefined
      },
      stepQuery: {
        flowId: undefined
      },
      flowStep: null

    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  },
  created() {
    console.log('FLOW_DETAIL:this.$route:', this.$route)
    this.listQuery.flowId = this.$route.params.id
    this.stepQuery.flowId = this.$route.params.id
    console.log('this.userinfo', this.userinfo)

    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getDetailsList(this.listQuery).then(response => {
        this.list = response.data.records
        console.log('list', this.list)
        // 获取流程
        getFlowStepInfo(this.stepQuery).then(response => {
          this.flowStep = response.data.flowDetailInfos
          this.listLoading = false
          console.log('flowStep', this.flowStep)
          // 获取流程
        })
      })
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
  margin-top: 1%;
  //height: 8%;
  //z-index: 1;
}

.ipt{
  margin-top: 10px;
}

</style>
