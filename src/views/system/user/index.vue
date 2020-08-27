<template>
  <div>
    <!--卡片-->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-button v-hasPermi="['system:user:add']" type="primary" small icon="el-icon-plus" class="addBtn" style="margin:10px" size="mini" @click="addDialogVisible = true">新增
      </el-button>

      <el-button v-hasPermi="['system:user:import']" type="info" small icon="el-icon-upload2" class="importBtn" style="margin:10px" size="mini" @click="importDialogVisible = true">导入
      </el-button>

      <el-button v-hasPermi="['system:user:export']" type="warning" small icon="el-icon-download" class="exportBtn" style="margin:10px" size="mini" @click="exportClick">导出
      </el-button>

      <!--用户表格-->
      <el-table :data="listForm" stripe border style="width: 100%">
        <el-table-column prop="userId" label="ID" width="80" />
        <el-table-column prop="userName" label="姓名" width="180" />
        <el-table-column prop="nickName" label="昵称" />
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex | sexFormat }}
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="userStateChanged(scope.row)"
            /></template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="日期" width="180" />
        <!--操作-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="编辑用户" placement="top">
              <el-button v-hasPermi="['system:user:edit']" type="success" icon="el-icon-edit" size="mini" @click="editBtn(scope.row.userId)" />
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="删除用户" placement="top">
              <el-button v-hasPermi="['system:user:del']" type="danger" icon="el-icon-delete" size="mini" @click="delBtn(scope.row.userId)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        background
        :current-page="pageNumber"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

    </el-card>

    <!--添加用户对话框-->
    <el-dialog title="新增用户" :visible.sync="addDialogVisible" width="580px" @close="addHandleClose">
      <span>
        <el-form ref="addFormRef" :inline="true" :model="addForm" :rules="addFormRules" label-width="70px">
          <el-form-item label="账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="密码" prop="passWord">
            <el-input v-model="addForm.passWord" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="addForm.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="addForm.nickName" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addForm.remark" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="addForm.roleIdList" multiple placeholder="请选择角色" style="width: 450px">
              <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
            </el-select>
          </el-form-item>
        </el-form>
        <!--底部区域-->
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑用户对话框-->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="580px" @close="editHandleClose">
      <span>
        <el-form ref="editFormRef" :inline="true" :model="editForm" label-width="70px">
          <el-form-item label="账号" prop="userName">
            <el-input v-model="editForm.userName" disabled />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="editForm.nickName" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="editForm.remark" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="editForm.roleIdList" multiple placeholder="请选择角色" style="width: 450px">
              <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
            </el-select>
          </el-form-item>
        </el-form>
        <!--底部区域-->
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--导入对话框-->
    <el-dialog title="导入" :visible.sync="importDialogVisible" width="580px">
      <span>
        <el-upload
          class="upload-demo"
          drag
          action="123"
          :http-request="myUpload"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
        </el-upload>
        <!--底部区域-->
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="importClick">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { add, edit, del, listUser, getUser, importUser, exportUser } from '@/api/system/user'
import { listRole } from '@/api/system/role'
export default {
  name: 'User',
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      allotDialogVisible: false,
      importDialogVisible: false,
      pageNumber: 1,
      pageSize: 10,
      total: 1,
      loading: false,
      listForm: [],
      addForm: {
        userName: '',
        passWord: '',
        email: '',
        sex: 1,
        nickName: '',
        remark: '',
        roleIdList: []
      },
      roleList: [],
      editForm: {},
      addFormRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
          // { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 初始化用户列表
    this.initListUser()
    this.initListRole()
  },

  methods: {
    // 由于element 上传组件有跨域问题，使用自定义创建表单发送请求
    myUpload(content) {
      const formData = new FormData()
      formData.append('file', content.file) // 'file[]' 代表数组 其中`file`是可变的
      importUser(formData).then(res => {
        //
        this.$message.success(res.message)
      }).catch(err => {
        // 失败
        console.log(err)
      })
    },

    // 添加按钮
    addBtn() {
      this.addDialogVisible = true
    },

    // 确认添加用户
    addClick() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        add(this.addForm).then(res => {
          this.$message.success(res.message)
          // 刷新数据
          this.initListUser()

          // 关闭对话框
          this.addDialogVisible = false
        })
      })
    },

    // 编辑按钮
    editBtn(id) {
      this.editDialogVisible = true
      getUser(id).then(res => {
        if (res.code === 20000) {
          this.editForm = res.data
        }
      })
    },

    // 确认编辑用户
    editClick() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        edit(this.editForm).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
            // 刷新数据
            this.initListUser()
          }
          // 关闭对话框
          this.editDialogVisible = false
        })
      })
    },

    // 修改状态
    userStateChanged(user) {
      edit(user).then(res => {
        if (res.code === 20000) {
          this.$message.success(res.message)
          // 刷新数据
          this.initListUser()
        }
      })
    },

    // 删除按钮
    delBtn(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认操作
        del(id).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
            // 刷新数据
            this.initListUser()
          }
        })
      })
    },

    // 导入按钮
    importBtn() {
      this.importDialogVisible = true
    },
    // 导入按钮
    importClick() {
      this.importDialogVisible = false
    },

    // 导出
    exportClick() {
      this.$confirm('是否确认导出所有用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportUser()
        })
        .then((res) => {
          console.log('=========exportUser===========')
          console.log(res.data.uuid)
          const uuid = res.data.uuid
          const fileName = 'user'
          this.download(fileName, uuid)
        })
        .catch(function() {})
    },

    // 监听当前页的事件
    handleCurrentChange(pageIndex) {
      const params = {
        pageNum: pageIndex,
        pageSize: this.pageSize
      }
      listUser(params).then(res => {
        this.listForm = res.data.records
        this.total = res.data.total
        this.pageNum = res.data.current
        this.pageSize = res.data.size
      })
    },

    // 监听当前页的条数事件
    handleSizeChange(pageIndex) {
      const params = {
        pageNum: this.pageNumber,
        pageSize: pageIndex
      }
      listUser(params).then(res => {
        this.listForm = res.data.records
        this.total = res.data.total
        this.pageNum = res.data.current
        this.pageSize = res.data.size
      })
    },

    // 监听添加用户对话框的关闭事件，重置表单内容
    addHandleClose() {
      this.$refs.addFormRef.resetFields()
      this.addForm.roleIdList = []
    },

    // 监听编辑用户对话框的关闭事件,重置表单内容
    editHandleClose() {
      this.$refs.editFormRef.resetFields()
      this.addForm.roleIdList = []
    },
    // 初始化用户数据
    initListUser() {
      const params = {
        pageNum: this.pageNumber,
        pageSize: this.pageSize
      }
      listUser(params).then(res => {
        this.listForm = res.data.records
        this.total = res.data.total
        this.pageNum = res.data.current
      })
    },
    // 初始化角色数据
    initListRole() {
      const params = {
        pageNum: this.pageNumber,
        pageSize: this.pageSize
      }
      listRole(params).then(res => {
        this.roleList = res.data.records
        this.total = res.data.total
        this.pageNum = res.data.current
      })
    }
  }
}
</script>

<style scoped>
</style>
