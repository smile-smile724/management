<!--  -->
<template>
    <div class="mainbox">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="项目类型" style="width:250px">
                <el-select v-model="form.region" placeholder="请选择">
                    <el-option label="基础型" value="基础型"></el-option>
                    <el-option label="综合型" value="综合型"></el-option>
                    <el-option label="创新型" value="创新型"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目命题" style="width:400px;">
                <el-input v-model="form.proposition" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="相关资料" style="width:420px;min-height:200px">
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
                :file-list="fileList"
                :auto-upload="false">
                    <el-button slot="trigger" size="small">
                        <i class='el-icon-plus'></i> 点击添加
                    </el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <div id="submit" @click="submitUpload">发布</div>
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
                region:'',
                proposition:''
            },
            fileList: [],
            uploadNum:0,
            listNum:[]
        }
    },
    methods:{
        submitUpload() {
            this.uploadNum=this.$refs.upload.uploadFiles.length;
            this.$refs.upload.submit();
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
                            that.SubmitPro()
                        }
                    }
                }
            }
            request.send(formData);
        },
        SubmitPro(){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/teacher_add_project_type',
                data:{
                    type:that.form.region,
                    gist:"教师指定命题",
                    typeName:that.form.proposition,
                    fileArray:this.listNum.join(',')
                }
            })
            .then(response => {
                var data=response.data;
                console.log(response)
                if(data.code==12){
                    that.$message({
                        message: '项目命题发布成功！',
                        type: 'success'
                    });
                    that.dialogVisible=false;
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
        }
    },
    mounted() {

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