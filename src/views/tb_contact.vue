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
            <el-form-item label="联系地址" prop="address">
              <el-input v-model="searchForm.address" placeholder="联系地址"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="searchForm.mobile" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" prop="remark">
              <el-input v-model="searchForm.remark" placeholder="备注信息"></el-input>
            </el-form-item>
            <el-form-item label="联系人姓名" prop="name">
              <el-input v-model="searchForm.name" placeholder="联系人姓名"></el-input>
            </el-form-item>
            <el-form-item label="公司名称" prop="company">
              <el-input v-model="searchForm.company" placeholder="公司名称"></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input v-model="searchForm.position" placeholder="职位"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="searchForm.email" placeholder="电子邮箱"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                <el-option label="正常" :value="1"></el-option>
                <el-option label="已删除" :value="0"></el-option>
              </el-select>
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
        <el-table-column prop="birthday" label="生日"></el-table-column>
        <el-table-column prop="address" label="联系地址"></el-table-column>
        <el-table-column prop="created" label="创建时间"></el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="remark" label="备注信息"></el-table-column>
        <el-table-column label="头像地址">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="联系人姓名"></el-table-column>
        <el-table-column prop="company" label="公司名称"></el-table-column>
        <el-table-column prop="id" label="主键ID"></el-table-column>
        <el-table-column prop="position" label="职位"></el-table-column>
        <el-table-column prop="updated" label="更新时间"></el-table-column>
        <el-table-column prop="email" label="电子邮箱"></el-table-column>
        <el-table-column label="状态：1-正常 0-已删除">
          <template slot-scope="scope">
            <el-switch @change="handleChange(scope.row)"   :active-value=1 :inactive-value=0  v-model="scope.row.status"></el-switch>
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
        <el-form-item label="生日" prop="birthday">
          <el-input v-model="form.birthday"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="created">
          <el-date-picker type="datetime"  format="yyyy-MM-dd HH:mm:ss"  v-model="form.created" placeholder="选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label="头像地址" prop="avatar">
          <el-upload class="avatar-uploader" action="http://localhost:9655/file/upload/" :show-file-list="false" :on-success="($event) => handleAvatarSuccess($event, 'avatar')">
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="form.company"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position"></el-input>
        </el-form-item>
        <el-form-item label="更新时间" prop="updated">
          <el-date-picker type="datetime"  format="yyyy-MM-dd HH:mm:ss"  v-model="form.updated" placeholder="选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
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
      tableName: 'tb_contact',
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
          this.$message.success('操作成功');this.fetchData();
        })
    },    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id);
    },
    importData() {
   console.log("开始导入数据..."); this.$message.success('操作成功');this.fetchData();     },
    exportData() {
      console.log("开始导出数据...");
      window.open(`http://localhost:9655/${this.tableName.replace("tb_", "")}/export`, "_blank");
    this.$message.success('操作成功'); },
    showDialog(type, row) {
this.resetForm();
      this.action = type;
      if (type === "edit") {
        this.form = { ...row };
      }
      this.dialogVisible = true;    },
 addHoursToDate(dateStr, hours) {
      const date = new Date(dateStr);
      date.setHours(date.getHours() + hours);
      return date.toISOString();  // 返回ISO 8601格式的日期字符串
    },    onSubmit() {
  var formCopy = { ...this.form };

      Object.keys(formCopy).forEach(key => {
        if (/(date|created|updated|time)/i.test(key) && formCopy[key]) {
          formCopy[key] = this.addHoursToDate(formCopy[key], 8);
        }
      });      axios
        .post(`http://localhost:9655/${this.tableName.replace("tb_", "")}/save_or_update`, formCopy)
        .then((response) => {
          console.log("提交成功:", response.data);
          this.$message.success('操作成功');this.fetchData();
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("提交失败:", error);this.$message.error('操作失败');
        });
    },
    resetForm() {
      // 方法2：通过重置表单数据对象来清空表单数据
      this.form = {
        birthday: '',
        address: '',
        created: '',
        mobile: '',
        remark: '',
        avatar: '',
        name: '',
        company: '',
        id: '',
        position: '',
        updated: '',
        email: '',
        status: '',
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
          this.$message.success('操作成功');this.fetchData();
        })
        .catch((error) => {
          console.error("批量删除失败:", error);this.$message.error('操作失败');
        });
    },
    deleteRow(row) {
      console.log("deleteRow called with row:", row);
      axios
        .delete(`http://localhost:9655/${this.tableName.replace("tb_", "")}/${row.id}`)
        .then((response) => {
          console.log("删除成功:", response.data);
          this.fetchData();this.$message.success('操作成功');
        })
        .catch((error) => {
          console.error("删除失败:", error);this.$message.error('操作失败');
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
