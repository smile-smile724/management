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
                </div>
                <el-table
                ref="multipleTable"
                :data="tableData.filter(data => {
                return Object.keys(data).some(key => {
                    return String(data[key]).toLowerCase().indexOf(search) > -1
                })
            }).slice((currentPage-1)*pagesize,currentPage*pagesize)"
                tooltip-effect="dark"
                style="width: 100%;">
                    <el-table-column
                    prop="projectName"
                    label="项目名称">
                    </el-table-column>
                    <el-table-column
                    prop="number1"
                    label="项目负责人">
                    </el-table-column>
                    <el-table-column
                    prop="awardName"
                    label="竞赛名称">
                    </el-table-column>
                    <el-table-column
                    prop="awardDetails"
                    label="奖项等级">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="downloadPro(scope.$index, scope.row)"
                            :disabled="scope.row.achievementFile.length==0">成果下载</el-button>
                            <el-button
                            size="mini"
                            @click="downloadAward(scope.$index, scope.row)"
                            :disabled="scope.row.awardFile.length==0">证书下载</el-button>
                        </template>
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
            currentPage: 1
        }
    },
    methods:{
        getInfo(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/project_achievement_query'
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
        downloadPro(index,row){
            for(var i=0;i<row.achievementFile.length;i++){
                let link = document.createElement('a')
                link.href = row.achievementFile[i]
                document.body.appendChild(link)
                link.setAttribute('download',this.changeAddress(row.achievementFile[i]))
                link.click()
            }
        },
        downloadAward(index,row){
            for(var i=0;i<row.awardFile.length;i++){
                let link = document.createElement('a')
                link.href = row.awardFile[i]
                document.body.appendChild(link)
                link.setAttribute('download',this.changeAddress(row.awardFile[i]))
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
    border-bottom: #DCDFE6 solid 1px;
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