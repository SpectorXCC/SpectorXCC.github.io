# 课程要求与截图清单

依据《02-Linux课程大作业-20261026.docx》整理。下面的勾选表示你在自己环境中完成并保存证据；模板提供的文件不能代替操作截图。

## 环境搭建与基础配置 20 分

- [ ] 5 分：在 Linux 虚拟机执行 `hugo version`，保存版本截图。
- [ ] 2 分：保存 `hugo new site` 成功创建站点的终端截图；初始化脚本会执行该命令。
- [ ] 3 分：完成 `git submodule add`，用 `.gitmodules`、`git submodule status` 或主题目录证明主题已安装。
- [ ] 2 分：`hugo.toml` 中设置 `theme = "PaperMod"`。
- [ ] 4 分：`[outputs] home = ["HTML", "RSS", "JSON"]`。
- [ ] 4 分：首页、关于、标签、分类、归档、搜索六个菜单完整，weight 顺序正确。

## 内容与功能 30 分

- [ ] 3 分：首页简介来自 `[params.homeInfoParams]`，已经换成自己的介绍。
- [ ] 2 分：首页显示至少 3 篇文章的标题与摘要。
- [ ] 3 分：关于页包含真实姓名和专业。
- [ ] 2 分：关于页替换为真实个人照片并正常显示，不能保留占位图。
- [ ] 5 分：至少 3 篇文章，均为 `draft: false`，日期不在未来。
- [ ] 5 分：文章有实质性文字，已结合自己的作业、实验或编制内容修改。
- [ ] 2 分：每篇文章设置合理的 `categories`、`tags`。
- [ ] 1 分：标签页能进入对应文章列表。
- [ ] 1 分：分类页能进入对应文章列表。
- [ ] 1 分：归档页按时间显示文章。
- [ ] 2 分：存在 `content/search.md` 且 `layout: "search"`。
- [ ] 3 分：搜索 `Linux` 能返回结果，点击可进入文章。

## 方式 A 宿主机访问 15 分

- [ ] 5 分：使用 `hugo server --bind 0.0.0.0 -D` 或等价命令，截图包含启动命令和服务输出。
- [ ] 5 分：宿主机访问 `http://虚拟机IP:1313/`，截图同时包含 IP 地址栏和首页。
- [ ] 5 分：保存约 2—3 张子页面截图，展示关于、标签、搜索等菜单可访问。

## 方式 B GitHub Pages 25 分

- [ ] 3 分：源码推送到自己的 GitHub 仓库，保存仓库文件列表。
- [ ] 2 分：`.gitignore` 包含 `public/`，本地构建结果未提交到源码主分支。
- [ ] 3 分：存在 `.github/workflows/hugo.yaml`。
- [ ] 4 分：checkout 明确配置 `submodules: recursive`。
- [ ] 3 分：工作流使用 `peaceiris/actions-hugo` 等课程认可动作。
- [ ] 3 分：自己的 GitHub Actions 运行记录为绿色成功。
- [ ] 3 分：Settings → Pages 的 Source 设置为 GitHub Actions。
- [ ] 4 分：提供可直接访问的公网网址，截图证明公网样式与本地一致。

## 规范与文档 10 分

- [ ] 3 分：环境安装、构建、访问、GitHub 配置等关键操作均有清晰截图。
- [ ] 2 分：截图包含必要的虚拟机 IP、GitHub 用户名和公网 URL，关键信息无遮挡。
- [ ] 2 分：提交完整源码或自己的 GitHub 仓库链接。
- [ ] 3 分：README 或实验报告写明自己实际遇到的问题和解决办法。

## 建议截图顺序

| 建议文件名 | 画面内容 |
| --- | --- |
| `01-hugo-version.png` | Linux 终端的 Hugo 版本 |
| `02-new-site.png` | `hugo new site` 命令及成功提示 |
| `03-theme-submodule.png` | 子模块安装结果、`.gitmodules` 或 status |
| `04-config.png` | 主题、outputs、菜单等关键配置，可适当合并 |
| `05-server.png` | bind 启动命令、IP、端口和终端输出 |
| `06-host-home.png` | 宿主机浏览器地址栏 IP 和首页 |
| `07-host-about.png` | 宿主机访问的姓名、专业、照片 |
| `08-host-tags.png` | 标签或分类页，以及对应文章列表 |
| `09-host-search.png` | 输入 Linux 并显示真实搜索结果 |
| `10-repository.png` | GitHub 源码文件列表，包含子模块，主分支无 public |
| `11-workflow.png` | hugo.yaml 的关键步骤与子模块配置 |
| `12-actions-success.png` | 本人仓库的绿色运行记录 |
| `13-pages-settings.png` | Pages 来源设置 |
| `14-public-site.png` | 公网地址栏和博客样式，可另补搜索或照片验证 |

用系统截图工具，不要拍摄屏幕。截图保持原长宽比，在报告放大到 150% 时仍应清晰；合并图片时保持图号、图注和对齐。当前包内没有伪造的实验截图。

## 最终报告格式

- [ ] 封面包含姓名、学院、专业、班级、学号和二寸电子照片。
- [ ] Word 方式按老师模板：中文小四宋体，英文小四 Times New Roman，1.25 倍行距；Markdown 方式按课程允许规则编制。
- [ ] 图片、图号、图注居中，重要内容清楚。
- [ ] 不超过 30 页，删除无关页，保留关键代码和结果。
- [ ] 最终 PDF 文件名严格为 `序号-学号-姓名.pdf`，没有多余字符。
- [ ] 序号以老师给出的表为准，截止日期以畅课平台为准。
