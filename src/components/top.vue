<template>
    <div class="top">
        <h1>开放性创新实验项目管理平台</h1>
        <!-- <i class="el-icon-arrow-down" style="float:right;padding:20px 40px 20px 20px;"></i> -->
        <el-dropdown>
            <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="$route.path.indexOf('admin')==-1"><span @click="GoInfo">个人信息</span></el-dropdown-item>
                <el-dropdown-item v-if="$route.path.indexOf('admin')!=-1"><span @click="open">修改密码</span></el-dropdown-item>
                <el-dropdown-item><span @click="OutLogin">退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <img :src="head">
        <span id="name">{{name}}</span>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;  
export default {
    data () {
        return {
            head:require('../assets/head_Portrait.svg'),
            name:'宓拉拉'
        }
    },
    methods:{
        OutLogin(){
            this.delCookie('username');
            this.$router.push({
                path:'/'
            });
        },
        GoInfo(){
            if(this.$route.path.indexOf('teacher')!=-1){
                this.$router.push({path:'/teacher/personalInfo'})
            }else if(this.$route.path.indexOf('student')!=-1){
                this.$router.push({path:'/student/personalInfo'})
            }else if(this.$route.path.indexOf('admin')!=-1){
                this.$router.push({path:'/admin/personalInfo'})
            }
        },
        open() {
            this.$prompt('请输入要修改的密码', '密码修改', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                var that= this;
                axios({
                    method: 'post',
                    url: this.$host+'/manage_platform/update_password',
                    data:{
                        password:value
                    }
                })
                .then(response => {
                    var data=response.data;
                    if(data.code==12){
                        that.$message({
                            type: 'success',
                            message: '密码修改成功！'
                        });
                    }else{
                        that.$message.error(data.message);
                    }
                })
                .catch(function (error) {
                    that.$message.error('连接失败，请检查网络');
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消修改'
                });       
            });
        }
    },
    mounted(){
        this.name=this.getCookie('username');
    }
}
</script>

<style scoped>
.top{
    width: 100%;
	height: 60px;
	color: rgba(80, 80, 80, 1);
	background-color: rgba(255, 255, 255, 1);
	text-align: left;
    font-size: 20px;
}    
.top h1{
	height: 36px;
    padding: 12px 51px;
    margin:0;
	color: rgba(80, 80, 80, 1);
	font-size: 24px;
	line-height: 36px;
	text-align: left;
	font-weight: bold;
    display: inline-block;
}
.el-dropdown{
    width:88px;
    height:20px;
    float:right;
    text-align: center;
    margin:20px 20px 20px 0;
}
.el-dropdown-link {
    cursor: pointer;
    padding-right:10px;
}
.el-icon-arrow-down {
    font-size: 20px;
}
.top img{
    width: 35px;
	height: 35px;
    border-radius: 35px;
    float: right;
    margin:12.5px 10px;
}
#name{
    height:30px;
    font-size: 16px;
    margin:15px 10px;
    color: rgba(56, 56, 56, 1);
	font-size: 14px;
	line-height: 30px;
	font-weight: bold;
    float:right;
}
</style>