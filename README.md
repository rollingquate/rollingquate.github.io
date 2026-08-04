# RollingQuate 创作信息公示平台

滚动天空饭制同人爱好者创作社群官方网站。

## 网站简介

RollingQuate 创作信息公示平台是滚动的天空饭制同人爱好者社群的官方信息公示网站，用于发布团队动态、创作专栏、专题汇总等内容。

**重要声明**：本站为滚动的天空饭制同人爱好者网站，内容仅供社群内部交流，纯属虚构，不属于任何官方机构，不具备行政与法律效力。

## 网站栏目

- **首页** - 网站概览与最新动态
- **信息发布** - 团队公告与重要通知
- **团队新闻** - 团队发展历程与事件
- **创作专栏** - 高质量饭制关卡作品展示
- **社员互动** - 社群内部交流分享
- **专题汇总** - 主题内容整理
- **应用天地** - 团队开发的 APK 应用下载
- **团队概况** - 团队介绍与沿革
- **入队申请指引** - 招募信息（当前关闭）

## 本地管理工具

`admin-generator.html` 是本地管理工具，用于：
- 发布/编辑/删除文章
- 上传首页横幅大图
- 管理应用天地（APK 上传）

**注意**：管理工具文件不应上传到 GitHub，已通过 `.gitignore` 自动排除。

## 部署到 GitHub Pages

### 方法一：使用部署脚本（推荐）

1. 右键运行 `deploy.ps1`（PowerShell 脚本）
2. 脚本会自动生成 `deploy/` 文件夹，排除所有管理工具文件
3. 将 `deploy/` 文件夹内的所有文件上传到 GitHub 仓库
4. 在仓库 Settings → Pages 中启用 GitHub Pages
5. 访问 `https://fallen0757.github.io/rollingquate/`

### 方法二：手动上传

1. 创建 GitHub 仓库
2. 上传以下文件/文件夹（**排除**管理工具）：
   - ✅ 所有 `.html` 文件
   - ✅ `css/` 文件夹
   - ✅ `js/` 文件夹（**排除** `admin-*.js`）
   - ✅ `images/` 文件夹
   - ✅ `articles/` 文件夹
   - ✅ `apps/` 文件夹
   - ✅ `.nojekyll`
   - ✅ `robots.txt`
   - ✅ `sitemap.xml`
   - ❌ **不要上传**：`admin-generator.html`、`build-admin.js`、`js/admin-*.js`、`deploy.ps1`
3. 启用 GitHub Pages

### 方法三：自动部署（GitHub Actions）

已配置 GitHub Actions 工作流，推送到 `main` 分支时自动部署到 GitHub Pages。

## 技术栈

- 纯静态 HTML/CSS/JS
- 无外部框架依赖
- 兼容 `file://` 协议本地预览
- 支持 GitHub Pages 部署

## 联系方式

- 团队邮箱：cshusbs@gmail.com
- 网站负责人：FALLEN

## 官方社群

- 官方①群｜联合国：https://qm.qq.com/q/5bF26oRxpS
- 官方群 Rolling Eclipse Xplode：https://qm.qq.com/q/jAQxHOU1cQ
- 官方①群 Rolling Eclipse Xplode：https://qm.qq.com/q/l94nU3nsT6

## 许可证

本项目仅供学习交流，所有内容版权归原作者所有。
