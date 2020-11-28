<!--  -->
<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出登陆</el-button>
    </el-header>
    <!-- 主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isColse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <el-row>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened="true"
            :collapse="isColse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuList"
              :key="item.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + child.path"
                v-for="child in item.children"
                :key="child.id"
                @click="activeItem('/' + child.path)"
              >
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-row>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { reqMenu } from "../../api/index";
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isColse: false, // 是否折叠
      activePath: "" // 被激活的链接地址
    };
  },
  created() {
    // 获取侧边栏
    this.getMenuList()
    // 获取激活的子菜单index
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    //   退出登陆
    logOut() {
      this.$confirm("是否退出登陆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 清除token
          window.sessionStorage.clear();
          this.$router.replace("/login");
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
    },

    // 获取菜单列表
    async getMenuList() {
      const res = await reqMenu();
      if (res.meta.status !== 200) {
        this.$message.error("获取数据失败，请重试");
        return;
      }
      this.menuList = res.data;
    },

    // 切换侧边栏显示装填
    toggleMenu() {
      this.isColse = !this.isColse;
    },

    // 激活子菜单
    activeItem(activePath) {
      // 持久化
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
};
</script>
<style lang='less' scoped>
.el-container {
  height: 100%;
  .el-menu {
    border-right: none;
  }
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  > div {
    font-size: 20px;
    display: flex;
    align-items: center;
    color: #fff;
    > span {
      padding-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedfe;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  color: #fff;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  background-color: #4a5064 !important;
  cursor: pointer;
}
</style>