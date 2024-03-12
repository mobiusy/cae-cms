# CAE CMS
## 描述

CMS 内容管理系统

## 目录结构

```
├── Dockerfile
├── README.md
├── deploy            # k8s 部署脚本
├── libs              # 公共模块及基础设施
├── logs              # 日志
├── nest-cli.json     # 项目配置
├── package.json      # 项目依赖
├── src               # 项目源码
│   ├── app-config   # 服务配置模块
│   ├── db           # 数据库schema 及 incremental
│   ├── health       # 健康检查模块
│   ├── main.ts      # 程序主入口
│   ├── s3           # S3模块
│   └── statistic    # 统计模块
├── test              # 测试配置
├── ...

```

## 安装

```bash
$ yarn install
```

## 服务依赖

- Redis
- Postgres
- Minio

## 服务配置

见[配置文件](./src/app-config/config.yaml)

## 本地运行服务

```bash
# 生成prisma client
$  yarn prisma generate
```

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yanr run build
$ yarn run start:prod
```

## K8S部署

```bash
# 执行部署脚本
$ chmod +x ./deploy/deploy.sh
$ ./deploy/deploy.sh
```

## 初始化数据库
```bash
# 初始化数据库
$  yarn prisma migrate deploy
```


## 查看接口文档

1. 本地启动   
http://localhost:13000/api

2. k8s 部署   
http://{host}:30005/api   
注意： 环境变量NODE_ENV为production不暴露接口文档

3. 在线地址   
https://apifox.com/apidoc/shared-0230ea48-6dd2-4076-86be-47b1ecb8f40c

## 测试

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```



## License

Nest is [MIT licensed](LICENSE).
