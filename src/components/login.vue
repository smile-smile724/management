<template>
  <div class="main">
    <div id="bg">
      <img src="../assets/login_bg.jpeg">
    </div>
    <div class="mainbox">
      <div id="login_pic">
        <img src="../assets/login_pic.jpg">
      </div>
      <div id="line"></div>
      <div id="content">
        <h1>开放性创新实验项目管理平台</h1>
        <input type="text" v-model="username"  placeholder="用户名" >
        <input type="password" v-model="password"  placeholder="密码" style='margin-bottom:5px;'>
        <img src="../assets/username.svg" style="top:148px;left:35px;">
        <img src="../assets/password.svg" style="top:207px;left:35px;">
        <span @click='dialogVisible=true' id='reg'>注册</span>
        <div id="identity">
          <label><input name="student" type="radio"  v-model="identity" value="student" />学生</label>
          <label><input name="teacher" type="radio"  v-model="identity" value="teacher" />教师</label>
          <label><input name="admin" type="radio"  v-model="identity" value="admin" />管理员</label>
        </div>
        <div id="login_btn" @click="Login">登录</div>
      </div>
    </div>

    <!-- 注册弹框 -->
    <el-dialog
      title="注册"
      :visible.sync="dialogVisible">
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
      }
    }
  },
  methods:{
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
  width: 900px;
	height: 400px;
	top: 200px;
  left:50%;
  margin-left:-450px;
	background-color: rgba(255, 255, 255, 1);
	border-radius: 70px;
	text-align: center;
  position: absolute;
}
#login_pic{
  width: 430px;
  height:100%;
  position: relative;
  border-radius: 70px 0 0 70px;
  overflow: hidden;
  float:left;
}
#login_pic img{
  width: 740px;
  height:100%;
	left: -154px;
  position: absolute;
}
#line{
  float: left;
  width:3px;
  height:200px;
  margin:100px 0 100px 40px;
  background-color: rgba(108, 138, 216, 1);
}
#content{
  width:370px;
  height:100%;
  float:right;
  margin-right:40px;
  position: relative;
}
#content h1{
  width: 100%;
	height: 30px;
  display: block;
	color: rgba(80, 80, 80, 1);
	font-size: 24px;
	line-height: 30px;
	text-align: center;
	font-weight: bold;
  margin:70px 0 40px 0;
}
#content input{
  width: 90%;
	height: 35px;
	color: rgba(80, 80, 80, 1);
	background-color: rgba(255, 255, 255, 1);
	border-radius: 12px;
	font-size: 16px;
	line-height: 30px;
	border: rgba(229, 229, 229, 1) solid 1px;
	text-align: left;
  text-indent: 50px;
  margin:0 5% 20px 5%;
  outline:none;
}
#content img{
  position: absolute;
  width:20px;
  height:20px;
}
#identity{
  width:100%;
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
  width: 90%;
	height: 35px;
  color: rgba(255, 255, 255, 1);
	background-color: rgba(108, 138, 216, 1);
	border-radius: 10px;
	font-size: 14px;
	line-height: 35px;
	text-align: center;
  cursor: pointer;
  margin: 5% 20px;
}
.main /deep/ .el-dialog{
    width:700px;
    position: relative;
}
.main /deep/ .el-dialog__header{
    box-shadow: 0px 5px 5px 0px rgba(229, 229, 229, 1);
}
.main /deep/ .el-dialog__title{
    color: rgba(108, 138, 216, 1);
	font-size: 22px;
}
#reg{
  color:rgba(108, 138, 216, 1);
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
  margin-left:280px;
}
</style>
