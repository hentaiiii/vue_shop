<!-- roles -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddRoleDialog"
          >添加角色</el-button
        >

        <!-- 表格区域 -->
        <el-table :data="roleList" border stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- <pre>{{ scope.row.id }}</pre> -->
              <el-row
                v-for="(item1, i1) in scope.row.children"
                :key="i1"
                :class="['border-bottom', i1 === 0 ? 'border-top' : '']"
                class="item-center"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="closeRight(scope.row, item1.id)">{{
                    item1.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级和三级权限 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, i2) in item1.children"
                    :key="i2"
                    :class="i2 === 0 ? '' : 'border-top'"
                  >
                    <el-col :span="8">
                      <el-tag
                        closable
                        type="success"
                        @close="closeRight(scope.row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="16">
                      <el-tag
                        closable
                        type="warning"
                        v-for="(item3, i3) in item2.children"
                        :key="i3"
                        @close="closeRight(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作" width="290px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-search"
                @click="ShowEditRoleDialog(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-search"
                @click="deleteRole(scope.row.id)"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-search"
                @click="showSetRightsDialog(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="closeAddDialog"
    >
      <el-form
        :model="addRoleForm"
        :rules="AddRoleRules"
        ref="addRoleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="eidtRoleForm"
        :rules="AddRoleRules"
        ref="eidtRoleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="eidtRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="eidtRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialog" width="50%" @close="clsoeSetDialog">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        :default-expand-all="true"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        ref = "setRightsRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqRoles,
  reqAddRole,
  reqRole,
  putRole,
  reqDelteRole,
  deleteRights,
  reqRightsByTree,
  reqSetRights
} from "../../api/index";
export default {
  data() {
    return {
      roleList: [], // 角色列表
      addRoleDialogVisible: false, // 控制添加角色对话框的显示和隐藏
      addRoleForm: {
        // 添加角色对象
        roleName: "",
        roleDesc: ""
      },
      AddRoleRules: {
        // 添加角色验证规则
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      editDialogVisible: false, // 控制编辑角色对话框的显示和隐藏
      eidtRoleForm: {}, // 编辑角色对象
      setRightDialog: false, // 分配角色对话框
      rightsList: [], // 树状权限列表
      treeProps: {
        // 树状分配权限列表
        children: "children",
        label: "authName"
      },
      defKeys: [], // 默认勾选的数组
      roleId: '', // 当前角色id
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const res = await reqRoles();
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.roleList = res.data;
    },

    // 点击显示添加角色对话框
    showAddRoleDialog() {
      this.addRoleDialogVisible = true;
    },

    // 关闭添加角色对话框事件
    closeAddDialog() {
      this.$refs.addRoleForm.resetFields();
    },

    // 添加角色
    addRole() {
      // 添加角色表单的预校验
      this.$refs.addRoleForm.validate(async vaild => {
        if (!vaild) {
          return this.$message.error("请输入正确的格式！");
        }
        // 添加角色
        const res = await reqAddRole(this.addRoleForm);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        // 刷新页面 提示成功 关闭对话框
        this.addRoleDialogVisible = false;
        this.$message.success(res.meta.msg);
        this.getRoles();
      });
    },

    // 显示编辑角色对话框
    async ShowEditRoleDialog(id) {
      const res = await reqRole(id);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      // 保存数据
      this.eidtRoleForm = res.data;

      this.editDialogVisible = true;
    },

    // 编辑角色
    editRole() {
      // 校验表单
      this.$refs.eidtRoleForm.validate(async valid => {
        if (!valid) {
          return this.$message.eroor("请输入正确格式！");
        }
        // 提交编辑表单
        const res = await putRole(this.eidtRoleForm);
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("修改成功");
        this.editDialogVisible = false;
        this.getRoles();
      });
      this.editDialogVisible = false;
    },

    // 删除角色
    async deleteRole(roleId) {
      const confrimPromise = await this.$confirm("是否删除该角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confrimPromise === "cancel") {
        return this.$message.error("删除已经取消");
      }
      // 确定删除
      const res = await reqDelteRole(roleId);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success("删除成功");
      this.getRoles();
    },

    //  点击tag标签删除对应权限
    async closeRight(role, rightId) {
      const roleId = role.id;
      const isConfirmDel = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (isConfirmDel === "cancel") {
        return this.$message.info("已经取消删除！");
      }
      // 正式删除
      const res = await deleteRights(roleId, rightId);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      // 删除成功
      this.$message.success(res.meta.msg);
      // 重新为roleList的children赋值 达到刷新页面的效果
      role.children = res.data;
    },

    // 分配权限按钮
    async showSetRightsDialog(role) {
      this.roleId = role.id

      const res = await reqRightsByTree()
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      // 获取数据车成功
      this.rightsList = res.data;
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialog = true;
    },

    // 递归遍历获取被选中的第三季权限
    getLeafKeys(node, arr) {
      // 三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      });
    },

    // 监听分配角色对话框关闭
    clsoeSetDialog() {
      this.defKeys = []
    },

    // 确定角色分配权限
    async setRights() {
      const keys = [
        ...this.$refs.setRightsRef.getHalfCheckedKeys(),
        ...this.$refs.setRightsRef.getCheckedKeys()
      ]
      const keyStr = keys.join(',')
      const res = await reqSetRights(this.roleId, keyStr)
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      // 分配权限成功
      this.$message.success(res.meta.msg)
      this.setRightDialog = false
      this.getRoles()
    }
  }
};
</script>
<style lang='less' scoped>
.el-tag {
  margin: 7px;
  cursor: pointer;
}
.border-top {
  border-top: 1px solid #eee;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.item-center {
  display: flex;
  align-items: center;
}
</style>