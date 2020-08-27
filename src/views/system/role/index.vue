<template>
  <div>
    <!--卡片-->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-button v-hasPermi="['system:role:add']" type="primary" small class="addBtn" style="margin:10px" size="mini" icon="el-icon-plus" @click="addDialogVisible = true">新增
      </el-button>
      <!--角色表格-->
      <el-table :data="listForm" stripe border style="width: 100%">
        <el-table-column prop="roleId" label="ID" width="80" />
        <el-table-column prop="roleName" label="角色名称" width="180" />
        <el-table-column prop="roleKey" label="角色标识" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="日期" width="180" />
        <!--操作-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="编辑角色" placement="top">
              <el-button v-hasPermi="['system:role:edit']" type="success" icon="el-icon-edit" size="mini" @click="editBtn(scope.row.roleId)" />
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="分配权限" placement="top">
              <el-button v-hasPermi="['system:role:auth']" type="warning" icon="el-icon-s-tools" size="mini" @click="authClick(scope.row.roleId)" />
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="删除角色" placement="top">
              <el-button v-hasPermi="['system:role:del']" type="danger" icon="el-icon-delete" size="mini" @click="delBtn(scope.row.roleId)" />
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

    <!--添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="580px" @close="addHandleClose">
      <span>
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName" />
          </el-form-item>
          <el-form-item label="角色标识" prop="roleKey">
            <el-input v-model="addForm.roleKey" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addForm.remark" />
          </el-form-item>
        </el-form>
        <!--底部区域-->
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑角色对话框-->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="580px" @close="editHandleClose">
      <span>
        <el-form ref="editFormRef" :model="editForm" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName" />
          </el-form-item>
          <el-form-item label="角色标识" prop="roleKey">
            <el-input v-model="editForm.roleKey" disabled />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="editForm.remark" />
          </el-form-item>
        </el-form>
        <!--底部区域-->
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--授权对话框-->
    <el-dialog title="角色授权" :visible.sync="allotDialogVisible" width="580px" @close="authDialogClosed">
      <span>
        <el-tree
          ref="treeRef"
          :data="menuTree"
          :props="defaultProps"
          show-checkbox
          node-key="menuId"
          default-expand-all
          :default-checked-keys="defaultKeys"
        />
        <!--底部区域-->
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotClick">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { add, edit, del, getRole, listRole, auth } from '@/api/system/role'
import { treeMenu } from '@/api/system/menu'
export default {
  name: 'Role',
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      allotDialogVisible: false,
      pageNumber: 1,
      pageSize: 10,
      total: 1,
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      role: {
        roleId: '',
        menuIdList: []
      },
      defaultKeys: [],
      listForm: [],
      addForm: {
        roleName: '',
        roleKey: '',
        remark: ''
      },
      roleList: [],
      editForm: {},
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    // 初始化角色列表
    this.initListRole()
  },

  methods: {
    // 添加按钮
    addBtn() {
      this.addDialogVisible = true
    },

    // 确认添加角色
    addClick() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        add(this.addForm).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
            // 刷新数据
            this.initListRole()
          }
          // 关闭对话框
          this.addDialogVisible = false
        })
      })
    },

    // 编辑按钮
    editBtn(id) {
      this.editDialogVisible = true
      getRole(id).then(res => {
        if (res.code === 20000) {
          this.editForm = res.data
        }
      })
    },

    // 确认编辑角色
    editClick() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        edit(this.editForm).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
            // 刷新数据
            this.initListRole()
          }
          // 关闭对话框
          this.editDialogVisible = false
        })
      })
    },

    // 角色授权
    allotClick() {
      this.role.menuIdList = [
        ...this.$refs.treeRef.getCheckedKeys() // 获取全选的menuId
        // ...this.$refs.treeRef.getHalfCheckedKeys() // 获取半选的menuId
      ]
      console.log(this.role.menuIdList)
      auth(this.role).then(res => {
        if (res.code === 20000) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
        // 关闭对话框
        this.allotDialogVisible = false
      })
    },

    // 监听分配权限对话框的关闭事件
    authDialogClosed() {
      this.defaultKeys = []
    },

    // 菜单列表
    authClick(roleId) {
      this.allotDialogVisible = true
      this.role.roleId = roleId
      treeMenu().then(res => {
        this.menuTree = res.data
      })

      getRole(roleId).then(res => {
        this.defaultKeys = res.data.menuIdList
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
            this.initListRole()
          }
        })
      })
    },

    // 监听当前页的事件
    handleCurrentChange(pageIndex) {
      const params = {
        pageNum: pageIndex,
        pageSize: this.pageSize
      }
      listRole(params).then(res => {
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
      listRole(params).then(res => {
        this.listForm = res.data.records
        this.total = res.data.total
        this.pageNum = res.data.current
        this.pageSize = res.data.size
      })
    },

    // 监听添加角色对话框的关闭事件，重置表单内容
    addHandleClose() {
      this.$refs.addFormRef.resetFields()
      this.addForm.roleIdList = []
    },

    // 监听编辑角色对话框的关闭事件,重置表单内容
    editHandleClose() {
      this.$refs.editFormRef.resetFields()
      this.addForm.roleIdList = []
    },

    // 初始化角色数据
    initListRole() {
      const params = {
        pageNum: this.pageNumber,
        pageSize: this.pageSize
      }
      listRole(params).then(res => {
        this.listForm = res.data.records
        this.total = res.data.total
        this.pageNum = res.data.current
      })
    }
  }
}
</script>

<style scoped>
</style>
