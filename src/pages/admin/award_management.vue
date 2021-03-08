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
                :data="tableData.filter(data => !this.search
                || data.projectName.toLowerCase().includes(search.toLowerCase())
                || data.element.username.toLowerCase().includes(search.toLowerCase())
                || data.element.awardName.toLowerCase().includes(search.toLowerCase())
                || data.element.awardDetails.toLowerCase().includes(search.toLowerCase())
                ).slice((currentPage-1)*pagesize,currentPage*pagesize)"
                tooltip-effect="dark"
                style="width: 100%;" 
                v-show="choose=='未审批'">
                    <el-table-column
                    prop="projectName"
                    label="项目名称">
                    </el-table-column>
                    <el-table-column
                    prop="element.username"
                    label="项目负责人">
                    </el-table-column>
                    <el-table-column
                    prop="element.awardName"
                    label="竞赛名称">
                    <template slot-scope="scope">
                            <el-input v-model="scope.row.element.awardName"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="element.awardDetails"
                    label="奖项等级">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="handlePictureCardPreview(scope.row)"
                            :disabled="scope.row.fileUrl.length==0">查看</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="Aproval(scope.row,'审批通过')">通过</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="Aproval(scope.row,'审批不通过')">拒绝</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="tableData.filter(data => !this.search
                || data.projectName.toLowerCase().includes(search.toLowerCase())
                || data.element.username.toLowerCase().includes(search.toLowerCase())
                || data.element.awardName.toLowerCase().includes(search.toLowerCase())
                || data.element.awardDetails.toLowerCase().includes(search.toLowerCase())).length"
                style="text-align:right;margin:20px 0;"
                v-show="choose=='未审批'">
                </el-pagination>

                <!-- 历史记录 -->
                <el-table
                ref="multipleTable"
                :data="data.filter(data => !this.search
                || data.project.projectName.toLowerCase().includes(search.toLowerCase())
                || data.studentList[0].name.toLowerCase().includes(search.toLowerCase())
                || data.msg.awardName.toLowerCase().includes(search.toLowerCase())
                || data.msg.awardDetails.toLowerCase().includes(search.toLowerCase())
                ).slice((currentPage-1)*pagesize,currentPage*pagesize)"
                tooltip-effect="dark"
                style="width: 100%;"
                v-show="choose!='未审批'">
                    <el-table-column
                    prop="project.projectName"
                    label="项目名称">
                    </el-table-column>
                    <el-table-column
                    prop="studentList[0].name"
                    label="项目负责人">
                    </el-table-column>
                    <el-table-column
                    prop="msg.awardName"
                    label="竞赛名称">
                    </el-table-column>
                    <el-table-column
                    prop="msg.awardDetails"
                    label="奖项等级">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="handlePictureCardPreview(scope.row)"
                            :disabled="scope.row.fileUrl.length==0">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="data.filter(data => !this.search
                || data.project.projectName.toLowerCase().includes(search.toLowerCase())
                || data.studentList[0].name.toLowerCase().includes(search.toLowerCase())
                || data.msg.awardName.toLowerCase().includes(search.toLowerCase())
                || data.msg.awardDetails.toLowerCase().includes(search.toLowerCase())).length"
                style="text-align:right;margin:20px 0;"
                v-show="choose!='未审批'">
                </el-pagination>
            </div>
            
            <el-dialog :visible.sync="ImageVisible"  title="证书预览">
                <img width="100%" :src="dialogImageUrl" alt="">
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
            SearchFlag:false,
            choose:'未审批',
            ImageVisible:false,
            dialogImageUrl:''
        }
    },
    methods:{
        getInfo(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/project_award_approval_list'
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
        },
        Search(){
            this.search=this.input;
            this.currentPage=1;
        },
        Exit(){
            this.input='';
            this.Search();
        },
        handlePictureCardPreview(row) {
            this.dialogImageUrl = row.fileUrl[0];
            this.ImageVisible = true;
        },
        Aproval(row,flag){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/project_award_approval',
                data:{
                    id: row.element.id,
                    state:flag,
                    awardName:row.element.awardName
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    that.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    that.getInfo();
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
                url: this.$host+'/manage_platform/query_award_achievement_by_state',
                data:{
                    state:sta,
                    award:1
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.data=data.info;
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
        this.getInfo()
    },
    watch:{
        'choose':function (val) {
            var that=this;
            this.$nextTick(function () {
                if(that.choose=='已通过'){
                    that.getHistory('审批通过')
                }else if(that.choose=='已拒绝'){
                    that.getHistory('审批不通过')
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
</style>