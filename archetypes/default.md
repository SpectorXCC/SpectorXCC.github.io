---
title: "{{ replace .File.ContentBaseName "-" " " }}"
date: {{ .Date }}
draft: true
summary: "用一两句话说明这篇文章解决的问题。"
categories: ["学习笔记"]
tags: ["Linux"]
---

## 实验目的

写清楚要验证的知识点和操作环境。

## 操作步骤

记录实际运行的命令，并解释关键参数。

```bash
pwd
```

## 结果与分析

填入自己的观察，并插入截图。图片放入 static/images/ 后，可使用：

<!-- {{</* shot src="images/your-screenshot.png" alt="截图说明" caption="图 1 实验结果" */>}} -->

## 问题与改进

记录实际出现的问题、原因、解决办法以及复测结果。

写完后把 draft 改为 false，并把 date 改成真实记录日期（不要使用未来日期）。
