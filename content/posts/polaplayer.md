---
title: "PolaPlayer：基于 Kotlin 与 Jetpack Compose 的 Android 多来源音乐播放器"
date: 2026-11-10T10:00:00+08:00
draft: false
hiddenInHomeList: true
summary: "融合本地音频、Navidrome/Subsonic、网易云音乐与 QQ 音乐曲库的 Android 11+ 音乐播放器，采用 Jetpack Compose 与 Media3 构建沉浸式流光播放体验。"
categories: ["项目实践"]
tags: ["Android", "Kotlin", "Jetpack Compose", "Media3", "音乐播放器"]
ShowToc: true
---

> 开源仓库：<https://github.com/SpectorXCC/PolaPlayer>（Kotlin + Jetpack Compose，GPLv3 协议发布）。

## 项目定位与视觉理念

**PolaPlayer** 是一款面向 Android 11（API 30）及以上设备的开源多来源音乐播放器（GPLv3），使用 **Kotlin + Jetpack Compose + Android Media3** 从零搭建核心播放与曲库管理链路，界面参考 Apple Music 与椒盐音乐的克制美学——**“一个播放器，多种音乐来源”**。

{{< shot src="images/polaplayer/preview.png" alt="PolaPlayer 沉浸式播放界面与封面动态取色预览" caption="PolaPlayer 全屏播放界面：封面动态取色流光、逐行歌词与待播队列自然切换" >}}

---

## 核心特性拆解

### 1. 多音乐来源聚合与独立开关
- 原生扫描 **设备本地音乐**（离线断网直读原文件）；
- 支持自托管 **Navidrome / Subsonic**（含 OpenSubsonic `songLyrics` 扩展）；
- 兼容 **网易云音乐** 与 **QQ 音乐** 登录同步歌曲和歌单；
- 支持单独启用/停用任意来源——停用后依然保留已索引曲目和自建歌单信息，不再混乱出错。

### 2. 跨来源自建歌单与混合播放队列
- 在同一首「我的歌单」中自由混合来自不同音乐源的曲目，支持重命名、排序与删除；
- 按每首歌的原始来源解析真实播放地址，支持断线恢复播放队列；
- 某首歌播放失败时在详情提示具体原因，并提供一键「重试播放」。

### 3. 沉浸式全屏播放器与歌词系统
- **封面流光背景**：随当前播放曲目封面动态取色，歌词与队列二级页之间无割裂切换；
- **多源与本地歌词**：支持逐行高亮、译文显示与点击跳转；本地曲目支持手动导入 `.lrc` 歌词（自动兼容 UTF-8、UTF-16 BOM、GB18030）；
- **边播边缓存**：支持关闭、512 MB、1 GB（默认）、2 GB、5 GB 空间上限与按来源/账号隔离缓存复用，退出账号自动清理对应隐私缓存。

### 4. 工程安全与 CI/CD 流水线
- 敏感账号与连接凭据全部通过 **Android Keystore** 加密存储；
- 配置了完整的 GitHub Actions CI（单元测试 + Lint + Debug APK）及手动签名发行工作流（输出签名 Release APK 与 `SHA256SUMS` 校验）。

---

## 构建与技术栈

| 层面 | 技术选型 |
| --- | --- |
| 语言与界面 | Kotlin, Jetpack Compose, Material 3 |
| 媒体播放核心 | Android Media3 (`ExoPlayer` + 通知栏媒体控制) |
| 多源与加密 | Subsonic / OpenSubsonic, 社区接口适配, Android Keystore |
| 运行环境 | Android 11+ (API 30–36.1), JDK 21 |
