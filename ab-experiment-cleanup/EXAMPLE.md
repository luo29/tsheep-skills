# A/B 实验清理示例

## 场景描述

假设我们有一个电商网站，之前做了一个新结账流程的 A/B 实验。实验字段为 `enableNewCheckout`，现在实验已经推全，全量值为 `true`，需要清理旧的结账流程代码（`enableNewCheckout === false` 的分支）。

## 使用命令

```
/ab-experiment-cleanup

enableNewCheckout 实验字段对应的实验已经推全，enableNewCheckout 字段全量为 true，
请下掉走到 enableNewCheckout 为 false 的业务逻辑代码，
并产出影响面分析和业务回测报告
```

## 预期输出示例

### 1. 信息确认

```
我理解您的需求：
- 实验字段：enableNewCheckout
- 全量值：true
- 需要删除：enableNewCheckout 为 false 的代码分支
- 需要保留：enableNewCheckout 为 true 的代码分支

开始扫描代码库...
```

### 2. 代码扫描结果

```
找到 8 个文件包含 enableNewCheckout 引用：

业务逻辑文件：
- src/pages/Checkout.tsx
- src/components/PaymentForm.tsx
- src/components/OrderSummary.tsx
- src/hooks/useCheckout.ts

配置文件：
- src/config/experiments.ts
- src/config/featureFlags.json

类型定义：
- src/types/experiments.ts

测试文件：
- src/pages/__tests__/Checkout.test.tsx
```

### 3. 清理计划

```markdown
## 代码清理计划

### src/pages/Checkout.tsx

**当前代码（第 45-89 行）：**
```typescript
const CheckoutPage = () => {
  const { enableNewCheckout } = useExperiments();

  if (enableNewCheckout) {
    // 新结账流程
    return (
      <div className="new-checkout">
        <CheckoutSteps />
        <PaymentForm />
        <OrderSummary />
      </div>
    );
  } else {
    // 旧结账流程 - 需要删除
    return (
      <div className="old-checkout">
        <LegacyCheckoutForm />
      </div>
    );
  }
};
```

**清理后代码：**
```typescript
const CheckoutPage = () => {
  return (
    <div className="new-checkout">
      <CheckoutSteps />
      <PaymentForm />
      <OrderSummary />
    </div>
  );
};
```

**操作：**
- ✂️ 删除第 46 行：`const { enableNewCheckout } = useExperiments();`
- ✂️ 删除第 48-58 行：整个 if-else 条件判断
- ✂️ 删除第 59-63 行：旧结账流程代码
- ✅ 保留第 50-56 行：新结账流程代码，提升到函数顶层

---

### src/config/experiments.ts

**当前代码（第 12-16 行）：**
```typescript
export const experiments = {
  enableNewCheckout: {
    name: 'New Checkout Flow',
    defaultValue: true,
  },
  // ... 其他实验
};
```

**操作：**
- ✂️ 删除第 12-15 行：整个 enableNewCheckout 配置

---

### src/types/experiments.ts

**当前代码（第 5-8 行）：**
```typescript
export interface ExperimentFlags {
  enableNewCheckout: boolean;
  // ... 其他实验
}
```

**操作：**
- ✂️ 删除第 6 行：`enableNewCheckout: boolean;`

---

（其他文件的清理计划类似...）
```

### 4. 影响面分析报告

```markdown
# 影响面分析报告

## 1. 受影响文件清单

| 文件类型 | 文件路径 | 修改类型 | 影响程度 |
|---------|---------|---------|---------|
| 业务逻辑 | src/pages/Checkout.tsx | 删除旧逻辑，简化条件 | 🔴 重大 |
| 业务逻辑 | src/components/PaymentForm.tsx | 删除条件判断 | 🟡 中等 |
| 业务逻辑 | src/components/OrderSummary.tsx | 删除条件判断 | 🟡 中等 |
| 业务逻辑 | src/hooks/useCheckout.ts | 简化逻辑 | 🟢 轻微 |
| 配置文件 | src/config/experiments.ts | 删除实验配置 | 🟢 轻微 |
| 配置文件 | src/config/featureFlags.json | 删除 flag | 🟢 轻微 |
| 类型定义 | src/types/experiments.ts | 删除类型定义 | 🟢 轻微 |
| 测试文件 | src/pages/__tests__/Checkout.test.tsx | 更新测试用例 | 🟡 中等 |

**统计：**
- 总文件数：8
- 重大影响：1
- 中等影响：3
- 轻微影响：4

## 2. 功能模块影响

### 结账流程（核心功能）
- **影响程度**：🔴 重大
- **涉及文件**：Checkout.tsx, PaymentForm.tsx, OrderSummary.tsx
- **变更说明**：删除旧结账流程，保留新流程
- **风险点**：这是核心业务流程，需要充分测试

### 实验配置系统
- **影响程度**：🟢 轻微
- **涉及文件**：experiments.ts, featureFlags.json
- **变更说明**：清理实验配置
- **风险点**：无

### 类型系统
- **影响程度**：🟢 轻微
- **涉及文件**：experiments.ts
- **变更说明**：删除不再使用的类型定义
- **风险点**：需要确保没有其他地方引用该类型

## 3. 依赖关系分析

```
enableNewCheckout (实验字段)
├── src/pages/Checkout.tsx (主要使用)
│   └── 依赖 useExperiments hook
├── src/components/PaymentForm.tsx
│   └── 依赖 useExperiments hook
├── src/components/OrderSummary.tsx
│   └── 依赖 useExperiments hook
└── src/hooks/useCheckout.ts
    └── 依赖 experiments config
```

**关键发现：**
- ✅ 没有发现其他实验依赖 enableNewCheckout
- ✅ 删除后不会影响其他功能
- ⚠️ 需要确认 useExperiments hook 在删除后仍然正常工作

## 4. 风险评估

### 总体风险等级：🟡 中等

**风险因素：**
1. **核心功能修改**：结账流程是核心业务，任何问题都会直接影响收入
2. **代码覆盖面广**：涉及 8 个文件，需要仔细审查每个变更
3. **测试依赖**：需要更新测试用例，确保测试覆盖

**降低风险的措施：**
1. ✅ 充分的回测（见回测报告）
2. ✅ 灰度发布策略
3. ✅ 实时监控关键指标
4. ✅ 准备快速回滚方案

## 5. 建议的发布策略

1. **阶段 1**：在测试环境完整回测（1-2 天）
2. **阶段 2**：灰度 5% 用户，监控 24 小时
3. **阶段 3**：灰度 25% 用户，监控 24 小时
4. **阶段 4**：灰度 50% 用户，监控 24 小时
5. **阶段 5**：全量发布

**监控指标：**
- 结账成功率
- 支付成功率
- 页面加载时间
- JavaScript 错误率
```

### 5. 回测报告

```markdown
# 业务回测报告

## 1. 回测检查清单

### 功能模块：结账流程

#### 基础流程测试
- [ ] 新用户首次结账
- [ ] 老用户重复购买
- [ ] 购物车为空时的处理
- [ ] 购物车有多个商品
- [ ] 购物车有单个商品

#### 支付相关
- [ ] 信用卡支付
- [ ] 借记卡支付
- [ ] 第三方支付（支付宝、微信）
- [ ] 支付失败的错误处理
- [ ] 支付超时的处理

#### 优惠和折扣
- [ ] 应用优惠券
- [ ] 应用促销码
- [ ] 会员折扣
- [ ] 多重优惠叠加

#### 订单确认
- [ ] 订单摘要显示正确
- [ ] 价格计算准确
- [ ] 订单确认邮件发送
- [ ] 订单状态更新

#### 异常场景
- [ ] 网络中断时的处理
- [ ] 库存不足的提示
- [ ] 地址信息不完整
- [ ] 支付信息验证失败

### 功能模块：实验配置系统

- [ ] 其他实验仍然正常工作
- [ ] useExperiments hook 正常返回
- [ ] 实验配置加载正常

## 2. 自动化测试建议

### 需要执行的现有测试
```bash
# 运行所有结账相关的测试
npm test -- Checkout
npm test -- PaymentForm
npm test -- OrderSummary

# 运行集成测试
npm test -- e2e/checkout
```

### 需要新增的测试用例

**src/pages/__tests__/Checkout.test.tsx**
```typescript
describe('Checkout - After experiment cleanup', () => {
  it('should render new checkout flow without experiment flag', () => {
    render(<CheckoutPage />);
    expect(screen.getByTestId('new-checkout')).toBeInTheDocument();
    expect(screen.queryByTestId('old-checkout')).not.toBeInTheDocument();
  });

  it('should not depend on useExperiments hook', () => {
    // 确保不再依赖实验配置
    const { container } = render(<CheckoutPage />);
    expect(container).toMatchSnapshot();
  });
});
```

### 需要更新的测试用例

**需要删除的测试：**
- 所有测试旧结账流程的用例
- 所有测试实验分支切换的用例

**需要更新的测试：**
- 将测试新结账流程的用例改为默认测试
- 移除 mock useExperiments 的代码

## 3. 手动测试场景

### 高优先级（必须测试）

1. **完整结账流程**
   - 从购物车到支付成功的完整流程
   - 测试环境：Chrome, Safari, Firefox
   - 测试设备：Desktop, Mobile

2. **支付成功场景**
   - 使用测试信用卡完成支付
   - 验证订单创建成功
   - 验证邮件发送

3. **错误处理**
   - 支付失败的提示
   - 网络错误的处理
   - 表单验证

### 中优先级（建议测试）

1. **不同用户状态**
   - 未登录用户
   - 已登录用户
   - VIP 用户

2. **不同商品类型**
   - 实体商品
   - 虚拟商品
   - 预售商品

### 低优先级（可选测试）

1. **边界情况**
   - 极大金额订单
   - 极小金额订单
   - 特殊字符处理

## 4. 数据验证建议

### 关键指标监控

| 指标 | 当前基线 | 预期范围 | 告警阈值 |
|-----|---------|---------|---------|
| 结账成功率 | 85% | 83-87% | < 80% |
| 支付成功率 | 92% | 90-94% | < 88% |
| 页面加载时间 | 1.2s | < 1.5s | > 2.0s |
| JavaScript 错误率 | 0.5% | < 1% | > 2% |
| 订单转化率 | 12% | 11-13% | < 10% |

### 监控时间表

- **第 1 天**：每小时检查一次
- **第 2-3 天**：每 4 小时检查一次
- **第 4-7 天**：每天检查一次
- **第 2 周后**：恢复正常监控频率

### 数据对比分析

对比以下时间段的数据：
- 清理前 7 天 vs 清理后 7 天
- 同比去年同期
- 环比上周同期

## 5. 回滚预案

### 回滚触发条件

满足以下任一条件立即回滚：
- 结账成功率下降超过 5%
- 支付成功率下降超过 3%
- JavaScript 错误率上升超过 1%
- 收到 3 个以上用户投诉

### 回滚步骤

1. **立即回滚代码**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **触发紧急发布**
   - 跳过灰度，直接全量
   - 通知相关团队

3. **验证回滚效果**
   - 检查关键指标是否恢复
   - 执行冒烟测试

4. **事后分析**
   - 分析回滚原因
   - 制定改进方案

## 6. 后续行动项

### 发布前
- [ ] 代码 Review（至少 2 人）
- [ ] 执行所有自动化测试
- [ ] 完成手动回测
- [ ] 准备监控 Dashboard
- [ ] 准备回滚脚本

### 发布中
- [ ] 按灰度策略发布
- [ ] 实时监控关键指标
- [ ] 准备随时回滚

### 发布后
- [ ] 持续监控 7 天
- [ ] 收集用户反馈
- [ ] 数据对比分析
- [ ] 总结经验教训
```

## 总结

这个示例展示了 skill 的完整输出，包括：

1. ✅ 详细的代码清理计划
2. ✅ 全面的影响面分析
3. ✅ 完整的回测报告
4. ✅ 清晰的后续行动项

使用这个 skill 可以大大提高 A/B 实验代码清理的效率和安全性。
