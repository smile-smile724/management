<template>
    <div class="mainbox">
        <div id="text">
            <i></i>
            <span>申请检索</span>
        </div>
        <div id="content_search">
            <span>切换：</span>
            <el-select v-model="application_index" placeholder="请选择">
                <el-option label="项目" value="项目"></el-option>
                <el-option label="实验室" value="实验室"></el-option>
                <el-option label="设备" value="设备"></el-option>
                <el-option label="奖项" value="奖项"></el-option>
                <el-option label="成果" value="成果"></el-option>
                <el-option label="结题报告" value="结题报告"></el-option>
            </el-select>
            <i class="el-icon-search" style="cursor: pointer;" @click="proSearch"></i>
            <input v-model="pro_search" placeholder="请输入内容">
        </div>
        <div id="table">

            <!-- 项目 -->
            <el-table
            :data="pro.slice((ProPage-1)*pagesize,ProPage*pagesize)"
            style="width:100%"
            v-show="application_index=='项目'">
                <el-table-column
                prop="projectName"
                label="项目名称">
                </el-table-column>
                <el-table-column
                prop="state"
                label="项目进度">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.state == '待审批'" style="color:blue;" slot="reference">审核中</span>
                        <span  v-if="scope.row.state == '审批不通过'" style="color:red;" slot="reference">已拒绝</span>
                        <span  v-if="scope.row.state == '审批通过'" style="color:green;" slot="reference">已通过</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="reason"
                label="审批原因">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="ReasonView(scope.$index, scope.row.reason)"
                        :disabled="scope.row.reason==''||scope.row.reason==null">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            :page-size="pagesize"
            background
            @current-change="Prochange"
            layout="total, prev, pager, next, jumper"
            :total="pro.length"
            style="margin-top:20px"
            v-show="application_index=='项目'">
            </el-pagination>

            <!-- 实验室 -->
            <el-table
            :data="pro.slice((ProPage-1)*pagesize,ProPage*pagesize)"
            style="width:100%"
            v-show="application_index=='实验室'">
                <el-table-column
                prop="labName"
                label="实验室名称">
                </el-table-column>
                <el-table-column
                prop="place"
                label="所在地">
                </el-table-column>
                <el-table-column
                prop="startDate"
                label="借用时间"
                width="300">
                    <template slot-scope="scope">
                        <span>{{scope.row.startDate}} - {{scope.row.endDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="orderState"
                label="审批结果">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.orderState == '待审批'" style="color:blue;" slot="reference">审核中</span>
                        <span  v-if="scope.row.orderState == '拒绝'" style="color:red;" slot="reference">已拒绝</span>
                        <span  v-if="scope.row.orderState == '同意审批'" style="color:green;" slot="reference">已通过</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="reason"
                label="审批原因">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="ReasonView(scope.$index, scope.row.reason)"
                        :disabled="scope.row.reason==''||scope.row.reason==null">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            :page-size="pagesize"
            background
            @current-change="Prochange"
            layout="total, prev, pager, next, jumper"
            :total="pro.length"
            style="margin-top:20px"
            v-show="application_index=='实验室'">
            </el-pagination>

            <!-- 设备 -->
            <el-table
            :data="pro.slice((ProPage-1)*pagesize,ProPage*pagesize)"
            style="width:100%"
            v-show="application_index=='设备'">
                <el-table-column
                prop="serialNumber"
                label="设备编号"
                width="200">
                </el-table-column>
                <el-table-column
                prop="name"
                label="设备名称">
                </el-table-column>
                <el-table-column
                prop="labName"
                label="所在地">
                </el-table-column>
                <el-table-column
                prop="startDate"
                label="借用时间"
                width="300">
                    <template slot-scope="scope">
                        <span>{{scope.row.startDate}} - {{scope.row.endDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="orderState"
                label="审批结果">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.orderState == '待审批'" style="color:blue;" slot="reference">审核中</span>
                        <span  v-if="scope.row.orderState == '拒绝'" style="color:red;" slot="reference">已拒绝</span>
                        <span  v-if="scope.row.orderState == '同意审批'" style="color:green;" slot="reference">已通过</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="reason"
                label="审批原因">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="ReasonView(scope.$index, scope.row.reason)"
                        :disabled="scope.row.reason==''||scope.row.reason==null">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            :page-size="pagesize"
            background
            @current-change="Prochange"
            layout="total, prev, pager, next, jumper"
            :total="pro.length"
            style="margin-top:20px"
            v-show="application_index=='设备'">
            </el-pagination>

            <!-- 奖项 -->
            <el-table
            :data="pro.slice((ProPage-1)*pagesize,ProPage*pagesize)"
            style="width:100%"
            v-show="application_index=='奖项'">
                <el-table-column
                prop="projectName"
                label="项目名称">
                </el-table-column>
                <el-table-column
                prop="typeName"
                label="项目命题">
                </el-table-column>
                <el-table-column
                prop="awardName"
                label="竞赛名称">
                </el-table-column>
                <el-table-column
                prop="award"
                label="奖项等级">
                </el-table-column>
                <el-table-column
                prop="state"
                label="审批结果">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.state == '待审批'" style="color:blue;" slot="reference">审核中</span>
                        <span  v-if="scope.row.state == '审批不通过'" style="color:red;" slot="reference">已拒绝</span>
                        <span  v-if="scope.row.state == '审批通过'" style="color:green;" slot="reference">已通过</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="reason"
                label="审批原因">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="ReasonView(scope.$index, scope.row.reason)"
                        :disabled="scope.row.reason==''||scope.row.reason==null">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            :page-size="pagesize"
            background
            @current-change="Prochange"
            layout="total, prev, pager, next, jumper"
            :total="pro.length"
            style="margin-top:20px"
            v-show="application_index=='奖项'">
            </el-pagination>

            <!-- 成果 -->
            <el-table
            :data="pro.slice((ProPage-1)*pagesize,ProPage*pagesize)"
            style="width:100%"
            v-show="application_index=='成果'">
                <el-table-column
                prop="projectName"
                label="项目名称">
                </el-table-column>
                <el-table-column
                prop="gist"
                label="项目类型">
                </el-table-column>
                <el-table-column
                prop="typeName"
                label="项目命题">
                </el-table-column>
                <el-table-column
                prop="state"
                label="审批结果">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.state == '待审批'" style="color:blue;" slot="reference">审核中</span>
                        <span  v-if="scope.row.state == '审批不通过'" style="color:red;" slot="reference">已拒绝</span>
                        <span  v-if="scope.row.state == '审批通过'" style="color:green;" slot="reference">已通过</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="reason"
                label="审批原因">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="ReasonView(scope.$index, scope.row.reason)"
                        :disabled="scope.row.reason==''||scope.row.reason==null">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            :page-size="pagesize"
            background
            @current-change="Prochange"
            layout="total, prev, pager, next, jumper"
            :total="pro.length"
            style="margin-top:20px"
            v-show="application_index=='成果'">
            </el-pagination>

            <!-- 结题报告 -->
            <el-table
            :data="pro.slice((ProPage-1)*pagesize,ProPage*pagesize)"
            style="width:100%"
            v-show="application_index=='结题报告'">
                <el-table-column
                prop="projectName"
                label="项目名称">
                </el-table-column>
                <el-table-column
                prop="gist"
                label="项目类型">
                </el-table-column>
                <el-table-column
                prop="typeName"
                label="项目命题">
                </el-table-column>
                <el-table-column
                prop="endStat"
                label="审批结果">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.endStat == '0'" style="color:blue;" slot="reference">审核中</span>
                        <span  v-if="scope.row.endStat == '2'" style="color:red;" slot="reference">已拒绝</span>
                        <span  v-if="scope.row.endStat == '1'" style="color:green;" slot="reference">已通过</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="reason"
                label="审批原因">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="ReasonView(scope.$index, scope.row.endReason)"
                        :disabled="scope.row.endReason==''||scope.row.endReason==null">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            :page-size="pagesize"
            background
            @current-change="Prochange"
            layout="total, prev, pager, next, jumper"
            :total="pro.length"
            style="margin-top:20px"
            v-show="application_index=='结题报告'">
            </el-pagination>
        </div>
        <!-- <div id="text">
            <i></i>
            <span>消息公告</span>
        </div>
        <div id="content_search">
            <i class="el-icon-search" style="cursor: pointer;" @click="msgSearch"></i>
            <input v-model="msg_search" placeholder="请输入内容">
        </div>
        <div id="table">
            <el-table
            :data="message.filter(data => !Msg_search
                || data.announce.title.toLowerCase().includes(Msg_search.toLowerCase())).slice((MsgPage-1)*pagesize,MsgPage*pagesize)"
            style="width:100%" @row-click="openDetails">
                <el-table-column
                prop="announce.title"
                label="公告名称">
                </el-table-column>
                <el-table-column
                prop="announce.dayDate"
                label="公告时间">
                </el-table-column>
            </el-table>
            <el-pagination
            :page-size="pagesize"
            background
            @current-change="Msgchange"
            layout="total, prev, pager, next, jumper"
            :total="message.filter(data => !Msg_search
                || data.announce.title.toLowerCase().includes(Msg_search.toLowerCase())).length"
            style="margin-top:20px">
            </el-pagination>
        </div> -->

        <!-- 弹窗 -->
        <!-- <el-dialog title="公告" :visible.sync="dialogVisible">
            <div id="notice">
                <span id='tit'>{{msg.announce.title}}</span>
                <span id='tit1'>{{msg.announce.dayDate}}</span>
                <p  v-html="changeBr(msg.announce.content)" style='white-space: pre-wrap;'></p>
                <span id="tit2" v-if="msg.fileUrl.length!=0">附件：</span>
                <a v-for="(item,index) in msg.fileUrl" :href="item" :download="changeAddress(item)" :key="index">
                <i class="el-icon-link"></i>{{changeAddress(item)}}</a>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;  
export default {
    data () {
        return {
            project: [],
            pro:[],
            pagesize:8,
            ProPage:1,
            MsgPage:1,
            pro_search:'',
            msg_search:'',
            Pro_search:'',
            Msg_search:'',
            message: [],
            msg:{
                announce:{
                    title:'',
                    dayDate:'',
                    content:''
                },
                fileUrl:[]
            },
            dialogVisible: false,
            application_index:'项目'
        }
    },
    methods:{
        getInfo(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/student_index_msg'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    if(data.info.projectList!=null){
                        that.project=data.info.projectList;
                        that.pro=that.project.filter(data => !that.Pro_search
                        || data.projectName.toLowerCase().includes(that.Pro_search.toLowerCase()));
                        if(that.application_index=='结题报告'){
                            that.pro=that.project.filter(data => data.endStat!='-1')
                        }
                        that.ProPage = 1;
                    }
                    if(data.info.announceList!=null){
                        that.message=data.info.announceList;
                    }
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
        Prochange:function(currentPage){
            this.ProPage = currentPage;
        },
        Msgchange:function(currentPage){
            this.MsgPage = currentPage;
        },
        msgSearch(){
            this.MsgPage=1;
            this.Msg_search=this.msg_search;
        },
        proSearch(){
            this.ProPage=1;
            this.Pro_search=this.pro_search;
            if(this.application_index=='项目'){
                this.pro=this.project.filter(data => !this.Pro_search
                || data.projectName.toLowerCase().includes(this.Pro_search.toLowerCase()));
            }else if(this.application_index=='设备'){
                this.pro=this.project.filter(data => !this.Pro_search
                || data.serialNumber.toLowerCase().includes(this.Pro_search.toLowerCase())
                || data.name.toLowerCase().includes(this.Pro_search.toLowerCase())
                || data.labName.toLowerCase().includes(this.Pro_search.toLowerCase()))
            }else if(this.application_index=='实验室'){
                this.pro=this.project.filter(data => !this.Pro_search
                || data.labName.toLowerCase().includes(this.Pro_search.toLowerCase())
                || data.place.toLowerCase().includes(this.Pro_search.toLowerCase()))
            }else if(this.application_index=='结题报告'){
                console.log(this.project)
                this.pro=this.project.filter(data => data.endStat!='-1')
                .filter(data => !this.Pro_search
                || data.projectName.toLowerCase().includes(this.Pro_search.toLowerCase()))
            }else{
                this.pro=this.project.filter(data => {
                    return Object.keys(data).some(key => {
                        return String(data[key]).toLowerCase().indexOf(this.Pro_search) > -1
                    })
                })
            }
            this.ProPage = 1;
        },
        openDetails(row){
            this.dialogVisible=true;
            this.msg=row;
        },
        changeBr(content){
            content = content.replace(/\\n/gm,"<br/>");
   		    return content;
        },
        getLabList(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/student_lab'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    that.project=data.info;
                    this.pro=this.project.filter(data => !this.Pro_search
                    || data.labName.toLowerCase().includes(this.Pro_search.toLowerCase())
                    || data.place.toLowerCase().includes(this.Pro_search.toLowerCase()))
                    this.ProPage = 1;
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
        getEquipList(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/student_equ'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    that.project=data.info;
                    this.pro=this.project.filter(data => !this.Pro_search
                    || data.serialNumber.toLowerCase().includes(this.Pro_search.toLowerCase())
                    || data.name.toLowerCase().includes(this.Pro_search.toLowerCase())
                    || data.labName.toLowerCase().includes(this.Pro_search.toLowerCase()))
                    this.ProPage = 1;
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
        getAwardList(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/student_award_achievement_query'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    if(that.application_index=='奖项'){
                        that.project=data.info.award;
                    }else{
                        that.project=data.info.achievement;
                    }
                    this.pro=this.project.filter(data => {
                        return Object.keys(data).some(key => {
                            return String(data[key]).toLowerCase().indexOf(this.Pro_search) > -1
                        })
                    })
                    this.ProPage = 1;
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
        changeAddress(item){
            var str=item.split("/");
            // console.log(str)
            return str[str.length-1]
        },
        ReasonView(index,row){
            this.$alert(row, '审批原因', {});
        },
        // getConclusionList(){
        //     var that=this;
        //     axios({
        //         method: 'get',
        //         url: this.$host+'/manage_platform/student_index_msg'
        //     })
        //     .then(response => {
        //         var data=response.data;
        //         if(data.code==12){
        //             if(data.info.projectList!=null){
        //                 that.project=data.info.projectList;
        //                 for(var i=0;i<that.project.length;i++){
        //                     that.getConclusion(that.project[i].id,i)
        //                 }
        //                 that.proSearch()
        //             }
        //             if(data.info.announceList!=null){
        //                 that.message=data.info.announceList;
        //             }
        //         }else if(data.code==10){
        //             this.$message.error(data.message);
        //             // this.$router.push({path:'/'})
        //         }else{
        //             this.$message.error(data.message);
        //         }
        //     })
        //     .catch(function (error) {
        //         that.$message.error('连接失败，请检查网络');
        //     });
        // },
        // getConclusion(projectId,num){
        //     var that=this;
        //     axios({
        //         method: 'post',
        //         url: this.$host+'/manage_platform/end_file_query',
        //         data:{
        //             id:projectId
        //         }
        //     })
        //     .then(response => {
        //         var data=response.data;
        //         if(data.code==12){
        //             this.project[num].conclusion=data.info;
        //         }else if(data.code==10){
        //             this.$message.error(data.message);
        //             this.$router.push({path:'/'})
        //         }else{
        //             this.$message.error(data.message);
        //         }
        //     })
        //     .catch(function (error) {
        //         that.$message.error('连接失败，请检查网络');
        //     });
        // }
    },
    mounted(){
        this.getInfo();
    },
    watch:{
        'application_index':function (val) {
            var that=this;
            this.$nextTick(function () {
                if(that.application_index=='项目'||that.application_index=='结题报告'){
                    that.getInfo();
                }else if(that.application_index=='设备'){
                    that.getEquipList();
                }else if(that.application_index=='实验室'){
                    that.getLabList();
                }else{
                    that.getAwardList();
                }
                that.Pro_search=''
            });
        }
    }
}
</script>

<style scoped>
.mainbox{
    min-width:1000px;
    margin-left:300px;
    min-height:740px;
    position: relative;
    text-align: left;
}
#text{
    display: block;
	height: 30px;
    padding:40px 0;
}
#text span{
    float: left;
	height: 30px;
	color: rgba(112, 111, 111, 1);
	font-size: 18px;
	line-height: 30px;
	text-align: left;
}
#text i{
    width:3px;
    height:3px;
    float: left;
    border-radius:10px;
    background-color:rgba(108, 138, 216, 1);
    margin:13.5px 22px 13.5px 0;
}
#content_search{
    margin:0 10% 10px 10%;
    font-size:20px;
    height:34px;
    line-height: 30px;
}
#content_search span{
    width: 45px;
	height: 22px;
	color: rgba(108, 138, 216, 1);
	font-size: 16px;
	text-align: left;
}
#content_search i{
    float:right;
    margin:7px 10px 0 10px;
}
.mainbox input{
    width:250px;
    height:30px;
    float:right;
    line-height: 30px;
    border:1px solid rgba(204, 204, 204, 1);
    font-size: 12px;
    border-radius: 20px;
    outline: none;
    text-indent: 15px;
}
#table{
    width:80%;
    height:560px;
    margin:0 10%;
    background-color: white;
    text-align: center;
    box-shadow: 0px 5px 5px 0px rgba(229, 229, 229, 1);
}
.mainbox /deep/ .el-table{
    height:486px;
}
.mainbox /deep/ .el-table td,.mainbox /deep/ .el-table th{
    text-align: center;
    padding:15px 0;
}
.mainbox /deep/ .el-table td{
    font-size: 14px;
}
.mainbox /deep/ .el-table thead {
    font-size: 18px;
    color:rgba(108, 138, 216, 1);
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
#notice{
    width:90%;
    margin:0 auto;
    position: relative;
}
#tit{
    width: 100%;
	color: rgba(80, 80, 80, 1);
	font-size: 25px;
	line-height: 40px;
    display: block;
	text-align: left;
}
#tit1{
    width: 114px;
	height: 19px;
	color: rgba(166, 166, 166, 1);
	font-size: 13px;
	line-height: 19px;
	text-align: left;
}
#tit2{
	height: 19px;
	font-size: 16px;
    font-weight: bold;
	line-height: 19px;
	text-align: left;
}
#notice p{
    margin:40px 0;
}
#notice a{
    color:rgba(108, 138, 216, 1);
    display: table;
    margin-left:50px;
    font-size:15px;
}
#table span{
    display: block;
}
</style>