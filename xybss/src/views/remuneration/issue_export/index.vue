<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <div>
      <el-col :span="3"><el-input v-model="listQuery.accountPeriod" size="small" placeholder="请输入账期" />
      </el-col>
      <el-col :span="3" style="margin-left: 10px"> <el-button type="primary" size="small" @click="fetchData">查询</el-button>
      </el-col>

    </div>

    <el-table ref="issue" v-loading="listLoading" style="margin-top: 3%;" :data="list" element-loading-text="Loading..." border fit show-summary highlight-current-row>

      <el-table-column label="结算周期" align="center">
        <template slot-scope="scope">
          {{ scope.row.accountPeriod }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="accountPeriod" width="110" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag>{{ scope.row.accountPeriod }}</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="代理商ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.shopMerchantId }}
        </template>
      </el-table-column>
      <el-table-column label="代理商名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.merchantName }}
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.sum }}
        </template>
      </el-table-column>

      <!--      <el-table-column align="center" label="Date" width="220">-->
      <!--        <template slot-scope="scope">-->
      <!--          <i class="el-icon-time" />-->
      <!--          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <div style="margin-top: 1%;">
      <FilenameOption v-model="filename" />
      <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" />
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
        {{ $t('excel.export') }} Excel
      </el-button>
      <!--      <a href="https://panjiachen.github.io/vue-element-admin-site/feature/component/excel.html" target="_blank" style="margin-left:15px;">-->
      <!--        <el-tag type="info">Documentation</el-tag>-->
      <!--      </a>-->
    </div>

  </div>
</template>

<script>
import { parseTime } from '@/utils'
// options components
// import FilenameOption from './components/FilenameOption'
import FilenameOption from '@/views/excel/components/FilenameOption.vue'
import AutoWidthOption from '@/views/excel/components/AutoWidthOption'
import BookTypeOption from '@/views/excel/components/BookTypeOption'
import { getIssueByPeriod } from '@/api/remuneration'
export default {
  name: 'ExportExcel',
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '手工佣金汇总',
      autoWidth: true,
      bookType: 'xlsx',
      listQuery: {
        accountPeriod: ''
      }

    }
  },
  created() {
    this.listLoading = false
    // this.fetchData()
  },

  methods: {
    fetchData() {
      this.listLoading = true
      getIssueByPeriod(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['结算周期', '代理商ID', '代理商名称', '金额']
        const filterVal = ['accountPeriod', 'shopMerchantId', 'merchantName', 'sum']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
