<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" :inline="false" label-width="120px">

      <el-col :span="8">
        <el-form-item label="申请人">
          <el-input v-model="form.createUser" :disabled="true" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="申请人工号">
          <el-input v-model="form.usercode" :disabled="true" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="发起人电话">
          <el-input v-model="form.phone" :disabled="true" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="部门名称">
          <el-input v-model="form.unit_name" :disabled="true" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="发起时间">
          <el-input v-model="form.createDate" :disabled="true" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="工单编号">
          <el-input v-model="form.flowCode" :disabled="true" />
        </el-form-item>
      </el-col>

      <el-form-item label="业务类别" prop="businessType">
        <el-select v-model="form.businessType" placeholder="请选择业务类型">
          <el-option label="考核激励" value="khjl" />
          <el-option label="代扣" value="dk" />
          <el-option label="调账" value="tz" />
          <el-option label="检查考核" value="jckh" />
          <el-option label="其他" value="qt" />
        </el-select>
      </el-form-item>

      <el-form-item label="工单标题">
        <el-input v-model="form.flowName" />
      </el-form-item>

      <el-form-item label="工单详细" prop="desc">
        <el-input v-model="form.flowNotes" type="textarea" :rows="4" resize="none" />
      </el-form-item>

      <el-form-item label="下一步">
        <el-radio-group v-model="form.resource">
          <el-radio label="部门领导审批" />
          <!--          <el-radio label="Venue" />-->
        </el-radio-group>
      </el-form-item>

      <el-row>
        <el-col :span="16">
          <el-form-item label="审批人">
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
      </el-row>

      <el-row />

      <el-form-item>
        <el-button @click="downloadTemplate('temp.xlsx')">下载导入模板</el-button>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>

      </el-form-item>

      <el-col :span="2">
        <el-form-item label="上传清单明细" />
      </el-col>

      <el-row />

      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" align="center" />
      </el-table>

    </el-form>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { addDetailsList, getAuditorInfos } from '@/api/remuneration'
import { mapGetters } from 'vuex'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      form: {
        createUser: '',
        createDate: '',
        usercode: '',
        unit_name: '',
        flowName: '',
        flowCode: '',
        flowNotes: [],
        phone: '',
        resource: '部门领导审批',
        businessType: '',
        // commissionInfos: [],
        flowTemplateId: '1',
        auditUser: '',
        orgId: ''
      },

      rules: {
        businessType: [{ required: true, message: '请选择业务类别', trigger: 'change' }],
        flowNotes: [{ required: true, message: '请输入相关说明', trigger: 'blur' },
          { min: 4, max: 200, message: '长度在 4 到 200 个字符', trigger: 'blur' }]
      },

      tableData: [],
      tableHeader: [],

      auditorQuery: {
        orgId: '',
        auditTier: 'department'
      },
      auditorList: []
      // userInfo: store.getters.state
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  },
  mounted() {
    console.log(this.userinfo)

    this.set_data()
  },

  methods: {
    changeAuditor(index) {
      console.log('changeAuditor')
      console.log(index)
      console.log(this.auditorList[index])
      this.form.orgId = this.auditorList[index].orgId
      this.form.auditUser = this.auditorList[index].userId

      console.log(this.form)
    },

    set_data() {
      /* 发起时间和工单号初始化，获取当前时间转换为对应格式 */
      this.listLoading = true
      const moment = require('moment')
      const datetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      const datestring = moment(new Date()).format('YYYYMMDDHHmmssSSSS')

      this.form.createDate = datetime
      this.form.flowCode = datestring
      this.form.createUser = this.userinfo.userId
      this.form.usercode = this.userinfo.userCode
      this.form.phone = this.userinfo.phone
      this.form.unit_name = this.userinfo.userAuthorities[0].orgInfo.orgName
      this.listLoading = false

      /* 获取审批人信息*/
      getAuditorInfos(this.auditorQuery).then(response => {
        console.log('getAuditorInfos', response)

        if (response.code === 200) {
          this.auditorList = response.data
          console.log('auditorList', this.auditorList)
          this.listLoading = false
        }
      })
    },

    onSubmit(formName) {
      // 数据提交
      console.log('onSubmit', this)

      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('valid', valid)
          this.submitData()
          // alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 调用后端新增接口
    submitData() {
      // console.log('submitData', this)
      this.listLoading = true
      this.form.commissionInfos = this.tableData
      console.log('this.from', this.form)

      addDetailsList(this.form).then(response => {
        console.log('response', response)

        if (response.code === 200) {
          this.$message(response.msg)
          this.listLoading = false

          // this.$message({
          //   message: response.msg,
          //   type: 'warning'
          // })
        }

        // this.list = response.data.records
        // this.listLoading = false
        // console.log(this.list)
      })
    },

    /* 下载按钮*/
    downloadTemplate(fileName) {
      const fileUrl = '' + fileName
      this.$download(fileUrl, fileName)
    },

    // 文件大小检验
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 5

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },

    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      // console.log(this.tableData)

      // 获取工单总金额
      // let sum = 0
      // this.tableData.forEach((item) => {
      //   sum += item.amount
      // })

      // 以项目名称来
      // const uniqueArr = [...new Map(this.tableData.map(item => [item.projectName, item.projectName])).values()]
      // console.log(uniqueArr)
      // console.log(uniqueArr.indexOf('202309月夏季营销激励倒跑追溯'))
      //
      this.tableData.forEach((item) => {
        // item.projectAmount = sum
        // item.commissionCode = this.form.it_code + '0' + (uniqueArr.indexOf(item.projectName) + 1)
        item.commissionCode = this.form.flowCode
        item.commissionType = this.form.businessType
      })

    //   待处理，获取登录信息更新发起人，发起部门等信息
    }

  }
}
</script>

<style scoped>
.line {
  text-align: center;
}

</style>

