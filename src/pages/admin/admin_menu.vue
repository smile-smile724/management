<template>
  <div id="box">
    <top></top>
    <div id="left_menu">
        <el-col :span="24">
            <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            style="text-align:left；font-size:14px"
            router>
                <el-menu-item index="/admin/index">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">主页</span>
                </el-menu-item>
                <el-menu-item index="/admin/publish_pro">
                    <i class="el-icon-document-add"></i>
                    <span slot="title">发布项目</span>
                </el-menu-item>
                <el-submenu index="/admin/pro_management">
                    <template slot="title">
                        <i class="el-icon-edit-outline"></i>
                        <span>项目管理</span>
                    </template>
                    <el-menu-item index="/admin/pro_management">项目审批</el-menu-item>
                    <el-menu-item index="/admin/pro_approvalFile">申请文件导出</el-menu-item>
                </el-submenu>
                <el-submenu index="/admin/user_management">
                    <template slot="title">
                        <i class="el-icon-user"></i>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/admin/user_management">账号管理</el-menu-item>
                    <el-menu-item index="/admin/user_list">用户查看</el-menu-item>
                </el-submenu>
                <el-menu-item index="/admin/Announcement">
                    <i class="el-icon-data-board"></i>
                    <span slot="title">公告管理</span>
                </el-menu-item>
                <el-submenu index="/admin/achieve_export">
                    <template slot="title">
                        <i class="el-icon-upload"></i>
                        <span>成果管理</span>
                    </template>
                    <el-menu-item index="/admin/achieve_approval">成果审批</el-menu-item>
                    <el-menu-item index="/admin/achieve_export">成果导出</el-menu-item>
                </el-submenu>
                <el-submenu index="/admin/conclusion_export">
                    <template slot="title">
                        <i class="el-icon-document-checked"></i>
                        <span>结题报告管理</span>
                    </template>
                    <el-menu-item index="/admin/conclusion_approval">结题报告审批</el-menu-item>
                    <el-menu-item index="/admin/conclusion_export">结题报告导出</el-menu-item>
                </el-submenu>
                <el-submenu index="/admin/award_management">
                    <template slot="title">
                        <i class="el-icon-document-copy"></i>
                        <span>奖项管理</span>
                    </template>
                    <el-menu-item index="/admin/award_management">奖项审批</el-menu-item>
                    <el-menu-item index="/admin/award_export">奖项导出</el-menu-item>
                </el-submenu>
                <el-menu-item index="/admin/equipment">
                    <i class="el-icon-s-platform"></i>
                    <span slot="title">设备管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/lab_approval">
                    <i class="el-icon-office-building"></i>
                    <span slot="title">实验室管理</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </div>
    <router-view/>
    <div style='height:50px'></div>
  </div>
</template>

<script>
import top from '../../components/top.vue'
export default {
    components:{
        top
    },
    data () {
        return {

        }
    },
    methods:{
    },
    mounted:function(){
    }
}
</script>

<style scoped>
#box{
    width: 100%;
    min-height:1150px;
    position: relative;
    background-color: rgba(231, 240, 254, 1);
}
#left_menu{
    width: 200px;
    background-color: rgba(255, 255, 255, 1);
    float: left;
    margin:24px 0 0 51px;
}
#left_menu /deep/ .el-menu-item,#left_menu /deep/ .el-submenu__title{
    text-align: left;
}
#left_menu /deep/ .el-menu-item.is-active{
    border-right:3px solid rgba(108, 138, 216, 1);
    background-color: rgb(235, 239, 250);
}
</style>