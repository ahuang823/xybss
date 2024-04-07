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
      >
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55"-->
        <!--          align="center"-->
        <!--        />-->

        <el-table-column align="center" label="账期" prop="month_id" sortable="true">
          <template v-slot="scope">
            {{ scope.row.accountPeriod }}
          </template>
        </el-table-column>
        <el-table-column label="工单名称" align="center" min-width="150px">
          <template v-slot="scope">
            {{ scope.row.flowName }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="项目总金额">
          <template v-slot="scope">
            {{ scope.row.projectAmount }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="已核发金额">
          <template v-slot="scope">
            {{ scope.row.issueAmount }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="未核发金额">
          <template v-slot="scope">
            {{ scope.row.notIssueAmount }}
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

        <!--        <el-table-column align="center" label="操作">-->
        <!--          <template v-slot="scope">-->
        <!--            <el-button size="small" @click="goIssue(scope.row)">部分核发</el-button>-->
        <!--          </template>-->

        <!--        </el-table-column>-->

      </el-table>

    </div>

    <!--    <div class="app-footer">-->

    <!--      <el-col style="margin-left: 1%;margin-bottom: 1%" :span="2"><el-tag size="large">当前选择总金额：{{ Amount }}</el-tag></el-col>-->
    <!--      <el-col style="margin-left: 2%;margin-bottom: 1%" :span="2">-->
    <!--        <el-button type="primary" size="small" @click="addBatch">批量加入核发库</el-button>-->
    <!--      </el-col>-->

    <!--      <el-col style="margin-bottom: 1%" :span="2">-->
    <!--        <el-button size="small" @click="goIssueList">打开核发库</el-button>-->
    <!--      </el-col>-->

    <!--    </div>-->

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
        pageSize: 50,
        haveIssued: 1
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
        // sum += parseFloat(item.projectAmount)
        sum = this.addNum(sum, parseFloat(item.projectAmount))
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
        console.log('res', response)
        this.arrList = response.data[0].commissionInfos
        console.log('arrlist', ...this.arrList)
        this.listLoading = false
        if (!Vue.prototype.$globalAllArray.has(row.flowId)) {
          Vue.prototype.$globalAllArray.add(row.flowId)
          Vue.prototype.$globalAllList = [...Vue.prototype.$globalAllList, ...this.arrList]
          // Vue.prototype.$globalAllList.push(this.arrList)
        }
        console.log('Vue.prototype.$globalAllArray', Vue.prototype.$globalAllArray)
        console.log('Vue.prototype.$globalAllList', Vue.prototype.$globalAllList)
      })

      this.$message({
        message: '添加成功！',
        type: 'success'

      })
    },

    addBatch() {
      console.log('批量加入核发库')

      const arr = new Set()

      this.multipleSelection.forEach((item) => {
        arr.add(item.flowId)
      })

      console.log(arr)

      getCommissionDetailsList([...arr]).then(response => {
        console.log('response', response)
        response.data.forEach((item) => {
          // console.log(...item.commissionInfos)
          this.arrList.push(...item.commissionInfos)
          // item.commissionInfos.forEach((item) => {
          //   console.log(item)
          //   this.arrList.push(item)
          // })
        })

        // this.listLoading = false
        console.log('this.arrList', this.arrList)
        console.log('开始添加')

        this.arrList.forEach((item) => {
          console.log('item', item)
          if (!Vue.prototype.$globalAllArray.has(item.commissionId)) {
            console.log('Vue.prototype.$globalArray.has(item)', Vue.prototype.$globalAllArray.has(item.commissionId))
            Vue.prototype.$globalAllArray.add(item.commissionId)

            console.log('Vue.prototype.$globalArray', Vue.prototype.$globalAllArray)
            Vue.prototype.$globalAllList.push(item)
          }

          // if (!Vue.prototype.$globalArray.includes(item)) {
          //   Vue.prototype.$globalArray.push(item)
          //   console.log('Vue.prototype.$globalArray', Vue.prototype.$globalArray)
          // }
        })

        console.log('Vue.prototype.$globalAllList', Vue.prototype.$globalAllList)
      })
      this.$message({
        message: '添加成功！',
        type: 'success'
      })
    },

    // 调整选择明细
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('this.multipleSelection', this.multipleSelection)
    },
    addNum(num1, num2) {
      var sq1, sq2, m
      try {
        sq1 = num1.toString().split('.')[1].length
      } catch (e) {
        sq1 = 0
      }
      try {
        sq2 = num2.toString().split('.')[1].length
      } catch (e) {
        sq2 = 0
      }
      m = Math.pow(10, Math.max(sq1, sq2))
      return (num1 * m + num2 * m) / m
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

