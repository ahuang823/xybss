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

      <!--      <el-table-column label="片区" align="center">-->
      <!--        <template v-slot="scope">-->
      <!--          {{ scope.row.unit_name3 }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->

    </el-table>

    <div class="app-footer">

      <template>
        <el-row>
          <!--          <el-col :span="2" style="margin-top: 10px;" class="title">-->
          <!--            <div class="title">核发百分比</div>-->
          <!--          </el-col>-->
          <el-col :span="3">
            <el-input-number v-model="proportion" style="margin-top: 10px;" size="medium" :min="1" :max="100" label="按百分比核发" />
            <!--            <el-button size="small" @click="goback">返回</el-button>-->
          </el-col>
          <el-col :span="6">
            <el-button style="margin-top: 10px;margin-left: 10px;" type="primary" size="medium" @click="onSubmit">添加核发库</el-button>
            <!--            <el-button size="small" @click="goback">返回</el-button>-->
          </el-col>
        </el-row>

      </template>

    </div>

  </div>

</template>

<script>
import { getCommissionDetailsList } from '@/api/remuneration'
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
      form: {},
      // id: '',
      list: null,
      listLoading: true,
      multipleSelection: [], // 选择项数组,
      listQuery: {
        flowId: []
      },
      proportion: 100
    }
  },
  created() {
    // console.log('this.id:', this.id)
    console.log('this.$route:', this.$route)
    // this.id = this.$route.params.id
    this.listQuery.flowId.push(this.$route.query.row.flowId)
    console.log(this.listQuery.flowId)
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // getList(id=this.id).then(response => {
      getCommissionDetailsList(this.listQuery.flowId).then(response => {
        this.list = response.data[0].commissionInfos
        this.listLoading = false

        console.log('this.list', this.list)
      })
    },
    onSubmit() {
      this.multipleSelection.forEach((item) => {
        console.log('item', item)
        if (!Vue.prototype.$globalAllArray.has(item.commissionId)) {
          console.log('Vue.prototype.$globalArray.has(item)', Vue.prototype.$globalAllArray.has(item.commissionId))
          Vue.prototype.$globalAllArray.add(item.commissionId)
          // 处理乘法精度问题.toPrecision(2)
          console.log('parseFloat', parseFloat(item.amount).toPrecision(2))
          item.amount = parseFloat(item.amount).toPrecision(2) * (this.proportion / 100) // 按百分比核发
          console.log('Vue.prototype.$globalArray', Vue.prototype.$globalAllArray)
          Vue.prototype.$globalAllList.push(item)
        }
      })
      // Vue.prototype.$globalAllList.push(...this.multipleSelection)
      console.log('Vue.prototype.$globalAllList', Vue.prototype.$globalAllList)

      this.$message({
        message: '添加成功！',
        type: 'success'
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('multipleSelection', this.multipleSelection)
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
  //height: 8%;
  //z-index: 1;
}

.title{
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中，如果也需要水平居中的话 */
  text-align: center;
}

</style>
