<template>
    <div class='mainbox'>

        <!-- 数据统计 -->
        <div id="text">
            <i></i>
            <span>数据统计</span>
        </div>
        <div id="pie">
            <div id="main" style="float:left;width:376px;height: 250px"></div>
            <span>当前：{{search}}</span>
        </div>
        <div id="line"></div>
        <div id="table">
            <div id="search_pro">
                <span style="display:inline-block;">选择竞赛名称：</span>
                <el-select v-model="search" placeholder="请选择项目" style="display:inline-block;width:300px;">
                    <el-option v-for="(item, index) in List" :key="index"
                    :label="item" :value="item"></el-option>
                </el-select>
            </div>
            <el-table
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            style="width: 100%;margin-top:40px" v-if="search!='全部竞赛'">
                <el-table-column
                prop="projectName"
                label="项目名称">
                </el-table-column>
                <el-table-column
                prop="number1"
                label="项目负责人">
                </el-table-column>
                <el-table-column
                prop="teacher"
                label="指导老师">
                </el-table-column>
                <el-table-column
                prop="result"
                label="获奖情况">
                </el-table-column>
            </el-table>
            <el-pagination
            :page-size="pagesize"
            @current-change="currentChange"
            layout="total,prev, pager, next, jumper"
            background
            :total="tableData.length"
            style="text-align:right;margin:20px 0;"
            v-if="search!='全部竞赛'">
            </el-pagination>
        </div>

    </div>
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')

import axios from 'axios';
axios.defaults.withCredentials = true;  
export default {
    data() {
        return {
            search:'',
            tableData: [],
            pagesize:7,
            currentPage: 1,
            List:['全部竞赛'],
            data:{},
        }
    },
    methods:{
        initData(info) {
            var myChart = echarts.init(document.getElementById('main'));
            // 绘制图表
            var infoData=[];
            var num=[];
            for(var key in info){
                var i={value:info[key], name:key};
                infoData.push(i);
                num.push(key)
            }
            myChart.setOption({
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    bottom: 'bottom',
                    data: num
                },
                series : [
                    {
                        name: '获奖情况',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:infoData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        },
        currentChange(currentPage){
            this.currentPage = currentPage;
            this.data=this.tableData.filter(data => {
                return Object.keys(data).some(key => {
                    return String(data[key]).toLowerCase().indexOf(this.search) > -1
                })
            }).slice((currentPage-1)*this.pagesize,currentPage*this.pagesize);
        },
        getInfo(name){
            var that=this;
            axios({
                method: 'post',
                url: this.$host+'/manage_platform/award_query',
                data:{
                    awardName:name
                }
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.data=data.info.stat;
                    this.tableData=data.info.details;
                    this.initData(this.data);
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
        getList(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/competition_name'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.List=this.List.concat(data.info);
                    if(this.List.length!=0){
                        this.search=this.List[0];
                    }
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
        getAll(){
            var that=this;
            axios({
                method: 'get',
                url: this.$host+'/manage_platform/stat_award'
            })
            .then(response => {
                var data=response.data;
                if(data.code==12){
                    this.data=data.info;
                    this.tableData=data.info;
                    this.initChart(this.data);
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
        initChart(info) {
            var myChart = echarts.init(document.getElementById('main'));
            // 绘制图表
            var infoData=[];
            var num=[];
            for(var i=0;i<info.length;i++){
                var chartData={value:info[i]['count(*)'], name:info[i].award_name};
                infoData.push(chartData);
                num.push(info[i].award_name)
            }
            myChart.setOption({
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    bottom: 'bottom',
                    data: num
                },
                series : [
                    {
                        name: '获奖情况',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:infoData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }
    },
    mounted() {
        this.getList();
    },
    watch:{
        'search':function (val) {
            var that=this;
            this.$nextTick(function () {
                if(val=='全部竞赛'){
                    this.getAll()
                }else{
                    that.getInfo(val)
                }
            });
        }
    }
}
</script>
<style scoped>
.mainbox{
    min-width:1230px;
    margin:24px 200px 0 300px;
    padding:34px 70px 34px 50px;
    min-height:740px;
    position: relative;
    text-align: left;
    background-color: rgba(255, 255, 255, 1);
}
#text{
    display: block;
	height: 30px;
}
#text span{
    float: left;
	height: 30px;
	color: rgba(112, 111, 111, 1);
	font-size: 18px;
	line-height: 30px;
	text-align: left;
}
#text i{
    width:3px;
    height:3px;
    float: left;
    border-radius:10px;
    background-color:rgba(108, 138, 216, 1);
    margin:13.5px 22px 13.5px 0;
}
#pie{
    float:left;
    width:376px;
}
#main{
    margin-top:140px;
}
#pie span{
    width:100%;
    text-align: center;
    display: block;
    float: left;
    color: rgba(80, 80, 80, 1);
	font-size: 14px;
	line-height: 21px;
    margin-top:30px;
}
#line{
    float: left;
    width: 4px;
	height: 220px;
	background-color: rgba(108, 138, 216, 1);
    margin-top:200px;
}
#table{
    width: 59%;
	height: 520px;
	box-shadow: 0px 10px 10px 0px rgba(229, 229, 229, 1);
    padding:40px;
    float: right;
    margin-top:40px;
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
.mainbox /deep/ .el-form{
    width:90%;
    margin:0 auto;
    padding-top:40px;
    text-align: left;
}
.mainbox /deep/ .el-form-item{
    height:40px;
}
.mainbox /deep/ .el-form-item__label{
    text-align: left;
    color: rgba(108, 138, 216, 1);
}
</style>