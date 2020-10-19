<!--  -->
<template>
  <div>
    <el-button type="danger" @click="logOut">退出登陆</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    logOut() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 清除token
          window.sessionStorage.clear()
          this.$router.replace('/login')
          this.$message({
            type: "success",
            message: "退出成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消！"
          });
        });
    }
  }
};
</script>
<style lang='less' scoped>
</style>