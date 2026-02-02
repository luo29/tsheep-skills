# Installation Guide for ab-experiment-cleanup Skill

## Repository Information

**Repository URL:** https://github.com/luo29/tsheep-skills.git

The skill has been successfully uploaded and is now available for installation.

## Installation Methods

### Method 1: NPX Install (Recommended) 🚀

Install using npx without any prior setup:

```bash
# Global install to ~/.claude/skills (default)
npx tsheep-skills add ab-experiment-cleanup

# Project-local install to ./.claude/skills
npx tsheep-skills add ab-experiment-cleanup --local

# Install to .cursor directory instead of .claude
npx tsheep-skills add ab-experiment-cleanup --cursor

# Project-local install to ./.cursor/skills
npx tsheep-skills add ab-experiment-cleanup --local --cursor
```

**Installation Options:**
- `-l, --local`: Install to project-local directory (`./.claude/skills` or `./.cursor/skills`)
- `-c, --cursor`: Use `.cursor` directory instead of `.claude`
- `-g, --global`: Install to global directory (default: `~/.claude/skills`)

### Method 2: Claude Code CLI

Use the Claude Code CLI to install the skill directly:

```bash
claude skill install https://github.com/luo29/tsheep-skills.git/ab-experiment-cleanup
```

### Method 3: Manual Install via Git Clone

1. Clone the repository:
```bash
git clone https://github.com/luo29/tsheep-skills.git
```

2. Create a symlink to your Claude skills directory:
```bash
ln -s $(pwd)/tsheep-skills/ab-experiment-cleanup ~/.claude/skills/ab-experiment-cleanup
```

3. Restart Claude Code or reload skills

### Method 4: Direct Download

1. Download the skill directory from GitHub
2. Copy it to your Claude skills directory:
```bash
cp -r ab-experiment-cleanup ~/.claude/skills/
```

## Usage

Once installed, you can use the skill in two ways:

1. **Direct invocation:**
```
/ab-experiment-cleanup
```

2. **Natural language:**
Simply describe what you want to do, and Claude will automatically use the skill:
```
"Help me clean up the A/B experiment code that has been fully rolled out"
```

## Verification

To verify the skill is installed correctly:

```bash
ls -la ~/.claude/skills/ab-experiment-cleanup
```

You should see the SKILL.md, README.md, and EXAMPLE.md files.

## Repository Structure

```
tsheep-skills/
├── README.md                          # Repository documentation
├── skills.json                        # Skills manifest
└── ab-experiment-cleanup/
    ├── SKILL.md                       # Skill prompt/instructions
    ├── README.md                      # User documentation
    └── EXAMPLE.md                     # Usage examples
```

## Next Steps

- Visit the repository: https://github.com/luo29/tsheep-skills
- Read the skill documentation: https://github.com/luo29/tsheep-skills/tree/main/ab-experiment-cleanup
- Try the skill with your A/B experiment cleanup tasks
