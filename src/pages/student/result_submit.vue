<!--  -->
<template>
    <div class="mainbox">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="提交内容" style="width:700px;">
                <el-select v-model="choose" placeholder="请选择"  style="width:200px;">
                    <el-option label="成果提交" value="成果提交"></el-option>
                    <el-option label="奖项申请" value="奖项申请"></el-option>
                    <el-option label="结题报告提交" value="结题报告提交"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目选择" style="width:700px;">
                <el-select v-model="form.pro" placeholder="请选择项目"  style="width:200px;">
                    <el-option  v-for="(item, index) in proList" :key="index"
                    :label="item.projectName" :value="item.projectName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="竞赛名称" style="width:500px" v-if="choose=='奖项申请'">
                <el-input v-model="form.awardName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="奖项" style="width:500px" v-if="choose=='奖项申请'">
                <el-input v-model="form.awardDetails" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="文件上传" style="width:320px;min-height:200px">
                <el-upload
                class="upload-demo"
                ref="upload"
                action="#"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="5"
                :on-exceed="handleExceed"
                :beforeUpload="beforeUpload"
                :file-list="fileList"
                :auto-upload="false">
                    <el-button slot="trigger" size="small">
                        <i class='el-icon-plus'></i> 点击添加
                    </el-button>
                </el-upload>
            </el-form-item>
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
                pro:'',
                awardName:'',
                awardDetails:'',
            },
            fileList: [],
            choose:'',
            proList:[],
            listNum:[],
            uploadNum:0
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
        onSubmit(){
            this.uploadNum=this.$refs.upload.uploadFiles.length;
            console.log(this.uploadNum)
            if(this.uploadNum!=0){
                this.$refs.upload.submit();
            }else{
                this.$message.error('请选择上传文件');
            }
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
                        that.listNum.push(data.info);
                        if(that.uploadNum==0){
                            that.SubmitAll()
                        }
                    }
                }
            }
            request.send(formData);
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
        SubmitAll(){
            var that=this;
            var pro;
            for(var i=0;i<this.proList.length;i++){
                if(this.proList[i].projectName==this.form.pro){
                    pro=this.proList[i];
                }
            }
            if(this.choose=='奖项申请'&&this.listNumlength!=0){
                if(this.form.awardDetails!=''&&this.form.awardName!=''){
                    axios({
                        method: 'post',
                        url: this.$host+'/manage_platform/submit_result',
                        data:{
                            projectId:pro.id,
                            fileId:this.listNum.join(','),
                            awardAchievement:{
                                award:1,
                                awardDetails:this.form.awardDetails,
                                awardName:this.form.awardName
                            }
                        }
                    })
                    .then(response => {
                        var data=response.data;
                        that.listNum=[];
                        if(data.code==12){
                            that.$message({
                                message: '奖项申请提交成功',
                                type: 'success'
                            });
                        }else{
                            this.$message.error(data.message);
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                        that.$message.error('连接失败，请检查网络');
                    });
                }else{
                    this.$message.error('请输入完整的奖项信息！');
                }
            }else if(this.choose=='成果提交'&&this.listNumlength!=0){
                axios({
                    method: 'post',
                    url: this.$host+'/manage_platform/submit_result',
                    data:{
                        projectId:pro.id,
                        fileId:this.listNum.join(','),
                        awardAchievement:{
                            award:0,
                            awardDetails:'',
                            awardName:''
                        }
                    }
                })
                .then(response => {
                 var data=response.data;
                    that.listNum=[];
                    if(data.code==12){
                        that.$message({
                            message: '成果提交成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(data.message);
                    }
                })
                .catch(function (error) {
                        console.log(error)
                    that.$message.error('连接失败，请检查网络');
                });
            }else if(this.choose=='结题报告提交'&&this.listNumlength!=0){
                axios({
                    method: 'post',
                    url: this.$host+'/manage_platform/end_file_up',
                    data:{
                        id:pro.id,
                        endFile:this.listNum.join(',')
                    }
                })
                .then(response => {
                 var data=response.data;
                    that.listNum=[];
                    if(data.code==12){
                        that.$message({
                            message: '结题报告提交成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(data.message);
                    }
                })
                .catch(function (error) {
                        console.log(error)
                    that.$message.error('连接失败，请检查网络');
                });
            }else{
                this.$message.error('请上传相关文件');
            }
        }
    },
    mounted() {
        this.getPro()
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
    height:200px;
    position: relative;
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
</style>