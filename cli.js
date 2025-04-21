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
        include: ["src", "lib"],
        exclude: ["node_modules", "dist"],
        rules: {
            noEval: true,
            noConsoleLog: true,
            noFunctionConstructor: true,
            noInnerHTML: true,
            noDocumentWrite: true,
            noSetTimeoutString: true,
            noSetIntervalString: true,
            noUnguardedStorage: true,
            noGlobalVar: true,
            noEmptyCatch: true
        }
    };
  
    fs.writeFileSync('hawkeye.config.json', JSON.stringify(config, null, 2));
    console.log('configuration file created successfully ✅: hawkeye.config.json');
}


function analyzeCode() {
  const configPath = path.join(process.cwd(), 'hawkeye.config.json');
  if (!fs.existsSync(configPath)) {
    console.log('❌ Config file not found! Run `hawkeye init` first.');
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const results = [];

  function scanFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const lines = code.split('\n');

    lines.forEach((line, i) => {
        const lineNumber = i + 1;
      
        if (config.rules.noEval && /eval\s*\(/.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: 'Use of eval() is discouraged due to security risks.',
            severity: 'High'
          });
        }
      
        if (config.rules.noConsoleLog && /console\.log\s*\(/.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: 'Avoid using console.log() in production code.',
            severity: 'Low'
          });
        }
      
        if (config.rules.noFunctionConstructor && /new\s+Function\s*\(/.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: 'Avoid using Function constructor due to security concerns.',
            severity: 'High'
          });
        }
      
        if (config.rules.noInnerHTML && /\.innerHTML\s*=/.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: 'Direct use of innerHTML can lead to XSS vulnerabilities.',
            severity: 'High'
          });
        }
      
        if (config.rules.noDocumentWrite && /document\.write\s*\(/.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: 'Avoid using document.write(); it can overwrite the document and is generally unsafe.',
            severity: 'Medium'
          });
        }
      
        if (config.rules.noSetTimeoutString && /setTimeout\s*\(\s*['"`]/.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: 'Avoid passing strings to setTimeout(); use a function instead.',
            severity: 'Medium'
          });
        }
      
        if (config.rules.noSetIntervalString && /setInterval\s*\(\s*['"`]/.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: 'Avoid passing strings to setInterval(); use a function instead.',
            severity: 'Medium'
          });
        }
      
        if (config.rules.noUnguardedStorage && /localStorage\.setItem|sessionStorage\.setItem/.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: 'Avoid storing unvalidated data in localStorage or sessionStorage.',
            severity: 'Medium'
          });
        }
      
        if (config.rules.noGlobalVar && /^\s*[a-zA-Z_$][0-9a-zA-Z_$]*\s*=/.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: 'Detected variable assignment without let/const/var. This may create a global variable.',
            severity: 'Low'
          });
        }
      
        if (config.rules.noEmptyCatch && /catch\s*\(\s*\w*\s*\)\s*\{\s*\}/.test(line)) {
          results.push({
            file: filePath,
            line: lineNumber,
            issue: 'Empty catch block detected. Consider handling the error appropriately.',
            severity: 'Low'
          });
        }
    });
      
  }

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(process.cwd(), fullPath);
      const stat = fs.statSync(fullPath);

      if (config.exclude.some(excluded => relativePath.startsWith(excluded))) {
        return;
      }

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.endsWith('.js')) {
        scanFile(fullPath);
      }
    });
  }

  scanDirectory(process.cwd());

  fs.writeFileSync('hawkeye.report.json', JSON.stringify(results, null, 2));
  console.log(`✅ Report generated: hawkeye.report.json (${results.length} issues found)`);
}

function launchDashboard() {
    const http = require('http');
    const server = http.createServer((req, res) => {
      if (req.url === '/hawkeye.report.json') {
        const data = fs.readFileSync('hawkeye.report.json', 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      } else {
        const html = fs.readFileSync(path.join(__dirname, 'dashboard/index.html'), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      }
    });
  
    server.listen(9000, () => {
      console.log('✅ Dashboard exit in http://localhost:9000');
    });
}
   