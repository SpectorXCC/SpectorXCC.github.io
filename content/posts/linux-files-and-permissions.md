---
title: "Linux 文件与权限：从路径到可执行脚本"
date: 2026-10-20T10:00:00+08:00
draft: false
summary: "用一个小型练习目录，串起路径、文件操作和 rwx 权限；理解 chmod 之后究竟改变了什么。"
categories: ["Linux 基础"]
tags: ["Linux", "文件管理", "权限"]
---

> 示例笔记：以下介绍知识点与练习步骤，不代表你已经完成实验。请运行命令，加入自己的终端截图、观察和分析，再删除这段提示。

## 为什么先理解路径

Linux 以 `/` 为根目录组织文件。绝对路径从根目录开始，含义不依赖当前位置；相对路径则从当前工作目录开始。`pwd` 可以确认当前位置，`ls -la` 可以同时查看隐藏文件和权限信息。

在实验中，先确认当前目录再执行操作，可以减少“文件明明存在却找不到”的情况。下面只在家目录中新建练习目录，不会触碰系统目录。

```bash
mkdir -p ~/linux-course-lab/files
cd ~/linux-course-lab/files
pwd
printf 'Hello, Linux!\n' > hello.txt
ls -la
cat hello.txt
cp hello.txt hello-copy.txt
mv hello-copy.txt renamed.txt
```

`mkdir -p` 会按需创建父目录；`cp` 复制文件内容，`mv` 可以移动或重命名文件。重定向符号 `>` 会覆盖目标文件，因此在重复实验时要注意已有内容；`>>` 则会追加到文件末尾。

## 如何读权限位

`ls -l` 输出的第一组字符包含文件类型与权限。例如 `-rw-r--r--` 中，开头的 `-` 表示普通文件，后面依次为所有者、所属组和其他用户的权限。

| 权限 | 数值 | 对普通文件的含义 | 对目录的含义 |
| --- | --- | --- | --- |
| `r` | 4 | 读取文件内容 | 列出目录项名称 |
| `w` | 2 | 修改文件内容 | 修改目录项，通常还需要执行权限 |
| `x` | 1 | 尝试将文件作为程序执行 | 访问、穿过这个目录 |

因此，`644` 表示所有者可读写，其余用户只读；`755` 表示所有者可读写执行，其余用户可读执行。权限的数值只是表示方法，真正需要判断的是“谁需要对这个对象做什么”。

## 给脚本增加执行权限

创建一个独立的小脚本，分别用解释器调用和直接执行的方式运行：

```bash
cat > greet.sh <<'EOF'
#!/usr/bin/env bash
printf 'Hello from a shell script!\n'
EOF

chmod 644 greet.sh
ls -l greet.sh
bash greet.sh
chmod u+x greet.sh
ls -l greet.sh
./greet.sh
```

`bash greet.sh` 让 Bash 读取脚本，不要求脚本本身有执行权限。`./greet.sh` 则直接执行路径指向的文件，通常需要执行权限，并依据首行 shebang 选择解释器。`chmod u+x` 只给所有者增加执行权限，不会把所有权限统一放开。

## 记录自己的观察

请比较两次 `ls -l greet.sh` 的输出，说明哪一组权限发生了变化。也可以在加权限之前尝试 `./greet.sh`，记录实际提示，再解释错误产生的原因。若仍无法执行，检查 shebang、文件换行符以及挂载选项等因素。

把截图放到 `static/images/linux-permissions.png`，然后在这里使用下面的短代码；图片尚未保存时不要取消注释。

<!-- {{</* shot src="images/linux-permissions.png" alt="权限修改前后的终端输出" caption="图 1 脚本权限与运行结果" */>}} -->

这次练习的重点是把路径、文件类型、权限和运行方式联系起来。自己的总结应写出观察到的现象，不能只列出命令名称。
