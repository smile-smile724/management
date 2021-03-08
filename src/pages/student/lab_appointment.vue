<!--  -->
<template>
    <div class="mainbox">
        <el-form ref="form" :model="form" label-width="100px" id="form">
            <el-form-item label="项目选择" style="width:700px;height:40px;">
                <el-col :span="10">
                    <el-select v-model="form.pro" placeholder="请选择项目"  style="width:200px;">
                        <el-option v-for="(item, index) in proList" :key="index"
                        :label="item.projectName" :value="item.projectName"></el-option>
                    </el-select>
                </el-col>
                <el-col class="line" :span="8" style="color:rgba(212, 48, 48, 1);">* 无项目状态下不能预约实验室</el-col>
            </el-form-item>
            <el-form-item label="实验室选择" style="width:500px;height:40px;">
                <el-col :span="11">
                    <el-select v-model="form.lab" placeholder="请选择实验室"  style="width:380px;"  filterable   :filter-method="dataFilter">
                        <el-option v-for="(item, index) in labSearch" :key="index"
                        :label="item.labName +' - ' +item.place" :value="item.labName +' - ' + item.place"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="开始时间" style="width:500px;height:40px;">
                <el-col :span="12">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.start" style="width: 100%;"></el-date-picker>
                </el-col>
                <!-- <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                <el-col :span="11">
                    <el-time-picker placeholder="选择时间" v-model="form.start" style="width: 100%;"></el-time-picker>
                </el-col> -->
            </el-form-item>
            <el-form-item label="结束时间" style="width:500px;height:40px;">
                <el-col :span="12">
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
            <!-- <router-link to="#" id="link">
                <i class="el-icon-link" style="color:rgba(108, 138, 216, 1);margin-left:100px;"></i>
                <span>XXX实验室课表</span>
            </router-link> -->
            <el-form-item>
                <div id="submit" @click="onSubmit">提交</div>
            </el-form-item>
        </el-form>
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
                lab:'',
                start:'',
                end: ''
            },
            proList:[{}],
            labList:[{}],
            labSearch:[{}],
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
        getLab(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/lab_can_use'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.labList=data.info;
                    this.labSearch=data.info;
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
        onSubmit(){
            if(this.form.pro!=''){
                if(this.form.lab!=''){
                    if(this.form.end!=''&&this.form.start!=''){
                        if(this.form.end>this.form.start){
                            var choose;
                            for(var i=0;i<this.labList.length;i++){
                                if((this.labList[i].labName +' - ' +this.labList[i].place)==this.form.lab){
                                    choose=this.labList[i];
                                    break;
                                }
                            }
                            axios({
                                method: 'post',
                                url: this.$host+'/manage_platform/lab_apply',
                                data:{
                                    className:choose.className,
                                    type:choose.type,
                                    labName:choose.labName,
                                    place:choose.place,
                                    area:choose.area,
                                    property:choose.property,
                                    startDate:this.$moment(this.form.start).format('YYYY-MM-DD  HH:mm:ss'),
                                    endDate:this.$moment(this.form.end).format('YYYY-MM-DD  HH:mm:ss')
                                }
                            })
                            .then(response => {
                                var data=response.data;
                                if(data.code==12){
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(data.message);
                                }
                            })
                            .catch(function (error) {
                                this.$message.error('连接失败，请检查网络');
                            });
                        }else{
                            this.$message.error('请选择正确的申请时间');
                        }
                    }else{
                        this.$message.error('请选择要申请的时间');
                    }
                }else{
                    this.$message.error('请选择要申请的实验室');
                }
            }else{
                this.$message.error('请选择项目');
            }
        },
        dataFilter(val){
            this.value=val
            if(val){
                this.labSearch=this.labList.filter((item=>{
                    if (!!~(item.labName +' - ' +item.place).indexOf(val) || !!~(item.labName +' - ' +item.place).toUpperCase().indexOf(val.toUpperCase())) {
                         return true
                    }
                }))
            }else{
                this.labSearch=this.labList
            }
        },

    },
    mounted() {
        this.getPro();
        this.getLab();
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
#link{
    display: table;
	color: rgba(108, 138, 216, 1);
	font-size: 14px;
    margin-bottom:30px;
}
</style>