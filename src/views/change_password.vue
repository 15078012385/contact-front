<template>
  <el-form ref="form" :model="formData" label-width="120px" class="password-form">
    <el-form-item label="当前密码" prop="currentPassword">
      <el-input type="password" v-model="formData.currentPassword" autocomplete="current-password"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input type="password" v-model="formData.newPassword" autocomplete="new-password"></el-input>
    </el-form-item>
    <el-form-item label="确认新密码" prop="confirmPassword">
      <el-input type="password" v-model="formData.confirmPassword" autocomplete="new-password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        userId:JSON.parse(localStorage.getItem("userInfo")).userId,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.formData.newPassword !== this.formData.confirmPassword) {
            this.$message.error('新密码和确认密码不一致');
            return;
          }
          axios.post("http://localhost:9655/users/change_password",this.formData).then((resp)=>{
              if (resp.data.code==200){
                // localStorage.clear();
                this.$message.success("修改成功")
                this.$router.push("/")
              }else {
                this.$message.error(resp.data.message)
              }
          })
          // 在这里提交表单数据到后端
          console.log('表单提交成功');
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    }
  }
};
</script>

<style>
.password-form {
  max-width: 400px;
  margin: 50px auto;
}
</style>
