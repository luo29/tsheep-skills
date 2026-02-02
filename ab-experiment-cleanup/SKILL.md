---
name: ab-experiment-cleanup
description: 清理已推全的 A/B 实验代码，生成影响面分析和回测报告
---

# A/B 实验代码清理

当 A/B 实验推全后，帮助用户安全地清理实验代码，并生成详细的影响面分析和回测报告。

## 使用场景

当用户说类似以下内容时使用此 skill：
- "xxx 实验字段对应的实验已经推全，请下掉相关代码"
- "xxx 字段全量为 true，请删除 false 分支的代码"
- "实验 xxx 已经结束，需要清理代码并产出影响面分析"

## 工作流程

### 第 1 步：理解实验信息

从用户输入中提取关键信息：
- **实验字段名称**：例如 `enableNewCheckout`
- **全量值**：实验推全后的值（通常是 `true` 或 `false`）
- **要删除的分支**：与全量值相反的分支代码

向用户确认：
- 实验字段的准确名称
- 全量值是什么
- 是否需要删除配置文件中的实验定义

### 第 2 步：代码扫描与分析

使用 Grep 工具搜索实验字段在代码库中的所有出现位置：

```bash
# 搜索实验字段的所有引用
grep -r "实验字段名" --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx"
```

对每个找到的文件：
1. 使用 Read 工具读取完整文件内容
2. 识别实验相关的代码模式：
   - 条件判断：`if (experimentField)`, `if (!experimentField)`
   - 三元运算符：`experimentField ? A : B`
   - Switch 语句：`switch(experimentField)`
   - 逻辑运算：`experimentField && doSomething()`
3. 确定哪些代码块需要保留，哪些需要删除

### 第 3 步：组件迁移兼容性检查

**重要：** 如果清理计划涉及组件迁移（从旧版组件迁移到新版组件），必须先进行兼容性检查。

#### 3.1 识别组件迁移场景

检查是否存在以下情况：
- 需要将旧版组件（如 `ComponentName_old`）迁移到新版组件（如 `ComponentName`）
- 需要更改组件的导入路径
- 存在外部依赖使用了旧版组件

#### 3.2 执行组件兼容性检查

对于每个需要迁移的组件，执行以下检查：

**步骤 1：对比核心组件实现**

使用 `diff` 命令对比新旧组件的实现：

```bash
# 对比主组件
diff -u src/components/ComponentName_old/index.tsx src/components/ComponentName/index.tsx

# 对比子组件
diff -u src/components/ComponentName_old/SubComponent.tsx src/components/ComponentName/SubComponent.tsx

# 对比样式文件
diff -u src/components/ComponentName_old/index.module.less src/components/ComponentName/index.module.less
```

**步骤 2：分析差异**

对于发现的差异，分析以下方面：

1. **API 兼容性**
   - Props 是否一致？
   - 新增的 props 是否为可选参数？
   - 是否有 props 被删除或重命名？

2. **类型定义**
   - TypeScript 类型是否兼容？
   - 是否使用了 `any` 类型（更宽松）？

3. **子组件依赖**
   - 子组件是否有变化？
   - 子组件的 API 是否兼容？

4. **功能差异**
   - 新版是否有新增功能？
   - 新增功能是否通过可选参数控制？
   - 是否有功能被移除？

5. **样式差异**
   - 样式是否有变化？
   - 变化是否会影响视觉效果？

**步骤 3：生成兼容性报告**

为每个组件生成兼容性分析：

```markdown
## 组件兼容性分析：ComponentName

### 核心组件对比
- **新版**：src/components/ComponentName/index.tsx
- **旧版**：src/components/ComponentName_old/index.tsx
- **对比结果**：✅ 完全一致 / ⚠️ 有差异但兼容 / ❌ 不兼容

### 差异说明
| 差异项 | 旧版 | 新版 | 影响评估 |
|-------|------|------|---------|
| 新增 Props | 无 | `newProp1`, `newProp2` | ✅ 无影响（可选参数） |
| 功能变化 | 旧实现 | 新实现 | ⚠️ 需要测试 |

### 使用方式检查
- 当前使用的 props：`prop1`, `prop2`, `prop3`
- 新版是否支持：✅ 全部支持
- 是否需要修改调用代码：❌ 不需要

### 兼容性结论
✅ **安全** - 可以直接迁移
⚠️ **需要测试** - 迁移后需要验证功能
❌ **不兼容** - 需要修改调用代码
```

**步骤 4：确认迁移策略**

根据兼容性分析结果，确定迁移策略：

- **完全兼容**：直接修改导入路径即可
- **有差异但兼容**：修改导入路径，并在测试环节重点验证
- **不兼容**：需要修改调用代码，调整 props 或使用方式

#### 3.3 特殊注意事项

1. **子组件的递归检查**
   - 如果组件内部使用了其他子组件，也需要检查子组件的兼容性
   - 使用 `grep` 搜索组件内部的导入语句

2. **样式文件的对比**
   - 即使组件逻辑一致，样式差异也可能导致视觉问题
   - 建议在测试环境验证视觉效果

3. **第三方依赖**
   - 检查新旧组件是否依赖不同版本的第三方库
   - 确保依赖库都已安装

### 第 4 步：生成清理计划

为每个受影响的文件生成详细的清理计划：

**文件：** `src/components/Checkout.tsx`
- **行号 45-67**：删除 `if (!enableNewCheckout)` 分支（旧逻辑）
- **行号 68-89**：保留 `if (enableNewCheckout)` 分支，移除条件判断
- **操作**：将第 68-89 行的代码提升到外层，删除条件判断

记录所有需要修改的位置，包括：
- 业务逻辑代码
- 配置文件
- 类型定义
- 常量定义
- **组件迁移**（如果有）

#### 4.1 最小化变更原则 ⚠️ 重要

**核心原则：只修改与实验直接相关的代码，不要动其他逻辑**

这是非常重要的原则，因为：
1. **减少回测范围**：只测试实验相关的功能，不需要测试无关的功能
2. **降低风险**：避免引入新的 bug
3. **提高效率**：减少代码审查和测试的工作量

**正确的做法：**

✅ **只删除实验分支的代码**
```typescript
// 修改前
return experimentFlag ? <NewComponent /> : <OldComponent />;

// 修改后
return <NewComponent />;
```

✅ **只删除实验相关的导入**
```typescript
// 修改前
import OldComponent from './OldComponent';

// 修改后
// 删除这一行
```

❌ **不要删除无关的逻辑**
```typescript
// 错误示例：不要删除初始化逻辑
const experimentFlag = useExperiment();
const [init, setInit] = useState(false);

// 初始化逻辑（与实验无关，不要删除）
useEffect(() => {
  initSomething();
}, []);

// 只删除这里的条件判断
return experimentFlag ? <NewComponent /> : <OldComponent />;
```

❌ **不要简化整个文件**
```typescript
// 错误示例：不要把整个文件简化成几行
// 这会删除很多无关的逻辑，增加回测范围

// 错误的做法
export default function Entry() {
  return <NewComponent />;
}

// 正确的做法：保留所有无关的逻辑
export default function Entry() {
  const experimentFlag = useExperiment();
  const [init, setInit] = useState(false);

  // 保留初始化逻辑
  useEffect(() => {
    initSomething();
  }, []);

  // 保留 Loading 状态
  if (!init) {
    return <Loading />;
  }

  // 只修改这里
  return <NewComponent />;
}
```

**实际案例：**

假设有以下代码：
```typescript
export default function Entry() {
  const experimentFlag = useExperiment();
  const [init, setInit] = useState(false);

  async function initialize() {
    // 初始化逻辑（与实验无关）
    await doSomething();
    setInit(true);
  }

  useEffect(() => {
    initialize();
    // 埋点（与实验无关）
    trackEvent('page_view');
  }, []);

  if (!init) {
    return <Loading />;
  }

  // 实验判断
  return experimentFlag ? <NewVersion /> : <OldVersion />;
}
```

**正确的清理方式：**
```typescript
export default function Entry() {
  const experimentFlag = useExperiment();  // 保留（可能其他地方用到）
  const [init, setInit] = useState(false);  // 保留

  async function initialize() {
    // 保留（与实验无关）
    await doSomething();
    setInit(true);
  }

  useEffect(() => {
    initialize();  // 保留
    trackEvent('page_view');  // 保留
  }, []);

  if (!init) {
    return <Loading />;  // 保留
  }

  // 只修改这里
  return <NewVersion />;
}
```

**需要删除的内容：**
1. ✂️ `OldVersion` 组件的导入
2. ✂️ 条件判断中的 `<OldVersion />` 分支

**需要保留的内容：**
1. ✅ 所有初始化逻辑
2. ✅ 所有状态管理
3. ✅ 所有埋点代码
4. ✅ 所有 Loading 状态
5. ✅ 所有与实验无关的逻辑

#### 4.2 清理范围检查清单

在生成清理计划时，使用以下检查清单确保遵循最小化变更原则：

- [ ] 是否只删除了实验分支的代码？
- [ ] 是否保留了所有初始化逻辑？
- [ ] 是否保留了所有状态管理？
- [ ] 是否保留了所有埋点代码？
- [ ] 是否保留了所有 Loading 状态？
- [ ] 是否保留了所有错误处理？
- [ ] 是否只删除了必要的导入？
- [ ] 变更是否最小化？

### 第 5 步：影响面分析

生成详细的影响面分析报告，包含以下部分：

#### 5.1 受影响文件清单
列出所有需要修改的文件，按类型分类：
- **业务逻辑文件**：列出文件路径和修改类型
- **配置文件**：实验配置、feature flag 配置
- **类型定义文件**：TypeScript 接口、类型定义
- **测试文件**：相关的测试用例

#### 5.2 功能模块影响
分析受影响的功能模块：
- 识别涉及的业务功能（如：结账流程、用户注册等）
- 评估每个功能的修改范围（轻微/中等/重大）
- 标注关键路径和核心功能

#### 5.3 依赖关系分析
- 检查是否有其他代码依赖该实验字段
- 识别可能的连锁影响
- 标注需要特别注意的依赖关系

#### 5.4 风险评估
评估清理操作的风险等级：
- **低风险**：简单的条件分支删除，无复杂依赖
- **中风险**：涉及多个文件，有一定依赖关系
- **高风险**：核心功能修改，复杂的逻辑变更

#### 5.5 生成影响面分析文件
使用 Write 工具生成 Markdown 格式的影响面分析报告文件：

**文件命名规范：**
```
docs/ab-experiment-cleanup/impact-analysis-{实验字段名}-{YYYY-MM-DD}.md
```

**文件内容包含：**
- 实验信息摘要
- 受影响文件清单（表格形式）
- 功能模块影响分析
- 依赖关系图
- 风险评估和建议

### 第 6 步：生成回测报告

生成详细的业务回测报告，包含：

#### 6.1 回测检查清单
为每个受影响的功能模块生成回测点：

**功能模块：结账流程**
- [ ] 验证新用户结账流程正常
- [ ] 验证老用户结账流程正常
- [ ] 验证优惠券应用逻辑
- [ ] 验证支付成功后的跳转
- [ ] 验证错误处理逻辑

#### 6.2 测试用例建议
- 列出需要执行的自动化测试
- 建议新增的测试用例（如果原有测试覆盖不足）
- 标注需要手动测试的场景

#### 6.3 数据验证建议
- 建议监控的关键指标（如转化率、错误率）
- 建议的灰度发布策略
- 回滚预案

#### 6.4 生成回测报告文件
使用 Write 工具生成 Markdown 格式的回测报告文件：

**文件命名规范：**
```
docs/ab-experiment-cleanup/test-plan-{实验字段名}-{YYYY-MM-DD}.md
```

**文件内容包含：**
- 回测检查清单（按功能模块分类）
- 自动化测试建议
- 手动测试场景
- 数据验证和监控建议
- 回滚预案

### 第 7 步：执行代码清理

在用户确认清理计划后，执行代码修改：

#### 7.1 最小化变更原则（再次强调）⚠️

**在执行清理前，必须再次确认：**
- ✅ 只修改与实验直接相关的代码
- ✅ 不删除任何无关的逻辑
- ✅ 不简化整个文件
- ✅ 保留所有初始化、状态管理、埋点、Loading 等逻辑

**错误示例：**
```typescript
// ❌ 错误：把整个文件简化成几行
export default function Entry() {
  return <NewComponent />;
}
```

**正确示例：**
```typescript
// ✅ 正确：只删除实验分支，保留其他逻辑
export default function Entry() {
  const experimentFlag = useExperiment();
  const [init, setInit] = useState(false);

  // 保留初始化逻辑
  useEffect(() => {
    initialize();
  }, []);

  // 保留 Loading 状态
  if (!init) {
    return <Loading />;
  }

  // 只修改这里：删除条件判断
  return <NewComponent />;
}
```

#### 7.2 逐文件处理

1. **业务逻辑文件**：
   - 使用 Edit 工具进行精确的代码修改
   - **只删除实验分支的代码**
   - **只删除实验相关的导入**
   - **保留所有其他逻辑**
   - 不要"简化"或"优化"无关的代码

2. **清理配置**：
   - 删除实验配置文件中的相关定义
   - 更新类型定义文件
   - 清理不再使用的常量

3. **更新测试**：
   - 删除实验特定的测试用例
   - 更新相关的测试断言
   - 确保测试仍然通过

#### 7.3 执行前检查清单

在执行每个文件的修改前，检查：

- [ ] 是否只删除了实验分支的代码？
- [ ] 是否保留了所有初始化逻辑？
- [ ] 是否保留了所有状态管理？
- [ ] 是否保留了所有埋点代码？
- [ ] 是否保留了所有 Loading 状态？
- [ ] 是否保留了所有错误处理？
- [ ] 是否只删除了必要的导入？
- [ ] 变更是否最小化？

#### 7.4 常见错误和正确做法

| 错误做法 | 正确做法 | 原因 |
|---------|---------|------|
| 删除整个初始化逻辑 | 只删除实验分支 | 初始化逻辑可能被其他功能使用 |
| 删除所有状态管理 | 只删除实验相关的状态 | 状态可能被其他功能使用 |
| 删除所有埋点代码 | 只删除实验相关的埋点 | 埋点用于监控，不应删除 |
| 简化整个文件 | 最小化修改 | 增加回测范围和风险 |
| 删除 Loading 状态 | 保留 Loading 状态 | Loading 状态与实验无关 |

### 第 8 步：生成最终报告

生成一份完整的清理报告，包含：

#### 变更摘要
- 实验名称和字段
- 修改的文件数量
- 删除的代码行数
- 保留的代码行数

#### 详细变更列表
每个文件的具体变更：
```
src/components/Checkout.tsx
  - 删除第 45-67 行（旧结账逻辑）
  - 简化第 68-89 行（移除条件判断）

src/config/experiments.ts
  - 删除 enableNewCheckout 配置
```

#### 影响面分析（汇总）
- 受影响的功能模块列表
- 风险等级评估
- 关键依赖说明

#### 回测建议（汇总）
- 必须执行的回测项
- 建议的测试策略
- 监控指标建议

#### 后续行动项
- [ ] 执行自动化测试
- [ ] 进行手动回测
- [ ] 监控关键指标
- [ ] 准备回滚方案（如需要）

#### 8.1 生成最终清理报告文件
使用 Write 工具生成 Markdown 格式的完整清理报告文件：

**文件命名规范：**
```
docs/ab-experiment-cleanup/cleanup-report-{实验字段名}-{YYYY-MM-DD}.md
```

**文件内容包含：**
- 变更摘要
- 详细变更列表
- 影响面分析汇总（链接到详细报告）
- 回测建议汇总（链接到详细报告）
- 后续行动项清单

## 输出格式

### 控制台输出
在执行过程中，向用户展示进度和关键信息：
- 使用标题和子标题组织内容
- 使用代码块展示代码变更
- 使用表格展示文件清单
- 使用复选框列表展示回测项
- 使用引用块标注重要提示

### Markdown 文件输出
**必须生成以下 3 个 Markdown 文件：**

#### 1. 影响面分析报告
- **路径**：`docs/ab-experiment-cleanup/impact-analysis-{实验字段名}-{YYYY-MM-DD}.md`
- **时机**：第 4 步完成后立即生成
- **内容**：完整的影响面分析，包括文件清单、功能模块影响、依赖关系、风险评估

#### 2. 回测报告
- **路径**：`docs/ab-experiment-cleanup/test-plan-{实验字段名}-{YYYY-MM-DD}.md`
- **时机**：第 5 步完成后立即生成
- **内容**：完整的回测计划，包括检查清单、测试建议、监控指标、回滚预案

#### 3. 最终清理报告
- **路径**：`docs/ab-experiment-cleanup/cleanup-report-{实验字段名}-{YYYY-MM-DD}.md`
- **时机**：第 7 步完成后生成（如果执行了代码清理）
- **内容**：变更摘要、详细变更列表、后续行动项

**文件命名说明：**
- `{实验字段名}`：使用实际的实验字段名，如 `enableNewCheckout`
- `{YYYY-MM-DD}`：使用当前日期，如 `2026-02-02`
- 示例：`impact-analysis-enableNewCheckout-2026-02-02.md`

**目录结构：**
```
docs/
└── ab-experiment-cleanup/
    ├── impact-analysis-{实验字段名}-{日期}.md
    ├── test-plan-{实验字段名}-{日期}.md
    └── cleanup-report-{实验字段名}-{日期}.md
```

如果 `docs/ab-experiment-cleanup/` 目录不存在，需要先创建。

## 注意事项

1. **最小化变更原则**（最重要）⚠️：
   - **只修改与实验直接相关的代码**
   - **不要删除任何无关的逻辑**（初始化、状态管理、埋点、Loading 等）
   - **不要简化整个文件**
   - **目的**：减少回测范围，降低风险，提高效率
   - 这是最重要的原则，必须严格遵守

2. **安全第一**：在执行任何代码修改前，必须先生成清理计划并获得用户确认

3. **完整性**：确保搜索所有可能的文件类型（.js, .ts, .jsx, .tsx, .vue 等）

4. **准确性**：仔细识别条件逻辑，避免误删代码

5. **可读性**：清理后的代码应该保持原有的结构和可读性

6. **测试覆盖**：强调回测的重要性，提供详细的测试建议

7. **文件生成**：
   - 必须使用 Write 工具生成 Markdown 文件，不能只在控制台输出
   - 生成文件前先检查目录是否存在，不存在则创建
   - 文件命名必须遵循规范，包含实验字段名和日期
   - 生成文件后，向用户明确告知文件路径

8. **文档归档**：生成的报告文件应该提交到代码仓库，作为变更记录

## 示例对话

**用户：** "enableNewCheckout 实验字段对应的实验已经推全，enableNewCheckout 字段全量为 true，请下掉走到 enableNewCheckout 为 false 的业务逻辑代码，并产出影响面分析和业务回测报告"

**Agent 响应：**
1. 确认实验信息
2. 扫描代码库找到所有 `enableNewCheckout` 的引用
3. 分析每个文件的代码逻辑
4. **检查组件迁移兼容性**（如果涉及组件迁移）
   - 使用 diff 对比新旧组件
   - 分析 API 兼容性
   - 检查子组件依赖
   - 生成兼容性报告
5. 生成清理计划
6. 生成影响面分析报告（控制台 + MD 文件）
   - 创建 `docs/ab-experiment-cleanup/impact-analysis-enableNewCheckout-2026-02-02.md`
7. 生成回测报告（控制台 + MD 文件）
   - 创建 `docs/ab-experiment-cleanup/test-plan-enableNewCheckout-2026-02-02.md`
8. 等待用户确认后执行清理
9. 生成最终变更报告（控制台 + MD 文件）
   - 创建 `docs/ab-experiment-cleanup/cleanup-report-enableNewCheckout-2026-02-02.md`
10. 告知用户所有生成的文件路径
