<template>
  <div>
    <el-card style="margin-bottom:20px;">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>

      <div class="user-profile">
        <div style="text-align: center">
          <el-upload
            with-credentials
            :show-file-list="false"
            action="123"
            :http-request="myUpload"
            class="avatar-uploader"
          >
            <img
              style="font-size: 28px;
                    width: 120px;
                    height: 120px;
                    line-height: 120px;
                    text-align: center
                    display: block;
                    border-radius: 50%"

              title=" 点击上传头像"
              class="avatar"
              :src="user.avatar ? staticApi + user.avatar : Avatar"
            >
          </el-upload>
        </div>

        <ul class="user-info">
          <li><div style="height: 100%"><svg-icon icon-class="login" /> 登录账号<div class="user-right">{{ user.username }}</div></div></li>
          <li><svg-icon icon-class="user1" /> 用户昵称 <div class="user-right">{{ user.nickName }}</div></li>
          <li><svg-icon icon-class="phone" /> 手机号码 <div class="user-right">{{ user.phone }}</div></li>
          <li><svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">{{ user.email }}</div></li>
          <li><svg-icon icon-class="dept" /> 所属部门 <div class="user-right"> {{ user.dept }} / {{ user.job }}</div></li>
          <li>
            <svg-icon icon-class="anq" /> 安全设置
            <div class="user-right">
              <a @click="pwdDialogVisible = true">修改密码</a>
            </div>
          </li>
        </ul>
      </div>
    </el-card>

    <!--添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="pwdDialogVisible" width="580px" @close="addHandleClose">
      <span>
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
          <el-form-item label="旧密码" prop="passWord">
            <el-input v-model="form.passWord" type="password" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassWord">
            <el-input v-model="form.newPassWord" type="password" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPass">
            <el-input v-model="form.confirmPass" type="password" />
          </el-form-item>
        </el-form>
        <!--底部区域-->
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from '@/assets/images/avatar.png'
import store from '@/store'
import { updatePwd, editAvatar } from '@/api/system/user'

export default {
  data() {
    const confirmPass = (rule, value, callback) => {
      if (value) {
        if (this.form.newPassWord !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请再次输入密码'))
      }
    }
    return {
      Avatar: Avatar,
      pwdDialogVisible: false,
      form: {
        passWord: '',
        newPassWord: '',
        confirmPass: ''
      },
      formRules: {
        passWord: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '旧密码名的长度在6~20个字符之间',
            trigger: 'blur'
          }
        ],
        newPassWord: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '新密码的长度在6~20个字符之间',
            trigger: 'blur'
          }
        ], confirmPass: [
          { required: true, validator: confirmPass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'staticApi'
    ])
  },
  methods: {
    // 由于element 上传组件有跨域问题，使用自定义创建表单发送请求
    myUpload(conten) {
      const formData = new FormData()
      formData.append('file', conten.file) // 'file[]' 代表数组 其中`file`是可变的
      editAvatar(formData).then(res => {
        // 修改头像成功
        this.$message.success(res.message)
      }).catch(err => {
        // 修改头像失败
        console.log(err)
      })
    },
    // 编辑按钮
    editBtn(id) {
      this.pwdDialogVisible = true
    },

    // 确认编辑角色
    submitClick() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        updatePwd(this.form).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
          }
          // 关闭对话框
          this.pwdDialogVisible = false
        })
      })
    },
    // 监听添加角色对话框的关闭事件，重置表单内容
    addHandleClose() {
      this.$refs.formRef.resetFields()
      this.form = {}
    },
    handleSuccess(response, file, fileList) {
      this.$notify({
        title: '头像修改成功',
        type: 'success',
        duration: 2500
      })
      store.dispatch('GetInfo').then(() => {})
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
