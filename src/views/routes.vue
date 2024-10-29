<template>
  <div>
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            搜索区<i class="header-icon el-icon-info"></i>
          </template>
          <!-- 搜索表单 -->
          <el-form
            :inline="true"
            :model="searchForm"
            ref="searchFrom"
            class="demo-form-inline"
          >
            <el-form-item label="路径" prop="path">
              <el-input v-model="searchForm.path" placeholder="路径"></el-input>
            </el-form-item>
            <el-form-item label="组件名称" prop="childrenComponent">
              <el-input
                v-model="searchForm.childrenComponent"
                placeholder="组件名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="searchForm.icon" placeholder="图标"></el-input>
            </el-form-item>
            <el-form-item label="路由ID" prop="id">
              <el-input v-model="searchForm.id" placeholder="路由ID"></el-input>
            </el-form-item>
            <el-form-item label="路由标题" prop="title">
              <el-input
                v-model="searchForm.title"
                placeholder="路由标题"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="fetchData"
              >查询
              </el-button
              >
              <el-button type="danger" icon="el-icon-delete" @click="clearQuery"
              >清空查询
              </el-button
              >
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-upload
        class="upload-demo"
        :action="`http://localhost:9655/${tableName.replace(
          'tb_',
          ''
        )}/import/`"
        :show-file-list="false"
        :on-success="importData"
        style="margin: 5px"
      >
        <el-button type="success" size="small"
        ><i class="el-icon-upload"></i>导入
        </el-button
        >
      </el-upload>
      <div style="margin: 5px">
        <el-button type="primary" size="small" @click="generateRoutesBatch">
          <i class="el-icon-plus"></i>批量生成路由
        </el-button>

        <el-button type="primary" size="small" @click="showDialog('add')"
        ><i class="el-icon-plus"></i>新增
        </el-button
        >
        <el-button type="danger" size="small" @click="deleteBatch"
        ><i class="el-icon-delete-solid"></i>批量删除
        </el-button
        >
        <el-button type="info" size="small" @click="exportData"
        ><i class="el-icon-download"></i>导出
        </el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column
          prop="childrenComponent"
          label="组件名称"
        ></el-table-column>
        <el-table-column prop="icon" label="图标" align="center">
          <template slot-scope="scope">
            <i :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="路由ID"></el-table-column>
        <el-table-column prop="title" label="路由标题"></el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <el-button @click="generateRouteInfo(scope.row)" type="success" icon="el-icon-document" size="small">
              路由信息生成
            </el-button>
            <br>
            <br>
            <el-button
              @click="showDialog('edit', scope.row)"
              type="warning"
              icon="el-icon-edit"
              size="small"
            >编辑
            </el-button
            >
            <el-button
              @click="deleteRow(scope.row)"
              size="small"
              type="danger"
              icon="el-icon-delete"
            >移除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" title="FORM表单">
      <el-form ref="form" :model="form">
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="childrenComponent">
          <el-input v-model="form.childrenComponent"></el-input>
        </el-form-item>
        <el-form-item label="图标代码" prop="icon">
          <el-select v-model="form.icon" placeholder="请选择图标">
            <el-option
              v-for="item in iconsData"
              :key="item.id"
              :label="item.iconClass"
              :value="item.iconClass"
            />
            <!-- 使用template渲染图标 -->
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <template v-slot:default>
            <i :class="form.icon"></i>
          </template>
        </el-form-item>
        <el-form-item label="路由标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="action === 'add'" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="生成的路由信息" :visible.sync="showDialogt">
      <pre>{{ generatedRouteInfo }}</pre>
    </el-dialog>

  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      searchForm: {},
      iconsData: [],
      tableData: [],
      activeNames: [], showDialogt: false,
      currentPage: 1, generatedRouteInfo: "",
      pageSize: 10,
      total: 0,
      form: {},
      dialogVisible: false,
      action: "add",
      selectedIds: [],
      tableName: "routes",
    };
  },
  mounted() {
    this.fetchData();
    this.fetchIconsData();
  },
  methods: {
    generateRoutesBatch() {
      if (this.selectedIds.length === 0) {
        this.$message.warning('请先选择要生成路由的记录');
        return;
      }

      const generatedRoutes = [];

      // 遍历选中的记录，生成对应的路由信息
      this.tableData.forEach(row => {
        if (this.selectedIds.includes(row.id)) {
          const routeInfo = `
      {
        path: '/generator_page_${row.id}',
        component: Layout,
        redirect: '${row.path}',
        children: [{
          path: '${row.path}',
          name: '${row.path}',
          component: () => import('@/views/${row.childrenComponent}'),
          meta: { title: '${row.title}', icon: '${row.icon}' }
        }]
      },`;

          generatedRoutes.push(routeInfo);
        }
      });

      // 将生成的路由信息显示在对话框中或者其他适当的方式
      this.generatedRouteInfo = generatedRoutes.join('\n');
      this.showDialogt = true;
    },
    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id);
    },
    importData() {
      console.log("开始导入数据...");
      this.fetchData();
    },
    exportData() {
      console.log("开始导出数据...");
      window.open(
        `http://localhost:9655/${this.tableName.replace("tb_", "")}/export`,
        "_blank"
      );
    },
    showDialog(type, row) {
      this.resetForm();
      this.action = type;
      if (type === "edit") {
        this.form = {...row};
      }
      this.dialogVisible = true;
    },
    onSubmit() {
      console.log("表单数据：", this.form);
      axios
        .post(
          `http://localhost:9655/${this.tableName.replace(
            "tb_",
            ""
          )}/save_or_update`,
          this.form
        )
        .then((response) => {
          console.log("提交成功:", response.data);
          this.fetchData();
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("提交失败:", error);
        });
    },
    fetchIconsData() {
      axios
        .get("http://localhost:9655/icons/find_all")
        .then((response) => {
          this.iconsData = response.data.data; // 将图标数据存储到 iconsData 变量中
        })
        .catch((error) => {
          console.error("获取图标数据失败:", error);
        });
    },
    resetForm() {
      // 方法2：通过重置表单数据对象来清空表单数据
      this.form = {
        path: "",
        childrenComponent: "",
        icon: "",
        id: "",
        title: "",
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
        .post(
          `http://localhost:9655/${this.tableName.replace(
            "tb_",
            ""
          )}/del/batch`,
          this.selectedIds
        )
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
        .delete(
          `http://localhost:9655/${this.tableName.replace("tb_", "")}/${row.id}`
        )
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
    }, generateRouteInfo(row) {
      // 在这里执行生成路由信息的逻辑，可以使用row来获取当前行的数据
      const routeInfo = `
{
  path: '/generator_page',
  component: Layout,
  redirect: '${row.path}',
  children: [{
    path: '${row.path}',
    name: '${row.path}',
    component: () => import('@/views/${row.childrenComponent}'),
    meta: { title: '${row.title}', icon: '${row.icon}' }
  }]
},`;
      console.log(routeInfo);
      this.generatedRouteInfo = routeInfo; // 将生成的路由信息保存到变量中
      this.showDialogt = true; // 显示对话框
    },
    fetchData() {
      console.log("fetchData called with searchFields:", this.searchForm);
      axios
        .post(
          `http://localhost:9655/${this.tableName.replace(
            "tb_",
            ""
          )}/page_by_entity?pageNum=${this.currentPage}&pageSize=${
            this.pageSize
          }`,
          this.searchForm
        )
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
  border-color: #409eff;
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
