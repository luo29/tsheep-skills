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

function getClaudeSkillsDir() {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  return path.join(homeDir, '.claude', 'skills');
}

function ensureSkillsDirExists() {
  const skillsDir = getClaudeSkillsDir();
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

function installSkill(skillName) {
  const skillsDir = ensureSkillsDirExists();
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

  log(`Installing skill: ${skillName}...`, 'blue');
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

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const skillName = args[1];

  log('\n🐑 TSheep Skills Installer\n', 'cyan');

  if (!command || command === 'help' || command === '-h' || command === '--help') {
    log('Usage:', 'blue');
    log('  npx tsheep-skills add <skill-name>    Install a skill', 'reset');
    log('  npx tsheep-skills list                List available skills', 'reset');
    log('  npx tsheep-skills help                Show this help message', 'reset');
    log('\nExample:', 'blue');
    log('  npx tsheep-skills add ab-experiment-cleanup', 'cyan');
    process.exit(0);
  }

  switch (command) {
    case 'add':
    case 'install':
      if (!skillName) {
        log('✗ Please specify a skill name', 'red');
        log('Usage: npx tsheep-skills add <skill-name>', 'yellow');
        process.exit(1);
      }
      installSkill(skillName);
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
