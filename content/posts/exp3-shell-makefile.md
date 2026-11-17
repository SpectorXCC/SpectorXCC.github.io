---
title: "实验三：Linux Shell 编程及 Makefile 实践"
date: 2026-11-05T16:00:00+08:00
draft: false
summary: "围绕 Bash 条件判断、参数循环、带时间戳日志备份脚本与 Makefile 自动化构建开展实践（报告正文与截图待补充）。"
categories: ["Linux 实验"]
tags: ["Linux", "Shell", "Makefile"]
ShowToc: false
---

> 本实验报告正在整理中，实操记录与终端截图后续补充。

## 实验内容框架

1. **Bash Shell 基础与流程控制**：熟练使用 `if / elif / else`、`case`、`read` 读取键盘输入与 `for` 循环遍历命令行参数，掌握 `date` 时间戳命名与 `tee -a` 双向日志输出。
2. **文件与目录备份脚本**：编写带可执行权限与 `bash -x` 调试验证的批量备份脚本。
3. **Makefile 自动化编译**：理解目标、依赖与执行规则，编写可自动维护多源文件项目编译与清理任务的 `Makefile`。
