# 任务管理应用

一个无需登录和后端的单用户任务看板。使用 Vue 3、TypeScript、Vite、Tailwind CSS、Pinia 和浏览器 `localStorage` 实现。

## 功能

- 创建、编辑和删除任务；标题必填，描述可选。
- 固定三列看板：待办、进行中、完成。
- 高/中/低优先级以红/黄/绿徽标和文字同时提示。
- 原生拖拽卡片跨列变更状态；每张卡片也提供“移动到”下拉菜单，方便键盘操作。
- 深色模式一键切换，并在刷新后保留。
- 任务与主题均在当前浏览器本地持久化；异常或损坏的任务数据会自动备份后恢复为空看板，避免白屏。

## 环境要求

- Node.js 20 或更高版本
- npm 10 或更高版本

## 安装与运行

```bash
npm install
npm run dev
```

启动命令会输出本地访问地址（默认是 `http://localhost:5173`）。浏览器中的数据只保存在当前浏览器配置文件中，清除站点数据会同时清除任务。

## 常用命令

```bash
# 类型检查
npm run typecheck

# 运行单元测试
npm test

# 代码规范检查
npm run lint

# 生成生产构建到 dist/
npm run build
```

## 数据存储

应用不会请求网络或保存到服务器。任务保存为带版本号的 JSON：

| localStorage Key | 内容 |
| --- | --- |
| `task-manager.tasks` | `{ version: 1, tasks: [...] }` |
| `task-manager.theme` | `light` 或 `dark` |

若任务 JSON 无法解析、版本未知或结构不合法，原始数据会备份为 `task-manager.tasks.corrupt.<timestamp>`，然后安全地显示空看板。

## 项目结构

```text
src/
├── components/       # 看板、卡片、表单、对话框与通知
├── composables/      # 原生拖拽状态
├── constants/        # 状态、优先级和存储键
├── domain/           # 类型与业务校验
├── infrastructure/   # localStorage Repository
└── stores/           # Pinia 任务与主题状态
tests/unit/           # 校验、Store、Repository 单元测试
```

组件不直接读写任务存储；所有任务持久化通过 `LocalStorageTaskRepository`，任务状态的单一事实源是 Pinia 的 `taskStore.tasks`。
