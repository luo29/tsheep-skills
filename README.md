# TSheep Skills

A collection of Claude Code agent skills for various development tasks.

## Available Skills

### ab-experiment-cleanup

清理已推全的 A/B 实验代码，生成影响面分析和回测报告

**功能特性：**
- 自动识别和清理已推全的 A/B 实验代码
- 生成详细的影响面分析报告
- 提供回测验证支持
- 支持多种实验框架

[查看详细文档](./ab-experiment-cleanup/README.md)

## Installation

### Method 1: One-Click Install (Recommended)

Install a specific skill using the Claude Code CLI:

```bash
claude skill install https://github.com/luo29/tsheep-skills.git/ab-experiment-cleanup
```

### Method 2: Manual Install

1. Clone this repository:
```bash
git clone https://github.com/luo29/tsheep-skills.git
```

2. Create a symlink to the skill you want to use:
```bash
ln -s /path/to/tsheep-skills/ab-experiment-cleanup ~/.claude/skills/ab-experiment-cleanup
```

3. Restart Claude Code or reload skills

## Usage

Once installed, you can invoke the skill in Claude Code:

```
/ab-experiment-cleanup
```

Or simply describe what you want to do, and Claude will automatically use the appropriate skill.

## Contributing

Feel free to contribute new skills or improvements to existing ones. Please follow the skill structure:

```
skill-name/
├── SKILL.md      # The skill prompt/instructions
├── README.md     # User-facing documentation
└── EXAMPLE.md    # (Optional) Usage examples
```

## License

MIT
