# 🛡️ Hawkeye - JavaScript/Node.js Security Analyzer  
**By Mohammed Elghanam**  

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)  
[![npm version](https://badge.fury.io/js/mohammed_elghanam_hawkeye.svg)](https://www.npmjs.com/package/mohammed_elghanam_hawkeye)  
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)  

> A lightweight CLI tool to detect security vulnerabilities, bad practices, and code smells in JavaScript/Node.js projects.  

---

## 📌 Table of Contents  
- [✨ Features](#-features)  
- [🚀 Installation](#-installation)  
- [⚡ Usage](#-usage)  
- [🔧 Configuration](#-configuration)  
- [📸 Examples](#-examples)  
- [🤝 Contributing](#-contributing)  
- [📜 License](#-license)  

---

## ✨ Features  
- 🔍 **Security Scans**: Detect `eval()`, unsafe regex, and other vulnerabilities.  
- 📊 **Interactive Dashboard**: Visualize results with severity levels.  
- ⚙️ **Custom Rules**: Toggle rules via `hawkeye.config.json`.  
- 🚦 **CI/CD Ready**: Integrates with GitHub Actions, Travis CI.  

---

## 🚀 Installation  
```bash
npm install -D mohammed_elghanam_hawkeye
# or
yarn add -D mohammed_elghanam_hawkeye

## ⚙️ Usage

```bash
npx hawkeye init        # Initialize the project
npx hawkeye analyze     # Analyze the code for issues
npx hawkeye dashboard   # Open the dashboard to view results

## ⚙️ Configuration File: `hawkeye.config.json`

You can configure Hawkeye behavior by editing the `hawkeye.config.json` file. This file allows you to control what parts of your code are scanned and which rules to activate.

### 🔍 Fields:

- `projectName`: The name of your project.
- `include`: Array of folders or files you want to scan.
- `exclude`: Array of folders or files you want to skip.
- `rules`: A set of rules (true to activate, false to skip).

### 🎯 Why this configuration?

This file gives developers full control over the analysis process.  
For example, if you're only interested in detecting `eval()` usage and don't want to test for `console.log`, you can simply set:

```json
"noEval": true,
"noConsoleLog": false

## 📄 License
MIT License © 2025 Mohammed Elghanam

---
