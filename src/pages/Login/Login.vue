<!--  login-->
<template>
  <div class="container_login">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="" />
      </div>
      <!-- 表单 -->
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="loginFormRule"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item class="username" prop="username">
          <el-input
            placeholder="用户名"
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="password" prop="password">
          <el-input
            placeholder="密码"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="login_btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reqLogin } from "../../api/index";
export default {
  data() {
    // 用户名的表单验证规则
    let checkName = (rule, value, callBack) => {
      if (value === "") {
        return callBack(new Error("用户名不能为空!"));
      }
      if (value.length < 3 || value.length > 10) {
        callBack(new Error("用户名必须是在3-10位!"));
      } else {
        callBack();
      }
    };
    // 密码的验证规则
    let checkPass = (rule, value, callBack) => {
      if (!value) {
        return callBack(new Error("密码不能为空!"));
      }
      if (value.length < 3 || value.length > 8) {
        callBack(new Error("密码必须是在3-8位!"));
      } else {
        callBack();
      }
    };
    return {
      // 登陆表单
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 前端表单验证规则
      loginFormRule: {
        username: [{ validator: checkName, trigger: "blur" }],
        password: [{ validator: checkPass, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 重置用户名和密码
    resetLogin() {
      this.$refs.loginFormRef.resetFields();
    },
    // 用户登陆
    login() {
      // 登陆之前对表单进行验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        // 开始登陆
        const result = await reqLogin(this.loginForm);
        if (result.meta.status !== 200) {
          this.$message({
            message: "账号或密码错误，请重试！",
            type: "error"
          });
        } else {
          // 登陆成功
          this.$message({
            message: "登陆成功！",
            type: "success"
          })
          // 保存token
          window.sessionStorage.setItem('loginToken', result.data.token)
          // 跳转到个人中心
          this.$router.replace('/home')
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.container_login {
  position: relative;
  background-color: #2b4b6b;
  width: 100%;
  height: 100%;
  .login_box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 3px;
    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 1px solid #eee;
      padding: 10px;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }

    .login_btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>