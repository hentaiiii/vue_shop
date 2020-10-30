<!-- user -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 输入框 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addUserDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="users" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="closeAddUserForm"
    >
      <el-form
        :model="addUserRuleForm"
        :rules="addUserRules"
        ref="addUserRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditDialog"
    >
      <el-form
        :model="editRuleForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editRuleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialog" width="50%" @close="closeSetRoleDialog">
      <div>
        <p>
          当前用户：<span>{{ userInfo.username }}</span>
        </p>
        <p>
          当前角色：<span>{{ userInfo.role_name }}</span>
        </p>
        <div>
          <el-select v-model="roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id "
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRole"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqUserList,
  changeUserState,
  reqAddUser,
  reqUserById,
  putUserById,
  deleteUserById,
  reqRoles,
  reqSetRole
} from "../../api/index";
export default {
  data() {
    // 验证邮箱规则
    const emailCheck = (rule, val, cb) => {
      const regEail = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-])+(\.[A-Za-z0-9_-])+/;
      if (regEail.test(val)) {
        // 校验通过
        return cb();
      }
      cb(new Error("请输入正确的邮箱"));
    };
    // 验证手机号规则
    const mobileCheck = (rule, val, cb) => {
      const regMobile = /^(0|86|17951)?1[0-9]{10}$/;
      if (regMobile.test(val)) {
        // 校验手机号通过
        return cb();
      }
      cb(new Error("请输入正确的手机号！"));
    };

    return {
      // 用户列表的查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: window.sessionStorage.getItem("pagesize")
          ? window.sessionStorage.getItem("pagesize") * 1
          : 2
      },
      users: [], // 用户列表
      total: 0, // 用户总数
      addUserDialogVisible: false, // 显示隐藏添加用户对话框
      addUserRuleForm: {
        // 添加用户的表单对象
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
        // 添加用户表单的验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 11, message: "长度在 3 到 11 个数字", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: emailCheck, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: mobileCheck, trigger: "blur" }
        ]
      },
      editDialogVisible: false, // 控制编辑对话框的显示和隐藏
      editRuleForm: {}, // 被编辑的用户信息
      editRules: {
        // 编辑用户表单验证规则
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: mobileCheck, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: emailCheck, trigger: "blur" }
        ]
      },
      setRoleDialog: false, // 控制分配角色对话框的显示和隐藏
      userInfo: {}, // 当前用户信息对象
      roleList: [], // 角色列表
      roleId: '', // 当前选中的id值
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    // 获取用户数据列表
    async getUsers() {
      const res = await reqUserList(this.queryInfo);
      if (res.meta.status !== 200) {
        this.$message.error("获取数据失败！");
        return;
      }
      this.users = res.data.users;
      this.total = res.data.total;
    },

    // 分页页数改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      // 本地储存每页个数
      window.sessionStorage.setItem("pagesize", newSize);
      this.getUsers();
    },

    // 当前页数改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUsers();
    },

    // 监听用户状态改变
    async changeUserState(user) {
      const res = await changeUserState(user.id, user.mg_state);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      // 修改成功
      this.$message.success(res.meta.msg);
    },

    // 监听添加用户对话框关闭
    closeAddUserForm() {
      this.$refs.addUserRuleForm.resetFields();
    },

    // 添加用户
    addUser() {
      // 先进行表单的预校验
      this.$refs.addUserRuleForm.validate(async valid => {
        if (!valid) {
          return this.$message.error("请重新输入");
        }
        // 登陆
        const res = await reqAddUser(this.addUserRuleForm);
        if (res.meta.status === 400) {
          // 用户名存在
          return this.$message.error(res.meta.msg);
        }
        if (res.meta.status !== 201) {
          // 创建成功
          return this.$message.error(res.meta.msg);
        }

        this.$message.success(res.meta.msg);
        // 重新获取用户列表
        this.addUserDialogVisible = false;
        this.getUsers();
      });
    },

    // 显示编辑用户对话框
    async showEditDialog(id) {
      this.editDialogVisible = true;
      // 根据用户id查询用户信息
      const res = await reqUserById(id);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      // 保存被编辑用户数据
      this.editRuleForm = res.data;
    },

    // 监听编辑用户对话框事件
    closeEditDialog() {
      this.$refs.editRuleForm.resetFields();
    },

    // 编辑用户提交
    editUser() {
      this.$refs.editRuleForm.validate(async valid => {
        if (!valid) {
          return this.$message.error("请输入正确的格式！");
        }
        // 提交编辑表单
        const res = await putUserById(this.editRuleForm);
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新页面
        this.getUsers();
        this.$message.success(res.meta.msg);
      });
    },

    // 删除用户
    deleteUser(id) {
      this.$confirm("是否删除此用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 删除用户
          const res = await deleteUserById(id);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          // 提示删除成功
          // 刷新页面
          this.$message.success(res.meta.msg);
          this.getUsers();
        })
        .catch(() => {
          console.log("aaaaa");
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 分配角色按钮
    async showSetRoleDialog(userInfo) {
      this.userInfo = userInfo;
      // 获取角色列表
      const res = await reqRoles();
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.roleList = res.data

      this.setRoleDialog = true

    },

    // 给用户分配角色
    async setRole() {
      const res = await reqSetRole(this.userInfo.id, this.roleId)
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }

      this.$message.success(res.meta.msg)
      this.getUsers()
      this.setRoleDialog = false
    },

    // 分配用户角色对话框关闭事件
    closeSetRoleDialog() {
      this.roleId = ''
      this.userInfo = {}
    }
  }
};
</script>
<style lang='less' scoped>
</style>