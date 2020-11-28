<!-- goods -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加商品 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            @change="goodInputChange"
            clearable
            @clear="getGoodList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="goodInputChange"
            ></el-button>
          </el-input>
        </el-col>

        <el-button type="primary" @click="goAddGood">添加商品</el-button>
      </el-row>

      <!-- table表格 -->
      <el-table border stripe :data="goodList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="105"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="90"
        ></el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGood(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[20, 30, 40, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalGoods"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { reqGoodList, reqDeleteGood } from "../../api/index";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 20
      },
      goodList: [],
      totalGoods: 0
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    // 获取商品列表
    async getGoodList() {
      const res = await reqGoodList(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败!");
      }
      this.goodList = res.data.goods;
      this.totalGoods = res.data.total;
      console.log(res.data);
    },

    // 监听页面数据条数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodList();
    },

    // 监听页码改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getGoodList();
    },

    // 监听输入框改变事件
    goodInputChange() {
      this.getGoodList();
    },

    goAddGood() {
      console.log("aaaaa");
      this.$router.push("/goods/add");
    },

    // 删除商品
    async delGood(id) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmRes !== "confirm") {
        return this.$message.info("已取消删除!");
      }
      const res = await reqDeleteGood(id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败!");
      }
      // 删除成功
      this.$message.success("删除成功");
      this.getGoodList();
    }
  }
}
</script>
<style lang='less' scoped>
</style>