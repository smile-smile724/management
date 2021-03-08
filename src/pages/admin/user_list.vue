<!--  -->
<template>
    <div class="mainbox">
        <div id="material">
                <div id="search_material">
                    <span>切换：</span>
                    <el-select v-model="show_index" placeholder="请选择">
                        <el-option label="教师" value="教师"></el-option>
                        <el-option label="学生" value="学生"></el-option>
                    </el-select>
                    <span style="display:inline-block;margin-left:40px;">关键词：</span>
                    <el-input v-model="input" placeholder="请输入内容" style="display:inline-block;width:300px;"></el-input>
                    <div id="sure_btn" @click="Search">确定</div>
                    <div id="exit_btn" @click="Exit">取消</div>
                </div>
                <!-- 学生 -->
                <el-table
                :data="StudentList.filter(data => !search
                || data.name.toLowerCase().includes(search.toLowerCase())
                || data.account.toLowerCase().includes(search.toLowerCase())
                || data.classAndGrade.toLowerCase().includes(search.toLowerCase()))
                .slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%;margin-top:39px"
                v-show="show_index=='学生'">
                    <el-table-column
                    prop="name"
                    label="姓名">
                    </el-table-column>
                    <el-table-column
                    prop="account"
                    label="学号">
                    </el-table-column>
                    <el-table-column
                    prop="college"
                    label="学院">
                    </el-table-column>
                    <el-table-column
                    prop="classAndGrade"
                    label="班级">
                    </el-table-column>
                    <el-table-column
                    prop="telephone"
                    label="手机号">
                    </el-table-column>
                    <el-table-column
                    prop="mail"
                    label="邮箱">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="ResetPassword(scope.$index, scope.row)">密码重置</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="StudentList.filter(data => !search
                || data.name.toLowerCase().includes(search.toLowerCase())
                || data.account.toLowerCase().includes(search.toLowerCase())
                || data.classAndGrade.toLowerCase().includes(search.toLowerCase())).length"
                style="text-align:right;margin:20px 0;"
                v-show="show_index=='学生'">
                </el-pagination>

                <!-- 教师 -->
                <el-table
                :data="TeacherList.filter(data => !search
                || data.name.toLowerCase().includes(search.toLowerCase())
                || data.account.toLowerCase().includes(search.toLowerCase()))
                .slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%;margin-top:39px"
                v-show="show_index=='教师'">
                    <el-table-column
                    prop="name"
                    label="姓名">
                    </el-table-column>
                    <el-table-column
                    prop="account"
                    label="工号">
                    </el-table-column>
                    <el-table-column
                    prop="college"
                    label="学院">
                    </el-table-column>
                    <el-table-column
                    prop="officeHolder"
                    label="职称">
                    </el-table-column>
                    <el-table-column
                    prop="telephone"
                    label="手机号">
                    </el-table-column>
                    <el-table-column
                    prop="mail"
                    label="邮箱">
                    </el-table-column>
                    <el-table-column label="设备和实验室权限">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="approval(scope.$index, scope.row)"
                            :disabled="scope.row.labAdmin==true">{{scope.row.labAdmin==true?'已授权':'点击授权'}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="ResetPassword(scope.$index, scope.row)">密码重置</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="TeacherList.filter(data => !search
                || data.name.toLowerCase().includes(search.toLowerCase())
                || data.account.toLowerCase().includes(search.toLowerCase())).length"
                style="text-align:right;margin:20px 0;"
                v-show="show_index=='教师'">
                </el-pagination>
            </div>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;  
export default {
    data() {
        return {  
            search:'',
            input:'',
            StudentList: [],
            TeacherList: [],
            pagesize:10,
            currentPage: 1,
            show_index:'教师'
        }
    },
    methods:{
        getTeacher(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/user_teacher_list'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.TeacherList=data.info;
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
        getStudent(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/user_student_list'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.StudentList=data.info;
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
        currentChange(currentPage){
            this.currentPage = currentPage;
        },
        Search(){
            this.search=this.input;
            this.currentPage=1;
        },
        Exit(){
            this.input='';
            this.Search();
        },
        approval(index,row){
            this.$confirm('是否授予审批实验室和设备权限?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                this.add_approval(row);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '授予审批实验室和设备权限'
                });          
            });
        },
        add_approval(teacher){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/lab_admin',
                data:{
                    account:teacher.account,
                    name:teacher.name
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.$message({
                        type: 'success',
                        message: teacher.name+'：权限添加成功'
                    });
                    this.getTeacher();
                }else{
                    this.$message.error(teacher.name+'：'+data.messgae);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        ResetPassword(index,row){
            var that=this;
            var flag=false;
            if(this.show_index=='教师'){
                flag=true;
            }
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/reset_password',
                data:{
                    type:flag,
                    id:row.id
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.$message({
                        type: 'success',
                        message: row.name+'：密码重置成功'
                    });
                }else{
                    this.$message.error(row.name+'：'+data.messgae);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },
    mounted() {
        this.getTeacher();
    },
    watch:{
        'show_index':function (val) {
            var that=this;
            this.$nextTick(function () {
                if(that.show_index=='学生'){
                    that.getStudent();
                }else if(that.show_index=='教师'){
                    that.getTeacher();
                }
                that.search='';
                this.currentPage=1;
            });
        }
    }
}
</script>

<style scoped>
.mainbox{
    min-width:1200px;
    margin:24px 200px 0 300px;
    padding:34px 80px;
    min-height:740px;
    position: relative;
    text-align: left;
    background-color: rgba(255, 255, 255, 1);
}
#material{
    width:100%;
    margin:30px 0;
}
#sure_btn{
    width: 67px;
	height: 40px;
	color: rgba(255, 255, 255, 1);
	background-color: rgba(108, 138, 216, 1);
	border-radius: 4px;
	font-size: 14px;
	line-height: 40px;
    display:inline-block;
	text-align: center;
    margin-left:20px;
    cursor: pointer;
}
#exit_btn{
    width: 67px;
	height: 40px;
	color: rgba(80, 80, 80, 1);
	background-color: rgba(255, 255, 255, 1);
	border-radius: 4px;
	font-size: 13px;
	line-height: 40px;
    display:inline-block;
	border: rgba(229, 229, 229, 1) solid 1px;
	text-align: center;
    margin-left:10px;
    cursor: pointer;
}
#tip{
    width: 100%;
	height: 37px;
	color: rgba(108, 138, 216, 1);
	background-color: rgba(230, 247, 255, 1);
	box-shadow: rgba(186, 231, 255, 1) solid 1px;
	border-radius: 4px;
	font-size: 18px;
	line-height: 37px;
	text-align: left;
    margin:18px 0;
}
#tip span{
	font-size: 13px;
}
#download{
    width: 74px;
	height: 29px;
	color: rgba(255, 255, 255, 1);
	background-color: rgba(108, 138, 216, 1);
	border-radius: 4px;
	font-size: 13px;
	line-height: 29px;
	text-align: center;
    margin-top:10px;
}
</style>