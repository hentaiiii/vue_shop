<!-- Categories -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCateDialog"
          >添加分类</el-button
        >
      </el-row>
      <!-- 表格区域 -->
      <zk-table
        :data="cateList"
        :columns="columns"
        stripe
        border
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="isOK" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: green"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </zk-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateTatol * 1"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialog"
      width="50%"
      @close="closeAddCateEvent"
    >
      <el-form
        ref="addCateForm"
        :model="addCateForm"
        label-width="100px"
        :rules="addCateRules"
      >
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="parCateList"
            :props="selectProps"
            @change="handleChange"
            :disabled="optionsChanged"
            :key="isResouceShow"
            :clearable="true"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialog"
      width="50%"
      @close="closeEditCateDialog"
    >
      <el-form
        :model="editCateRuleForm"
        :rules="addCateRules"
        ref="editCateRuleForm"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateRuleForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqCategories,
  reqAddCate,
  reqCateById,
  putCate,
  delCate
} from "../../api/index";
export default {
  data() {
    return {
      queryInfo: {
        // 商品分类参数对象
        type: 3,
        pagenum: 7,
        pagesize: 5
      },
      cateList: [], // 商品分类参数列表
      cateTatol: "", // 商品分类总数
      columns: [
        // 树状表格的列控制对象
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          type: "template",
          template: "isOK",
          prop: "cat_deleted"
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
          prop: "cat_level"
        },
        { label: "操作", type: "template", template: "opt", prop: "cat_level" }
      ],
      addCateDialog: false, // 添加分类的显示和隐藏
      addCateForm: {
        // 添加分类对象
        cat_pid: 0, // 添加分类的父级id
        cat_name: "",
        cat_level: 0 // 添加分类的层级
      },
      parCateList: [], // 一二级分类
      selectKeys: [], // 选中的父级分类的id数组
      selectProps: {
        // 联及选择器配置对象
        expandTrigger: "hover",
        checkStrictly: "true",
        value: "cat_id",
        children: "children",
        label: "cat_name"
      },
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      editCateDialog: false, // 编辑分类的显示和隐藏
      editCateRuleForm: {}, // 当前被编辑的分类
      optionsChanged: false, // 是否禁用联级选择器(没数据禁用)
      isResouceShow: 0
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      const res = await reqCategories(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data.result;
      this.cateTatol = res.data.total;
    },
    // 监听每页数量改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategories();
    },

    // 监听页面
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum;
      this.getCategories();
    },

    // 获取一二级分类
    async getParCate() {
      this.parCateList = []
      ++this.isResouceShow
      const res = await reqCategories({
        type: 2,
        pagenum: this.queryInfo.pagenum,
        pagesize: this.queryInfo.pagesize
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      if(res.data.result.length === 0){
        this.optionsChanged = true
      }
      this.parCateList = res.data.result;
    },

    // 联级选择器change事件
    handleChange() {
      if (this.selectKeys.length > 0) {
        // 选中了
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        this.addCateForm.cat_level = this.selectKeys.length;
      } else {
        // 没选中
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    // 点击按钮显示添加分类对话框
    showAddCateDialog() {
      this.addCateDialog = true;
      this.getParCate();
    },

    // 监听对话框关闭
    closeAddCateEvent() {
      this.$refs.addCateForm.resetFields();
      this.selectKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },

    // 添加分类
    addCate() {
      this.$refs.addCateForm.validate(async valid => {
        if (!valid) {
          return this.$message.error("请输入正确格式的数据");
        }
        // 添加分类
        const res = await reqAddCate(this.addCateForm);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        // 添加成功
        this.$message.success(res.meta.msg);
        this.addCateDialog = false;
        this.getCategories();
      });
    },

    // 编辑按钮点击
    async showEditCateDialog(id) {
      this.editCateDialog = true;
      const res = await reqCateById(id);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.editCateRuleForm = res.data;
    },

    // 监听编辑分类对话框关闭
    closeEditCateDialog() {
      this.$refs.editCateRuleForm.resetFields();
    },

    // 编辑分类
    editCate() {
      this.$refs.editCateRuleForm.validate(async vaild => {
        if (!vaild) {
          return this.$message.error("请输入正确的格式!");
        }
        const { cat_id, cat_name } = this.editCateRuleForm;
        const res = await putCate(cat_id, cat_name);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        // 编辑成功
        this.$message.success(res.meta.msg);
        this.editCateDialog = false;
        this.getCategories();
      });
    },

    // 删除当前分类
    async deleteCate(id) {
      const confrim = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confrim === "cancel") {
        return this.$message.error("已取消删除");
      }
      // 确定删除
      const res = await delCate(id);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      // 删除成功
      this.$message.success(res.meta.msg);
      this.getCategories();
    },

   
  }
};
</script>
<style lang='less' scoped>
.zk-table {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>