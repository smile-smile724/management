<!--  -->
<template>
    <div class="mainbox">
        <div id="equipment_chosen">
                <div id="search_equipment_chosen">
                    <span style="display:inline-block;">设备编号：</span>
                    <el-input v-model="input" placeholder="请输入内容" style="display:inline-block;width:300px;"></el-input>
                    <div id="sure_btn" @click="Search">确定</div>
                    <div id="exit_btn" @click="Exit">取消</div>
                </div>
                <div id="Approval">
                    <span style='background-color:rgba(108, 138, 216, 1)' @click='dialogVisible=true'>
                        <i class='el-icon-plus'></i>添加
                    </span>
                    <span style='background-color:rgba(234, 50, 35, 1)' @click='delete_equ'>
                        <i class='el-icon-delete'></i>删除
                    </span>
                </div>
                <div id="tip">
                    <i class="el-icon-warning" style="margin-left:11px;"></i>
                    <span style="margin-left:6px;color:rgba(0, 0, 0, 0.65);">已选择{{equipment_chosen.length}}项</span>
                    <span style="margin-left:22px;color:rgba(108, 138, 216, 1);cursor: pointer;"  @click='clear'>清空</span>
                </div>
                <el-table
                ref="multipleTable"
                :data="data"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection">
                    </el-table-column>
                    <el-table-column
                    prop="serialNumber"
                    label="设备编号">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="设备名称">
                    </el-table-column>
                    <el-table-column
                    prop="modelName"
                    label="设备型号">
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
                    prop="state"
                    label="状态">
                        <template slot-scope="scope">
                            <span  v-if="scope.row.state == '不可借用'" style="color:red;" slot="reference">不可借用</span>
                            <span  v-if="scope.row.state == '可借用'" style="color:green;" slot="reference">可借用</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="tableData.filter(data => !search
                || data.serialNumber.toLowerCase().includes(search.toLowerCase())).length"
                style="text-align:right;margin:20px 0;">
                </el-pagination>
            </div>

                    <!-- 弹窗 -->
        <el-dialog title="添加设备" 
        :visible.sync="dialogVisible">
            <div id="edit">
                <a :href="address" download="设备上传模板.xls">设备上传模板.xls</a>
                <el-upload
                class="upload-demo"
                ref="upload"
                action="#"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                :beforeUpload="beforeUpload"
                :on-exceed="handleExceed"
                :file-list="fileList"
                :auto-upload="false">
                    <el-button slot="trigger" size="small">
                        <i class='el-icon-plus'></i> 点击添加
                    </el-button>
                    <el-button style="margin-left: 10px;" size="small" type="primary"  @click="submitUpload">
                        <i class='el-icon-upload2'></i>  点击上传
                    </el-button>
                </el-upload>
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
            equipment_chosen: [], 
            equipment: [], 
            search:'',
            input:'',
            data:[],
            tableData: [],
            pagesize:10,
            currentPage: 1,
            SearchFlag:false,
            dialogVisible: false,
            fileList:[],
            address:'../../../static/equ_add.xls'
        }
    },
    methods:{
        getInfo(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/equ_list'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    that.tableData=data.info;
                    this.data=this.tableData.filter(data => !this.search
                    || data.serialNumber.toLowerCase().includes(this.search.toLowerCase()))
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
            this.equipment = val;
        },
        currentChange(currentPage){
            this.currentPage = currentPage;
            this.data=this.tableData.filter(data => !this.search
                || data.serialNumber.toLowerCase().includes(this.search.toLowerCase()))
                .slice((currentPage-1)*this.pagesize,currentPage*this.pagesize);
        },
        clear(){
            this.toggleSelection();
            this.equipment_chosen=[]
        },
        Search(){
            this.search=this.input;
            this.currentPage=1;
            this.data=this.tableData.filter(data => !this.search
                || data.serialNumber.toLowerCase().includes(this.search.toLowerCase()))
                .slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);
            this.SearchFlag=true;
        },
        Exit(){
            this.input='';
            this.Search();
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        beforeUpload(file){
            var that=this;
            var formData = new FormData();
            formData.append('file',file)
            var request = new XMLHttpRequest();
            request.open("POST",this.$host +'/manage_platform/equ_add_by_excel' );
            request.onreadystatechange=function(){
                if (request.readyState==4){
                    var data=JSON.parse(request.responseText);
                    if(data.code==12){
                        that.$message({
                            message: data.info,
                            type: 'success'
                        });
                        that.getInfo()
                    }else{
                        that.$message.error(data.info);
                    }
                }
            }
            request.send(formData);
        },
        delete_oneEqu(num,flag){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/equ_delete',
                data:{
                    serialNumber:num
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code!=12){
                    flag=false;
                }else{
                    that.getInfo();
                }
            })
            .catch(function (error) {
                flag=false;
            });
        },
        delete_equ(){
            var flag=true;
            if(this.equipment_chosen.length==0){
                this.$message.error('请选择要删除的设备');
            }else{
                for(var i=0;i<this.equipment_chosen.length;i++){
                    this.delete_oneEqu(this.equipment_chosen[i].serialNumber,flag);
                }
                if(flag){
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                }else{
                    this.$message.error('删除失败');
                }
                this.clear();
            }
        }
    },
    mounted() {
        this.getInfo();
    },
    watch:{
        equipment(newVal,oldVal){
            if(newVal.length>oldVal.length&&newVal!=0){
                for(var i=oldVal.length;i<newVal.length;i++){
                    if(this.equipment_chosen.indexOf(this.equipment[i])==-1){
                        this.equipment_chosen.push(this.equipment[i]);
                    }
                }
            }else if(newVal.length<oldVal.length&&newVal!=0){
                for(var i=0;i<oldVal.length;i++){
                    if(newVal.indexOf(oldVal[i])==-1){
                        this.equipment_chosen.splice(this.equipment_chosen.indexOf(oldVal[i]), 1);
                    }
                }
            }else if(newVal==0){
                if(this.data.indexOf(oldVal[0])!=-1&&!this.SearchFlag){
                    this.equipment_chosen.splice(this.equipment_chosen.indexOf(oldVal[0]), oldVal.length-newVal.length)
                } else if(this.SearchFlag){
                    this.SearchFlag=!this.SearchFlag;
                }
            }
        },
        'data':function (val) {
            this.$nextTick(function () {
                for(var i=0;i<this.equipment_chosen.length;i++){
                    if(this.data.indexOf(this.equipment_chosen[i])!=-1){
                        this.equipment.push(this.equipment_chosen[i]);　
                        this.$refs.multipleTable.toggleRowSelection(this.$refs.multipleTable.data[this.data.indexOf(this.equipment_chosen[i])],true);
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
#equipment_chosen{
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
.mainbox /deep/ .el-dialog{
    width:600px;
    position: relative;
}
.mainbox /deep/ .el-dialog__header{
    box-shadow: 0px 5px 5px 0px rgba(229, 229, 229, 1);
}
.mainbox /deep/ .el-dialog__title{
    color: rgba(108, 138, 216, 1);
	font-size: 22px;
}
#edit a{
    color:rgba(108, 138, 216, 1);
    display: table;
    margin:10px 0 30px 0;
    font-size:15px;
}
</style>