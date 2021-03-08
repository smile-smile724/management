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
                <el-table
                ref="multipleTable"
                :data="tableData.filter(data => {
                    return Object.keys(data).some(key => {
                        return String(data[key]).toLowerCase().indexOf(search) > -1
                    })
                }).slice((currentPage-1)*pagesize,currentPage*pagesize)"
                tooltip-effect="dark"
                style="width: 100%;"
                @row-click="openDetails">
                    <el-table-column
                    prop="serialNumber"
                    label="设备编号">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="设备名称">
                    </el-table-column>
                    <el-table-column
                    prop="labPlaceName"
                    label="所属实验室">
                    </el-table-column>
                    <el-table-column
                    prop="labName"
                    label="实验室地点">
                    </el-table-column>
                    <el-table-column
                    prop="time"
                    label="申请时间"
                    width="300">
                        <template slot-scope="scope">
                            <span>{{scope.row.startDate}} - {{scope.row.endDate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="username"
                    label="申请人">
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

            <!-- 弹窗 -->
            <el-dialog title="设备管理" :visible.sync="dialogVisible">
                <div id="pro_Approval">
                    <div id="pro_table">
                        <el-form ref="form" :model="form" label-width="100px" id="form">
                            <el-form-item label="设备编号:">
                                <span>{{form.serialNumber}}</span>
                            </el-form-item>
                            <el-form-item label="设备名称:">
                                <span>{{form.name}}</span>
                            </el-form-item>
                            <el-form-item label="设备型号:">
                                <span>{{form.modelName}}</span>
                            </el-form-item>
                            <el-form-item label="开始时间:">
                                <span>{{form.startDate}}</span>
                            </el-form-item>
                            <el-form-item label="结束时间:">
                                <span>{{form.endDate}}</span>
                            </el-form-item>
                            <el-form-item label="申请人:">
                                <span>{{form.username}}</span>
                            </el-form-item>
                            <el-form-item label="申请人学号:">
                                <span>{{form.account}}</span>
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
                                <span>{{form.orderState}}</span>
                            </el-form-item>
                            <el-form-item label="审批原因:">
                                <span style="width:100%;text-align:left">{{form.reason}}</span>
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
            form: {},
            comment:{
                approval:'',
                desc:''
            },
            choose:'未审批'
        }
    },
    methods:{
        getInfo(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/order_equ_query'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    that.tableData=data.info;
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
            if(this.comment.approval=='同意'){
                this.agreeApproval();
            }else{
                this.disApproval();
            }
            this.dialogVisible=false;
        },
        agreeApproval(){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/approval_equ',
                data:{
                    orderState:"同意审批",
                    id:this.form.id,
                    startDate:this.form.startDate,
                    endDate:this.form.endDate,
                    reason:this.comment.desc
                }
            })
            .then(response => {
                var data=response.data;
                this.getInfo();
                if(data.code==12){
                    that.$message({
                        message: '操作成功！',
                        type: 'success'
                    });
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
        disApproval(){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/approval_equ',
                data:{
                    orderState:"拒绝",
                    id:this.form.id,
                    startDate:this.form.startDate,
                    endDate:this.form.endDate,
                    reason:this.comment.desc
                }
            })
            .then(response => {
                var data=response.data;
                this.getInfo();
                if(data.code==12){
                    that.$message({
                        message: '操作成功！',
                        type: 'success'
                    });
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
        getHistory(sta){
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/equ_query_by_state',
                data:{
                    orderState:sta
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
        this.getInfo();
    },
    watch:{
        'choose':function (val) {
            var that=this;
            this.$nextTick(function () {
                if(that.choose=='已通过'){
                    that.getHistory('同意审批')
                }else if(that.choose=='已拒绝'){
                    that.getHistory('拒绝')
                }else{
                    that.getInfo();
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
    min-height: 500px;
}
#pro_box{
    height: 248px;
    margin-top:33px
}
.mainbox /deep/ .el-form{
    width:90%;
    margin:0 auto;
    padding-top:30px;
    text-align: left;
}
.mainbox /deep/ .el-form-item__label{
    text-align: left;
    color: rgba(108, 138, 216, 1);
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