#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getSkillsDir(options = {}) {
  const { local = false, cursor = false } = options;
  const dirName = cursor ? '.cursor' : '.claude';

  if (local) {
    // Project-local installation
    return path.join(process.cwd(), dirName, 'skills');
  } else {
    // Global installation
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    return path.join(homeDir, dirName, 'skills');
  }
}

function ensureSkillsDirExists(options) {
  const skillsDir = getSkillsDir(options);
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
    log(`✓ Created skills directory: ${skillsDir}`, 'green');
  }
  return skillsDir;
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installSkill(skillName, options = {}) {
  const skillsDir = ensureSkillsDirExists(options);
  const sourceDir = path.join(__dirname, skillName);
  const destDir = path.join(skillsDir, skillName);

  if (!fs.existsSync(sourceDir)) {
    log(`✗ Skill "${skillName}" not found in this package`, 'red');
    log(`Available skills: ab-experiment-cleanup`, 'yellow');
    process.exit(1);
  }

  if (fs.existsSync(destDir)) {
    log(`⚠ Skill "${skillName}" already exists. Updating...`, 'yellow');
    fs.rmSync(destDir, { recursive: true, force: true });
  }

  const scope = options.local ? 'project-local' : 'global';
  const dirType = options.cursor ? '.cursor' : '.claude';
  log(`Installing skill: ${skillName} (${scope}, ${dirType})...`, 'blue');
  copyDirectory(sourceDir, destDir);
  log(`✓ Successfully installed "${skillName}" to ${destDir}`, 'green');
  log(`\nYou can now use it with: /${skillName}`, 'cyan');
}

function listSkills() {
  log('Available skills:', 'blue');
  const skillsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'skills.json'), 'utf8'));
  skillsData.skills.forEach(skill => {
    log(`\n  ${skill.name}`, 'green');
    log(`    ${skill.description}`, 'reset');
    log(`    Install: npx tsheep-skills add ${skill.name}`, 'cyan');
  });
}

function parseArgs(args) {
  const options = {
    local: false,
    cursor: false,
    global: false
  };
  const nonFlagArgs = [];

  for (const arg of args) {
    if (arg === '--local' || arg === '-l') {
      options.local = true;
    } else if (arg === '--cursor' || arg === '-c') {
      options.cursor = true;
    } else if (arg === '--global' || arg === '-g') {
      options.global = true;
    } else {
      nonFlagArgs.push(arg);
    }
  }

  // If both --local and --global are specified, or neither, default to global
  if (options.local && options.global) {
    log('⚠ Both --local and --global specified, defaulting to global', 'yellow');
    options.local = false;
  }

  return { options, args: nonFlagArgs };
}

function main() {
  const rawArgs = process.argv.slice(2);
  const { options, args } = parseArgs(rawArgs);
  const command = args[0];
  const skillName = args[1];

  log('\n🐑 TSheep Skills Installer\n', 'cyan');

  if (!command || command === 'help' || command === '-h' || command === '--help') {
    log('Usage:', 'blue');
    log('  npx tsheep-skills add <skill-name> [options]    Install a skill', 'reset');
    log('  npx tsheep-skills list                          List available skills', 'reset');
    log('  npx tsheep-skills help                          Show this help message', 'reset');
    log('\nOptions:', 'blue');
    log('  -l, --local     Install to project-local directory (./.claude/skills or ./.cursor/skills)', 'reset');
    log('  -c, --cursor    Use .cursor directory instead of .claude', 'reset');
    log('  -g, --global    Install to global directory (default: ~/.claude/skills)', 'reset');
    log('\nExamples:', 'blue');
    log('  npx tsheep-skills add ab-experiment-cleanup              # Global install to ~/.claude/skills', 'cyan');
    log('  npx tsheep-skills add ab-experiment-cleanup --local      # Local install to ./.claude/skills', 'cyan');
    log('  npx tsheep-skills add ab-experiment-cleanup --cursor     # Global install to ~/.cursor/skills', 'cyan');
    log('  npx tsheep-skills add ab-experiment-cleanup -l -c        # Local install to ./.cursor/skills', 'cyan');
    process.exit(0);
  }

  switch (command) {
    case 'add':
    case 'install':
      if (!skillName) {
        log('✗ Please specify a skill name', 'red');
        log('Usage: npx tsheep-skills add <skill-name> [options]', 'yellow');
        process.exit(1);
      }
      installSkill(skillName, options);
      break;

    case 'list':
    case 'ls':
      listSkills();
      break;

    default:
      log(`✗ Unknown command: ${command}`, 'red');
      log('Run "npx tsheep-skills help" for usage information', 'yellow');
      process.exit(1);
  }
}

main();
