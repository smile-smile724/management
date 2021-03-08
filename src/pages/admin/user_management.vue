<!--  -->
<template>
    <div class="mainbox">
        <div id="user">
                <div id="search_user">
                    <span style="display:inline-block;">输入关键词：</span>
                    <el-input v-model="input" placeholder="请输入内容   " style="display:inline-block;width:250px;"></el-input>
                    <div id="sure_btn" @click="Search">搜索</div>
                    <div id="exit_btn" @click="Exit">取消</div>
                </div>
                <div id="edit">
                    <span style='background-color:rgba(108, 138, 216, 1)' @click='dialogVisible=true'>
                        <i class='el-icon-plus'></i>添加
                    </span>
                    <span style='background-color:rgba(29, 160, 82, 1)' @click="Add_user">
                        <i class='el-icon-check'></i>同意
                    </span>
                    <span style='background-color:rgba(234, 50, 35, 1)' @click="Delete_user">
                        <i class='el-icon-delete'></i>拒绝
                    </span>
                </div>
                <div id="tip">
                    <i class="el-icon-warning" style="margin-left:11px;"></i>
                    <span style="margin-left:6px;color:rgba(0, 0, 0, 0.65);">已选择{{user_choosen.length}}项</span>
                    <span style="margin-left:22px;color:rgba(108, 138, 216, 1);cursor: pointer;"  @click='clear'>清空</span>
                </div>
                <el-table
                ref="multipleTable"
                :data="data"
                tooltip-effect="dark"
                style="width: 100%;"
                @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection">
                    </el-table-column>
                    <el-table-column
                    prop="account"
                    label="工号"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="姓名">
                    </el-table-column>
                    <!-- <el-table-column
                    prop="college"
                    label="所属学院">
                    </el-table-column> -->
                    <el-table-column
                    prop="officeHolder"
                    label="职称">
                    </el-table-column>
                    <el-table-column
                    prop="telephone"
                    label="电话"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="mail"
                    label="邮箱"
                    width="240">
                    </el-table-column>
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="tableData.filter(data => {
                    return Object.keys(data).some(key => {
                        return String(data[key]).toLowerCase().indexOf(search) > -1
                    })
                }).length"
                style="text-align:right;margin:20px 0;">
                </el-pagination>
            </div>

                <!-- 注册弹框 -->
        <el-dialog
        title="添加"
        :visible.sync="dialogVisible"
        :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules"
            style="text-align:left;width:70%;margin:20px 15% 0 15%;">
                <el-form-item label="用户身份：" prop="identity">
                    <el-select v-model="form.identity" placeholder="请选择">
                        <el-option label="教师" value="teacher"></el-option>
                        <el-option label="学生" value="student"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工号：" v-if="form.identity=='teacher'" prop="tno">
                    <el-input v-model="form.tno"></el-input>
                </el-form-item>
                <el-form-item label="学号：" prop="sno" v-if="form.identity=='student'">
                    <el-input v-model="form.sno"></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="sname">
                    <el-input v-model="form.sname"></el-input>
                </el-form-item>
                <el-form-item label="学院：" prop="college">
                    <el-input v-model="form.college"></el-input>
                </el-form-item>
                <el-form-item :label="form.identity=='student'?'班级：':'职称：'" prop="class"
                v-if="form.identity!=''">
                    <el-input v-model="form.class"></el-input>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="form.snum"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input v-model="form.mail"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">注册</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;  
export default {
    data() {
        return {  
            user_choosen: [], 
            user_choose: [], 
            search:'',
            input:'',
            sort:'student',
            data:[],
            tableData: [],
            pagesize:10,
            currentPage: 1,
            SearchFlag:false,
            dialogVisible: false,
            form:{
                identity:'',
                sno:'',
                sname:'',
                college:'',
                class:'',
                snum:'',
                mail:'',
                tno:''
            },
            rules:{
                identity:[
                    { required: true, message: '请输入您的身份', trigger: 'blur' }
                ],
                class:[
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                college:[
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                sno:[
                    { required: true, message: '请输入', trigger: 'blur' },
                    { pattern: /^\d{9}$/, message: '学号不正确', trigger: 'blur' }
                ],
                sname:[
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                tno:[
                    { required: true, message: '请输入', trigger: 'blur' }
                ]
            },
            regulation:{
                mail:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                tel:/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
            }
        }
    },
    methods:{
        getInfo(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/teacher_approval_list'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.tableData=data.info;
                    this.data=this.tableData.filter(data => {
                        return Object.keys(data).some(key => {
                            return String(data[key]).toLowerCase().indexOf(this.search) > -1
                        })
                    }).slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);
                }else{
                    this.$message.error(data.messgae);
                }
            })
            .catch(function (error) {
                that.$message.error('连接失败，请检查网络');
            });
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.user_choose = val;
        },
        currentChange(currentPage){
            this.currentPage = currentPage;
            this.data=this.tableData.filter(data => {
                return Object.keys(data).some(key => {
                    return String(data[key]).toLowerCase().indexOf(this.search) > -1
                })
            }).slice((currentPage-1)*this.pagesize,currentPage*this.pagesize);
        },
        clear(){
            this.toggleSelection();
            this.user_choosen=[]
        },
        Search(){
            this.search=this.input;
            this.currentPage=1;
            this.data=this.tableData.filter(data => {
                return Object.keys(data).some(key => {
                    return String(data[key]).toLowerCase().indexOf(this.search) > -1
                })
            }).slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);
            this.SearchFlag=true;
        },
        Exit(){
            this.input='';
            this.Search();
        },
        Add_user(){
            this.$confirm('确定同意申请?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var flag=true;
                for(var i=0;i<this.user_choosen.length;i++){
                    if(!this.edit_teacher(this.user_choosen[i].account,'true')){
                        this.$message.error(this.user_choosen[i].name+'：操作失败');
                        flag=false;
                    }
                }
                if(flag){
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },
        Delete_user(){
            this.$confirm('确定拒绝申请?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var flag=true;
                for(var i=0;i<this.user_choosen.length;i++){
                    if(!this.edit_teacher(this.user_choosen[i].account,'false')){
                        this.$message.error(this.user_choosen[i].name+'：操作失败');
                        flag=false;
                    }
                }
                if(flag){
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },
        StudentRegister(){
            var that= this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/student_register',
                data:{
                    account:that.form.sno,
                    name:that.form.sname,
                    password:that.form.sno,
                    college:that.form.college,
                    classAndGrade:that.form.class,
                    telephone:that.form.snum,
                    mail:that.form.mail
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    that.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                }else{
                    that.$message.error(data.message);
                }
            })
            .catch(function (error) {
                that.$message.error('连接失败，请检查网络');
            });
        },
        TeacherRegister(){
            var that= this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/add_teacher',
                data:{
                    account:that.form.tno,
                    name:that.form.sname,
                    password:that.form.tno,
                    college:that.form.college,
                    officeHolder:that.form.class,
                    telephone:that.form.snum,
                    mail:that.form.mail
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    that.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                }else{
                    that.$message.error(data.message);
                }
            })
            .catch(function (error) {
                that.$message.error('连接失败，请检查网络');
            });
        },
        submitForm(formName) {
            var that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(that.regulation.mail.test(that.form.mail)||that.form.mail==''){
                        if(that.regulation.tel.test(that.form.snum)||that.form.snum==''){
                            if(that.form.identity=='teacher'){
                                that.TeacherRegister();
                            }else if(that.form.identity=='student'){
                                that.StudentRegister();
                            }
                        }else{
                            that.$message.error('手机格式错误');
                        }
                    }else{
                        that.$message.error('邮箱格式错误');
                    }
                } else {
                    that.$message.error('请输入完整的信息');
                    return false;
                }
            });
        },
        edit_teacher(num,approval){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/teacher_approval',
                data:{
                    account:num,
                    result:approval
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code!=12){
                    return false;
                }else{
                    this.getInfo();
                    this.clear();
                    return true;
                }
            })
            .catch(function (error) {
                return false;
            });
        }
    },
    mounted() {
        this.getInfo();
    },
    watch:{
        user_choose(newVal,oldVal){
            if(newVal.length>oldVal.length&&newVal!=0){
                for(var i=oldVal.length;i<newVal.length;i++){
                    if(this.user_choosen.indexOf(this.user_choose[i])==-1){
                        this.user_choosen.push(this.user_choose[i]);
                    }
                }
            }else if(newVal.length<oldVal.length&&newVal!=0){
                for(var i=0;i<oldVal.length;i++){
                    if(newVal.indexOf(oldVal[i])==-1){
                        this.user_choosen.splice(this.user_choosen.indexOf(oldVal[i]), 1);
                    }
                }
            }else if(newVal==0){
                if(this.data.indexOf(oldVal[0])!=-1&&!this.SearchFlag){
                    this.user_choosen.splice(this.user_choosen.indexOf(oldVal[0]), oldVal.length-newVal.length)
                } else if(this.SearchFlag){
                    this.SearchFlag=!this.SearchFlag;
                }
            }
        },
        'data':function (val) {
            this.$nextTick(function () {
                for(var i=0;i<this.user_choosen.length;i++){
                    if(this.data.indexOf(this.user_choosen[i])!=-1){
                        this.user_choose.push(this.user_choosen[i]);　
                        this.$refs.multipleTable.toggleRowSelection(this.$refs.multipleTable.data[this.data.indexOf(this.user_choosen[i])],true);
                    }
                }
            });
        },
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
#user{
    width:100%;
    margin:30px 0;
}
#edit{
    width:100%;
    height:40px;
    margin:15px 0 0 0;
}
#edit span{
    width: 74px;
	height: 29px;
	border-radius: 4px;
	font-size: 13px;
	line-height: 29px;
    display: inline-block;
	text-align: center;
    margin-right:10px;
    cursor: pointer;
    color:rgba(255, 255, 255, 1);
}
#edit i{
    margin-right:4px
}
.mainbox /deep/ .el-table td,.mainbox /deep/ .el-table th{
    text-align: center;
}
.mainbox /deep/ .el-dialog{
    width:50%;
    min-width:600px;
    position: relative;
}
.mainbox /deep/ .el-dialog__header{
    box-shadow: 0px 5px 5px 0px rgba(229, 229, 229, 1);
}
.mainbox /deep/ .el-dialog__title{
    color: rgba(108, 138, 216, 1);
	font-size: 22px;
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
#text{
    width:60px;
	height: 30px;
    margin:0 auto;
}
#text i{
    width:6px;
    height:6px;
    float: left;
    border-radius:10px;
    background-color:rgba(108, 138, 216, 1);
    margin:12px 12px 12px 0;
}
#text span{
    float: left;
	height: 30px;
	line-height: 30px;
	text-align: left;
}
</style>