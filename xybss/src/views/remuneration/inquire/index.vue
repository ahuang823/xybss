<template>
  <div class="app-container">

    <div class="filter-container">

      <!--      <el-select v-model="listQuery.importance" placeholder="账期" clearable style="width: 120px;" class="filter-item">-->
      <!--        <el-option v-for="item in monthIdOptions" :key="item" :label="item" :value="item" />-->
      <!--      </el-select>-->

      <el-input v-model="listQuery.projectName" placeholder="项目名称" style="width: 200px" class="filter-item" />
      <el-input v-model="listQuery.shopId" placeholder="厅店" style="width: 200px;margin-left: 1%" class="filter-item" />

      <el-date-picker
        v-model="listQuery.accountPeriod"
        class="filter-item"
        type="month"
        placeholder="选择账期"
        format="yyyyMM"
        value-format="yyyyMM"
        size="small"
        style="width: 125px;margin-left: 1%;"
      />

      <el-input v-model="listQuery.businessNumber" placeholder="号码" style="width: 200px;margin-left: 1%" class="filter-item" />
      <el-input v-model="listQuery.county" placeholder="县区分局" style="width: 200px;margin-left: 1%" class="filter-item" />
      <el-input v-model="listQuery.businessDepartment" placeholder="营业部" style="width: 200px;margin-left: 1%" class="filter-item" />

      <!--      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px;margin-left: 1%">-->
      <!--        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
      <!--      </el-select>-->

      <el-button v-waves class="filter-item" type="small" icon="el-icon-search" style="margin-left: 1%" @click="handleFilter">
        搜索
      </el-button>

      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="small" icon="el-icon-download" @click="handleDownload">-->
      <!--        导出-->
      <!--      </el-button>-->
      <!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--        是否核发-->
      <!--      </el-checkbox>-->

      <el-button v-waves type="small" icon="el-icon-search" style="margin-left: 1%" class="filter-item" @click="clearFilter">
        清除全部筛选
      </el-button>
    </div>

    <el-table
      ref="dataList"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      stripe
    >
      <!--      <el-table-column align="center" label="id" width="95" sortable prop="commissionId">-->
      <!--        <template v-slot="scope">-->
      <!--          {{ scope.row.commissionId }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column
        label="账期"
        align="center"
        sortable
        prop="accountPeriod"
      >
        <template v-slot="scope">
          {{ scope.row.accountPeriod }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template v-slot="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>

      <el-table-column label="项目总金额" align="center" sortable>
        <template v-slot="scope">
          {{ scope.row.projectAmount }}
        </template>
      </el-table-column>

      <el-table-column label="发起时间" sortable>
        <template v-slot="scope">
          {{ scope.row.initiating_time }}
        </template>
      </el-table-column>

      <el-table-column label="发起部门" align="center" sortable>
        <template v-slot="scope">
          {{ scope.row.agentDepartment }}
        </template>
      </el-table-column>

      <el-table-column label="厅店" align="center" sortable>
        <template v-slot="scope">
          {{ scope.row.org_name }}
        </template>
      </el-table-column>

      <el-table-column label="厅店ID" align="center" sortable>
        <template v-slot="scope">
          {{ scope.row.shopId }}
        </template>
      </el-table-column>

      <el-table-column label="金额" align="center" sortable>
        <template v-slot="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>

      <el-table-column label="经办人" align="center" sortable>
        <template v-slot="scope">
          {{ scope.row.agent }}
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

      <el-table-column label="县区分局" align="center" sortable>
        <template v-slot="scope">
          {{ scope.row.county }}
        </template>
      </el-table-column>

      <el-table-column label="营业部" align="center" sortable>
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

    <template>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchData"
      />
    </template>

  </div>

</template>

<script>
import { getList3 } from '@/api/remuneration'
import { getDetailsList } from '@/api/remuneration'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  directives: { waves },

  filters: {
    // 状态
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
      total: 0,

      // 参数
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        projectName: undefined,
        accountPeriod: undefined,
        shopId: undefined,
        county: undefined,
        businessDepartment: undefined
        // shopId: '979070906'
      },

      defaultQuery: {
        pageNum: 1,
        pageSize: 10
      },

      list: null, // 明细清单
      listLoading: true // 加载中状态

    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    getList() {
      this.listLoading = true
      getList3(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false

        console.log(this.list)
      })
    },

    fetchData() {
      this.listLoading = true
      getDetailsList(this.listQuery).then(response => {
        console.log('response', response)
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
        console.log(this.list)
      })
    },
    handleFilter() {
      this.fetchData()
    },

    /* 字段筛选*/
    // filterTag(value, row) {
    //   console.log('value', value)
    //   return row.accountPeriod === value
    // },
    /* 重置全部查询和筛选条件*/
    clearFilter() {
      this.listQuery = Object.assign({}, this.defaultQuery)
    }

  }
}
</script>
