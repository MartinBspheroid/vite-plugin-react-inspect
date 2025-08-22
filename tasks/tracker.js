#!/usr/bin/env node
/**
 * Progress Tracker for Bun Migration
 * Usage: bun run tasks/tracker.js [command] [args...]
 * 
 * Commands:
 *   status - Show overall progress
 *   start <phase> <task> - Mark task as started
 *   complete <phase> <task> - Mark task as completed
 *   list <phase> - List all tasks in a phase
 *   next - Show next task to work on
 */

import { readFileSync, writeFileSync } from 'fs';

const PROGRESS_FILE = 'tasks/progress.yaml';

function loadProgress() {
  try {
    const content = readFileSync(PROGRESS_FILE, 'utf-8');
    // Simple YAML parser for our specific structure
    const lines = content.split('\n');
    const data = { project: {}, phases: {} };
    let currentPhase = null;
    let currentTask = null;
    let indent = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const currentIndent = line.length - line.trimStart().length;
      
      if (line.includes('project:')) {
        currentPhase = null;
        currentTask = null;
      } else if (line.includes('name:') && currentPhase === null && currentTask === null) {
        data.project.name = trimmed.split('name:')[1].trim().replace(/"/g, '');
      } else if (line.includes('start_date:') && currentPhase === null) {
        data.project.start_date = trimmed.split('start_date:')[1].trim().replace(/"/g, '');
      } else if (line.includes('status:') && currentPhase === null && currentTask === null) {
        data.project.status = trimmed.split('status:')[1].trim().replace(/"/g, '');
      } else if (line.includes('phase_') && line.includes(':')) {
        currentPhase = trimmed.split(':')[0];
        data.phases[currentPhase] = { tasks: {} };
        currentTask = null;
      } else if (currentPhase && line.includes('name:') && currentTask === null) {
        data.phases[currentPhase].name = trimmed.split('name:')[1].trim().replace(/"/g, '');
      } else if (currentPhase && line.includes('status:') && currentTask === null) {
        data.phases[currentPhase].status = trimmed.split('status:')[1].trim().replace(/"/g, '');
      } else if (currentPhase && line.includes('estimated_hours:')) {
        data.phases[currentPhase].estimated_hours = parseInt(trimmed.split('estimated_hours:')[1].trim());
      } else if (currentPhase && line.includes('risk_level:')) {
        data.phases[currentPhase].risk_level = trimmed.split('risk_level:')[1].trim().replace(/"/g, '');
      } else if (currentPhase && trimmed.startsWith('p') && trimmed.includes(':')) {
        currentTask = trimmed.split(':')[0];
        data.phases[currentPhase].tasks[currentTask] = {};
      } else if (currentTask && line.includes('name:')) {
        data.phases[currentPhase].tasks[currentTask].name = trimmed.split('name:')[1].trim().replace(/"/g, '');
      } else if (currentTask && line.includes('status:')) {
        data.phases[currentPhase].tasks[currentTask].status = trimmed.split('status:')[1].trim().replace(/"/g, '');
      } else if (currentTask && line.includes('estimated_minutes:')) {
        data.phases[currentPhase].tasks[currentTask].estimated_minutes = parseInt(trimmed.split('estimated_minutes:')[1].trim());
      } else if (currentTask && line.includes('description:')) {
        data.phases[currentPhase].tasks[currentTask].description = trimmed.split('description:')[1].trim().replace(/"/g, '');
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error loading progress file:', error.message);
    process.exit(1);
  }
}

function saveProgress(data) {
  try {
    // For now, just update status in the file manually
    console.log('⚠️  Progress tracking - manual update required in progress.yaml');
    console.log('📝 Update needed for task status change');
  } catch (error) {
    console.error('Error saving progress file:', error.message);
    process.exit(1);
  }
}

function showStatus() {
  const data = loadProgress();
  
  console.log(`\n📋 ${data.project.name}`);
  console.log(`📅 Started: ${data.project.start_date}`);
  console.log(`📊 Status: ${data.project.status}\n`);
  
  Object.entries(data.phases).forEach(([phaseKey, phase]) => {
    if (phaseKey === 'validation') return;
    
    const tasks = Object.values(phase.tasks || {});
    const completed = tasks.filter(t => t.status === 'completed').length;
    const total = tasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const statusIcon = phase.status === 'completed' ? '✅' : 
                     phase.status === 'in_progress' ? '🔄' : '⏳';
    
    console.log(`${statusIcon} ${phase.name} (${progress}% - ${completed}/${total})`);
    console.log(`   Risk: ${phase.risk_level} | Est: ${phase.estimated_hours}h`);
    
    if (phase.status === 'in_progress') {
      const activeTasks = tasks.filter(t => t.status === 'in_progress');
      if (activeTasks.length > 0) {
        console.log(`   🔄 Active: ${activeTasks.map(t => t.name).join(', ')}`);
      }
    }
    console.log();
  });
}

function startTask(phaseId, taskId) {
  const data = loadProgress();
  const phase = data.phases[phaseId];
  
  if (!phase) {
    console.error(`❌ Phase "${phaseId}" not found`);
    return;
  }
  
  const task = phase.tasks[taskId];
  if (!task) {
    console.error(`❌ Task "${taskId}" not found in phase "${phaseId}"`);
    return;
  }
  
  task.status = 'in_progress';
  task.started_at = new Date().toISOString();
  
  if (phase.status === 'not_started') {
    phase.status = 'in_progress';
  }
  
  if (data.project.status === 'not_started') {
    data.project.status = 'in_progress';
  }
  
  console.log(`🔄 Started: ${task.name}`);
  saveProgress(data);
}

function completeTask(phaseId, taskId) {
  const data = loadProgress();
  const phase = data.phases[phaseId];
  
  if (!phase) {
    console.error(`❌ Phase "${phaseId}" not found`);
    return;
  }
  
  const task = phase.tasks[taskId];
  if (!task) {
    console.error(`❌ Task "${taskId}" not found in phase "${phaseId}"`);
    return;
  }
  
  task.status = 'completed';
  task.completed_at = new Date().toISOString();
  
  // Check if all tasks in phase are completed
  const allTasks = Object.values(phase.tasks);
  const allCompleted = allTasks.every(t => t.status === 'completed');
  
  if (allCompleted) {
    phase.status = 'completed';
    console.log(`🎉 Phase "${phase.name}" completed!`);
  }
  
  console.log(`✅ Completed: ${task.name}`);
  saveProgress(data);
}

function listTasks(phaseId) {
  const data = loadProgress();
  const phase = data.phases[phaseId];
  
  if (!phase) {
    console.error(`❌ Phase "${phaseId}" not found`);
    return;
  }
  
  console.log(`\n📋 ${phase.name}`);
  console.log(`📝 ${phase.description}\n`);
  
  Object.entries(phase.tasks).forEach(([taskId, task]) => {
    const statusIcon = task.status === 'completed' ? '✅' : 
                      task.status === 'in_progress' ? '🔄' : '⏳';
    
    console.log(`${statusIcon} ${taskId}: ${task.name}`);
    console.log(`   ⏱️  ${task.estimated_minutes}min | ${task.description}`);
    console.log();
  });
}

function showNext() {
  const data = loadProgress();
  
  // Find next task to work on
  for (const [phaseKey, phase] of Object.entries(data.phases)) {
    if (phaseKey === 'validation') continue;
    
    const tasks = Object.entries(phase.tasks);
    const nextTask = tasks.find(([_, task]) => task.status === 'not_started');
    
    if (nextTask) {
      const [taskId, task] = nextTask;
      console.log(`\n🎯 Next Task: ${task.name}`);
      console.log(`📋 Phase: ${phase.name}`);
      console.log(`⏱️  Estimated: ${task.estimated_minutes} minutes`);
      console.log(`📝 Description: ${task.description}`);
      console.log(`\n🚀 To start: bun run tasks/tracker.js start ${phaseKey} ${taskId}`);
      return;
    }
  }
  
  console.log('\n🎉 All tasks completed!');
}

// CLI handling
const [,, command, ...args] = process.argv;

switch (command) {
  case 'status':
    showStatus();
    break;
  case 'start':
    startTask(args[0], args[1]);
    break;
  case 'complete':
    completeTask(args[0], args[1]);
    break;
  case 'list':
    listTasks(args[0]);
    break;
  case 'next':
    showNext();
    break;
  default:
    console.log(`
📋 Migration Progress Tracker

Usage: bun run tasks/tracker.js [command] [args...]

Commands:
  status                    - Show overall progress
  start <phase> <task>     - Mark task as started
  complete <phase> <task>  - Mark task as completed  
  list <phase>             - List all tasks in a phase
  next                     - Show next task to work on

Examples:
  bun run tasks/tracker.js status
  bun run tasks/tracker.js start phase_1 p1_t1_backup_lockfiles
  bun run tasks/tracker.js complete phase_1 p1_t1_backup_lockfiles
  bun run tasks/tracker.js list phase_1
  bun run tasks/tracker.js next
`);
    break;
}