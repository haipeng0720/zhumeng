# syyoAdmin-web-template 基础模板（前端）

#### 介绍
新版本的前后端分离管理系统，使用SpringBoot、Mybaties-plus，Spring Security ， JWT ，Vue 

#### 账号密码：admin/123456

#### 项目源码

|                           |              | 源码                                             |
| ------------------------- | ------------ | ------------------------------------------------ |
| syyoAdmin-web-template    | 前端基础模板 | https://gitee.com/syyo/syyoAdmin-web-template    |
| syyoAdmin-server-template | 后端基础模板 | https://gitee.com/syyo/syyoAdmin-server-template |
| syyoAdmin-web             | 前端完整项目 | https://gitee.com/syyo/syyoAdmin-web             |
| syyoAdmin-server          | 后端完整项目 | https://gitee.com/syyo/syyoAdmin-server          |



#### 前端技术

    vue 2.6
    element-ui 2.13 饿了么组件库
    vue-table-with-tree-grid 0.2 树形展示组件
    vuex 3.1
    vue-router 3.0
    echarts 4.2

#### 后端技术
    springboot
    Spring Security
    Mybaties-plus
    jwt
    lombok
    easyexcel

#### 内置功能
1.用户管理

2.角色管理

3.菜单管理


#### 软件需求
    JDK1.8
    MySQL5.5+
    Maven3.5+



#### 后端部署 
1.  使用idea通过git下载源码
2.  idea需安装lombok插件，不然会提示找不到entity的get set方法
3.  创建数据库syyo，数据库编码为UTF-8
4.  执行db/syyo-server.sql文件，初始化数据
5.  修改配置文件application-dev.yml的数据库用户名密码
6.  启动SyyoApplication.java文件

#### 前端部署
注意：必要安装nodeJs和webpack环境（详情百度nodeJS安装）

账号密码：admin/123456

第一种
1.  使用WebStorm或者vscode打开syyoAdmin-web-template项目
2.  在终端输入 npm i 
3.  在终端输入 npm run serve 
4.  访问 http://localhost:9001（默认端口9001）
5.  由于用到了图片显示，所以用到了nginx请求转发

第二种
1.  使用WebStorm或者vscode打开syyoAdmin-web-template项目
2.  在终端输入 npm i 
3.  在终端输入 npm run build 
4.  将打包好的文件放入nginx的html包下，配置好nginx的配置文件（详情百度nginx安装配置）
5.  启动ngin，既可访问



nginx配置

```
        # 动态请求
        location  ^~ /api/ {
            proxy_pass http://192.168.1.11:8082/; # 改成后端服务的ip
        }
        # 静态文件
        location /F:/com/syyo  {
            alias F:/com/syyo/ ; # 改成对应的静态地址
        }
```



#### 注意：前端安装node-sass包，需要用到python2.7版本的环境。




##### 登录页

![1597307407929](https://gitee.com/syyo/images/raw/master/images/登录_20200817094944.png)



##### 个人信息

![1597307433382](https://gitee.com/syyo/images/raw/master/images/个人信息_20200817095149.png)



##### 首页

![1597307433382](https://gitee.com/syyo/images/raw/master/images/首页_20200817095038.png)



##### 用户页

![1597307490844](https://gitee.com/syyo/images/raw/master/images/用户模块_20200817095055.png)



##### 角色页

![1597307509507](https://gitee.com/syyo/images/raw/master/images/角色模块_20200817095111.png)



##### 菜单页

![1597307517202](https://gitee.com/syyo/images/raw/master/images/菜单模块_20200817095128.png)



####  特别鸣谢

​	前端框架使用花裤衩的开源项目vue-admin-template

​	vue-admin-template源码地址：<https://gitee.com/panjiachen/vue-admin-template> 

   	前端动态路由和后端security的权限控制 参考 eladmin项目部分代码

​        eladmin源码地址：<https://gitee.com/elunez/eladmin> 



 



