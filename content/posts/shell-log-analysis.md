---
title: "用 Shell 分析日志：管道与一个小脚本"
date: 2026-10-22T14:00:00+08:00
draft: false
summary: "从一份练习日志开始，用 grep、cut、sort 和 uniq 提取信息，再把重复步骤整理成可运行的脚本。"
categories: ["Shell 实践"]
tags: ["Linux", "Shell", "管道", "日志"]
---

> 示例笔记：这里的日志是人为构造的练习数据。请补上自己的运行记录和截图，不要把预期结果写成已完成的实验结论。

## 准备一份可重复使用的输入

Shell 的管道可以把前一个命令的标准输出交给后一个命令。为了理解数据如何流动，先建立格式简单、每行字段位置一致的日志：

```bash
mkdir -p ~/linux-course-lab/logs
cd ~/linux-course-lab/logs
cat > app.log <<'EOF'
INFO startup
INFO user_login
WARN slow_response
ERROR connection_timeout
INFO task_finished
ERROR file_missing
EOF
```

每行第一列是日志级别，第二列是事件。这个练习数据只有六行，因此既能手工核对结果，也便于定位命令处理错了哪一步。

## 从筛选到统计

```bash
grep '^ERROR ' app.log
cut -d ' ' -f 1 app.log | sort | uniq -c
wc -l < app.log
```

`^ERROR ` 中的 `^` 表示行首，避免匹配到正文中偶然出现的 ERROR。`cut` 用空格作为分隔符取第一列；`sort` 将相同级别放在一起；`uniq -c` 统计连续相同的行。由于 `uniq` 只比较相邻行，所以在这个统计任务中需要先排序。

对于上面的练习输入，预期有 3 行 INFO、2 行 ERROR 和 1 行 WARN。请把自己的输出与这个预期比较，并解释统计管道中每一步的数据变化。

## 把步骤写进脚本

将下面的内容保存为 `summarize.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

log_file="${1:-app.log}"
if [[ ! -f "$log_file" || ! -r "$log_file" ]]; then
  printf '无法读取日志文件：%s\n' "$log_file" >&2
  exit 1
fi

printf '总行数：'
wc -l < "$log_file"
printf '\n各级别计数：\n'
cut -d ' ' -f 1 "$log_file" | sort | uniq -c
```

运行方式：

```bash
chmod u+x summarize.sh
./summarize.sh app.log
./summarize.sh missing.log
echo "$?"
```

`${1:-app.log}` 表示没有传入第一个参数时使用默认文件名。给变量加双引号可以正确处理包含空格的路径。脚本主动检查输入，把错误信息写入标准错误，并用非零退出状态说明失败。

`set -euo pipefail` 提供常用的错误检查，但并不能替代对业务条件的判断。尤其是 `grep` 没找到匹配内容时会返回 1；将它放进需要“零匹配也正常”的统计脚本时，应单独处理这种情况。

## 结果分析与局限

请保存成功统计和文件不存在两种情况的截图，并说明它们的退出状态。还可以加入空行或连续空格，观察目前的 `cut` 方案是否仍然准确。

这份脚本只针对本例的简单格式。真实日志的字段数量和分隔符可能不同，需要先理解输入格式，再选择 `awk` 等工具或调整解析规则。写实验分析时，应明确脚本在哪些输入条件下适用。
