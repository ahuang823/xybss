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

      <el-form :model="form" label-width="100px" :inline="false" class="demo-form-inline">

        <el-col :span="8" class="ipt">
          <el-form-item label="审批意见" required>
            <el-input v-model="form.auditReason" placeholder="请输入审批意见" size="small" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="16" class="ipt">
          <el-form-item v-show="Number(isAuditorShow)===1" label="审批人">
            <el-select v-model="form.realName" filterable clearable placeholder="请选择" @change="changeAuditor">
              <el-option
                v-for="(item,index) in auditorList"
                :key="index"
                :label="item.realName"
                :value="index"
              >
                <span style="float: left">{{ item.realName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.orgName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!--        <el-form-item label="审批人">-->
        <!--          <el-input v-model="form.name" :disabled="true" />-->
        <!--        </el-form-item>-->

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
            <el-button type="primary" size="meduim" @click="onSubmit">提交</el-button>
            <!--            <el-button size="small" @click="goback">返回</el-button>-->
          </el-form-item>

        </el-col>

      </el-form>

    </div>

  </div>

</template>

<script>
import { approveList, getAuditorInfos, getDetailsList, getFlowInfo } from '@/api/remuneration'
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
      },
      auditorQuery: {
        orgId: '',
        auditTier: ''
      },
      auditorList: [],
      isAuditorShow: 1
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  },
  created() {
    console.log('this.$route:', this.$route)
    this.listQuery.flowId = this.$route.params.id
    this.form.flowId = this.$route.params.id
    console.log('this.userinfo', this.userinfo)

    this.fetchData()
  },
  methods: {
    changeAuditor(index) {
      this.form.orgId = this.auditorList[index].orgId
      this.form.auditUser = this.auditorList[index].userId
      console.log(this.form)
    },

    fetchData() {
      this.listLoading = true
      getDetailsList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        console.log('list', this.list)
        // 获取流程
        getFlowInfo(this.listQuery).then(response => {
          console.log('流程信息', response.data)
          this.form.currentFlowStepId = response.data.currentFlowStepId
          this.form.flowDetailId = response.data.flowDetailId
          this.form1.nextFlowStepYes = response.data.nextFlowStepInfoYes
          console.log('currentFlowStepId', this.form.currentFlowStepId)
          console.log('this.form1', this.form1)
          console.log('this.form', this.form)
          const reg = /['支局','分局','分宜县分公司']/

          // 如果是在部门审批环节
          console.log('当前环境', response.data.auditTier)
          console.log('部门', this.userinfo.userAuthorities[0].orgInfo.orgName)
          console.log('是否经营单元', reg.test(this.userinfo.userAuthorities[0].orgInfo.orgName))
          if (response.data.auditTier === 'department') {
            if (reg.test(this.userinfo.userAuthorities[0].orgInfo.orgName)) {
              this.auditorQuery.auditTier = 'county_director'
              console.log('county_director', response.data.auditTier)
            } else {
              this.auditorQuery.auditTier = 'vice_general_manager'
              console.log('vice_general_manager', response.data.auditTier)
            }
          } else if (response.data.auditTier === 'vice_general_manager') {
            console.log('row', this.$route.query.row.projectAmount)
            if (Number(this.$route.query.row.projectAmount) > 20000) {
              this.auditorQuery.auditTier = 'general_manager'
            } else {
              this.isAuditorShow = 0
            }
          } else if (response.data.auditTier === 'general_manager') {
            this.isAuditorShow = 0
            this.form1.nextFlowStepYes = response.data.nextFlowStepYes
            console.log('金额校验', this.isAuditorShow)
          }

          // 获取审批人
          // this.auditorQuery.auditTier = response.data.auditTier
          console.log('获取审批人', this.auditorQuery)
          getAuditorInfos(this.auditorQuery).then(response => {
            console.log('getAuditorInfos', response)

            if (response.code === 200) {
              this.auditorList = response.data
              console.log('auditorList', this.auditorList)
              this.listLoading = false
            }
          })
        })
      })
    },
    onSubmit() {
      this.listLoading = true

      if (this.form.auditResult === 'agree') {
        console.log('agree')
        console.log(this.form1)
        delete this.form.nextFlowStepYes

        if (this.form1.nextFlowStepYes.auditTier === 'judgment1') {
          console.log('next:judgment1')
          this.form.nextFlowStep = 2
          approveList(this.form).then(response => {
            delete this.form.flowDetailId
            console.log('approveList1.response', response)
            console.log('this.form', this.form)
            // this.form.currentFlowStepId =
            const reg = /['支局','分局','分宜县分公司']/
            if (reg.test(this.userinfo.userAuthorities[0].orgInfo.orgName)) {
              this.form.nextFlowStep = this.form1.nextFlowStepYes.nextFlowStepYes
              console.log('county_director', response.data.auditTier)
            } else {
              this.form.nextFlowStep = this.form1.nextFlowStepYes.nextFlowStepNo
            }

            // this.form.nextFlowStep = this.form1.nextFlowStepYes.nextFlowStepYes
            approveList(this.form).then(response => {
              this.listLoading = false
              console.log('approveList2.response', response)
              this.$message({
                message: '审批成功！',
                type: 'success'
              })
            })
          })
        } else if (this.form1.nextFlowStepYes.auditTier === 'judgment2') {
          console.log('next:judgment2')
          this.form.nextFlowStep = 9
          approveList(this.form).then(response => {
            delete this.form.flowDetailId
            console.log('approveList1.response', response)
            console.log('判断', Number(this.$route.query.row.projectAmount) > 20000)
            if (Number(this.$route.query.row.projectAmount) > 20000) {
              this.form.nextFlowStep = this.form1.nextFlowStepYes.nextFlowStepYes
            } else {
              this.form.nextFlowStep = this.form1.nextFlowStepYes.nextFlowStepNo
            }

            // else if (response.data.auditTier === 'general_manager') {
            //   this.form.nextFlowStep = this.form1.nextFlowStepYes.nextFlowStepNo
            // }
            console.log('this.form', this.form)
            approveList(this.form).then(response => {
              this.listLoading = false
              console.log('approveList2.response', response)
              this.$message({
                message: '审批成功！',
                type: 'success'
              })
            })
          })
        } else {
          console.log('this.form1', this.form1)
          this.form.nextFlowStep = 'end'
          approveList(this.form).then(response => {
            this.listLoading = false
            console.log('approveList2.response', response)
            this.$message({
              message: '审批成功！',
              type: 'success'
            })
          })
        }

        // this.form.nextFlowStep = this.form1.nextFlowStepYes
        // console.log('删除前', this.form)
        // console.log('删除后', this.form)
      } else {
        this.form.nextFlowStep = 'repulse'
        console.log('repulse')
        approveList(this.form).then(response => {
          this.listLoading = false
          this.$message({
            message: '审批成功！',
            type: 'success'
          })
        })
      }

      // })
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

.ipt{
  margin-top: 10px;
}

</style>
