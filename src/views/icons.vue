<template>
  <div>
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            搜索区<i class="header-icon el-icon-info"></i>
          </template>
          <!-- 搜索表单 -->
          <el-form :inline="true" :model="searchForm" ref="searchFrom" class="demo-form-inline">
            <el-form-item label="ICON类名" prop="iconClass">
              <el-input v-model="searchForm.iconClass" placeholder="ICON类名"></el-input>
            </el-form-item>
            <el-form-item label="图标ID" prop="id">
              <el-input v-model="searchForm.id" placeholder="图标ID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="clearQuery">清空查询</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
  <el-upload
        class="upload-demo"
        :action="`http://localhost:9655/${tableName.replace('tb_', '')}/import/`"
        :show-file-list="false"
        :on-success="importData"  style="margin: 5px"
      >
        <el-button type="success" size="small"
          ><i class="el-icon-upload"></i>导入</el-button
        >
      </el-upload>      <div style="margin: 5px">
        <el-button type="primary" size="small" @click="showDialog('add')"><i class="el-icon-plus"></i>新增</el-button>
        <el-button type="danger" size="small" @click="deleteBatch"><i class="el-icon-delete-solid"></i>批量删除</el-button>
        <el-button type="info" size="small" @click="exportData"><i class="el-icon-download"></i>导出</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%"  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="iconClass" label="ICON类名"></el-table-column>
        <el-table-column prop="id" label="图标ID"></el-table-column>
        <el-table-column label="实际图标" width="120">
          <template slot-scope="scope">
            <i :class="scope.row.iconClass"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <el-button @click="showDialog('edit', scope.row)" type="warning" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button @click="deleteRow(scope.row)" size="small" type="danger" icon="el-icon-delete">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" title="FORM表单">
      <el-form ref="form" :model="form">
        <el-form-item label="ICON类名" prop="iconClass">
          <el-input v-model="form.iconClass"></el-input>
        </el-form-item>
        <el-form-item label="图标ID" prop="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="action === 'add'" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      searchForm: {},
      tableData: [],
      activeNames: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      form: {},
      dialogVisible: false,
      action: "add",
      selectedIds: [],
      tableName: 'icons',
    };
  },
  mounted(){
    this.fetchData();
  },
  methods: {
 handleChange(row) {
      // 在这里执行你想要的逻辑
      axios
        .post(`http://localhost:9655/${this.tableName.replace("tb_", "")}/save_or_update`, row)
        .then((response) => {
          console.log("提交成功:", response.data);
          this.fetchData();
        })
    },    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id);
    },
    importData() {
   console.log("开始导入数据..."); this.fetchData();    },
    exportData() {
      console.log("开始导出数据...");
      window.open(`http://localhost:9655/${this.tableName.replace("tb_", "")}/export`, "_blank");
    },
    showDialog(type, row) {
this.resetForm();
      this.action = type;
      if (type === "edit") {
        this.form = { ...row };
      }
      this.dialogVisible = true;    },
    onSubmit() {
      console.log("表单数据：", this.form);
      axios
        .post(`http://localhost:9655/${this.tableName.replace("tb_", "")}/save_or_update`, this.form)
        .then((response) => {
          console.log("提交成功:", response.data);
          this.fetchData();
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("提交失败:", error);
        });
    },
    resetForm() {
      // 方法2：通过重置表单数据对象来清空表单数据
      this.form = {
        iconClass: '',
        id: '',
      };
    },
    handleAvatarSuccess(res, columnName) {
      this.form[columnName] = res;
    },
    clearQuery() {
      this.$refs.searchFrom.resetFields();
    },
    deleteBatch() {
      console.log("批量删除的ID集合:", this.selectedIds);
      axios
        .post(`http://localhost:9655/${this.tableName.replace("tb_", "")}/del/batch`, this.selectedIds)
        .then((response) => {
          console.log("批量删除成功:", response.data);
          this.fetchData();
        })
        .catch((error) => {
          console.error("批量删除失败:", error);
        });
    },
    deleteRow(row) {
      console.log("deleteRow called with row:", row);
      axios
        .delete(`http://localhost:9655/${this.tableName.replace("tb_", "")}/${row.id}`)
        .then((response) => {
          console.log("删除成功:", response.data);
          this.fetchData();
        })
        .catch((error) => {
          console.error("删除失败:", error);
        });
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchData();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      console.log("当前页码:", newPage);
      this.fetchData();
    },
    fetchData() {
      console.log("fetchData called with searchFields:", this.searchForm);
      axios
        .post(`http://localhost:9655/${this.tableName.replace("tb_", "")}/page_by_entity?pageNum=${this.currentPage}&pageSize=${this.pageSize}`, this.searchForm)
        .then((response) => {
          console.log("后端返回的数据:", response.data);
          this.tableData = response.data.data.records;
          this.total = response.data.data.total;
        })
        .catch((error) => {
          console.error("请求出错:", error);
        });
    },
  },
};
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
