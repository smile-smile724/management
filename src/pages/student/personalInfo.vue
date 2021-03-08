<!--  -->
<template>
    <div class="mainbox">
        <div id="box">
            <el-form ref="user" :model="user" label-width="80px">
                <el-form-item label="姓名：">
                    <span>{{user.name}}</span>
                </el-form-item>
                <el-form-item label="密码：">
                    <el-input v-model="user.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="学院：">
                    <span>{{user.college}}</span>
                </el-form-item>
                <el-form-item label="班级：">
                    <span>{{user.classAndGrade}}</span>
                </el-form-item>
                <el-form-item label="电话：">
                    <el-input v-model="user.telephone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input v-model="user.mail"></el-input>
                </el-form-item>
                <el-form-item>
                    <div id="submit" @click="EditInfo">保存</div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;  
export default {
    data() {
        return {  
            user:{}
        }
    },
    methods:{
        getInfo(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/student'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.user=data.info;
                }else if(data.code==10){
                    this.$message.error(data.message);
                    this.$router.push({path:'/'})
                }else{
                    this.$message.error(data.message);
                }
            })
            .catch(function (error) {
                that.$message.error('连接失败，请检查网络');
            });
        },
        EditInfo(){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/student_message',
                data:{
                    password:this.user.password,
                    telephone:this.user.telephone,
                    mail:this.user.mail
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.getInfo();
                }else{
                    this.$message.error(data.message);
                }
            })
            .catch(function (error) {
                that.$message.error('连接失败，请检查网络');
            });
        }
    },
    mounted() {
        this.getInfo();
    }
}
</script>

<style scoped>
.mainbox{
    min-width:1250px;
    margin:24px 200px 0 300px;
    padding:34px 50px 34px 50px;
    min-height:740px;
    position: relative;
    text-align: left;
    background-color: rgba(255, 255, 255, 1);
}
#box{
    padding-top:100px;
    width:800px;
    height:500px;
    margin:0 auto;
}
.mainbox /deep/ .el-form{
    width:450px;
    text-align: left;
    margin-left:100px;
}
.mainbox /deep/ .el-form span{
    margin-left:15px;
}
.mainbox /deep/ .el-form-item{
    height:40px;
}
#submit{
    width: 60px;
	height: 30px;
	border-radius: 10px;
    color: rgba(108, 138, 216, 1);
	font-size: 12px;
	line-height: 30px;
    margin-top:40px;
	border: rgba(108, 138, 216, 1) solid 1px;
	text-align: center;
    cursor: pointer;
    margin-left:150px;
}
#submit:hover{
    background-color: rgba(108, 138, 216, 1);
	border: rgba(108, 138, 216, 1) solid 1px;
    color:white;
}
</style>