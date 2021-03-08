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
                    <span :class="{'approval1-1':choose=='0','approval1-2':choose!='0'}"
                    @click="choose='0'">
                        <i class='el-icon-alarm-clock'></i>未审批
                    </span>
                    <span :class="{'approval2-1':choose=='1','approval2-2':choose!='1'}"
                    @click="choose='1'">
                        <i class='el-icon-check'></i>已通过
                    </span>
                    <span :class="{'approval3-1':choose=='2','approval3-2':choose!='2'}"
                    @click="choose='2'">
                        <i class='el-icon-delete'></i>已拒绝
                    </span>
                </div>
                <el-table
                ref="multipleTable"
                :data="tableData.filter(data => !choose
                || data.endStat==choose)
                .filter(data => !search
                || data.projectMsg.project.typeName.toLowerCase().includes(search.toLowerCase())
                || data.projectMsg.project.projectName.toLowerCase().includes(search.toLowerCase())
                || data.projectMsg.studentList[0].name.toLowerCase().includes(search.toLowerCase())
                ).slice((currentPage-1)*pagesize,currentPage*pagesize)"
                tooltip-effect="dark"
                style="width: 100%;"
                @row-click="openDetails">
                    <el-table-column
                    prop="projectMsg.project.typeName"
                    label="命题">
                    </el-table-column>
                    <el-table-column
                    prop="projectMsg.project.projectName"
                    label="项目名称">
                    </el-table-column>
                    <el-table-column
                    prop="projectMsg.studentList[0].name"
                    label="项目负责人">
                    </el-table-column>
                    <el-table-column
                    prop="projectMsg.teacherList"
                    label="指导老师">
                        <template slot-scope="scope">
                            <span>{{scope.row.projectMsg.teacherList.lenght!=0?scope.row.projectMsg.teacherList[0].name:''}}{{scope.row.projectMsg.teacherList.length==2?'，'+scope.row.projectMsg.teacherList[1].name:''}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="tableData.filter(data => !choose
                || data.endStat==choose)
                .filter(data => !search
                || data.projectMsg.project.typeName.toLowerCase().includes(search.toLowerCase())
                || data.projectMsg.project.projectName.toLowerCase().includes(search.toLowerCase())
                || data.projectMsg.studentList[0].name.toLowerCase().includes(search.toLowerCase())).length"
                style="text-align:right;margin:20px 0;">
                </el-pagination>
            </div>

            <!-- 弹窗 -->
            <el-dialog title="结题报告审批" :visible.sync="dialogVisible">
                <div id="pro_Approval">
                    <div id="pro_table">
                        <el-form ref="form" :model="form" label-width="100px" id="form">
                            <el-form-item label="命题选题:">
                                <span>{{form.projectMsg.project.typeName}}</span>
                            </el-form-item>
                            <el-form-item label="项目名称:">
                                <span>{{form.projectMsg.project.projectName}}</span>
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
                                    <li v-for="(item, index) in form.projectMsg.studentList" :key="index">
                                        <span>学生 {{index+1}}</span>
                                        <span>{{item.name}}</span>
                                        <span>{{item.account}}</span>
                                        <span>{{item.classAndGrade}}</span>
                                        <span>{{item.college}}</span>
                                        <span style=" border-bottom: #DCDFE6 solid 1px;">{{item.telephone}}</span>
                                    </li>
                                </ul>
                            </el-form-item>
                            <el-form-item label="结题报告:">
                                <a v-for="(item,index) in form.endFileUrl" :href="item" :download="changeAddress(item)" :key="index">
                                    <i class="el-icon-link"></i>{{changeAddress(item)}}</a>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div id="pro_box" v-show="choose=='0'">
                        <el-form ref="comment" :model="comment" label-width="100px" id="comment">
                            <el-form-item label="审批结果:">
                                <div>
                                    <span :class="{'agree':comment.approval=='通过','unchoose':comment.approval!='通过'}" @click="comment.approval='通过'">
                                        <i class='el-icon-check'></i>通过
                                    </span>
                                    <span :class="{'unagree':comment.approval=='退回','unchoose':comment.approval!='退回'}" @click="comment.approval='退回'">
                                        <i class='el-icon-close'></i>退回
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
                    <div id="pro_box" v-if="choose!='0'&&dialogVisible">
                        <el-form ref="comment" :model="form" label-width="100px">
                            <el-form-item label="审批结果:">
                                <span>{{form.endStat=='0'?'待审批':(form.endStat=='1'?'审批通过':'审批不通过')}}</span>
                            </el-form-item>
                            <el-form-item label="审批原因:">
                                <span style="width:100%;text-align:left">{{form.endReason}}</span>
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
            data:[],
            pagesize:10,
            currentPage: 1,
            dialogVisible: false, 
            form: {
                projectMsg:{
                    project:{},
                    studentList:[],
                    teacherList:[],
                    fileUrl:[]
                },
                endReason:'',
                endStat:'0'
            },
            comment:{
                approval:'',
                desc:''
            },
            choose:'0'
        }
    },
    methods:{
        getInfo(){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/end_approval_list'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.tableData=data.info
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
        openDetails(row){
            this.dialogVisible=true;
            this.form=row;
        },
        onSubmit(){
            var that=this;
            if(this.comment.approval!=''){
                var pass='0';
                if(this.comment.approval=='通过'){
                    pass='1';
                }else{
                    pass='2';
                }
                axios({
                    method: 'post',
                    url: this.$host+'/manage_platform/end_approval',
                    data:{
                        id:this.form.projectId,
                        endStat:pass,
                        endReason:this.comment.desc
                    }
                })
                .then(response => {
                    var data=response.data;
                    if(data.code==12){
                        this.$message({
                            message: '审批成功',
                            type: 'success'
                        });
                        this.getInfo();
                        this.dialogVisible=false;
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
            }else{
                this.$message.error('请选择审批结果');
            }
        },
        download(row){
            for(var i=0;i<row.endFileUrl.length;i++){
                let link = document.createElement('a')
                link.href = row.endFileUrl[i]
                document.body.appendChild(link)
                link.setAttribute('download',this.changeAddress(row.endFileUrl[i]))
                link.click()
            }
        },
        changeAddress(item){
            var str=item.split("/");
            // console.log(str)
            return str[str.length-1]
        }
    },
    mounted() {
        this.getInfo();
    },
    watch:{
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
    min-height: 600px;
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
    font-size:15px;
    line-height:20px;
    display: block;
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
#form a{
    color:rgba(108, 138, 216, 1);
    font-size:15px;
    display: block;
}
</style>