# NPM 发布指南

## 前提条件

1. 拥有 npm 账号（在 https://www.npmjs.com/ 注册）
2. 本地已登录 npm：
```bash
npm login
```

## 发布步骤

### 1. 确保代码已提交

```bash
git status
git add .
git commit -m "Prepare for npm publish"
git push
```

### 2. 发布到 npm

```bash
cd /path/to/tsheep-skills
npm publish
```

如果包名已被占用，可以使用 scoped package：

```bash
# 修改 package.json 中的 name 为 @luo29/tsheep-skills
npm publish --access public
```

### 3. 验证发布

发布成功后，用户可以通过以下方式安装：

```bash
# 如果使用普通包名
npx tsheep-skills add ab-experiment-cleanup

# 如果使用 scoped 包名
npx @luo29/tsheep-skills add ab-experiment-cleanup
```

## 更新版本

当需要发布新版本时：

```bash
# 更新补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 更新次版本 (1.0.0 -> 1.1.0)
npm version minor

# 更新主版本 (1.0.0 -> 2.0.0)
npm version major

# 推送标签
git push --tags

# 发布新版本
npm publish
```

## 测试本地包

在发布前，可以先本地测试：

```bash
# 在项目目录下
npm link

# 在其他目录测试
npx tsheep-skills add ab-experiment-cleanup
```

## 包信息

- **包名**: tsheep-skills (或 @luo29/tsheep-skills)
- **版本**: 1.0.0
- **仓库**: https://github.com/luo29/tsheep-skills
- **主页**: https://github.com/luo29/tsheep-skills#readme

## 注意事项

1. 确保 package.json 中的信息准确
2. 检查 .npmignore 文件，避免发布不必要的文件
3. 首次发布可能需要验证邮箱
4. 如果包名被占用，考虑使用 scoped package (@username/package-name)
