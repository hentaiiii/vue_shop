<!-- params -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="注意：只允许为第三级设置分类相关参数!"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="select_row">
        <span>选择商品分类：</span>
        <el-cascader
          v-model="selectCateKeys"
          :options="cateList"
          :props="cateProps"
          @change="handleChange"
        ></el-cascader>
      </el-row>

      <!-- tab标签页 -->
      <el-tabs v-model="paramActiveName" @tab-click="paramsHandleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isDisabled"
            @click="showAddParamDialog"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyParams" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeTagParam(index, scope.row)"
                  >{{ item }}</el-tag
                >

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" prop="attr_name">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isDisabled"
            @click="showAddParamDialog"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyParams" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeTagParam(index, scope.row)"
                  >{{ item }}</el-tag
                >

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性参数对话框 -->
    <el-dialog
      :title="paramsName"
      :visible.sync="addParamDialog"
      width="50%"
      @close="closeAddParamDialog"
    >
      <!-- 当表单只有一个输入框 按enter键会触发页面刷新 -->
      <el-form
        :model="addParamForm"
        :rules="addParamRules"
        ref="addParamForm"
        label-width="100px"
        class="demo-ruleForm"
        @submit.native.prevent
      >
        <el-form-item :label="paramsName" prop="attr_name">
          <el-input v-model="addParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialog = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑属性对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editParamDialog"
      width="50%"
      @close="closeEditDialog"
    >
      <el-form
        :model="editParamForm"
        :rules="addParamRules"
        ref="editParamForm"
        label-width="100px"
        class="demo-ruleForm"
        @submit.native.prevent
      >
        <el-form-item :label="paramsName" prop="attr_name">
          <el-input v-model="editParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialog = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqCategories,
  reqAttributes,
  reqAddParam,
  reqParamById,
  reqPutParam,
  reqDeleteParamById
} from "../../api/index";
export default {
  data() {
    return {
      // 分类列表
      cateList: [],
      // 联及选择器配置选项
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 联及选择器框双向绑定到数组
      selectCateKeys: [],
      // 被激活的标签页
      paramActiveName: "many",
      // 静态参数列表
      onlyParams: [],
      // 动态参数列表
      manyParams: [],
      // 控制添加参数的显示和隐藏
      addParamDialog: false,
      // 添加属性表单
      addParamForm: {
        attr_name: ""
      },
      // 添加参数表单验证规则
      addParamRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      // 编辑对话框的显示和隐藏
      editParamDialog: false,
      editParamForm: {
        attr_name: ""
      },
      // 当前三级分类参数的id
      attr_id: "",
      // tag标签和文本框的切换
      inputVisible: false,
      // tag输入框的值
      inputValue: ""
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isDisabled() {
      return this.selectCateKeys.length !== 3 ? true : false;
    },
    // 添加属性和参数的名称
    paramsName() {
      if (this.paramActiveName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
    // 当前三级分类id
    cateId() {
      return this.selectCateKeys[this.selectCateKeys.length - 1];
    }
  },
  methods: {
    // 获取所有参数列表
    async getCateList() {
      const res = await reqCategories();
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败，请稍后重试!");
      }
      this.cateList = res.data;
    },

    // 联级菜单改变事件
    handleChange() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        this.onlyParams = [];
        this.manyParams = [];
        return;
      }

      this.getParams();
    },

    // tab标签页点击切换
    paramsHandleClick() {
      if (this.selectCateKeys.length !== 3) {
        return;
      }
      this.getParams();
    },

    //  获取参数参数列表
    async getParams() {
      // 获取参数列表
      const res = await reqAttributes(this.cateId, this.paramActiveName);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }

      // 遍历循环更改数据结构
      res.data.forEach(item => {
        if (item["attr_vals"] === "") {
          item["attr_vals"] = [];
        } else {
          item["attr_vals"] = item["attr_vals"].split(" ");
        }
        // 控制文本的控制和隐藏
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue = "";
      });

      if (this.paramActiveName === "only") {
        // 动态参数
        this.onlyParams = res.data;
      } else {
        //静态参数
        this.manyParams = res.data;
      }
    },

    // 添加参数点击事件
    showAddParamDialog() {
      this.addParamDialog = true;
    },

    // 监听对话框关闭事件
    closeAddParamDialog() {
      this.$refs.addParamForm.resetFields();
    },

    // 添加商品分类参数
    addParam() {
      this.$refs.addParamForm.validate(async vaild => {
        if (!vaild) {
          return;
        }
        const res = await reqAddParam(
          this.cateId,
          this.addParamForm.attr_name,
          this.paramActiveName
        );
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }

        this.$message.success(res.meta.msg);
        this.addParamDialog = false;
        this.getParams();
      });
    },

    // 展示编辑参数对话框
    async showEditParamDialog(attr_id) {
      this.attr_id = attr_id;
      this.editParamDialog = true;
      const res = await reqParamById(
        this.cateId,
        attr_id,
        this.paramActiveName
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败!");
      }
      this.editParamForm.attr_name = res.data.attr_name;
    },
    // 监听对话框的关闭
    closeEditDialog() {
      this.$refs.editParamForm.resetFields();
    },
    // 编辑参数名称
    editParam() {
      this.$refs.editParamForm.validate(async valid => {
        if (!valid) {
          return;
        }

        const res = await reqPutParam(
          this.cateId,
          this.attr_id,
          this.editParamForm.attr_name,
          this.paramActiveName
        );
        if (res.meta.status !== 200) {
          return this.$message.error("编辑失败！");
        }

        this.$message.success("编辑成功!");
        this.editParamDialog = false;
        this.getParams();
      });
    },

    // 删除参数
    async deleteParam(attr_id) {
      const isConfrim = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (isConfrim === "cancel") {
        return this.$message.warning("已取消删除!");
      }

      // 确定删除
      const res = await reqDeleteParamById(this.cateId, attr_id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败！");
      }

      this.$message.success("删除成功!");
      this.getParams();
    },

    // 文本失去焦点或者enter触发
    handleInputConfirm(row) {
      if (row.inputValue.length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      this.saveAttrVal(row);

      row.inputVisible = false;
      row.inputValue = "";
    },

    // 将对应的attr_vals保存到数据库
    async saveAttrVal(row) {
      // 持久化
      const res = await reqPutParam(
        this.cateId,
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals.join(" ")
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新失败!");
      }
      this.$message.success("更新成功!");
    },

    // 点击显示文本输入框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 关闭tag标签删除参数属性值
    closeTagParam(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVal(row);
    }
  }
};
</script>
<style lang='less' scoped>
.select_row {
  margin: 15px 0;
}
.el-tag {
  margin-right: 15px;
  margin-bottom: 15px;
}

.input-new-tag {
  width: 90px;
}
</style>