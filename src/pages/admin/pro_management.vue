<!--  -->
<template>
    <div class="mainbox">
            <div id="pro">
                <div id="search_pro">
                    <span style="display:inline-block;">输入关键词：</span>
                    <el-input v-model="input" placeholder="请输入内容   " style="display:inline-block;width:300px;"></el-input>
                    <div id="sure_btn" @click="Search">搜索</div>
                    <div id="exit_btn" @click="Exit">取消</div>
                </div>
                <div id="Approval">
                    <span :class="{'approval1-1':choose=='未审批','approval1-2':choose!='未审批'}"
                    @click="choose='未审批'">
                        <i class='el-icon-alarm-clock'></i>未审批
                    </span>
                    <span :class="{'approval2-1':choose=='已通过','approval2-2':choose!='已通过'}"
                    @click="choose='已通过'">
                        <i class='el-icon-check'></i>已通过
                    </span>
                    <span :class="{'approval3-1':choose=='已拒绝','approval3-2':choose!='已拒绝'}"
                    @click="choose='已拒绝'">
                        <i class='el-icon-delete'></i>已拒绝
                    </span>
                </div>

                <!-- 待审批 -->
                <el-table
                ref="multipleTable"
                :data="tableData.filter(data => !search
                || data.project.projectName.toLowerCase().includes(search.toLowerCase())
                || data.studentList[0].name.toLowerCase().includes(search.toLowerCase()))
                .slice((currentPage-1)*pagesize,currentPage*pagesize)"
                tooltip-effect="dark"
                style="width: 100%;"
                @row-click="openDetails">
                    <el-table-column
                    prop="project.projectName"
                    label="项目名称">
                    </el-table-column>
                    <el-table-column
                    prop="studentList[0].name"
                    label="项目负责人">
                    </el-table-column>
                    <el-table-column
                    prop="teacherList"
                    label="指导老师">
                        <template slot-scope="scope">
                            <span>{{scope.row.teacherList.lenght!=0?scope.row.teacherList[0].name:''}}{{scope.row.teacherList.length==2?'，'+scope.row.teacherList[1].name:''}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="tableData.filter(data => !search
                || data.project.projectName.toLowerCase().includes(search.toLowerCase())
                || data.studentList[0].name.toLowerCase().includes(search.toLowerCase()))
                .length"
                style="text-align:right;margin:20px 0;">
                </el-pagination>
            </div>

            <!-- 弹窗 -->
            <el-dialog title="项目审批" :visible.sync="dialogVisible">
                <div id="pro_Approval">
                    <div id="pro_table">
                        <el-form ref="form" :model="form" label-width="100px" id="form">
                            <el-form-item label="项目类型:">
                                <span>{{form.project.type}}</span>
                            </el-form-item>
                            <el-form-item label="命题选题:">
                                <span>{{form.project.gist}}</span>
                            </el-form-item>
                            <el-form-item label="命题:">
                                <span>{{form.project.typeName}}</span>
                            </el-form-item>
                            <el-form-item label="项目名称:">
                                <span>{{form.project.projectName}}</span>
                            </el-form-item>
                            <el-form-item label="小组成员:" style="height:270px;position:relative">
                                <ul id="table">
                                    <li>
                                        <span id="tit"></span>
                                        <span>姓名</span>
                                        <span>学号</span>
                                        <span>所属学院</span>
                                        <span>班级</span>
                                        <span style=" border-bottom: #DCDFE6 solid 1px;">联系方式</span>
                                    </li>
                                    <li v-for="(item, index) in form.studentList" :key="index">
                                        <span>学生 {{index+1}}</span>
                                        <span>{{item.name}}</span>
                                        <span>{{item.account}}</span>
                                        <span>{{item.classAndGrade}}</span>
                                        <span>{{item.college}}</span>
                                        <span style=" border-bottom: #DCDFE6 solid 1px;">{{item.telephone}}</span>
                                    </li>
                                </ul>
                            </el-form-item>
                            <el-form-item label="指导教师 1:" style="width:300px" v-if="form.teacherList.length!=0">
                                <span>{{form.teacherList[0].name}}（{{form.teacherList[0].account}}）</span>
                            </el-form-item>
                            <el-form-item label="指导教师 2:" style="width:300px" v-if="form.teacherList.length==2">
                                <span>{{form.teacherList[1].name}}（{{form.teacherList[1].account}}）</span>
                            </el-form-item>
                            <el-form-item label="项目简介:" style="height:130px">
                                <span id="desc">{{form.project.intro}}</span>
                            </el-form-item>
                            <el-form-item label="申请资金:">
                                <el-col :span="2">
                                    <span>{{form.project.fund}}</span>
                                </el-col>
                                <el-col class="line" :span="1">元</el-col>
                            </el-form-item>
                            <el-form-item label="附件:" v-if="form.fileUrl.length!=0">
                                <a v-for="(item,index) in form.fileUrl" :href="item" :download="changeAddress(item)" :key="index">
                                    <i class="el-icon-link"></i>{{changeAddress(item)}}</a>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div id="pro_box" v-show="choose=='未审批'">
                        <el-form ref="comment" :model="comment" label-width="100px" id="comment">
                            <el-form-item label="审批结果:">
                                <div>
                                    <span :class="{'agree':comment.approval=='同意','unchoose':comment.approval!='同意'}" @click="comment.approval='同意'">
                                        <i class='el-icon-check'></i>同意
                                    </span>
                                    <span :class="{'unagree':comment.approval=='拒绝','unchoose':comment.approval!='拒绝'}" @click="comment.approval='拒绝'">
                                        <i class='el-icon-close'></i>拒绝
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="审批原因:">
                                <el-input v-model="comment.desc" placeholder="请输入" style="width:400px"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <div id="exit" @click="dialogVisible=false">取消</div>
                                <div id="submit" @click="onSubmit">提交</div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div id="pro_box" v-show="choose!='未审批'">
                        <el-form ref="comment" :model="form" label-width="100px">
                            <el-form-item label="审批结果:">
                                <span>{{form.project.state}}</span>
                            </el-form-item>
                            <el-form-item label="审批原因:">
                                <span  style="width:100%;text-align:left">{{form.project.reason}}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-dialog>
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
            tableData: [],
            pagesize:10,
            currentPage: 1,
            dialogVisible: false, 
            form: {
                project:{},
                studentList:[{}],
                teacherList:[{}],
                fileUrl:[]
            },
            data:[],
            comment:{
                approval:'',
                desc:''
            },
            choose:'未审批'
        }
    },
    methods:{
        getPro(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/admin_project_list'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.tableData=data.info;
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
            this.data=this.tableData.filter(data => {
                return Object.keys(data).some(key => {
                    return String(data[key]).toLowerCase().indexOf(this.search) > -1
                })
            }).slice((currentPage-1)*this.pagesize,currentPage*this.pagesize);
        },
        Search(){
            this.search=this.input;
            this.currentPage=1;
        },
        Exit(){
            this.input='';
            this.Search();
        },
        openDetails(row){
            this.dialogVisible=true;
            this.form=row;
        },
        onSubmit(){
            var that=this;
            if(this.comment.approval!=''){
                var pass='';
                if(this.comment.approval=='同意'){
                    pass='审批通过';
                }else{
                    pass='审批不通过';
                }
                axios({
                    method: 'post',
                    url: this.$host+'/manage_platform/project_approval',
                    data:{
                        id:this.form.project.id,
                        state:pass,
                        reason:this.comment.desc
                    }
                })
                .then(response => {
                    var data=response.data;
                    if(data.code==12){
                        this.$message({
                            message: '审批成功',
                            type: 'success'
                        });
                        this.getPro();
                        this.dialogVisible=false;
                    }else{
                        this.$message.error(data.message);
                    }
                })
                .catch(function (error) {
                    that.$message.error('连接失败，请检查网络');
                });
            }else{
                this.$message.error('请选择审批结果');
            }
        },
        changeAddress(item){
            var str=item.split("/");
            // console.log(str)
            return str[str.length-1]
        },
        getProHistory(sta){
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/project_query_by_state',
                data:{
                    state:sta
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.tableData=data.info;
                }else if(data.code==10){
                    this.$message.error(data.message);
                    this.$router.push({path:'/'})
                }else{
                    this.$message.error(data.message);
                }
            })
            .catch(function (error) {
                this.$message.error('连接失败，请检查网络');
            });
        }
    },
    mounted() {
        this.getProHistory('待审批');
    },
    watch:{
        'choose':function (val) {
            var that=this;
            this.$nextTick(function () {
                if(that.choose=='已通过'){
                    that.getProHistory('审批通过')
                }else if(that.choose=='已拒绝'){
                    that.getProHistory('审批不通过')
                }else{
                    that.getProHistory('待审批');
                }
                that.search='';
                that.currentPage=1;
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
#pro{
    width:100%;
    margin:30px 0;
}
#Approval{
    width:100%;
    height:40px;
    margin:15px 0 0 0;
}
#Approval span,#comment span{
    width: 74px;
	height: 29px;
	border-radius: 4px;
	font-size: 13px;
	line-height: 29px;
    display: inline-block;
	text-align: center;
    margin-right:10px;
    cursor: pointer;
}
#Approval i,#comment span i{
    margin-right:4px
}
.unchoose{
    background-color: white;
	color: rgba(80, 80, 80, 1);
	border: rgba(166, 166, 166, 1) solid 1px;
}
.mainbox /deep/ .el-table td,.mainbox /deep/ .el-table th{
    text-align: center;
}
.mainbox /deep/ .el-dialog{
    width:70%;
    min-width:1000px;
    position: relative;
}
.mainbox /deep/ .el-dialog__header{
    box-shadow: 0px 5px 5px 0px rgba(229, 229, 229, 1);
}
.mainbox /deep/ .el-dialog__title{
    color: rgba(108, 138, 216, 1);
	font-size: 22px;
}
.mainbox /deep/ .el-dialog__body{
    background-color: rgba(250, 247, 247, 1);
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
#pro_table,#pro_box{
    width: 95%;
    margin:0 2.5%;
	color: rgba(80, 80, 80, 1);
	background-color: rgba(255, 255, 255, 1);
	font-size: 14px;
	box-shadow: 0px 10px 10px 0px rgba(229, 229, 229, 1);
	text-align: center;
}
#pro_table{
    min-height: 920px;
    padding-bottom:30px;
}
#pro_box{
    height: 248px;
    margin-top:33px
}
.mainbox /deep/ .el-form{
    width:90%;
    margin:0 auto;
    padding-top:40px;
    text-align: left;
}
.mainbox /deep/ .el-form-item{
    height:40px;
}
.mainbox /deep/ .el-form-item__label{
    text-align: left;
    color: rgba(108, 138, 216, 1);
}
#table{
    list-style: none;
    width:100%;
    height:240px;
    margin-bottom:30px;
    position: relative;
    border-left: #DCDFE6 solid 1px;
    padding:0;
}
#table li{
    position: relative;
    width:16.6%;
    float: left;
}
#table li span{
    width:99%;
    height:39px;
    display: block;
    text-align: center;
    border:none;
    border-top: #DCDFE6 solid 1px;
    border-right: #DCDFE6 solid 1px;
}
#table li input{
    width:99%;
    height:39px;
    display: block;
    text-align: center;
    border:none;
    border-top: #DCDFE6 solid 1px;
    border-right:#DCDFE6 solid 1px;
    outline: none;
    padding:0;
}
#desc{
    width:95%;
    height:100px;
    border:#DCDFE6 solid 1px;
    padding:10px;
    text-align: left;
    border-radius: 10px;
    line-height:20px;
    display: block;
    overflow-y: auto;

}
.agree{
    color: rgba(255, 255, 255, 1);
	background-color: rgba(29, 160, 82, 1);
	border: rgba(29, 160, 82, 1) solid 1px;
}
.unagree{
    color: rgba(255, 255, 255, 1);
	background-color: rgba(234, 50, 35, 1);
	border: rgba(234, 50, 35, 1) solid 1px;
}
.approval1-1{
    border:1px solid rgba(108, 138, 216, 1);
    background-color: rgba(108, 138, 216, 1);
    color:white;
}
.approval1-2{
    border:1px solid rgba(108, 138, 216, 1);
    background-color: white;
    color:rgba(108, 138, 216, 1);
}
.approval2-1{
    border:1px solid rgba(29, 160, 82, 1);
    background-color: rgba(29, 160, 82, 1);
    color:white;
}
.approval2-2{
    border:1px solid rgba(29, 160, 82, 1);
    background-color: white;
    color:rgba(29, 160, 82, 1);
}
.approval3-1{
    border:1px solid rgba(234, 50, 35, 1);
    background-color: rgba(234, 50, 35, 1);
    color:white;
}
.approval3-2{
    border:1px solid rgba(234, 50, 35, 1);
    background-color: white;
    color:rgba(234, 50, 35, 1);
}
#submit{
    width: 100px;
	height: 35px;
	color: rgba(255, 255, 255, 1);
	background-color: rgba(108, 138, 216, 1);
	border-radius: 5px;
	font-size: 14px;
	line-height: 35px;
	border: rgba(204, 204, 204, 1) solid 1px;
	text-align: center;
    cursor: pointer;
    float: right;
}
#exit{
    width: 100px;
	height: 35px;
	color: rgba(80, 80, 80, 1);
	border-radius: 5px;
	font-size: 14px;
	line-height: 35px;
	border: rgba(204, 204, 204, 1) solid 1px;
	text-align: center;
    cursor: pointer;
    float: right;
    margin-left:30px;
}
</style>