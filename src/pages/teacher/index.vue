<template>
  <div class='mainbox'>

    <!-- 数据统计 -->
    <div id="text">
      <i></i>
      <span>数据统计</span>
    </div>
    <div id="pie">
      <div
        id="main"
        style="float:left;width:376px;height: 250px"
      ></div>
      <span>当前：{{search}}</span>
    </div>
    <div id="line"></div>
    <div id="table">
      <div id="search_pro">
        <span style="display:inline-block;">选择竞赛名称：</span>
        <el-select
          v-model="search"
          placeholder="请选择项目"
          style="display:inline-block;width:300px;"
        >
          <el-option
            v-for="(item, index) in List"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <el-table
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        style="width: 100%;margin-top:40px"
        v-if="search!='全部竞赛'"
      >
        <el-table-column
          prop="projectName"
          label="项目名称"
        >
        </el-table-column>
        <el-table-column
          prop="number1"
          label="项目负责人"
        >
        </el-table-column>
        <el-table-column
          prop="teacher"
          label="指导老师"
        >
        </el-table-column>
        <el-table-column
          prop="result"
          label="获奖情况"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pagesize"
        @current-change="currentChange"
        layout="total,prev, pager, next, jumper"
        background
        :total="tableData.length"
        style="text-align:right;margin:20px 0;"
        v-if="search!='全部竞赛'"
      >
      </el-pagination>
    </div>

    <!-- 指导项目进度 -->
    <div
      id="text"
      style='margin-top:62px;'
    >
      <i></i>
      <span>指导项目进度</span>
    </div>
    <div id="content_search">
      <i
        class="el-icon-search"
        style="cursor: pointer;"
        @click="proSearch"
      ></i>
      <input
        v-model="pro_input"
        placeholder="请输入项目名称"
      >
    </div>
    <div id="pro_table">
      <el-table
        :data="project.filter(data => !Pro_search
                || data.project.projectName.toLowerCase().includes(Pro_search.toLowerCase()))
            .slice((ProPage-1)*pagesize,ProPage*pagesize)"
        style="width:100%"
        @row-click="openDetails"
      >
        <el-table-column
          prop="project.projectName"
          label="项目名称"
        >
        </el-table-column>
        <el-table-column
          prop="studentList[0].name"
          label="项目负责人"
        >
        </el-table-column>
        <el-table-column
          prop="project.state"
          label="项目进度"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.project.state == '待审批'"
              style="color:blue;"
              slot="reference"
            >审核中</span>
            <span
              v-if="scope.row.project.state == '审批不通过'"
              style="color:red;"
              slot="reference"
            >已拒绝</span>
            <span
              v-if="scope.row.project.state == '审批通过'"
              style="color:green;"
              slot="reference"
            >已通过</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pagesize"
        background
        @current-change="Prochange"
        layout="total, prev, pager, next, jumper"
        :total="project.filter(data => !Pro_search
                || data.project.projectName.toLowerCase().includes(Pro_search.toLowerCase()))
            .length"
        style="margin-top:20px"
      >
      </el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      title="项目进度查看"
      :visible.sync="dialogVisible"
    >
      <div id="pro_Approval">
        <div id="pro_table_01">
          <el-form
            ref="form"
            :model="form"
            label-width="100px"
            id="form"
          >
            <el-form-item label="项目类型:">
              <span>{{form.project.type}}</span>
            </el-form-item>
            <el-form-item label="命题选题:">
              <span>{{form.project.gist}}</span>
            </el-form-item>
            <el-form-item label="命题:">
              <span>{{form.project.typeName}}</span>
            </el-form-item>
            <el-form-item label="项目名称:">
              <span>{{form.project.projectName}}</span>
            </el-form-item>
            <el-form-item
              label="小组成员:"
              style="height:270px;position:relative"
            >
              <ul id="table_01">
                <li>
                  <span id="tit"></span>
                  <span>姓名</span>
                  <span>学号</span>
                  <span>所属学院</span>
                  <span>班级</span>
                  <span style=" border-bottom: #DCDFE6 solid 1px;">联系方式</span>
                </li>
                <li
                  v-for="(item, index) in form.studentList"
                  :key="index"
                >
                  <span>学生 {{index+1}}</span>
                  <span>{{item.name}}</span>
                  <span>{{item.account}}</span>
                  <span>{{item.classAndGrade}}</span>
                  <span>{{item.college}}</span>
                  <span style=" border-bottom: #DCDFE6 solid 1px;">{{item.telephone}}</span>
                </li>
              </ul>
            </el-form-item>
            <el-form-item
              label="指导教师 1:"
              style="width:300px"
              v-if="form.teacherList.length!=0"
            >
              <span>{{form.teacherList[0].name}}（{{form.teacherList[0].account}}）</span>
            </el-form-item>
            <el-form-item
              label="指导教师 2:"
              style="width:300px"
              v-if="form.teacherList.length==2"
            >
              <span>{{form.teacherList[1].name}}（{{form.teacherList[1].account}}）</span>
            </el-form-item>
            <el-form-item
              label="项目简介:"
              style="height:130px"
            >
              <span id="desc">{{form.project.intro}}</span>
            </el-form-item>
            <el-form-item label="申请资金:">
              <el-col :span="2">
                <span>{{form.project.fund}}</span>
              </el-col>
              <el-col
                class="line"
                :span="1"
              >元</el-col>
            </el-form-item>
            <el-form-item
              label="附件:"
              v-if="form.fileUrl.length!=0"
            >
              <a
                v-for="(item,index) in form.fileUrl"
                :href="item"
                :download="changeAddress(item)"
                :key="index"
              >
                <i class="el-icon-link"></i>{{changeAddress(item)}}</a>
            </el-form-item>
          </el-form>
        </div>
        <div id="pro_box">
          <el-form
            :model="form"
            label-width="100px"
          >
            <el-form-item label="审批结果:">
              <span>{{form.project.state}}</span>
            </el-form-item>
            <el-form-item
              label="审批原因:"
              v-if="form.project.state != '待审批'"
            >
              <span style="width:100%;text-align:left">{{form.project.reason==''?'无':form.project.reason}}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");

import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  data() {
    return {
      search: "",
      tableData: [],
      data: {},
      project: [],
      pagesize: 6,
      currentPage: 1,
      List: ["全部竞赛"],
      ProPage: 1,
      Pro_search: "",
      pro_input: "",
      dialogVisible: false,
      form: {
        project: {},
        studentList: [{}],
        teacherList: [{}],
        fileUrl: [],
      },
    };
  },
  methods: {
    initData(info) {
      var myChart = echarts.init(document.getElementById("main"));
      // 绘制图表
      var infoData = [];
      for (var key in info) {
        var i = { value: info[key], name: key };
        infoData.push(i);
      }
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          bottom: "bottom",
          data: ["一等奖", "二等奖", "三等奖", "未获奖"],
        },
        series: [
          {
            name: "获奖情况",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: infoData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.data = this.tableData
        .filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(this.search) > -1;
          });
        })
        .slice((currentPage - 1) * this.pagesize, currentPage * this.pagesize);
    },
    proSearch() {
      this.ProPage = 1;
      this.Pro_search = this.pro_input;
    },
    Prochange: function (currentPage) {
      this.ProPage = currentPage;
    },
    getInfo(name) {
      var that = this;
      axios({
        method: "post",
        url: this.$host + "/manage_platform/award_query",
        data: {
          awardName: name,
        },
      })
        .then((response) => {
          var data = response.data;
          if (data.code == 12) {
            this.data = data.info.stat;
            this.tableData = data.info.details;
            this.initData(this.data);
          } else if (data.code == 10) {
            this.$message.error(data.message);
            this.$router.push({ path: "/" });
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function (error) {
          that.$message.error("连接失败，请检查网络");
        });
    },
    getList() {
      var that = this;
      axios({
        method: "get",
        url: this.$host + "/manage_platform/competition_name",
      })
        .then((response) => {
          var data = response.data;
          if (data.code == 12) {
            this.List = this.List.concat(data.info);
            if (this.List.length != 0) {
              this.search = this.List[0];
            }
          } else if (data.code == 10) {
            this.$message.error(data.message);
            this.$router.push({ path: "/" });
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function (error) {
          that.$message.error("连接失败，请检查网络");
        });
    },
    getAll() {
      var that = this;
      axios({
        method: "get",
        url: this.$host + "/manage_platform/stat_award",
      })
        .then((response) => {
          var data = response.data;
          if (data.code == 12) {
            this.data = data.info;
            this.tableData = data.info;
            this.initChart(this.data);
          } else if (data.code == 10) {
            this.$message.error(data.message);
            this.$router.push({ path: "/" });
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function (error) {
          that.$message.error("连接失败，请检查网络");
        });
    },
    getProgress() {
      var that = this;
      axios({
        method: "get",
        url: this.$host + "/manage_platform/query_project_progress",
      })
        .then((response) => {
          var data = response.data;
          if (data.code == 12) {
            this.project = data.info;
          } else if (data.code == 10) {
            this.$message.error(data.message);
            this.$router.push({ path: "/" });
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function (error) {
          that.$message.error("连接失败，请检查网络");
        });
    },
    openDetails(row) {
      this.dialogVisible = true;
      this.form = row;
    },
    changeAddress(item) {
      var str = item.split("/");
      // console.log(str)
      return str[str.length - 1];
    },
    initChart(info) {
      var myChart = echarts.init(document.getElementById("main"));
      // 绘制图表
      var infoData = [];
      var num = [];
      for (var i = 0; i < info.length; i++) {
        var chartData = {
          value: info[i]["count(*)"],
          name: info[i].award_name,
        };
        infoData.push(chartData);
        num.push(info[i].award_name);
      }
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          bottom: "bottom",
          data: num,
        },
        series: [
          {
            name: "获奖情况",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: infoData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
  },
  mounted() {
    this.getList();
    this.getProgress();
  },
  watch: {
    search: function (val) {
      var that = this;
      this.$nextTick(function () {
        if (val == "全部竞赛") {
          this.getAll();
        } else {
          that.getInfo(val);
        }
      });
    },
  },
};
</script>
<style scoped>
.mainbox {
  min-width: 1230px;
  margin: 24px 200px 0 300px;
  padding: 34px 70px 34px 50px;
  min-height: 1270px;
  /* min-height:740px; */
  position: relative;
  text-align: left;
  background-color: rgba(255, 255, 255, 1);
}
#text {
  width: 100%;
  float: left;
  height: 30px;
}
#text span {
  float: left;
  height: 30px;
  color: rgba(112, 111, 111, 1);
  font-size: 18px;
  line-height: 30px;
  text-align: left;
}
#text i {
  width: 3px;
  height: 3px;
  float: left;
  border-radius: 10px;
  background-color: rgba(108, 138, 216, 1);
  margin: 13.5px 22px 13.5px 0;
}
#pie {
  float: left;
  width: 376px;
}
#main {
  margin-top: 140px;
}
#pie span {
  width: 100%;
  text-align: center;
  display: block;
  float: left;
  color: rgba(80, 80, 80, 1);
  font-size: 14px;
  line-height: 21px;
  margin-top: 30px;
}
#line {
  float: left;
  width: 4px;
  height: 220px;
  background-color: rgba(108, 138, 216, 1);
  margin-top: 200px;
}
#table {
  width: 59%;
  height: 470px;
  box-shadow: 0px 10px 10px 0px rgba(229, 229, 229, 1);
  padding: 40px;
  float: right;
  margin-top: 40px;
}
#sure_btn {
  width: 67px;
  height: 40px;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(108, 138, 216, 1);
  border-radius: 4px;
  font-size: 14px;
  line-height: 40px;
  display: inline-block;
  text-align: center;
  margin-left: 20px;
  cursor: pointer;
}
#exit_btn {
  width: 67px;
  height: 40px;
  color: rgba(80, 80, 80, 1);
  background-color: rgba(255, 255, 255, 1);
  border-radius: 4px;
  font-size: 13px;
  line-height: 40px;
  display: inline-block;
  border: rgba(229, 229, 229, 1) solid 1px;
  text-align: center;
  margin-left: 10px;
  cursor: pointer;
}
.mainbox /deep/ .el-form {
  width: 90%;
  margin: 0 auto;
  padding-top: 40px;
  text-align: left;
}
.mainbox /deep/ .el-form-item {
  height: 40px;
}
.mainbox /deep/ .el-form-item__label {
  text-align: left;
  color: rgba(108, 138, 216, 1);
}
#content_search {
  margin: 50px 10% 10px 10%;
  font-size: 20px;
  height: 34px;
  line-height: 30px;
  float: left;
}
#content_search span {
  width: 45px;
  height: 22px;
  color: rgba(108, 138, 216, 1);
  font-size: 16px;
  text-align: left;
}
#content_search i {
  float: right;
  margin: 7px 10px 0 10px;
}
.mainbox input {
  width: 250px;
  height: 30px;
  float: right;
  line-height: 30px;
  border: 1px solid rgba(204, 204, 204, 1);
  font-size: 12px;
  border-radius: 20px;
  outline: none;
  text-indent: 15px;
}
#pro_table {
  width: 80%;
  height: 437px;
  margin: 0 10%;
  background-color: white;
  text-align: center;
  float: left;
  border: rgba(108, 138, 216, 1) solid 1px;
  box-shadow: 0px 5px 5px 0px rgba(229, 229, 229, 1);
}
#pro_table /deep/ .el-table {
  height: 364px;
}
#pro_table /deep/ .el-table td,
#pro_table /deep/ .el-table th {
  text-align: center;
  padding: 15px 0;
}
#pro_table /deep/ .el-table td {
  font-size: 14px;
}
#pro_table /deep/ .el-table thead {
  font-size: 18px;
  color: rgba(108, 138, 216, 1);
}
.mainbox /deep/ .el-dialog {
  width: 70%;
  min-width: 1000px;
  position: relative;
}
.mainbox /deep/ .el-dialog__header {
  box-shadow: 0px 5px 5px 0px rgba(229, 229, 229, 1);
}
.mainbox /deep/ .el-dialog__title {
  color: rgba(108, 138, 216, 1);
  font-size: 22px;
}
.mainbox /deep/ .el-dialog__body {
  background-color: rgba(250, 247, 247, 1);
}
#pro_table_01,
#pro_box {
  width: 95%;
  margin: 0 2.5%;
  color: rgba(80, 80, 80, 1);
  background-color: rgba(255, 255, 255, 1);
  font-size: 14px;
  box-shadow: 0px 10px 10px 0px rgba(229, 229, 229, 1);
  text-align: center;
}
#pro_table_01 {
  min-height: 920px;
  padding-bottom: 30px;
}
#pro_box {
  height: 248px;
  margin-top: 33px;
}
.mainbox /deep/ .el-form {
  width: 90%;
  margin: 0 auto;
  padding-top: 40px;
  text-align: left;
}
.mainbox /deep/ .el-form-item {
  height: 40px;
}
.mainbox /deep/ .el-form-item__label {
  text-align: left;
  color: rgba(108, 138, 216, 1);
}
#table_01 {
  list-style: none;
  width: 100%;
  height: 240px;
  margin-bottom: 30px;
  position: relative;
  border-left: #dcdfe6 solid 1px;
  padding: 0;
}
#table_01 li {
  position: relative;
  width: 16.6%;
  float: left;
}
#table_01 li span {
  width: 99%;
  height: 39px;
  display: block;
  text-align: center;
  border: none;
  border-top: #dcdfe6 solid 1px;
  border-right: #dcdfe6 solid 1px;
}
#table_01 li input {
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
  width: 95%;
  height: 100px;
  border: #dcdfe6 solid 1px;
  padding: 10px;
  text-align: left;
  border-radius: 10px;
  line-height: 20px;
  display: block;
  overflow-y: auto;
}
</style>