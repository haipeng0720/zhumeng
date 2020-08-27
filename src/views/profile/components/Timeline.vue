<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: '2020/8/13',
          title: 'SYYO后台管理项目',
          content: '完成用户模块'
        },
        {
          timestamp: '2020/8/12',
          title: 'SYYO后台管理项目',
          content: '完成角色模块'
        },
        {
          timestamp: '2020/8/11',
          title: 'SYYO后台管理项目',
          content: '完成菜单模块'
        }

      ]
    }
  }
}
</script>
