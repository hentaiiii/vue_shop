<!-- right -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if=" scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if=" scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { reqRights } from "../../api/index";
export default {
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getRights()
  },
  methods: {
    async getRights() {
      const res = await reqRights();
      if (res.meta.status !== 200) {
        return this.$message.error(this.meta.msg)
      }
      this.rightsList = res.data
    }
  }
};
</script>
<style lang='less' scoped>
</style>