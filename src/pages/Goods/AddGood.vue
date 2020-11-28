<!-- 添加商品 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="activeIndex - 0"
        finish-status="success"
        align-center
        :space="200"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab标签页 -->
      <el-form
        :model="addGoodForm"
        :rules="addGoodRules"
        ref="addGoodForm"
        label-position="top"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="changeTabs"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in manyTableData"
              :key="index"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyTableData"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- on-preview 预览图片触发事件 -->
            <!-- on-remove 移除图片触发事件 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodForm.goods_introduce"></quill-editor>
            <!-- 添加按钮 -->
            <el-button type="primary" style="margin-top: 10px" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 预览图片对话框 -->
      <el-dialog
        :title="previewName"
        :visible.sync="previewDialogVisible"
        width="50%"
      >
        <img :src="previewPath" class="preview_img">
        <span slot="footer" class="dialog-footer">
          <el-button @click="previewDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="previewDialogVisible = false"
            >确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { reqCategories, reqAttributes, reqAddGood } from "../../api/index";
import _ from 'lodash'
export default {
  data() {
    return {
      tabPosition: "left", // tab标签页方向
      activeIndex: "0",
      // 添加商品表单的数据对象
      addGoodForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: ''
      },
      addGoodRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      cateList: [], // 分类参数列表
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      manyTableData: [], // 动态参数数组
      onlyTableData: [], // 静态参数数组
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 上传图片的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("loginToken")
      },
      // 预览图片对话框的显示和隐藏
      previewDialogVisible: false,
      // 预览大图的url
      previewPath: '',
      previewName: ''
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      const res = await reqCategories({});
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败！");
      }
      this.cateList = res.data;
    },

    // 联级选择器改变触发
    handleChange() {
      // 只能选择三级分类 不能选择二级
      if (this.addGoodForm.goods_cat.length !== 3) {
        return (this.addGoodForm.goods_cat = []);
      }
    },

    // tab标签页改变
    changeTabs(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addGoodForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },

    // tab标签页的切换
    async tabClick() {
      if (this.activeIndex === "1") {
        // 获取动态参数数据
        const res = await reqAttributes(this.cardId, "many");
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数失败！");
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? "[]" : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        // 获取静态属性数据
        const res = await reqAttributes(this.cardId, "only");
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数失败!");
        }
        this.onlyTableData = res.data;
        console.log(res.data);
      }
    },

    // 预览图片触发函数
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewName = file.name
      this.previewDialogVisible = true
    },

    // 移除图片触发事件
    handleRemove(file) {
      if (file.response.meta.status !== 200) {
        return this.$message.error("删除失败!");
      }
      const tem_url = file.response.data.tmp_path;
      const i = this.addGoodForm.pics.findIndex(item => item === tem_url)
      this.addGoodForm.pics.splice(i, 1)
    },

    // 上传成功的时候的回调
    uploadSuccess(response) {
      // 上传成功后保存临时路径
      if (response.meta.status !== 200) {
        return this.$message.error("上传失败！")
      }
      const picsObj = { pic: response.data.tmp_path }
      this.addGoodForm.pics.push(picsObj)
    },

    // 添加商品
    addGood() {
      console.log(this.$refs.addGoodForm)
      this.$refs.addGoodForm.validate(async valid => {
        if(!valid){
          return this.$message.warning('请输入正确的表单!')
        }
        // 处理一下goods_cat 数据格式
        // 深拷贝数据
        const from = _.cloneDeep(this.addGoodForm)
        from.goods_cat = from.goods_cat.join(',')
        from.attr = []
        // 添加attr属性
        this.onlyTableData.forEach(item => {
          const tempObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          from.attr.push(tempObj)
        })
        this.manyTableData.forEach(item => {
          const tempObj = {
            attr_id:item.attr_id,
            attr_value: item.attr_vals
          }
          from.attr.push(tempObj)
        })
        // 处理完数据 添加商品
        const res = await reqAddGood(from)
        if(res.meta.status !== 201){
          return this.$message.error('添加失败!')
        }
        // 添加成功
        this.$message.success('添加成功!')
        this.$router.push('/goods')

      })
    }
  },
  computed: {
    cardId() {
      if (this.addGoodForm.goods_cat.length !== 3) {
        return ""
      }
      return this.addGoodForm.goods_cat[this.addGoodForm.goods_cat.length - 1]
    }
  }
};
</script>
<style lang='less' scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preview_img{
  width: 100%;
}
</style>