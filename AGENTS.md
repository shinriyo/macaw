# AGENTS.md

## Project Name
Macaw

## Goal
Create a VS Code extension that automatically changes workspace color and title based on folder path or active language.

## Core Features

### 1. Color Mode
macaw.colorMode:
- path
- language
- none

Behavior:
- path → folder rules
- language → active editor language
- none → no color change

---

### 2. Path Rules

macaw.pathRules:

[
  {
    "pattern": "~/develop/*",
    "label": "DEV",
    "color": "#7E57C2"
  },
  {
    "pattern": "~/work/*",
    "label": "WORK",
    "color": "#1976D2"
  },
  {
    "pattern": "~/danger/*",
    "label": "DANGER",
    "color": "#D32F2F"
  }
]

Requirements:
- support "~"
- support "*"
- first match wins

---

### 3. Language Colors

Default:

typescript → #3178C6  
javascript → #F7DF1E  
python → #3776AB  
rust → #CE422B  
go → #00ADD8  
dart → #0175C2  

Use:
vscode.window.activeTextEditor.document.languageId

---

### 4. Title

Format:

[DEV] TypeScript「App bank プロジェクト」

Settings:
macaw.projectLabel
macaw.showLanguageInTitle
macaw.showPathLabelInTitle

If no label → use folder name

---

### 5. Apply Colors

Update ONLY:

workbench.colorCustomizations:

titleBar.activeBackground  
titleBar.activeForeground  
statusBar.background  
activityBar.background  

Auto contrast:
dark → white text  
light → black text  

---

### 6. Commands

macaw.apply  
macaw.clear  
macaw.addPathRule  
macaw.setProjectLabel  

---

### 7. Events

Re-run on:

onDidChangeWorkspaceFolders  
onDidChangeActiveTextEditor  
onDidChangeConfiguration  

---

### 8. Architecture

src/

extension.ts → entry  
config.ts → read settings  
pathRules.ts → match rules  
language.ts → detect language  
color.ts → generate colors  
title.ts → build title  
apply.ts → main logic  

---

## UX Rules

- no JSON editing required
- no spam updates
- only update Macaw keys
- support Japanese labels
- keep title short

---

## MVP

- colorMode
- pathRules
- projectLabel
- path coloring
- language coloring
- title update
- addPathRule command
- clear command

---

## Done When

- opening ~/develop/app sets color automatically
- language mode works
- none mode does nothing
- title shows label + language
- Japanese works
- no repeated writes