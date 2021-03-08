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
                <el-menu-item index="/student/index">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">主页</span>
                </el-menu-item>
                <el-menu-item index="/student/pro_application">
                    <i class="el-icon-message"></i>
                    <span slot="title">项目申请</span>
                </el-menu-item>
                <el-submenu index="/student/lab_appointment">
                    <template slot="title">
                        <i class="el-icon-date"></i>
                        <span>预约提交</span>
                    </template>
                    <el-menu-item index="/student/lab_appointment">实验室预约</el-menu-item>
                    <el-menu-item index="/student/equip_appointment">设备预约</el-menu-item>
                </el-submenu>
                <el-menu-item index="/student/result_submit">
                    <i class="el-icon-collection-tag"></i>
                    <span slot="title">成果获奖结题提交</span>
                </el-menu-item>
                <el-menu-item index="/student/material">
                    <i class="el-icon-collection"></i>
                    <span slot="title">资料</span>
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
    min-height:100%;
    position: relative;
    background-color: rgba(231, 240, 254, 1);
}
#left_menu{
    width: 200px;
	height: 420px;
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