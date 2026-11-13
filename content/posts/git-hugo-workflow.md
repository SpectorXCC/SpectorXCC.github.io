---
title: "从本地笔记到博客：Git 与 Hugo 的协作"
date: 2026-10-24T16:00:00+08:00
draft: false
summary: "区分 Markdown 源码、主题子模块和 public 构建产物，理解一篇笔记如何经过 GitHub Actions 变成可访问的网页。"
categories: ["工具与实践"]
tags: ["Linux", "Git", "Hugo", "GitHub Pages"]
---

> 示例笔记：这篇文章解释工作流程。请在实际完成虚拟机访问和 GitHub Pages 部署后，补入自己的命令、截图、公网网址及排错过程。

## 博客中有哪些不同的文件

Hugo 将内容、模板和配置组合成静态网页。写文章主要编辑 `content/` 中的 Markdown；全站设置放在 `hugo.toml`；图片一般放在 `static/images/`，构建后会出现在站点的 `images/` 路径。

| 对象 | 本项目中的位置 | 是否进入源码仓库 |
| --- | --- | --- |
| 文章与配置 | `content/`、`hugo.toml` | 是 |
| 自定义样式与页面扩展 | `assets/`、`layouts/` | 是 |
| PaperMod 主题 | `themes/PaperMod` 子模块 | 记录主题仓库地址及提交版本 |
| 构建后的静态文件 | `public/` | 不进入源码主分支 |

`public/` 可以由 Hugo 重新生成，所以 `.gitignore` 应忽略它。这个区分让仓库保留需要维护的源码，同时让部署过程负责生成网页。

## 为什么主题要使用子模块

Git 子模块用一个提交指针关联另一个仓库。父仓库中的 `.gitmodules` 保存主题仓库的地址和位置，Git 索引中的 gitlink 保存具体版本。只复制一个空的 `themes/PaperMod` 目录，并不能安装主题。

```bash
cat .gitmodules
git submodule status
git ls-files --stage themes/PaperMod
```

初始化脚本已经安装主题。在自己的仓库中执行这些检查，应该能看到主题路径、提交哈希，以及 `160000` 类型的子模块记录。之后在另一台机器克隆自己的仓库，可以使用：

```bash
git clone --recurse-submodules 你的仓库地址
```

如果已经克隆但主题缺失，在项目根目录执行 `git submodule update --init --recursive`。GitHub Actions 也需要 `submodules: recursive`，否则构建环境可能只有博客源码而没有主题。

## 从预览到发布

```bash
# 开发预览，-D 表示同时显示草稿
hugo server -D

# 正式构建，默认不发布草稿和未来日期文章
hugo --minify

# 检查本次修改与忽略规则
git status
git check-ignore public/index.html
```

预览用的 `-D` 不应让我们误以为文章已经发布。正式文章需要设置 `draft: false`，日期也不能晚于构建时间。本模板中的三篇示例已经设置为非草稿；新建文章默认仍为草稿，以免把未写完的内容发布出去。

推送代码到 `main` 后，工作流依次拉取源码与子模块、安装 Hugo、生成 `public/`、上传构建产物，最后发布到 Pages。只有工作流成功并且公网页面可以打开，才完成了外网访问验证。

## 常见问题怎样定位

如果本地正常而公网样式缺失，应先检查 `baseURL` 和资源路径。项目站点通常带有仓库名子路径，图片或链接写死为站点根路径时容易访问错误地址。本模板的部署流程会读取 Pages 返回的基础网址，个人照片和截图短代码也通过 Hugo 的 URL 函数处理路径。

如果搜索框没有结果，应检查首页的 JSON 输出、`index.json` 是否可以访问，以及搜索页的 `layout: search`。如果所有文章消失，则检查 `draft`、日期和 `content/posts/` 路径。

自己的实验总结应选取至少一个实际问题，记录“现象—检查方法—原因—修改—复测”，并提供相应截图。这样能说明自己理解了发布过程，而不仅是让页面暂时显示出来。
