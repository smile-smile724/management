// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
import '../theme/index.css';
import moment from 'moment'

Vue.prototype.$moment = moment;

Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.prototype.getCookie = function(c_name) {
  if (document.cookie.length > 0) {
    var c_start = document.cookie.indexOf(c_name + '=')
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1
      var c_end = document.cookie.indexOf(';', c_start)
      if (c_end === -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return ''
}
Vue.prototype.setCookie = function(c_name,value,expire){
  var date=new Date()
  date.setSeconds(date.getSeconds()+expire)
  document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
  //console.log(document.cookie)
}
Vue.prototype.delCookie = function(c_name){
  Vue.prototype.setCookie(c_name, "", -1)
}
//management
axios.get('../management/static/serverConfig.json').then( (result) => {
  Vue.prototype.$host= result.data.baseUrl
  // console.log(Vue.prototype.$host);

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
  })
})
