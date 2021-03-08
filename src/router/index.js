import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login.vue'
// 学生端
import student_menu from '@/pages/student/student_menu.vue'
import student_index from '@/pages/student/index.vue'
import pro_application from '@/pages/student/pro_application.vue'
import lab_appointment from '@/pages/student/lab_appointment.vue'
import equip_appointment from '@/pages/student/equip_appointment.vue'
import result_submit from '@/pages/student/result_submit.vue'
import material from '@/pages/student/material.vue'
import student_personalInfo from '@/pages/student/personalInfo.vue'
// 管理员端
import admin_menu from '@/pages/admin/admin_menu.vue'
import admin_index from '@/pages/admin/index.vue'
import pro_management from '@/pages/admin/pro_management.vue'
import user_management from '@/pages/admin/user_management.vue'
import Announcement from '@/pages/admin/Announcement.vue'
import achieve_export from '@/pages/admin/achieve_export.vue'
import award_management from '@/pages/admin/award_management.vue'
import equipment from '@/pages/admin/equipment.vue'
import achieve_approval from '@/pages/admin/achieve_approval.vue'
import pro_approvalFile from '@/pages/admin/pro_approvalFile.vue'
import user_list from '@/pages/admin/user_list.vue'
import admin_publish_pro from '@/pages/admin/publish_pro.vue'
import award_export from '@/pages/admin/award_export.vue'
import conclusion_export from '@/pages/admin/conclusion_export.vue'
import conclusion_approval from '@/pages/admin/conclusion.vue'
// 教师端
import teacher_menu from '@/pages/teacher/teacher_menu.vue'
import teacher_index from '@/pages/teacher/index.vue'
import teacher_personalInfo from '@/pages/teacher/personalInfo.vue'
import pro_approval from '@/pages/teacher/pro_approval.vue'
import lab_approval from '@/pages/teacher/lab_approval.vue'
import equip_approval from '@/pages/teacher/equip_approval.vue'
import publish_pro from '@/pages/teacher/publish_pro.vue'




Vue.use(Router)

const originalPush = Router.prototype.push
  Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/student',
      name: 'student_menu',
      component: student_menu,
      children:[
        {
          path: '/student/personalInfo',
          name: 'student_personalInfo',
          component: student_personalInfo
        },
        {
          path: '/student/index',
          name: 'student_index',
          component: student_index
        },
        {
          path: '/student/pro_application',
          name: 'pro_application',
          component: pro_application
        },
        {
          path: '/student/lab_appointment',
          name: 'lab_appointment',
          component: lab_appointment
        },
        {
          path: '/student/equip_appointment',
          name: 'equip_appointment',
          component: equip_appointment
        },
        {
          path: '/student/result_submit',
          name: 'result_submit',
          component: result_submit
        },
        {
          path: '/student/material',
          name: 'material',
          component: material
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin_menu',
      component: admin_menu,
      children:[
        {
          path: '/admin/index',
          name: 'admin_index',
          component: admin_index
        },
        {
          path: '/admin/pro_management',
          name: 'pro_management',
          component: pro_management
        },
        {
          path: '/admin/user_management',
          name: 'user_management',
          component: user_management
        },
        {
          path: '/admin/Announcement',
          name: 'Announcement',
          component: Announcement
        },
        {
          path: '/admin/achieve_export',
          name: 'achieve_export',
          component: achieve_export
        },
        {
          path: '/admin/achieve_approval',
          name: 'achieve_approval',
          component: achieve_approval
        },
        {
          path: '/admin/award_management',
          name: 'award_management',
          component: award_management
        },
        {
          path: '/admin/equipment',
          name: 'equipment',
          component: equipment
        },
        {
          path: '/admin/pro_approvalFile',
          name: 'pro_approvalFile',
          component: pro_approvalFile
        },
        {
          path: '/admin/user_list',
          name: 'user_list',
          component: user_list
        },
        {
          path: '/admin/lab_approval',
          name: 'lab_approval',
          component: lab_approval
        },
        {
          path: '/admin/publish_pro',
          name: 'admin_publish_pro',
          component: admin_publish_pro
        },
        {
          path: '/admin/award_export',
          name: 'award_export',
          component: award_export
        },
        {
          path: '/admin/conclusion_export',
          name: 'conclusion_export',
          component: conclusion_export
        },
        {
          path: '/admin/conclusion_approval',
          name: 'conclusion_approval',
          component: conclusion_approval
        }
      ]
    },
    {
      path: '/teacher',
      name: 'teacher_menu',
      component: teacher_menu,
      children:[
        {
          path: '/teacher/index',
          name: 'teacher_index',
          component: teacher_index
        },
        {
          path: '/teacher/personalInfo',
          name: 'teacher_personalInfo',
          component: teacher_personalInfo
        },
        {
          path: '/teacher/pro_approval',
          name: 'pro_approval',
          component: pro_approval
        },
        {
          path: '/teacher/lab_approval',
          name: 'lab_approval',
          component: lab_approval
        },
        {
          path: '/teacher/equip_approval',
          name: 'equip_approval',
          component: equip_approval
        },
        {
          path: '/teacher/publish_pro',
          name: 'publish_pro',
          component: publish_pro
        }
      ]
    }
  ]
})
