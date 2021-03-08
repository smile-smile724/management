<!--  -->
<template>
    <div class="mainbox">
        <!-- 表单 -->
        <el-form ref="form" :model="form" label-width="100px" id="form">
            <el-form-item label="项目选择" style="width:700px;height:40px;">
                <el-col :span="10">
                    <el-select v-model="form.pro" placeholder="请选择项目"  style="width:200px;">
                        <el-option  v-for="(item, index) in proList" :key="index"
                        :label="item.projectName" :value="item.projectName"></el-option>
                    </el-select>
                </el-col>
                <el-col class="line" :span="8" style="color:rgba(212, 48, 48, 1);">* 无项目状态下不能预约设备</el-col>
            </el-form-item>
            <el-form-item label="设备选择" style="width:600px;height:40px;">
                <el-col>
                    <el-tag
                    v-for="(tag, index) in form.equipment"
                    :key="index"
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                    style="margin:0 5px">
                    {{tag.name}}
                    </el-tag>
                    <el-button @click="dialogVisible=true">+</el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="开始时间" style="width:500px;height:40px;">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.start" style="width: 100%;"></el-date-picker>
                </el-col>
                <!-- <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                <el-col :span="11">
                    <el-time-picker placeholder="选择时间" v-model="form.start" style="width: 100%;"></el-time-picker>
                </el-col> -->
            </el-form-item>
            <el-form-item label="结束时间" style="width:500px;height:40px;">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.end" style="width: 100%;"></el-date-picker>
                </el-col>
                <!-- <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                <el-col :span="11">
                    <el-time-picker placeholder="选择时间" v-model="form.end" style="width: 100%;"></el-time-picker>
                </el-col> -->
            </el-form-item>
            <!-- <el-form-item label="使用用途" style="height:130px">
                <textarea v-model="form.desc" id="desc"  placeholder="请输入，至多100字。"></textarea>
            </el-form-item> -->
            <el-form-item>
                <div id="submit" @click="onSubmit">提交</div>
            </el-form-item>
        </el-form>

        <!-- 弹窗 -->
        <el-dialog title="添加设备" :visible.sync="dialogVisible">
            <div id="add_equip">
                <div id="search_equip">
                    <span style="display:inline-block;">设备名称：</span>
                    <el-input v-model="input" placeholder="请输入内容" style="display:inline-block;width:300px;"></el-input>
                    <div id="sure_btn" @click="Search">确定</div>
                    <div id="exit_btn" @click="Exit">取消</div>
                </div>
                <div id="tip">
                    <i class="el-icon-warning" style="margin-left:11px;"></i>
                    <span style="margin-left:6px;color:rgba(0, 0, 0, 0.65);">已选择{{form.equipment.length}}项</span>
                    <span style="margin-left:22px;color:rgba(108, 138, 216, 1);cursor: pointer;" @click='clear()'>清空</span>
                </div>
                <el-table
                ref="multipleTable"
                :data="data"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
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
                </el-table>
                <el-pagination
                :page-size="pagesize"
                @current-change="currentChange"
                layout="total,prev, pager, next, jumper"
                background
                :total="tableData.filter(data => !search
                || data.name.toLowerCase().includes(search.toLowerCase())).length"
                style="text-align:right;margin:20px 0;">
                </el-pagination>
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
            form: {
                pro: '',
                equipment:[],
                start:'',
                end: ''
            },
            dialogVisible: false,
            search:'',
            input:'',
            tableData: [],
            data:[],
            equipment:[],
            pagesize:6,
            currentPage: 1,
            SearchFlag:false,
            proList:[{}]
        }
    },
    methods:{
        getPro(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/student_project_success'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.proList=data.info.map(obj => {return obj.project});
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
        getEqu(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/equ_can_use'
            })
            .then(response => {
                var data=response.data;
                console.log(data)
                if(data.code==12){
                    this.tableData=data.info;
                    this.data=this.tableData.filter(data => !this.search
                    || data.name.toLowerCase().includes(this.search.toLowerCase()))
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
        handleClose(tag) {
            this.form.equipment.splice(this.form.equipment.indexOf(tag), 1);
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
                    || data.name.toLowerCase().includes(this.search.toLowerCase()))
                    .slice((currentPage-1)*this.pagesize,currentPage*this.pagesize);
        },
        clear(){
            this.toggleSelection();
            this.form.equipment=[]
        },
        Search(){
            this.search=this.input;
            this.currentPage=1;
            this.data=this.tableData.filter(data => !this.search
                    || data.name.toLowerCase().includes(this.search.toLowerCase()))
                    .slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);
            this.SearchFlag=true;
        },
        Exit(){
            this.input='';
            this.Search();
        },
        onSubmit(){
            if(this.form.pro!=''){
                if(this.form.equipment.length!=0){
                    if(this.form.end!=''&&this.form.start!=''){
                        if(this.form.end>this.form.start){
                            for(var i=0;i<this.form.equipment.length;i++){
                                this.approvalOne(this.form.equipment[i])
                            }
                        }else{
                            this.$message.error('请选择正确的申请时间');
                        }
                    }else{
                        this.$message.error('请选择要申请的时间');
                    }
                }else{
                    this.$message.error('请选择要申请的设备');
                }
            }else{
                this.$message.error('请选择项目');
            }
        },
        approvalOne(choose){
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/equ_apply',
                data:{
                    modelName:choose.modelName,
                    name:choose.name,
                    serialNumber:choose.serialNumber,
                    labName:choose.labName,
                    labPlaceName:choose.labPlaceName,
                    startDate:this.$moment(this.form.start).format('YYYY-MM-DD HH:mm:ss'),
                    endDate:this.$moment(this.form.end).format('YYYY-MM-DD HH:mm:ss'),
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code!=12){
                    this.$message.error(choose.name+'：'+data.message);
                }else{
                    this.$message({
                        message: choose.name+'：提交申请成功',
                        type: 'success'
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
            });
        }
    },
    mounted() {
        this.getPro();
        this.getEqu();
    },
    watch:{
        equipment(newVal,oldVal){
            if(newVal.length>oldVal.length&&newVal!=0){
                for(var i=oldVal.length;i<newVal.length;i++){
                    if(this.form.equipment.indexOf(this.equipment[i])==-1){
                        this.form.equipment.push(this.equipment[i]);
                    }
                }
            }else if(newVal.length<oldVal.length&&newVal!=0){
                for(var i=0;i<oldVal.length;i++){
                    if(newVal.indexOf(oldVal[i])==-1){
                        this.form.equipment.splice(this.form.equipment.indexOf(oldVal[i]),1);
                    }
                }
            }else if(newVal==0){
                if(this.data.indexOf(oldVal[0])!=-1&&!this.SearchFlag){
                    this.form.equipment.splice(this.form.equipment.indexOf(oldVal[0]), oldVal.length-newVal.length)
                } else if(this.SearchFlag){
                    this.SearchFlag=!this.SearchFlag;
                }
            }
        },
        'data':function (val) {
            this.$nextTick(function () {
                for(var i=0;i<this.form.equipment.length;i++){
                    if(this.data.indexOf(this.form.equipment[i])!=-1){
                        this.equipment.push(this.form.equipment[i]);　
                        this.$refs.multipleTable.toggleRowSelection(this.$refs.multipleTable.data[this.data.indexOf(this.form.equipment[i])],true);
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
    padding:34px 100px 34px 50px;
    min-height:740px;
    position: relative;
    text-align: left;
    background-color: rgba(255, 255, 255, 1);
}
.mainbox /deep/ .el-form{
    max-width:1000px;
}
.mainbox /deep/ .el-form-item{
    height:40px;
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
}
#desc{
    width:100%;
    height:100px;
    outline: none;
    resize: none;
    border:#DCDFE6 solid 1px;
    padding:10px;
    border-radius: 10px;
    font-size:15px;
}
#add_equip{
    width:80%;
    margin:30px 10%;
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
#add_btn{
    width: 100px;
	height: 35px;
	color: rgba(255, 255, 255, 1);
	background-color: rgba(108, 138, 216, 1);
	border-radius: 4px;
	font-size: 13px;
	line-height: 35px;
	text-align: center;
	float:right;
}
</style>