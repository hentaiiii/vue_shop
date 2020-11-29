<!-- Orders -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table布局 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
          width="260"
        ></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay !== 0"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showKdMsg"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalOrder"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editOrderDialog"
      width="50%"
      @close="closeEidtOrderDialog"
    >
      <el-form
        :model="editOrderForm"
        :rules="editOrderRules"
        ref="editOrderFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editOrderForm.address1"
            :options="cityData"
            :props="orderProp"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editOrderForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialog = false">取 消</el-button>
        <el-button type="primary" @click="editOrderDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressDialog" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in kuaidiObj"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { reqGetOrders } from "../../api/index";
import cityData from "./citydata";
import kuaidiObj from "./kuaidi";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      totalOrder: 0,
      // 控制编辑对话框的显示和隐藏
      editOrderDialog: false,
      cityData,
      editOrderForm: {
        address1: [],
        address2: ""
      },
      editOrderRules: {
        address1: [
          { required: true, message: "请输入省市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      // 联级输入框配置对象
      orderProp: {
        expandTrigger: "hover"
      },
      kuaidiObj: kuaidiObj.data,
      progressDialog: false
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const res = await reqGetOrders(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单失败！");
      }
      this.orderList = res.data.goods;
      this.totalOrder = res.data.total;
    },
    // 显示编辑地址对话框
    showEditDialog() {
      this.editOrderDialog = true;
    },
    // 监听编辑订单地址对话框
    closeEidtOrderDialog() {
      this.$refs.editOrderFormRef.resetFields();
    },
    // 分页页面size改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
    },
    // currentPage 改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getOrderList();
    },
    // 显示物流进度
    // 接口错误直接引入
    showKdMsg() {
      this.progressDialog = true;
    }
  }
};
</script>
<style lang='less' scoped>
.el-cascader {
  width: 100%;
}
</style>