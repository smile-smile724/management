<!--  -->
<template>
    <div class="mainbox">
        <div id="notice">
                <div id="search_notice">
                    <span style="display:inline-block;">输入关键词：</span>
                    <el-input v-model="input" placeholder="请输入内容   " style="display:inline-block;width:300px;"></el-input>
                    <div id="sure_btn" @click="Search">搜索</div>
                    <div id="exit_btn" @click="Exit">取消</div>
                </div>
                <div id="Approval">
                    <span style='background-color:rgba(108, 138, 216, 1)' @click="Add_notice">
                        <i class='el-icon-plus'></i>添加
                    </span>
                    <span style='background-color:rgba(234, 50, 35, 1)' @click="Delete_notice">
                        <i class='el-icon-delete'></i>删除
                    </span>
                </div>
                <div id="tip">
                    <i class="el-icon-warning" style="margin-left:11px;"></i>
                    <span style="margin-left:6px;color:rgba(0, 0, 0, 0.65);">已选择{{notice_choosen.length}}项</span>
                    <span style="margin-left:22px;color:rgba(108, 138, 216, 1);cursor: pointer;"  @click='clear'>清空</span>
                </div>
                <el-table
                ref="multipleTable"
                :data="data"
                tooltip-effect="dark"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                :default-sort = "{prop: 'date', order: 'descending'}">
                    <el-table-column
                    type="selection">
                    </el-table-column>
                    <el-table-column
                    prop="announce.title"
                    label="公告名称"
                    width='500px'>
                    </el-table-column>
                    <el-table-column
                    prop="announce.dayDate"
                    label="发布时间"
                    sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="tableData.filter(data => !search
                || data.announce.title.toLowerCase().includes(search.toLowerCase())
                || data.announce.dayDate.toLowerCase().includes(search.toLowerCase())).length"
                style="text-align:right;margin:20px 0;">
                </el-pagination>
        </div>

        <!-- 弹窗 -->
        <el-dialog title="公告管理" 
        :visible.sync="dialogVisible"
        :before-close="handleClose">
            <div id="edit">
                <el-input v-model="notice.title" placeholder="请输入标题" ></el-input>
                <textarea v-model="notice.content" id="desc"  placeholder="请输入内容"></textarea>
                <div>
                    <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="#"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    multiple
                    :limit="5"
                    :beforeUpload="beforeUpload"
                    :on-exceed="handleExceed"
                    :auto-upload="false"
                    style='width:500px;display:inline-block'>
                        <span id="file">
                            <i class='el-icon-folder-add' style></i>附件
                        </span>
                    </el-upload>
                    <span id='submit' @click="OnSubmit">提交</span>
                </div>
            </div>
        </el-dialog>

        <!-- 弹窗 -->
        <el-dialog title="公告预览" :visible.sync="Visible">
            <div id="notice">
                <span id='tit'>{{msg.announce.title}}</span>
                <span id='tit1'>{{msg.announce.dayDate}}</span>
                <p  v-html="changeBr(msg.announce.content)" style='white-space: pre-wrap;'></p>
                <span id="tit2" v-if="msg.fileUrl.length!=0">附件：</span>
                <a v-for="(item,index) in msg.fileUrl" :href="item" :download="changeAddress(item)" :key="index">
                <i class="el-icon-link"></i>{{changeAddress(item)}}</a>
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
            notice_choosen: [], 
            notice_choose: [], 
            search:'',
            input:'',
            data:[],
            tableData: [],
            pagesize:10,
            currentPage: 1,
            SearchFlag:false,
            dialogVisible: false,
            Visible:false,
            add_flag:false,
            notice:{
                title:'',
                content:'',
                listNum:[]
            },
            uploadNum:0,
            msg:{
                announce:{
                    title:'',
                    dayDate:'',
                    content:''
                },
                fileUrl:[]
            },
        }
    },
    methods:{
        getInfo(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/announce_msg'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    that.tableData=data.info;
                    this.data=this.tableData.filter(data => !this.search
                || data.announce.title.toLowerCase().includes(this.search.toLowerCase())
                || data.announce.dayDate.toLowerCase().includes(this.search.toLowerCase()))
                .slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);
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
            this.notice_choose = val;
        },
        currentChange(currentPage){
            this.currentPage = currentPage;
            this.data=this.tableData.filter(data => !this.search
                || data.announce.title.toLowerCase().includes(this.search.toLowerCase())
                || data.announce.dayDate.toLowerCase().includes(this.search.toLowerCase()))
                .slice((currentPage-1)*this.pagesize,currentPage*this.pagesize);
        },
        clear(){
            this.toggleSelection();
            this.notice_choosen=[]
        },
        Search(){
            this.search=this.input;
            this.currentPage=1;
            this.data=this.tableData.filter(data => !this.search
                || data.announce.title.toLowerCase().includes(this.search.toLowerCase())
                || data.announce.dayDate.toLowerCase().includes(this.search.toLowerCase()))
                .slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);
            this.SearchFlag=true;
        },
        Exit(){
            this.input='';
            this.Search();
        },
        Add_notice(){
            this.dialogVisible=true;
            this.add_flag=true;
        },
        Delete_notice(){
            this.$confirm('是否删除公告?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var flag=true;
                for(var i=0;i<this.notice_choose.length;i++){
                    this.delete_notice(this.notice_choose[i].announce,flag);
                }
                if(flag){
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }else{
                    this.$message.error('删除失败!');
                }
                this.clear();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleEdit(index,row){
            this.Visible=true;
            this.msg=row;
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleClose(done) {
            this.$confirm('确认取消操作？')
            .then(_ => {
                done();
                this.add_flag=false;
                this.notice={
                    title:'',
                    content:'',
                    fileList:[]
                }
            })
            .catch(_ => {});
        },
        OnSubmit(){
            this.uploadNum=this.$refs.upload.uploadFiles.length;
            if(this.uploadNum==0){
                this.SubmitNotice();
            }
            this.$refs.upload.submit();
        },
        beforeUpload(file){
            var that=this;
            var formData = new FormData();
            formData.append('file',file)
            var request = new XMLHttpRequest();
            request.open("POST",this.$host +'/manage_platform/up_file' );
            request.onreadystatechange=function(){
                if (request.readyState==4){
                    var data=JSON.parse(request.responseText);
                    if(data.code==12){
                        that.uploadNum--;
                        that.notice.listNum.push(data.info);
                        if(that.uploadNum==0){
                            that.SubmitNotice()
                        }
                    }
                }
            }
            request.send(formData);
        },
        SubmitNotice(){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/announce_add',
                data:{
                    title:this.notice.title,
                    content:this.notice.content,
                    fileArray:this.notice.listNum.join(',')
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    that.$message({
                        message: '通告发布成功',
                        type: 'success'
                    });
                    that.notice.listNum=[]
                    that.dialogVisible=false;
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
        changeBr(content){
            content = content.replace(/\\n/gm,"<br/>");
   		    return content;
        },
        changeAddress(item){
            var str=item.split("/");
            // console.log(str)
            return str[str.length-1]
        },
        delete_notice(notice,flag){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/announce_delete',
                data:{
                    id:notice.id
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    that.getInfo();
                }else{
                    flag=false;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }

    },
    mounted() {
        this.getInfo();
    },
    watch:{
        notice_choose(newVal,oldVal){
            if(newVal.length>oldVal.length&&newVal!=0){
                for(var i=oldVal.length;i<newVal.length;i++){
                    if(this.notice_choosen.indexOf(this.notice_choose[i])==-1){
                        this.notice_choosen.push(this.notice_choose[i]);
                    }
                }
            }else if(newVal.length<oldVal.length&&newVal!=0){
                this.notice_choosen.splice(oldVal.length-1, oldVal.length-newVal.length);
            }else if(newVal==0){
                if(this.data.indexOf(oldVal[0])!=-1&&!this.SearchFlag){
                    this.notice_choosen.splice(this.notice_choosen.indexOf(oldVal[0]), oldVal.length-newVal.length)
                } else if(this.SearchFlag){
                    this.SearchFlag=!this.SearchFlag;
                }
            }
        },
        'data':function (val) {
            this.$nextTick(function () {
                for(var i=0;i<this.notice_choosen.length;i++){
                    if(this.data.indexOf(this.notice_choosen[i])!=-1){
                        this.notice_choose.push(this.notice_choosen[i]);　
                        this.$refs.multipleTable.toggleRowSelection(this.$refs.multipleTable.data[this.data.indexOf(this.notice_choosen[i])],true);
                    }
                }
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
#notice{
    width:100%;
    margin:30px 0;
}
#Approval{
    width:100%;
    height:40px;
    margin:15px 0 0 0;
    color:rgba(255, 255, 255, 1);
}
#Approval span{
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
#Approval i{
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
#edit{
    width:90%;
    padding:0 5%;
}
#desc{
    width:98%;
    height:552px;
    outline: none;
    resize: none;
    margin:0 auto;
    border:#DCDFE6 solid 1px;
    padding:1%;
    border-radius: 10px;
    font-size:15px;
    margin:17px 0 20px 0;
}
#file{
    width: 98px;
	height: 40px;
	background-color: rgba(108, 138, 216, 1);
	border-radius: 10px;
    color: rgba(255, 255, 255, 1);
	font-size: 14px;
	line-height: 40px;
	text-align: center;
    float: left;
    cursor: pointer;
}
#edit i{
    margin-right:5px;
    font-size:18px;
}
#submit{
    width: 100px;
	height: 35px;
	color: rgba(255, 255, 255, 1);
	font-size: 14px;
	background-color: rgba(108, 138, 216, 1);
	border-radius: 5px;
	line-height: 35px;
	border: rgba(204, 204, 204, 1) solid 1px;
	text-align: center;
    float: right;
    cursor: pointer;
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
</style>