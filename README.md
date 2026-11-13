# SpectorXCC 的个人站

这是《Linux基础及应用》课程大作业的 Hugo + PaperMod 起步项目。六个菜单、首页简介、三篇非草稿示例、标签分类、归档和站内搜索已配置，首页参考 [LuoStratus 的个人站](https://luostratus.cn/)，默认深色，支持浅色切换。首页窗口自动展示最新文章，宽屏阅读时目录留在左侧，小屏幕上可以在正文上方展开。

**先替换个人资料与照片，再用自己的实验记录改写文章，最后在虚拟机和选定的公网发布环境里分别验证。**

## 运行与日常编辑

本模板使用 Hugo **0.169.0 标准版**验证；主题要求至少 0.158.0。已通过初始化脚本创建项目时，直接运行：

```bash
hugo version
hugo server -D
```

虚拟机浏览器访问 `http://localhost:1313/`。终端保持运行，按 `Ctrl+C` 停止。网页通过服务器访问，不要双击 `public/index.html`，否则导航和搜索可能异常。

如果这是从自己的 GitHub 仓库重新克隆的项目，先执行：

```bash
git submodule update --init --recursive
```

## 优先修改这些位置

| 要改什么 | 文件或位置 | 怎么改 |
| --- | --- | --- |
| 博客名、作者、导航标识 | `hugo.toml` 的 `title`、`params.author`、`params.label.text` | 将 SpectorXCC 换成你喜欢的名字 |
| 首页个人简介 | `hugo.toml` 的 `[params.homeInfoParams]` | 修改 Title、signature、Content 和 eyebrow。保留此配置块以满足课程要求 |
| 姓名、专业、学校 | `hugo.toml` 的 `[params.profile]` | 把“待填写”换成真实信息 |
| 个人照片 | 放到 `static/images/me.jpg` | 把 `photo` 改成 `images/me.jpg`，更新 `photoAlt` |
| 关于页长介绍 | `content/about.md` | 修改兴趣与介绍，删除修改提示 |
| 三篇文章 | `content/posts/*.md` | 根据自己的作业、实验补充文字和截图 |
| 配色、字号和间距 | `assets/css/extended/personal-site.css` | 先修改开头的 CSS 变量 |
| 首页布局 | `layouts/_partials/home_info.html` | 可修改右侧文章窗口和按钮文字 |
| 正式网址 | `hugo.toml` 的 `baseURL` | 末尾保留 `/`，项目站点要带仓库名 |

当前头像是明确标注的占位图，**不能当作课程要求的个人照片**。建议照片以英文小写命名，留意 Linux 文件名大小写。照片按原始比例显示，不会被强制拉伸。

文章窗口和首页卡片会随 `content/posts/` 的文章更新，预览窗口取最新一篇，卡片最多列三篇。单篇文章布局在 `layouts/posts/single.html`，列表在 `layouts/posts/section.html`。自定义文件放在项目自己的 `assets/` 和 `layouts/` 中，主题子模块可以独立更新。

首页签名字体为 Caveat，随站点提供。许可见 `static/fonts/OFL-Caveat.txt`。

## 写一篇新文章

```bash
hugo new content posts/my-linux-note.md
```

填写标题、摘要、日期、分类、标签和正文。写完将 `draft: true` 改为 `draft: false`；日期用真实日期，未来日期的文章默认不参与正式构建。

```yaml
---
title: "我的 Linux 实验记录"
date: 2026-10-28T14:00:00+08:00
draft: false
summary: "记录一次具体实验的目标、操作与分析。"
categories: ["Linux 基础"]
tags: ["Linux", "权限"]
---
```

截图放到 `static/images/`。为了同时适配根域名和 GitHub 项目子路径，正文插图可以使用本项目的 `shot` 短代码：

```text
{{< shot src="images/my-result.png" alt="终端输出的内容说明" caption="图 1 实验运行结果" >}}
```

源路径中不写 `static/`。没有图片文件时不要先插入链接。示例文章中的注释使用 Hugo 的短代码转义写法；真正启用时照上面的格式写，移除 `/*`、`*/` 和 HTML 注释。

每篇示例已经包含实质性知识和步骤，但它们没有你的实际实验记录。请添加自己的观察、关键截图和问题分析。仅改名字、日期通常不能说明你完成了实验。

## 方式 A 从宿主机访问虚拟机博客

在虚拟机终端查看地址：

```bash
ip -4 addr
```

选择宿主机能访问的虚拟机网卡 IPv4 地址，不是 `127.0.0.1`。以下 `192.168.56.101` 只是示例，必须替换成你自己的地址：

```bash
hugo server --bind 0.0.0.0 -D \
  --baseURL "http://192.168.56.101:1313/" \
  --appendPort=false
```

在**宿主机**浏览器访问 `http://192.168.56.101:1313/`。`--bind 0.0.0.0` 允许外部连接，`--baseURL` 让页面链接使用宿主机能够访问的地址。终端显示监听地址和端口后截图，浏览器截图保留地址栏。

若打不开，按顺序检查：服务是否仍运行、IP 是否选对、虚拟机网络是否可达、1313 端口是否被防火墙拦截。部分 NAT 网络不能由宿主机直接访问，需要配置端口转发或使用合适的 Host-only/桥接网络。课程要求截图包含虚拟机 IP，优先完成宿主机直接访问虚拟机 IP 的方式。只在自己信任的实验网络内开放开发服务器。

## 方式 B 发布到 GitHub Pages

### 1 建立源码仓库

在 GitHub 创建你自己的空仓库。用户站点仓库命名为 `你的用户名.github.io`；普通项目仓库也可以，例如 `linux-blog`。为了减少首次使用的权限差异，课程博客可使用公开仓库。创建时先不要勾选自动添加 README，以免与本地项目发生历史冲突。

| 仓库类型 | `baseURL` 示例 |
| --- | --- |
| 用户站点 | `https://你的用户名.github.io/` |
| 项目站点 | `https://你的用户名.github.io/linux-blog/` |

在 `hugo.toml` 中填写自己的完整网址。工作流还会从 GitHub Pages 读取实际 URL；因此项目站点的 CSS、导航、个人照片与搜索路径也会带上正确前缀。

### 2 在 GitHub 设置发布来源

打开仓库 **Settings → Pages → Build and deployment → Source → GitHub Actions**。本模板使用 Actions artifact 部署，不需要创建或选择 `gh-pages` 分支。

### 3 提交并推送

下面命令在 `my-blog-f` 根目录执行。姓名、邮箱和仓库地址均替换成你自己的值。邮箱可使用 GitHub 提供的 noreply 邮箱。

```bash
git config user.name "你的 GitHub 名称"
git config user.email "你的提交邮箱"
git status
git add .
git commit -m "Create Linux course blog"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

若已经有 `origin`，用 `git remote -v` 检查，不要重复添加。HTTPS 推送需要使用 GitHub 支持的认证方式，例如凭据管理器或个人访问令牌；也可使用你已配置的 SSH。不要把令牌写进文件、仓库地址或截图。

### 4 检查工作流与公网结果

进入 **Actions → Build and deploy Hugo**。本模板使用 `peaceiris/actions-hugo@v3` 安装固定版本 Hugo，`actions/checkout` 包含 `submodules: recursive`，构建后通过官方 Pages 动作发布。

工作流成功后，在 `deploy` 任务或 Pages 设置中打开返回的网址。检查首页样式、关于页照片、标签与分类、归档，以及搜索 `Linux` 的结果。保存工作流绿色状态、Pages 设置和公网访问截图。

如果第一次推送时尚未启用 Pages，可以先完成设置，再在 Actions 中重新运行失败的工作流。后续每次推送到 `main` 都会重新部署。

## 使用自己的 Ubuntu 与 Caddy 发布

如果采用老师同意的服务器发布方式，仍需完成宿主机访问虚拟机的验证和课程截图。将项目源码传到服务器，按之前的 Ubuntu + Caddy 管理脚本安装。安装时的 `--source` 应指向含 `hugo.toml` 的博客根目录，`--url` 写实际访问的公网地址。现有服务从同一源码目录构建时，更新源码后运行 `sudo blogctl deploy` 即可。

## 提交前检查

```bash
# 正式构建，不带 -D
hugo --minify

# 主题必须是实际的子模块
cat .gitmodules
git submodule status
git ls-files --stage themes/PaperMod

# public 应被忽略；第二条应无输出
git check-ignore public/index.html
git ls-files public
```

再打开搜索页输入 `Linux`、`Shell`、`权限`，确认真实返回文章；确认首页至少有 3 篇非草稿文章，个人姓名、专业和真实照片已经替换。逐项清单见 [docs/COURSE-CHECKLIST.md](docs/COURSE-CHECKLIST.md)。

## 常见问题

| 现象 | 检查与处理 |
| --- | --- |
| `theme not found` 或页面空白 | 在项目根目录运行 `git submodule update --init --recursive`；检查 `theme = "PaperMod"` |
| 提示模板语法或 Hugo 版本错误 | 本主题要求 Hugo ≥ 0.158.0；本包固定并验证 0.169.0，先检查 `hugo version` |
| 虚拟机本机能开，宿主机打不开 | 检查 bind、虚拟机 IP、网络模式与端口防火墙 |
| 网页无样式或项目站点图片 404 | 检查 `baseURL` 的仓库前缀；图片用 `shot` 或 profile 参数；以网页方式访问 |
| 搜索没有结果 | 检查 `[outputs]` 的 JSON、`content/search.md` 的 layout 和 `/index.json` 实际响应 |
| 本地能看到文章，公网没有 | 检查 `draft` 和 `date`；本地 `-D` 会显示草稿，正式构建不会 |
| GitHub 构建找不到主题 | 检查 `.gitmodules`、主题 gitlink 是否提交、checkout 的 `submodules: recursive` |
| Pages 配置报错或找不到站点 | Source 选择 GitHub Actions；确认仓库允许 Pages，然后重新运行 |
| `public/` 已经被 Git 跟踪 | `.gitignore` 不能自动移除已跟踪文件；确认后执行 `git rm -r --cached public`，再提交 |

## 报告与参考

这是网站源码模板。课程报告仍要按老师文件要求完成：保留本人信息和封面照片、清晰截图、总页数不超过 30 页，最终 PDF 命名为 `序号-学号-姓名.pdf`。序号和截止日期以课程平台为准。Markdown 报告可按课程允许的方式编写；Word 报告优先使用老师提供的模板。报告提纲见 [docs/REPORT-OUTLINE.md](docs/REPORT-OUTLINE.md)。

实现参考以下官方资料，配置于 2026-10-28 核对；模板固定版本，不会每次自动跟随主题最新提交。

- [Hugo Linux 安装](https://gohugo.io/installation/linux/)
- [PaperMod 安装与子模块](https://github.com/adityatelange/hugo-PaperMod/wiki/Installation)
- [PaperMod 首页、搜索、归档功能](https://github.com/adityatelange/hugo-PaperMod/wiki/Features)
- [Hugo 部署到 GitHub Pages](https://gohugo.io/host-and-deploy/deploy-to-github-pages/)
- [peaceiris/actions-hugo](https://github.com/peaceiris/actions-hugo)

PaperMod 遵循 MIT 许可，保留主题目录中的许可文件与页面署名。模板没有修改上游主题源码。
