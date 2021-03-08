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
                <el-menu-item index="/teacher/index">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">主页</span>
                </el-menu-item>
                <el-menu-item index="/teacher/publish_pro">
                    <i class="el-icon-document-add"></i>
                    <span slot="title">发布项目</span>
                </el-menu-item>
                <el-menu-item index="/teacher/pro_approval">
                    <i class="el-icon-s-help"></i>
                    <span slot="title">成果查看</span>
                </el-menu-item>
                <el-menu-item index="/teacher/equip_approval" v-if="approval">
                    <i class="el-icon-s-platform"></i>
                    <span slot="title">设备管理</span>
                </el-menu-item>
                <el-menu-item index="/teacher/lab_approval" v-if="approval">
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
import axios from 'axios';
axios.defaults.withCredentials = true;  
import top from '../../components/top.vue'
export default {
    components:{
        top
    },
    data () {
        return {
            approval:false,
            name:'',
            account:''
        }
    },
    methods:{
        getApproval(){
            var that= this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/lab_admin_query',
                data:{
                    name:this.name,
                    account:this.account
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.approval=data.info;
                }else{
                    that.$message.error(data.message);
                }
            })
            .catch(function (error) {
                that.$message.error('连接失败，请检查网络');
            });
        }
    },
    mounted:function(){
        this.name=this.getCookie('username');
        this.account=this.getCookie('account');
        this.getApproval()
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