<template>
  <div class="main">
    <div id="bg">
      <img src="../assets/login_bg.jpeg">
    </div>
    <div class="mainbox">
      <div id="title">
        <h2>开放性创新实验项目管理平台</h2>
        <span>Open innovation experiment project management platform</span>
      </div>
      <div id="box">
        <div id="notice_list">
          <span>公告</span>
            <el-table
            ref="multipleTable"
            :data="tableData.slice((currentPage-1)*this.pagesize,currentPage*this.pagesize)"
            tooltip-effect="dark"
            style="width: 100%;"
            @row-click="openDetails">
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
            </el-table>
            <el-pagination
            :page-size="pagesize"
            @current-change="currentChange"
            layout="total,prev, pager, next, jumper"
            background
            :total="tableData.length"
            style="text-align:right;margin:20px 0;">
            </el-pagination>
        </div>
        <img src="../assets/login_pic2.jpg">
      </div>
      <div id="content">
        <h1>用户登录</h1>
        <input type="text" v-model="username"  placeholder="用户名" >
        <input type="password" v-model="password"  placeholder="密码" style='margin-bottom:5px;'>
        <img src="../assets/username.svg" style="top:129px;left:45px;">
        <img src="../assets/password.svg" style="top:188px;left:45px;">
        <div id="identity">
          <label><input name="student" type="radio"  v-model="identity" value="student" />学生</label>
          <label><input name="teacher" type="radio"  v-model="identity" value="teacher" />教师</label>
          <label><input name="admin" type="radio"  v-model="identity" value="admin" />管理员</label>
        </div>
        <div id="login_btn" @click="Login">登录</div>
        <div @click='dialogVisible=true' id="login_btn" style="background-color: rgba(229, 229, 229, 1);color:rgba(108, 138, 216, 1)">注册</div>
      </div>
    </div>

    <!-- 注册弹框 -->
    <el-dialog title="注册" :visible.sync="dialogVisible" id="dialog_01">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules"
      style="text-align:left;margin:20px 15% 0 15%;">
        <el-form-item label="用户身份：" prop="identity">
          <el-select v-model="form.identity" placeholder="请选择">
            <el-option label="教师" value="teacher"></el-option>
            <el-option label="学生" value="student"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号：" v-if="form.identity=='teacher'" prop="tno">
          <el-input v-model="form.tno"></el-input>
        </el-form-item>
        <el-form-item label="学号：" prop="sno" v-if="form.identity=='student'">
          <el-input v-model="form.sno"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="sname">
          <el-input v-model="form.sname"></el-input>
        </el-form-item>
        <el-form-item label="学院：" prop="college">
          <el-input v-model="form.college"></el-input>
        </el-form-item>
        <el-form-item :label="form.identity=='student'?'班级：':'职称：'" prop="class"
        v-if="form.identity!=''">
          <el-input v-model="form.class"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="form.snum"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="form.mail"></el-input>
        </el-form-item>
        <el-form-item label="设置密码：" prop="scode">
          <el-input type="password" v-model="form.scode"></el-input>
        </el-form-item>
        <el-form-item label="重复密码：" prop="recode">
          <el-input type="password" v-model="form.recode"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">注册</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog title="公告" :visible.sync="Visible" id="dialog_02">
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
  data () {
    return {
      username:'',
      password:'',
      identity:'',
      dialogVisible: false,
      form:{
        identity:'',
        sno:'',
        sname:'',
        college:'',
        class:'',
        snum:'',
        mail:'',
        scode:'',
        recode:'',
        tno:''
      },
      rules:{
        identity:[
          { required: true, message: '请输入您的身份', trigger: 'blur' }
        ],
        sno:[
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^\d{9}$/, message: '学号不正确', trigger: 'blur' }
        ],
        class:[
          { required: true, message: '必填', trigger: 'blur' }
        ],
        college:[
          { required: true, message: '必填', trigger: 'blur' }
        ],
        sname:[
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        scode:[
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        recode:[
          { required: true, message: '请重复密码', trigger: 'blur' }
        ],
        tno:[
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      regulation:{
        mail:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        tel:/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
        sno:/^\d{9}$/
      },
      pagesize:8,
      currentPage: 1,
      tableData: [],
      Visible:false,
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
        }else{
          this.$message.error(data.message);
        }
      })
      .catch(function (error) {
        that.$message.error('连接失败，请检查网络');
      });
    },
    StudentLogin(){
      var that= this;
      axios({
        method: 'post',
        url: this.$host+'/manage_platform/student_login',
        data:{
          account:that.username,
          password:that.password
        }
      })
      .then(response => {
        var data=response.data;
        if(data.code==1){
          that.setCookie( 'username' ,data.info,365 * 24 * 60 * 60 * 1000);
          that.setCookie( 'account' ,that.username,365 * 24 * 60 * 60 * 1000);
          that.$message({
            message: '用户'+data.info+'登陆成功',
            type: 'success'
          });
          that.$router.push({path:'/student/index'})
        }else{
          that.$message.error(data.message);
        }
      })
      .catch(function (error) {
        that.$message.error('连接失败，请检查网络');
      });
    },
    TeacherLogin(){
      var that= this;
      axios({
        method: 'post',
        url: this.$host+'/manage_platform/teacher_login',
        data:{
          account:that.username,
          password:that.password
        }
      })
      .then(response => {
        var data=response.data;
        if(data.code==1){
          that.setCookie( 'username' ,data.info,365 * 24 * 60 * 60 * 1000);
          that.setCookie( 'account' ,that.username,365 * 24 * 60 * 60 * 1000);
          that.$message({
            message: '用户'+data.info+'登陆成功',
            type: 'success'
          });
          that.$router.push({path:'/teacher/index'})
        }else{
          that.$message.error(data.message);
        }
      })
      .catch(function (error) {
        that.$message.error('连接失败，请检查网络');
      });
    },
    AdminLogin(){
      var that= this;
      axios({
        method: 'post',
        url: this.$host+'/manage_platform/admin_login',
        data:{
          account:that.username,
          password:that.password
        }
      })
      .then(response => {
        var data=response.data;
        if(data.code==1){
          that.setCookie( 'username' ,'管理员',365 * 24 * 60 * 60 * 1000);
          that.$message({
            message: '管理员登陆成功',
            type: 'success'
          });
          that.$router.push({path:'/admin/index'})
        }else{
          that.$message.error(data.message);
        }
      })
      .catch(function (error) {
        that.$message.error('连接失败，请检查网络');
      });
    },
    Login(){
      if(this.identity=='admin'){
        this.AdminLogin();
      }else if(this.identity=='student'){
        this.StudentLogin();
      }else if(this.identity=='teacher'){
        this.TeacherLogin();
      }else{
        this.$message.error('请选择登录身份');
      }
    },
    StudentRegister(){
      var that= this;
      axios({
        method: 'post',
        url: this.$host+'/manage_platform/student_register',
        data:{
          account:that.form.sno,
          name:that.form.sname,
          password:that.form.scode,
          college:that.form.college,
          classAndGrade:that.form.class,
          telephone:that.form.snum,
          mail:that.form.mail
        }
      })
      .then(response => {
        var data=response.data;
        if(data.code==12){
          that.$message({
            message: '注册成功',
            type: 'success'
          });
          that.dialogVisible=false;
        }else{
          that.$message.error(data.message);
        }
      })
      .catch(function (error) {
        that.$message.error('连接失败，请检查网络');
      });
    },
    TeacherRegister(){
      var that= this;
      axios({
        method: 'post',
        url: this.$host+'/manage_platform/teacher_register',
        data:{
          account:that.form.tno,
          name:that.form.sname,
          password:that.form.scode,
          college:that.form.college,
          officeHolder:that.form.class,
          telephone:that.form.snum,
          mail:that.form.mail
        }
      })
      .then(response => {
        var data=response.data;
        that.$message(data.info);
        that.dialogVisible=false;
      })
      .catch(function (error) {
        that.$message.error('连接失败，请检查网络');
      });
    },
    submitForm(formName) {
      var that=this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(that.form.scode==that.form.recode){
            if(that.regulation.mail.test(that.form.mail)||that.form.mail==''){
              if(that.regulation.tel.test(that.form.snum)||that.form.snum==''){
                if(that.form.identity=='teacher'){
                  that.TeacherRegister();
                }else if(that.form.identity=='student'){
                  that.StudentRegister();
                }
              }else{
                that.$message.error('手机格式错误');
              }
            }else{
              that.$message.error('邮箱格式错误');
            }
          }else{
            that.$message.error('两次密码输入不同');
          }
        } else {
          that.$message.error('请输入完整的信息');
          return false;
        }
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
    currentChange(currentPage){
      this.currentPage = currentPage;
    },
    openDetails(row){
      this.Visible=true;
      this.msg=row;
    },
  },
  mounted(){
    this.getInfo();
  }
}
</script>

<style scoped>
.main,#bg{
  width:100%;
  height:100%;
  position:relative;
}
#bg img{
  width:100%;
  height:100%;
  display: block;
}
.mainbox{
  width: 1300px;
	height: 650px;
	top: 50%;
  margin-top:-350px;
  left:50%;
  margin-left:-650px;
	text-align: center;
  position: absolute;
}
#title span{
	color: rgba(255, 255, 255, 1);
	font-size: 15px;
	text-align: left;
	font-weight: bold;
  display: block;
}
#title h2{
	color: rgba(255, 255, 255, 1);
	font-size: 26px;
	text-align: left;
	font-weight: bold;
  margin:0;
}
#notice_list{
  height:90%;
  width:53%;
  position: absolute;
  top:5%;
  left:40px;
}
#notice_list span{
  width:80px;
  height:30px;
  display: block;
	font-size: 18px;
  line-height: 30px;
	text-align: center;
  border-left: rgba(108, 138, 216, 1) 5px solid;
	font-weight: bold;
}
#box{
  width:100%;
  height:90%;
  opacity: 0.93;
	color: rgba(80, 80, 80, 1);
	background-color: rgba(255, 255, 255, 1);
	font-size: 14px;
	box-shadow: 0px 18px 18px 0px rgba(0, 0, 0, 0.5);
	text-align: center;
  margin-top:20px;
  position: relative;
}
#box img{
  height:82%;
  float:right;
  margin-top:8%;
}
#content{
  width:420px;
	height: 400px;
  top:40px;
  right:60px;
  position: absolute;
	border-radius: 50px;
	opacity: 0.96;
  background-color: rgba(255, 255, 255, 1);
	box-shadow: 0px 18px 18px 0px rgba(0, 0, 0, 0.5);
}
#content h1{
  width: 100%;
	height: 30px;
  display: block;
	color: rgba(108, 138, 216, 1);
	font-size: 24px;
	line-height: 30px;
	text-align: center;
	font-weight: bold;
  margin:50px 0 40px 0;
}
#content input{
  width: 360px;
	height: 35px;
	color: rgba(80, 80, 80, 1);
	background-color: rgba(255, 255, 255, 1);
	border-radius: 12px;
	font-size: 16px;
	line-height: 30px;
	border: rgba(229, 229, 229, 1) solid 1px;
	text-align: left;
  text-indent: 50px;
  margin:0 auto 20px auto;
  outline:none;
}
#content img{
  position: absolute;
  width:20px;
  height:20px;
}
#identity{
  width:100%;
  margin-top:10px;
}
#identity input{
  -webkit-appearance: none;
  width:15px;
  height:15px;
  padding:0;
  border: 1px solid #3151BF;
  border-radius: 0;
  outline: none;
  margin: 5px 8px 5px 0;
  cursor: pointer;
  float: left;
}
#identity input:checked{
  background:url("../assets/choose.png") no-repeat 0.5px 0;
  background-size: 12px 12px;
  border: 1px solid #3151BF;
}
#identity label{
  width:60px;
  font-size: 10px;
  color:black;
  display:inline-flex;
  flex-direction:row;
  align-items:center;
  margin:0 10px 0 10px;
  cursor: pointer;
}
#login_btn{
  width: 360px;
	height: 35px;
  color: rgba(255, 255, 255, 1);
	background-color: rgba(108, 138, 216, 1);
	border-radius: 10px;
	font-size: 15px;
	line-height: 35px;
	text-align: center;
  cursor: pointer;
  margin: 15px auto;
}
#dialog_01 /deep/ .el-dialog{
    width:700px;
    position: relative;
}
#dialog_02 /deep/ .el-dialog{
    width:70%;
    min-width:1000px;
    position: relative;
}
.main /deep/ .el-dialog__header{
    box-shadow: 0px 5px 5px 0px rgba(229, 229, 229, 1);
}
.main /deep/ .el-dialog__title{
    color: rgba(108, 138, 216, 1);
	font-size: 22px;
}
#notice{
    width:90%;
    margin:0 auto;
    text-align: left;
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
