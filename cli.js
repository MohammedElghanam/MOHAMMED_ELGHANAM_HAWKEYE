#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'init':
    initConfig();
    break;
  case 'analyze':
    analyzeCode();
    break;
  case 'dashboard':
    launchDashboard();
    break;
  default:
    console.log(' The Command not exist. use this commands: init | analyze | dashboard');
}


function initConfig() {
    const config = {
      projectName: path.basename(process.cwd()),
      rules: {
        noEval: true,
        noConsoleLog: true
      }
    };
  
    fs.writeFileSync('hawkeye.config.json', JSON.stringify(config, null, 2));
    console.log('configuration file created successfully ✅: hawkeye.config.json');
}
  