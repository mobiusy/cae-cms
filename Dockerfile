FROM node:20.11.1-slim as build

RUN yarn config set registry https://registry.npmmirror.com

# 第一阶段：复制代码，安装依赖，构建
WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

COPY . .
RUN yarn build

# 第二阶段：只复制必需目录到目标镜像中的工作目录，启动
FROM node:20.11.1-slim as prod

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 13000
# 启动命令
CMD ["node", "/app/dist/main.js"]