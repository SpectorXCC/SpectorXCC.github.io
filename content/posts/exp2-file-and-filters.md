---
title: "实验二：Linux 文件管理及文件过滤实践"
date: 2026-10-29T14:00:00+08:00
draft: false
summary: "围绕文件与软硬链接管理、Vim 模式编辑以及 grep / sed / awk 管道统计完成全流程实操与思考总结。"
categories: ["Linux 实验"]
tags: ["Linux", "Vim", "grep", "sed", "awk"]
ShowToc: true
---

## 一、实验目的

1. 掌握 Linux 下常见的文件与目录管理操作，包括创建、复制、移动、删除以及软/硬链接的建立。
2. 掌握 Vim 编辑器的基本使用流程，熟悉普通模式、插入模式与命令行模式间的切换，掌握保存退出、光标移动、文本修改、查找与全局替换等操作。
3. 掌握 `grep`、`sed`、`awk` 三类文本过滤工具的核心用法与定位差异。
4. 理解并运用正则表达式（字符集、量词、边界锚定）进行精细化文本匹配与模式提取。
5. 掌握组合多工具串联的多步骤文本分析与数据统计。

## 二、实验内容与步骤

### （一）文件管理操作

#### 1. 目录与文件创建

```bash
cd ~
mkdir -p file_experiment/{dir1,dir2,dir3}
cd file_experiment
ls -R

touch file1.txt file2.txt file3.log
echo "Hello Linux" > file1.txt
echo "This is file2" > file2.txt
echo "Error: test log" > file3.log
cat file1.txt
```

{{< shot src="images/experiments/exp2/s201.png" alt="截图1：创建目录和文件" caption="截图 1：创建目录和文件" >}}

#### 2. 文件复制与移动

```bash
cp file1.txt dir1/
cp file2.txt dir2/
cp -r dir1 dir1_backup
mv file3.log dir3/error.log
mv *.txt dir1/
tree .
```

{{< shot src="images/experiments/exp2/s202.png" alt="截图2：文件复制、移动" caption="截图 2：文件复制与移动命令执行结果" >}}

{{< shot src="images/experiments/exp2/s202_.png" alt="截图2补充：tree 显示目录结构的截图" caption="截图 2 补充：tree 命令显示的目录树结构" >}}

#### 3. 文件链接（硬链接与软链接）

```bash
ln file1.txt hard_link_file1
ln -s file1.txt soft_link_file1
file hard_link_file1
file soft_link_file1
```

{{< shot src="images/experiments/exp2/s203.png" alt="截图3：创建硬链接、软链接及查看链接类型" caption="截图 3：创建硬链接、软链接及查看链接类型" >}}

---

### （二）Vim 编辑器练习

#### 1. 使用 Vim 录入学生成绩表
新建 `student_scores.txt`
录入数据：
```text
zhang3 85 male ComputerScience
li4 92 female Geomatics
wang5 78 male Geology
zhao6 65 female Surveying
sun7 88 male ComputerScience
```

#### 2. Vim 检索、替换与快捷键操作
再次用 Vim 打开文件，设置行号便于定位，执行定位查找与范围替换：

```vim
:set nu
/geology
:s/geology/GEOLOGY/
:%s/male/Man/g
:wq
```

{{< shot src="images/experiments/exp2/s204.png" alt="截图4：Vim 编辑界面及查找替换" caption="截图 4：Vim 编辑界面及查找替换操作" >}}

---

### （三）文件过滤实践

先向 `student_scores.txt` 追加 3 条样本数据，扩充后的数据源如下：

```text
zhang3 85 male ComputerScience
li4 92 female Geomatics
wang5 78 male Geology
zhao6 65 female Surveying
sun7 88 male ComputerScience
chen8 95 Male ComputerScience
huang9 70 Female Surveying
lin10 82 Male Geology
```

#### 1. grep 文本检索练习

```bash
grep "ComputerScience" student_scores.txt
grep "Male" student_scores.txt
grep -i "male" student_scores.txt
grep -n "female" student_scores.txt
grep -v "ComputerScience" student_scores.txt
grep -E " 9[0-9] " student_scores.txt
grep -c "Geology" student_scores.txt
grep -rn "ssh" /etc/ 2>/dev/null
```

{{< shot src="images/experiments/exp2/s205.png" alt="截图5：grep 各种用法及运行结果" caption="截图 5：grep 多场景匹配与运行结果" >}}

### （四）sed 流编辑练习

`sed` 适合基于行规则实施非交互式的文本改写。默认情况下处理结果只送入标准输出，配合 `-i` 才能就地生效。

```bash
sed 's/ComputerScience/CS/g' student_scores.txt

sed -i 's/Male/Female/g' student_scores.txt

sed -i.bak 's/ComputerScience/CS/g' student_scores.txt
cat student_scores.txt

sed '3d' student_scores.txt

sed -n '2,4p' student_scores.txt

sed '/Geology/d' student_scores.txt
```

{{< shot src="images/experiments/exp2/s206.png" alt="截图6：sed 替换前后对比、删除及范围打印" caption="截图 6：sed 替换、删除与范围打印输出" >}}

---

### （五）awk 字段处理与统计

`awk` 具备内置字段拆分能力，适合处理以空格或特定字符切分的表格化文本。

```bash
awk '{print $1, $2}' student_scores.txt

awk '$2 > 80 {print $1, $2}' student_scores.txt

awk '{sum += $2} END {printf "总分: %.2f, 平均分: %.2f\n", sum, sum/NR}' student_scores.txt

awk '{
    sum[$4] += $2;
    count[$4]++;
}
END {
    for (major in sum)
        printf "%s: 人数=%d, 平均分=%.2f\n", major, count[major], sum[major] / count[major];
}' student_scores.txt
awk -F: '{print $1}' /etc/passwd | head -5
```

{{< shot src="images/experiments/exp2/s207.png" alt="截图7：awk 字段提取、条件过滤与分组统计" caption="截图 7：awk 字段提取、条件过滤与分组统计" >}}

---

### （六）管道协同与多命令组合

```bash
grep ComputerScience student_scores.txt | awk '{print $1, $2}'
cat student_scores.txt | sort -k2 -n | tail -3
awk '{print $4}' student_scores.txt | sort | uniq -c
awk '$2 > 80' student_scores.txt | sed 's/ComputerScience/CS/g'
grep -E "8[0-9]|9[0-9]" student_scores.txt > high_scores.txt
cat high_scores.txt
```

{{< shot src="images/experiments/exp2/s208.png" alt="截图8：管道组合命令执行结果" caption="截图 8：管道组合命令统计与过滤输出" >}}

## 三、思考题

### 1. grep、sed、awk 三者可以互相替代吗？各自的侧重点是什么？请各举一个最适合用它而不是另外两个的场景。

**不能完全替代。** 尽管 `awk` 在图灵完备性上能模拟另外两者，但三者在工具链定位、执行开销和编写复杂度上各有侧重：

* **grep（文本检索过滤）**
  * **侧重点**：专注高速匹配文本行，只管“找”，不改写内容。
  * **最优场景**：大范围递归排查日志或配置。例如 `grep -rn "Failed password" /var/log/auth.log`，不仅响应极快，而且原生带行号与高亮，用另外两者写会显得冗长且效率偏低。
* **sed（流式批量改写）**
  * **侧重点**：专注行级规则变换、定点删除与正则替换，擅长“非交互式修改”。
  * **最优场景**：自动化脚本中就地修改配置文件某参数。例如 `sed -i.bak 's/^#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config`，一条命令即可完成原文件就地修改与安全备份。
* **awk（结构化字段提取与统计分析）**
  * **侧重点**：具备完整的编程语法（变量、关联数组、内置数学函数），擅长按列切割、数值计算和生成统计报表。
  * **最优场景**：按字段分组求和与计算平均值。例如统计各专业的平均分 `awk '{s[$4]+=$2; c[$4]++} END {for(k in s) print k, s[k]/c[k]}'`，此类涉及列切分、聚合计算的任务，`grep` 完全做不到，`sed` 实现起来极其繁琐脆弱。

---

### 2. Vim 的「普通模式」和「插入模式」为什么要分开设计？直接像记事本一样输入有什么问题？

传统记事本始终处于“所见即所得的直接输入”状态，如果需要移动光标、删除行或做批量替换，用户必须频繁依赖鼠标，或者狂按 `Ctrl`、`Alt`、方向键等组合键。这种方式在大段文本移动或高频运维修改时效率很低，手掌也必须反复在主键盘区与鼠标/方向键之间来回挪动。

Vim 将输入与指令拆开：
1. **全键盘盲打控制**：在普通模式下，整个 26 键字母区直接映射为编辑动词（如 `d` 删、`y` 复制、`c` 修改、`p` 粘贴），配合移动量词（如 `w` 词、`$` 行尾、`G` 文末），单手几个键击就能完成精准的结构化编辑。
2. **命令组合正交性**：Vim 允许“操作符 + 范围”自由拼接（例如 `d3w` 表示删除接下来三个单词，`ci"` 表示修改双引号内的全部内容）。如果混在一个随时可能产生文字输入的文本流里，系统就无法判断当前击键是文字还是控制动作。
3. **更适合终端远程操作**：在 SSH 或无图形界面的服务器环境下，终端鼠标支持往往有限或存在网络延迟。基于模式的状态机设计让纯键盘操作的确定性与执行速度达到了极致。

---

### 3. 如何使用一个命令统计 /etc/passwd 文件中各 shell 类型的使用次数？

命令如下：

```bash
awk -F: '{print $7}' /etc/passwd | sort | uniq -c
```

**命令解析**：
1. `awk -F: '{print $7}' /etc/passwd`：以冒号 `:` 为字段分隔符，提取 `/etc/passwd` 每行的第 7 个字段（即该账户默认指定的登录 shell）。
2. `sort`：对提取出来的 shell 路径按字典序排序，将相同的 shell 聚拢到相邻行，为 `uniq` 提供必要前提。
3. `uniq -c`：统计相邻重复行的出现频次，并在每类 shell 名称前附带对应的计数值。

---

### 4. 硬链接和软链接的区别是什么？各有什么优缺点？

两者的根本差异在于**是否独立分配 inode，以及指向的是底层数据块还是文件名路径**：

| 对比维度 | 硬链接 (Hard Link) | 软链接 / 符号链接 (Symbolic Link) |
| :--- | :--- | :--- |
| **底层实现** | 与原文件共享同一个 inode 编号和底层数据块，仅增加该 inode 的引用计数（Link Count） | 是一个新建的独立文件（有独立 inode），文件内部仅存放目标文件的路径字符串 |
| **原文件删除影响** | 原文件名被删除后，inode 计数减 1，只要引用计数大于 0，数据块依然安全，硬链接文件照样正常读写 | 原文件一旦被删除或重命名，软链接立即变成死链（Broken Link），无法再读取内容 |
| **跨文件系统支持** | **不支持**（inode 仅在同一个文件系统内部唯一定位） | **支持**（仅通过路径寻址，可自由跨分区、跨挂载盘） |
| **对目录的支持** | **通常不允许**（为了防止在文件系统目录树中形成不可解的死循环） | **完全支持**（可对任意合法目录建立软链接，常用于路径别名） |
| **主要优缺点** | 优点：防误删容错性高，访问不经过二次重定向；缺点：受分区限制，且无法链接目录 | 优点：灵活直观，可跨盘可链目录；缺点：对原文件路径强依赖，原路径一旦变动即失效 |

## 四、实验总结

本次实验围绕 Linux 下的文件系统管理与核心文本处理工具链展开。

在文件操作环节，验证了目录结构的层级创建、文件通配符批量迁移以及软硬链接的底层区别。通过终端命令观察到，硬链接本质上是同一 inode 的别名，原文件名移除并不会破坏底层数据块；而软链接则是依赖目标路径寻址的快捷方式。

在文本处理环节，逐步练习了“Linux 文本三剑客”：
1. `grep` 专注于行筛选，结合正则量词与锚定符可以在海量日志中实现靶向定位；
2. `sed` 擅长按行规则进行流水线改写与就地修订（`-i`），有效替代了低效的手工排版；
3. `awk` 则具备表格化数据处理的先天优势，通过内置字段变量 `$1~$NF` 与关联数组，可轻松完成分组、求和与均值统计。

整个实验最核心的收获在于理解了 Linux **“组合单一工具，借助管道串接复杂逻辑”** 的哲学：不管是 `grep` 粗筛、`awk` 取列，还是 `sort | uniq -c` 聚类统计，只要输入输出遵循纯文本流规范，就能以搭积木的方式低成本解决复杂的数据处理需求。
