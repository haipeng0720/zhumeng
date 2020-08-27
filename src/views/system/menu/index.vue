<template>
  <div>
    <!--卡片-->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-button v-hasPermi="['system:menu:add']" type="primary" small icon="el-icon-plus" class="addBtn" style="margin:10px" size="mini" @click="addDialogVisible = true">新增
      </el-button>

      <!--菜单表格-->
      <tree-table
        class="treeTable"
        :data="treeList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >

        <!--图标-->
        <template slot="isicon" slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>

        <!--是否隐藏-->
        <template slot="isHidden" slot-scope="scope">
          <el-tag v-if="scope.row.hidden" size="mini" type="danger">是</el-tag>
          <el-tag v-else size="mini" type="success">否</el-tag>
        </template>

        <!--是否缓存-->
        <template slot="isCache" slot-scope="scope">
          <el-tag v-if="scope.row.cache" size="mini" type="success">是</el-tag>
          <el-tag v-else size="mini" type="danger">否</el-tag>
        </template>

        <!--菜单类型-->
        <template slot="menuType" slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" size="mini">目录</el-tag>
          <el-tag v-if="scope.row.type === 2" type="success" size="mini">菜单</el-tag>
          <el-tag v-if="scope.row.type === 3" type="warning" size="mini">按钮</el-tag>
        </template>

        <!--操作-->
        <template slot="opt" slot-scope="scope">
          <el-tooltip :enterable="false" effect="dark" content="编辑菜单" placement="top">
            <el-button v-hasPermi="['system:menu:edit']" type="success" icon="el-icon-edit" size="mini" @click="editBtn(scope.row.menuId)" />
          </el-tooltip>
          <el-tooltip :enterable="false" effect="dark" content="删除菜单" placement="top">
            <el-button v-hasPermi="['system:menu:del']" type="danger" icon="el-icon-delete" size="mini" @click="delBtn(scope.row.menuId)" />
          </el-tooltip>
        </template>
      </tree-table>

    </el-card>

    <!--添加菜单对话框-->
    <el-dialog title="添加菜单" :visible.sync="addDialogVisible" width="600px" @close="addHandleClose">
      <el-form ref="addFormRef" :inline="true" :model="addForm" :rules="addFormRules" label-width="80px" size="small">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="addForm.type" size="mini" style="width: 178px">
            <el-radio-button label="1">目录</el-radio-button>
            <el-radio-button label="2">菜单</el-radio-button>
            <el-radio-button label="3">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="addForm.type.toString() !== '3'" label="菜单图标" prop="icon">
          <el-popover placement="bottom-start" width="450" trigger="click" @show="$refs['iconSelect'].reset()">
            <IconSelect ref="iconSelect" @selected="selectedAdd" />
            <el-input slot="reference" v-model="addForm.icon" style="width: 450px" placeholder="点击选择图标" readonly>
              <svg-icon
                v-if="addForm.icon"
                slot="prefix"
                :icon-class="addForm.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>

        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="addForm.menuName" />
        </el-form-item>
        <el-form-item v-show="addForm.type.toString() !== '3'" label="路由地址" prop="path">
          <el-input v-model="addForm.path" />
        </el-form-item>
        <el-form-item v-show="addForm.type.toString() === '2'" label="组件地址" prop="component">
          <el-input v-model="addForm.component" />
        </el-form-item>
        <el-form-item v-show="addForm.type.toString() === '2'" label="组件名称" prop="componentName">
          <el-input v-model="addForm.componentName" />
        </el-form-item>
        <el-form-item v-show="addForm.type.toString() !== '3'" label="是否隐藏" prop="hidden" class="hidden">
          <el-radio-group v-model="addForm.hidden" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="addForm.type.toString() === '2'" label="是否缓存" prop="cache" class="cache">
          <el-radio-group v-model="addForm.cache" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="addForm.type.toString() === '3'" label="权限标识" prop="perms">
          <el-input v-model="addForm.perms" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input-number v-model.number="addForm.sort" :min="0" :max="999" controls-position="right" />
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-cascader
            v-model="addForm.pidList"
            :options="treeList"
            :props="defaultProps"
            clearable
            style="width: 450px"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑菜单对话框-->
    <el-dialog title="编辑菜单" :visible.sync="editDialogVisible" width="600px" @close="editHandleClose">
      <el-form
        ref="editFormRef"
        :inline="true"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
        size="small"
      >
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="editForm.type" size="mini" style="width: 178px">
            <el-radio-button label="1">目录</el-radio-button>
            <el-radio-button label="2">菜单</el-radio-button>
            <el-radio-button label="3">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="editForm.type.toString() !== '3'" label="菜单图标" prop="icon">
          <el-popover placement="bottom-start" width="450" trigger="click" @show="$refs['iconSelect'].reset()">
            <IconSelect ref="iconSelect" @selected="selectedEdit" />
            <el-input slot="reference" v-model="editForm.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
              <svg-icon
                v-if="editForm.icon"
                slot="prefix"
                :icon-class="editForm.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>

        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="editForm.menuName" />
        </el-form-item>
        <el-form-item v-show="editForm.type.toString() !== '3'" label="路由地址" prop="path">
          <el-input v-model="editForm.path" />
        </el-form-item>
        <el-form-item v-show="editForm.type.toString() === '2'" label="组件地址" prop="component">
          <el-input v-model="editForm.component" />
        </el-form-item>
        <el-form-item v-show="editForm.type.toString() === '2'" label="组件名称" prop="componentName">
          <el-input v-model="editForm.componentName" />
        </el-form-item>
        <el-form-item v-show="editForm.type.toString() !== '3'" label="是否隐藏" prop="hidden" class="hidden">
          <el-radio-group v-model="editForm.hidden" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="editForm.type.toString() === '2'" label="是否缓存" prop="cache" class="cache">
          <el-radio-group v-model="editForm.cache" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="editForm.type.toString() === '3'" label="权限标识" prop="perms">
          <el-input v-model="editForm.perms" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input-number
            v-model.number="editForm.sort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 178px;"
          />
        </el-form-item>

        <el-form-item label="父级菜单">
          <el-cascader
            v-model="editForm.pidList"
            :options="treeList"
            :props="defaultProps"
            clearable
            style="width: 450px"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClick">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import IconSelect from '@/components/IconSelect'
import { add, edit, del, treeMenu, getMenu } from '@/api/system/menu'

export default {
  name: 'Menu',
  components: { IconSelect },
  data() {
    return {
      activeName: 'first',
      addDialogVisible: false,
      editDialogVisible: false,
      defaultProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        children: 'children',
        label: 'menuName',
        value: 'menuId'
      },
      menuIdList: [],
      treeList: [],
      columns: [
        {
          label: '菜单名称',
          prop: 'menuName',
          minWidth: '150px'
        },
        {
          label: '图标',
          prop: 'icon',
          type: 'template',
          template: 'isicon',
          width: '50px'
        },
        {
          label: '权限标识',
          prop: 'perms'
        },
        {
          label: '路由地址',
          prop: 'path'
        },
        {
          label: '组件地址',
          prop: 'component'
        },
        {
          label: '组件名',
          prop: 'componentName'
        },
        {
          label: '是否隐藏',
          prop: 'hidden',
          type: 'template',
          template: 'isHidden',
          width: '75px'
        },
        {
          label: '是否缓存',
          prop: 'cache',
          type: 'template',
          template: 'isCache',
          width: '75px'
        },
        {
          label: '分类等级',
          prop: 'type',
          type: 'template',
          template: 'menuType',
          width: '75px'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addForm: {
        menuName: '',
        type: 1,
        pidList: [],
        perms: '',
        path: '',
        component: '',
        componentName: '',
        icon: '',
        sort: '',
        hidden: false,
        cache: false
      },
      addFormRules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      editForm: {
        menuId: '',
        menuName: '',
        type: 1,
        pidList: [],
        perms: '',
        path: '',
        component: '',
        componentName: '',
        icon: '',
        sort: '',
        hidden: false,
        cache: false
      },
      editFormRules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    // 初始化页面列表
    this.initListMenu()
  },

  methods: {

    // 选中图标
    selectedAdd(name) {
      this.addForm.icon = name
    },

    // 选中图标
    selectedEdit(name) {
      this.editForm.icon = name
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },

    // 监听添加菜单对话框的关闭事件，重置表单内容
    addHandleClose() {
      this.$refs.addFormRef.resetFields()
      this.addForm.pidList = []
      this.addForm.type = 1
    },

    // 监听编辑菜单对话框的关闭事件,重置表单内容
    editHandleClose() {
      this.$refs.editFormRef.resetFields()
      this.editForm.pidList = []
      this.editForm.type = 1
    },

    // 添加用户
    addClick() {
      // 1.校验表单
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        // 2.发送请求
        add(this.addForm).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
            // 3.刷新数据
            this.initListMenu()
          }
          // 4.关闭对话框
          this.addDialogVisible = false
        })
      })
    },

    // 编辑菜单按钮
    editBtn(id) {
      // 1.保存菜单id
      this.editDialogVisible = true
      this.editForm.menuId = id
      // 2.获取菜单详情
      getMenu(id).then(res => {
        this.editForm = res.data
      })
    },
    // 确认编辑菜单
    editClick() {
      // 1.发送请求
      edit(this.editForm).then(res => {
        if (res.code === 20000) {
          this.$message.success(res.message)
          // 2.刷新数据
          this.initListMenu()
        }
        // 3.关闭对话框
        this.editDialogVisible = false
      })
    },

    // 删除菜单按钮
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
            this.initListMenu()
          }
        })
      })
    },

    // 初始化列表页面
    initListMenu() {
      treeMenu().then(res => {
        this.treeList = res.data
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.hidden .cache {
  float: left;
}

.addBtn {
  margin: 10px 0;
}
</style>
