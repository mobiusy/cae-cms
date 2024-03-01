FROM node:18.14-slim as build

RUN yarn config set registry https://registry.npmmirror.com

# 第一阶段：复制代码，安装依赖，构建
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json package.json
COPY yarn.lock yarn.lock

# 安装依赖
RUN yarn

# 复制代码
COPY . .

# 构建
RUN yarn build

# 第二阶段：只复制必需目录到目标镜像中的工作目录，启动
FROM node:18.14-slim as prod

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  && echo 'Asia/Shanghai' >/etc/timezone

WORKDIR /app

# 复制第一阶段构建好的文件
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 13000

# 启动命令
CMD ["yarn", "start:prod"]