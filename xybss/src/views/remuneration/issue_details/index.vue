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
      stripe="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />

      <el-table-column label="账期" align="center" sortable="true">
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

      <el-table-column label="经办人" align="center">
        <template v-slot="scope">
          {{ scope.row.agent }}
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

      <el-table-column label="片区" align="center">
        <template v-slot="scope">
          {{ scope.row.unit_name3 }}
        </template>
      </el-table-column>

    </el-table>

    <div class="app-footer">

      <el-form :model="form" label-width="100px" :inline="false" class="demo-form-inline">

        <el-col :span="8" class="ipt">
          <el-form-item label="审批意见" required>
            <el-input v-model="form.name" placeholder="请输入审批意见" size="small" clearable />
          </el-form-item>

        </el-col>

        <el-col>
          <el-form-item>
            <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
            <el-button size="small" @click="goback">返回</el-button>
          </el-form-item>
        </el-col>

      </el-form>

    </div>

  </div>

</template>

<script>
import { getCommissionDetailsList } from '@/api/remuneration'

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
      form: {},
      // id: '',
      list: null,
      listLoading: true,
      multipleSelection: [], // 选择项数组,
      listQuery: {
        flowId: ''
      }
    }
  },
  created() {
    // console.log('this.id:', this.id)
    console.log('this.$route:', this.$route)
    // this.id = this.$route.params.id
    this.listQuery.flowId = this.$route.query.row.flowId
    console.log(this.listQuery.flowId)
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // getList(id=this.id).then(response => {
      getCommissionDetailsList(this.listQuery).then(response => {
        this.list = response.data.commissionInfos
        this.listLoading = false

        console.log(this.list)
      })
    },
    onSubmit() {
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
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
  height: 15%;
  z-index: 1;
}

.ipt{
  margin-top: 20px;
}

</style>
