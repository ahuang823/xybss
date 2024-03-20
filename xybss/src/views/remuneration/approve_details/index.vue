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
      <el-table-column label="项目名称" align="center">
        <template v-slot="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>

      <el-table-column label="厅店" align="center">
        <template v-slot="scope">
          {{ scope.row.org_name }}
        </template>
      </el-table-column>

      <el-table-column label="厅店ID" align="center">
        <template v-slot="scope">
          {{ scope.row.shopId }}
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

      <el-form :model="form" label-width="100px" :inline="false" class="demo-form-inline">

        <el-col :span="8" class="ipt">
          <el-form-item label="审批意见" required>
            <el-input v-model="form.auditReason" placeholder="请输入审批意见" size="small" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="4" class="ipt">
          <el-form-item label="审批人" required>
            <el-select v-model="form.auditUser" placeholder="审批人">
              <el-option label="Zone one" value="hzf" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="下一步骤" required>
            <el-radio-group v-model="form.auditResult">
              <el-radio label="agree">同意</el-radio>
              <el-radio label="repulse">不同意（退回发起人）</el-radio>

            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item>
            <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
            <!--            <el-button size="small" @click="goback">返回</el-button>-->
          </el-form-item>

        </el-col>

      </el-form>

    </div>

  </div>

</template>

<script>
import { approveList, getDetailsList, getFlowInfo } from '@/api/remuneration'

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
      form: {
        auditReason: '',
        auditResult: '',
        flowId: '',
        flowTemplateId: '1',
        auditUser: '',
        isAdd: '2',
        nextFlowStep: '',
        nextFlowStepYes: ''
      },
      form1: {},

      listQuery: {
        pageNum: 1,
        pageSize: 10,
        flowId: undefined
      }
    }
  },
  created() {
    console.log('this.$route:', this.$route)
    this.listQuery.flowId = this.$route.params.id
    this.form.flowId = this.$route.params.id
    console.log('row', this.$route.params.id)
    // console.log('this.listQuery', this.listQuery)

    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getDetailsList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        console.log(this.list)
        console.log('form', this.form)
        getFlowInfo(this.listQuery).then(response => {
          console.log('流程信息', response.data)
          this.form.currentFlowStepId = response.data.currentFlowStepId
          this.form.flowDetailId = response.data.flowDetailId
          this.form1.nextFlowStepYes = response.data.nextFlowStepYes
          console.log('currentFlowStepId', this.form.currentFlowStepId)
        })
      })
    },
    onSubmit() {
      this.listLoading = true

      if (this.form.auditResult === 'agree') {
        this.form.nextFlowStep = this.form1.nextFlowStepYes
        // console.log('删除前', this.form)
        delete this.form.nextFlowStepYes
        // console.log('删除后', this.form)
      } else {
        this.form.nextFlowStep = 'repulse'
      }

      approveList(this.form).then(response => {
        this.listLoading = false
        this.$message({
          message: '审批成功！',
          type: 'success'
        })
      })
      // })
    }
  }
}
</script>

<style scoped>
.app-footer{
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  height: 20%;
  z-index: 1;
}

.ipt{
  margin-top: 10px;
}

</style>
