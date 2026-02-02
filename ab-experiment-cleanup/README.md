# A/B 实验代码清理 Skill

这是一个用于清理已推全的 A/B 实验代码的 Claude Code skill，可以自动分析代码、生成影响面分析和回测报告。

## 功能特性

- 🔍 **智能代码扫描**：自动识别实验字段在代码库中的所有引用
- 🔄 **组件兼容性检查**：自动对比新旧组件实现，确保迁移安全
- 📊 **影响面分析**：生成详细的影响面分析报告，包括受影响的文件、功能模块和风险评估
- ✅ **回测报告**：自动生成业务回测检查清单和测试建议
- 🛡️ **安全清理**：在执行修改前生成清理计划，确保用户确认后再操作
- 📝 **完整文档**：输出详细的变更报告和后续行动项
- 💾 **Markdown 文件输出**：自动生成 3 个 Markdown 格式的报告文件，方便归档和分享
  - 影响面分析报告（`impact-analysis-*.md`）
  - 回测计划报告（`test-plan-*.md`）
  - 最终清理报告（`cleanup-report-*.md`）

## 安装方法

### 方法 1：本地安装（推荐用于开发）

```bash
# 在当前目录下已经创建好了 skill
cd ab-experiment-cleanup

# 可以直接在 Claude Code 中使用
# 将此目录添加到 ~/.claude/skills/ 目录下
cp -r ab-experiment-cleanup ~/.claude/skills/
```

### 方法 2：从 GitHub 安装（推荐用于分享）

如果你将这个 skill 推送到 GitHub：

```bash
npx skills add <your-username>/ab-experiment-cleanup
```

## 使用方法

在 Claude Code 中，使用以下格式调用这个 skill：

```
/ab-experiment-cleanup

<实验字段名> 实验字段对应的实验已经推全，<实验字段名> 字段全量为 <true/false>，
请下掉走到 <实验字段名> 为 <false/true> 的业务逻辑代码，
并产出影响面分析和业务回测报告
```

### 示例

```
/ab-experiment-cleanup

enableNewCheckout 实验字段对应的实验已经推全，enableNewCheckout 字段全量为 true，
请下掉走到 enableNewCheckout 为 false 的业务逻辑代码，
并产出影响面分析和业务回测报告
```

## 工作流程

1. **信息确认**：Agent 会确认实验字段名称、全量值等关键信息
2. **代码扫描**：扫描代码库中所有相关的代码引用
3. **组件兼容性检查**：如果涉及组件迁移，使用 diff 对比新旧组件实现，确保兼容性
4. **生成计划**：生成详细的代码清理计划
5. **影响面分析**：分析受影响的文件、功能模块和风险
6. **回测报告**：生成回测检查清单和测试建议
7. **执行清理**：在用户确认后执行代码修改
8. **最终报告**：生成完整的变更报告

## 输出内容

### 1. 清理计划
- 每个文件的具体修改位置
- 要删除的代码块
- 要保留的代码块

### 2. 影响面分析报告
- 受影响文件清单（按类型分类）
- 功能模块影响评估
- 依赖关系分析
- 风险等级评估
- **自动生成 MD 文件**：`docs/ab-experiment-cleanup/impact-analysis-{实验字段名}-{日期}.md`

### 3. 回测报告
- 回测检查清单（按功能模块）
- 测试用例建议
- 数据验证建议
- 监控指标建议
- **自动生成 MD 文件**：`docs/ab-experiment-cleanup/test-plan-{实验字段名}-{日期}.md`

### 4. 最终变更报告
- 变更摘要
- 详细变更列表
- 后续行动项
- **自动生成 MD 文件**：`docs/ab-experiment-cleanup/cleanup-report-{实验字段名}-{日期}.md`

### 生成的文件示例

执行后会在项目中生成以下文件：
```
docs/
└── ab-experiment-cleanup/
    ├── impact-analysis-enableNewCheckout-2026-02-02.md
    ├── test-plan-enableNewCheckout-2026-02-02.md
    └── cleanup-report-enableNewCheckout-2026-02-02.md
```

这些文件可以：
- 提交到代码仓库作为变更记录
- 分享给团队成员进行 Review
- 作为后续回测的参考文档

## 适用场景

- ✅ 前端 A/B 实验代码清理
- ✅ Feature Flag 清理
- ✅ 灰度发布后的代码简化
- ✅ 实验推全后的代码维护

## 支持的文件类型

- JavaScript (`.js`)
- TypeScript (`.ts`)
- React (`.jsx`, `.tsx`)
- Vue (`.vue`)
- 配置文件 (`.json`, `.yaml`)

## 注意事项

1. **最小化变更原则**（最重要）：
   - 只修改与实验直接相关的代码
   - 不要删除任何无关的逻辑（初始化、状态管理、埋点、Loading 等）
   - 不要简化整个文件
   - 目的：减少回测范围，降低风险

2. **备份代码**：在执行清理前，建议先提交当前代码或创建分支

3. **仔细审查**：务必仔细审查生成的清理计划，确保理解每个变更

4. **执行测试**：清理后必须执行完整的回测，确保功能正常

5. **监控指标**：上线后密切监控关键业务指标

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个 skill！

## 许可证

MIT
