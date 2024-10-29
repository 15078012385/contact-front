<template>
  <div>
    <el-card>
      <div slot="header">
        <h1>Code Generator</h1>
      </div>
      <el-form :model="form" label-width="220px" :rules="rules">
        <el-form-item label="Excluded Tables" prop="excludedTables">
          <el-input v-model="form.excludedTables"
                    placeholder="Enter excluded tables，Example：tb_user,tb_product,tb_***"></el-input>
        </el-form-item>
        <el-form-item label="Frontend Output Path" prop="frontPageOutputPath">
          <el-input v-model="form.frontPageOutputPath"
                    placeholder="Enter frontend output path."></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="generateCode">Generate</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CodeGenerator',
  data() {
    return {
      form: {
        excludedTables: '',
        frontPageOutputPath: ''
      },
      loading: false,
      rules: {
        frontPageOutputPath: [
          {required: true, message: 'Please enter frontend output path', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    generateCode() {
      if (!this.form.frontPageOutputPath.trim()) {
        this.$message.error('Please enter all required fields.');
        return;
      }
      this.loading = true; // 开始加载状态
      const frontPageOutputPath = encodeURIComponent(this.form.frontPageOutputPath);
      const url = `http://localhost:9655/code_generator?excludedTables=icons,routes,users,${this.form.excludedTables}&frontPageOutputPath=${frontPageOutputPath}`;
      axios.post(url)
        .then(response => {
          console.log(response.data);
          this.$message.success('Code generation successful. Please restart the backend.'); // 成功提示
        })
        .catch(error => {
          console.error(error);
          this.$message.error('Code generation failed.'); // 失败提示
        })
        .finally(() => {
          this.loading = false; // 结束加载状态
        });

    }
  }
};
</script>

<style lang="scss" scoped>
</style>
