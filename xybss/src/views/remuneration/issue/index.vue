<template>

  <div>

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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />

        <el-table-column align="center" label="账期" prop="month_id" sortable="true">
          <template v-slot="scope">
            {{ scope.row.accountPeriod }}
          </template>
        </el-table-column>
        <el-table-column label="工单名称" align="center">
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
            <el-button size="small" @click="goIssue(scope.row)">明细</el-button>
            <el-button size="small" type="primary" @click="addSingle(scope.row)">加入核发库</el-button>
          </template>

        </el-table-column>

      </el-table>

    </div>

    <div class="app-footer">

      <el-col style="margin-left: 1%;margin-bottom: 1%" :span="2"><el-tag size="large">当前选择总金额：{{ Amount }}</el-tag></el-col>
      <el-col style="margin-left: 2%;margin-bottom: 1%" :span="2">
        <el-button type="primary" size="small" @click="addBatch">批量加入核发库</el-button>
      </el-col>

      <el-col style="margin-bottom: 1%" :span="2">
        <el-button size="small" @click="goIssueList">打开核发库</el-button>
      </el-col>

    </div>

  </div>

</template>

<script>
import { getCommissionDetailsList, getIssueInfo } from '@/api/remuneration'
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
      direction: 'rtl',
      listQuery: {
        pageNum: 1,
        pageSize: 50
      },
      flowQuery: [],
      arrList: []
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
  },
  methods: {
    fetchData() {
      this.listLoading = true

      getIssueInfo(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false

        console.log(this.list)
      })
    },
    goIssue(row) {
      console.log('审批')
      this.$router.push({ path: `issue_details/${row.id}`, query: { row }})
      console.log(this.$router)
    },

    // 打开核发库
    goIssueList() {
      this.$router.push({ path: '/remuneration/issue_list' })
    },

    addSingle: function(row) {
      console.log('单例加入核发库')

      console.log('row', row.flowId)
      this.flowQuery.push(row.flowId)
      console.log('this.flowQuery', this.flowQuery)

      getCommissionDetailsList(this.flowQuery).then(response => {
        this.arrList = response.data[0].commissionInfos
        this.listLoading = false
        console.log(this.arrList)

        this.arrList.forEach((item) => {
          console.log('item', item)
          if (!Vue.prototype.$globalArray.includes(item.commissionId)) {
            Vue.prototype.$globalArray.push(item.commissionId)
          }
        })
      })
      console.log('Vue.prototype.$globalArray', Vue.prototype.$globalArray)
      this.$message({
        message: '添加成功！',
        type: 'success'

      })

      // if (!Vue.prototype.$globalArray.includes(row.flowId)) {
      //   Vue.prototype.$globalArray.push(this.arrList)
      //   console.log('Vue.prototype.$globalArray', Vue.prototype.$globalArray)
      //   this.$message({
      //     message: '添加成功！',
      //     type: 'success'
      //   })
      // }
    },

    addBatch() {
      console.log('批量加入核发库')

      this.multipleSelection.forEach((item) => {
        this.flowQuery.push(item.flowId)
      })

      console.log(this.flowQuery)

      getCommissionDetailsList(this.flowQuery).then(response => {
        // this.arrList = response.data.commissionInfos
        response.data.forEach((item) => {
          // arr.push(item.commissionInfos)
          // console.log('this.arr', arr)
          item.commissionInfos.forEach((item) => {
            console.log(item)
            this.arrList.push(item)
          })
        })

        this.listLoading = false
        console.log('this.arrList', this.arrList)
        console.log('开始添加')
        this.arrList.forEach((item) => {
          if (!Vue.prototype.$globalArray.has(item)) {
            console.log('Vue.prototype.$globalArray.has(item)', Vue.prototype.$globalArray.has(item))
            Vue.prototype.$globalArray.add(item)
            console.log('Vue.prototype.$globalArray', Vue.prototype.$globalArray)
          }

          // if (!Vue.prototype.$globalArray.includes(item)) {
          //   Vue.prototype.$globalArray.push(item)
          //   console.log('Vue.prototype.$globalArray', Vue.prototype.$globalArray)
          // }
        })
      })
      console.log('Vue.prototype.$globalArray', Vue.prototype.$globalArray)
      this.$message({
        message: '添加成功！',
        type: 'success'
      })
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
  //height: 8%;
  //z-index: 1;
}

</style>

