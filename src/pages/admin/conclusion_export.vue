<!--  -->
<template>
    <div class="mainbox">
        <div id="material">
                <div id="search_material">
                    <span>切换：</span>
                    <el-select v-model="show_index" placeholder="请选择">
                        <el-option label="审核中" value="0"></el-option>
                        <el-option label="已拒绝" value="2"></el-option>
                        <el-option label="已通过" value="1"></el-option>
                    </el-select>
                    <span style="display:inline-block;">输入关键词：</span>
                    <el-input v-model="input" placeholder="请输入内容" style="display:inline-block;width:300px;"></el-input>
                    <div id="sure_btn" @click="Search">确定</div>
                    <div id="exit_btn" @click="Exit">取消</div>
                </div>
                <el-table
                ref="multipleTable"
                :data="tableData.filter(data => !show_index
                || data.endStat==show_index)
                .filter(data => !search
                || data.projectMsg.project.projectName.toLowerCase().includes(search.toLowerCase())
                || data.projectMsg.project.typeName.toLowerCase().includes(search.toLowerCase())
                || data.projectMsg.studentList[0].name.toLowerCase().includes(search.toLowerCase()))
                .slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%;margin-top:39px">
                    <el-table-column
                    prop="projectMsg.project.projectName"
                    label="项目名称">
                    </el-table-column>
                    <el-table-column
                    prop="projectMsg.project.typeName"
                    label="项目命题">
                    </el-table-column>
                    <el-table-column
                    prop="projectMsg.studentList[0].name"
                    label="项目负责人">
                    </el-table-column>
                    <el-table-column
                    prop="projectMsg.teacherList[0].name"
                    label="指导老师">
                        <template slot-scope="scope">
                            <span>{{scope.row.projectMsg.teacherList[0].name}}{{scope.row.projectMsg.teacherList.length==2?'，'+scope.row.projectMsg.teacherList[1].name:''}}</span>
                        </template>
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
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="download(scope.$index, scope.row)"
                            :disabled="scope.row.endFileUrl.length==0">下载</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="tableData.filter(data => !show_index
                || data.endStat==show_index)
                .filter(data => !search
                || data.projectMsg.project.projectName.toLowerCase().includes(search.toLowerCase())
                || data.projectMsg.project.typeName.toLowerCase().includes(search.toLowerCase())
                || data.projectMsg.studentList[0].name.toLowerCase().includes(search.toLowerCase())).length"
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
            currentPage: 1,
            show_index:'0'
        }
    },
    methods:{
        getPro(){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/end_approval_list'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.tableData=data.info.filter(data => data.endFileUrl.length!=0);
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
        download(index,row){
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
        this.getPro();
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