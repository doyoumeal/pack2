# 打包员工效率监控系统

一个高效、美观的员工效率监控系统，专为物流和仓储行业设计，帮助管理者实时掌握员工工作效率数据。

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- Vite
- Recharts（数据可视化）
- XLSX（Excel文件处理）
- html2canvas（导出图片功能）

## 功能特点

- 📊 **实时数据可视化**：通过直观的表格和图表展示员工效率数据
- ⏱️ **小时级监控**：支持按小时查看和分析员工工作效率
- 📥 **数据导入导出**：支持CSV和XLSX格式数据导入，以及图片导出功能
- 🔍 **多维度筛选**：可按员工和时间段进行数据筛选
- 🌓 **深色模式支持**：自动适应系统深色模式，也可手动切换
- 🌐 **多语言支持**：支持中英文切换
- 📱 **响应式设计**：适配不同屏幕尺寸的设备

## 快速开始

### 前提条件

- Node.js 16+
- pnpm（推荐）或npm/yarn

### 安装依赖

```bash
# 使用pnpm
pnpm install

# 或使用npm
npm install

# 或使用yarn
yarn install
```

### 开发模式

```bash
# 使用pnpm
pnpm dev

# 或使用npm
npm run dev

# 或使用yarn
yarn dev
```

项目将在 http://localhost:3000 启动开发服务器。

### 构建生产版本

```bash
# 使用pnpm
pnpm build

# 或使用npm
npm run build

# 或使用yarn
yarn build
```

构建后的文件将生成在 `dist` 目录中。

## 部署指南

### 1. 静态网站部署

由于这是一个纯前端应用，您可以将构建后的静态文件部署到任何支持静态网站托管的平台。

#### 使用Vercel部署

1. 访问 [Vercel](https://vercel.com/) 并登录
2. 点击 "New Project"
3. 选择您的代码仓库
4. 配置项目设置（保持默认即可）
5. 点击 "Deploy"

#### 使用Netlify部署

1. 访问 [Netlify](https://www.netlify.com/) 并登录
2. 点击 "Add new site" > "Import an existing project"
3. 选择您的代码仓库
4. 配置构建设置：
   - Build command: `pnpm build` 或 `npm run build` 或 `yarn build`
   - Publish directory: `dist`
5. 点击 "Deploy site"

#### 使用GitHub Pages部署

1. 安装gh-pages包：
   ```bash
   pnpm add -D gh-pages
   # 或 npm install -D gh-pages
   # 或 yarn add -D gh-pages
   ```

2. 在package.json中添加以下脚本：
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. 构建并部署：
   ```bash
   pnpm build
   pnpm deploy
   ```

### 2. 自定义服务器部署

如果您想在自己的服务器上部署，可以按照以下步骤操作：

1. 构建项目：
   ```bash
   pnpm build
   ```

2. 将 `dist` 目录中的所有文件复制到您的Web服务器根目录

3. 确保您的Web服务器正确配置了单页应用（SPA）路由。以下是一些常见Web服务器的配置示例：

#### Nginx配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache配置

确保启用了mod_rewrite模块，然后在.htaccess文件中添加：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 项目结构

```
├── src/
│   ├── components/    # 可复用组件
│   ├── contexts/      # React上下文
│   ├── hooks/         # 自定义钩子
│   ├── lib/           # 工具函数和库
│   ├── pages/         # 页面组件
│   ├── App.tsx        # 应用主组件
│   └── main.tsx       # 应用入口
├── index.html         # HTML模板
├── package.json       # 项目依赖和脚本
└── tailwind.config.js # Tailwind CSS配置
```

## 数据格式要求

导入的CSV或XLSX文件应包含以下字段：

- 订单号/Order No.
- 包裹号/Package number
- 打包操作人/Packed by
- 打包完成时间/Packing completion time
- 商品数量/Qty

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT