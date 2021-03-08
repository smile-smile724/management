<!--  -->
<template>
  <div class="mainbox">
    <el-form
      ref="form"
      :model="form"
      label-width="150px"
      id="form"
    >
      <el-form-item
        label="项目类型"
        style="width:350px"
      >
        <el-select
          v-model="form.type"
          placeholder="请选择"
        >
          <el-option
            label="基础型"
            value="基础型"
          ></el-option>
          <el-option
            label="综合型"
            value="综合型"
          ></el-option>
          <el-option
            label="创新型"
            value="创新型"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="命题选题"
        style="width:350px"
      >
        <el-select
          v-model="form.gist"
          placeholder="请选择"
        >
          <el-option
            label="学生自选命题"
            value="学生自选命题"
          ></el-option>
          <el-option
            label="教师指定命题"
            value="教师指定命题"
          ></el-option>
          <el-option
            label="常规题库命题"
            value="常规题库命题"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="教师指定命题"
        style="width:500px"
        v-if="form.gist=='教师指定命题'"
      >
        <el-select
          v-model="form.typeName"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in list.teacher.filter(data => form.type||
                        data.type.toLowerCase().includes(form.type.toLowerCase()))"
            :key="index"
            :label="item.typeName"
            :value="item.typeName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="常规题库命题"
        style="width:500px"
        v-if="form.gist=='常规题库命题'"
      >
        <el-select
          v-model="form.typeName"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in list.admin.filter(data => 
                        data.type.toLowerCase().includes(form.type.toLowerCase()))"
            :key="index"
            :label="item.typeName"
            :value="item.typeName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="学生自选命题"
        style="width:500px"
        v-if="form.gist=='学生自选命题'"
      >
        <el-input
          v-model="form.typeName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="项目名称"
        style="width:500px"
      >
        <el-input
          v-model="form.projectName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="小组成员"
        style="height:270px;position:relative"
      >
        <ul id="table">
          <li>
            <span id="tit"></span>
            <span>姓名</span>
            <span>学号</span>
            <span>所属学院</span>
            <span>班级</span>
            <span>联系方式</span>
          </li>
          <li
            v-for="(item, index) in people"
            :key="index"
          >
            <span>学生 {{index+1}}</span>
            <input
              type="text"
              v-model="item.name"
            >
            <input
              type="text"
              v-model="item.account"
            >
            <input
              type="text"
              v-model="item.college"
            >
            <input
              type="text"
              v-model="item.classAndGrade"
            >
            <input
              type="text"
              v-model="item.telephone"
            >
          </li>
        </ul>
      </el-form-item>
      <el-form-item
        label="指导教师1"
        style="width:300px"
      >
        <el-input
          v-model="form.teacher1"
          placeholder="请输入教师工号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="指导教师2"
        style="width:300px"
        v-if="form.teacher1!=''"
      >
        <el-input
          v-model="form.teacher2"
          placeholder="请输入教师工号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="项目简介"
        style="height:130px"
      >
        <textarea
          v-model="form.intro"
          id="desc"
          placeholder="请输入"
        ></textarea>
      </el-form-item>
      <el-form-item label="申请资金">
        <el-col :span="6">
          <el-input
            v-model="form.fund"
            placeholder="请输入"
            style="width:200px"
          ></el-input>
        </el-col>
        <el-col
          class="line"
          :span="1"
        >元</el-col>
      </el-form-item>
      <el-form-item
        label="附件上传"
        style="width:520px;min-height:200px"
      >
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
          :auto-upload="false"
        >
          <el-button
            slot="trigger"
            size="small"
          >
            <i class='el-icon-plus'></i> 点击添加
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <div
          id="submit"
          @click="onSubmit"
        >提交</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  data() {
    return {
      form: {
        projectName: "",
        typeName: "",
        gist: "",
        type: "",
        teacher1: "",
        teacher2: "",
        intro: "",
        fund: "",
      },
      people: [
        {
          name: "",
          account: "",
          classAndGrade: "",
          college: "",
          telephone: "",
        },
        {
          name: "",
          account: "",
          classAndGrade: "",
          college: "",
          telephone: "",
        },
        {
          name: "",
          account: "",
          classAndGrade: "",
          college: "",
          telephone: "",
        },
        {
          name: "",
          account: "",
          classAndGrade: "",
          college: "",
          telephone: "",
        },
        {
          name: "",
          account: "",
          classAndGrade: "",
          college: "",
          telephone: "",
        },
      ],
      list: {
        teacher: [],
        admin: [],
      },
      regulation: {
        tel: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
        sno: /^\d{9}$/,
      },
      listNum: [],
      uploadNum: 0,
      fileList: [],
    };
  },
  methods: {
    getInfo() {
      var that = this;
      axios({
        method: "get",
        url: this.$host + "/manage_platform/query_project_type",
      })
        .then((response) => {
          var data = response.data;
          if (data.code == 12) {
            that.list.teacher = data.info.教师指定命题;
            that.list.admin = data.info.常规题库命题;
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function (error) {
          that.$message.error("连接失败，请检查网络");
        });
    },
    onSubmit() {
      this.uploadNum = this.$refs.upload.uploadFiles.length;
      if (this.uploadNum != 0) {
        this.$refs.upload.submit();
      } else {
        this.ProApply();
      }
    },
    ProApply() {
      var that = this;
      if (this.approval()) {
        this.form.applyFileArray = this.listNum.join(",");
        axios({
          method: "post",
          url: this.$host + "/manage_platform/project_apply",
          data: {
            project: that.form,
            studentList: that.people,
          },
        })
          .then((response) => {
            var data = response.data;
            that.listNum = [];
            if (data.code == 12) {
              that.$message({
                message: "项目申请成功",
                type: "success",
              });
            } else {
              this.$message.error(data.message);
            }
          })
          .catch(function (error) {
            that.$message.error("连接失败，请检查网络");
          });
      } else {
        that.$message.error("格式错误");
      }
    },
    approval() {
      for (var i = 0; i < this.people.length; i++) {
        if (
          !this.regulation.tel.test(this.people[i].telephone) &&
          this.people[i].telephone != ""
        ) {
          return false;
        }
        if (
          !this.regulation.sno.test(this.people[i].account) &&
          this.people[i].account != ""
        ) {
          return false;
        }
      }
      return true;
    },
    beforeUpload(file) {
      var that = this;
      var formData = new FormData();
      formData.append("file", file);
      var request = new XMLHttpRequest();
      request.open("POST", this.$host + "/manage_platform/up_file");
      request.onreadystatechange = function () {
        if (request.readyState == 4) {
          var data = JSON.parse(request.responseText);
          if (data.code == 12) {
            that.uploadNum--;
            that.listNum.push(data.info);
            if (that.uploadNum == 0) {
              that.ProApply();
            }
          }
        }
      };
      request.send(formData);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
  mounted() {
    this.getInfo();
  },
  watch: {
    "form.type": function (val) {
      var that = this;
      this.$nextTick(function () {
        that.form.typeName = "";
      });
    },
    "form.gist": function (val) {
      var that = this;
      this.$nextTick(function () {
        that.form.typeName = "";
      });
    },
  },
};
</script>
<style scoped>
.mainbox {
  min-width: 1200px;
  margin: 24px 200px 0 300px;
  padding: 34px 100px 34px 50px;
  min-height: 740px;
  position: relative;
  text-align: left;
  background-color: rgba(255, 255, 255, 1);
}
.mainbox /deep/ .el-form {
  max-width: 1000px;
}
.mainbox /deep/ .el-form-item {
  height: 40px;
}
#table {
  list-style: none;
  width: 100%;
  height: 240px;
  margin-bottom: 30px;
  position: relative;
  border-bottom: #dcdfe6 solid 1px;
  border-left: #dcdfe6 solid 1px;
  padding: 0;
}
#table li {
  position: relative;
  width: 16.6%;
  float: left;
}
#table li span {
  width: 99%;
  height: 39px;
  display: block;
  text-align: center;
  border: none;
  border-top: #dcdfe6 solid 1px;
  border-right: #dcdfe6 solid 1px;
}
#table li input {
  width: 99%;
  height: 39px;
  display: block;
  text-align: center;
  border: none;
  border-top: #dcdfe6 solid 1px;
  border-right: #dcdfe6 solid 1px;
  outline: none;
  padding: 0;
}
#desc {
  width: 100%;
  height: 100px;
  outline: none;
  resize: none;
  padding: 0 15px;
  font-size: 14px;
  -webkit-appearance: none;
  background-color: #ffffff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: #606266;
  display: inline-block;
  line-height: 40px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  font-family: 'element-icons'
}

#desc::-webkit-input-placeholder {
  color: #c0c4cc;
}
#desc::-moz-placeholder {
  color: #c0c4cc;
}
#desc:-ms-input-placeholder {
  color: #c0c4cc;
}
#desc::-ms-input-placeholder {
  color: #c0c4cc;
}
#desc::placeholder {
  color: #c0c4cc;
}
#submit {
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