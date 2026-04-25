import * as vscode from 'vscode';
import { applyMacaw, clearMacaw } from './apply';
import { getConfig, type PathRule } from './config';
import { getFolderName, getPrimaryWorkspaceFolder, pathToTildePattern } from './pathRules';
import { openRulesView } from './rulesView';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('macaw.apply', async () => {
      await applyMacaw();
    }),
    vscode.commands.registerCommand('macaw.clear', async () => {
      await clearMacaw();
    }),
    vscode.commands.registerCommand('macaw.openRules', async () => {
      await openRulesView(context);
    }),
    vscode.commands.registerCommand('macaw.addPathRule', async () => {
      await addPathRule();
    }),
    vscode.commands.registerCommand('macaw.setProjectLabel', async () => {
      await setProjectLabel();
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(() => void applyMacaw()),
    vscode.window.onDidChangeActiveTextEditor(() => void applyMacaw()),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('macaw')) {
        void applyMacaw();
      }
    })
  );

  void applyMacaw();
}

export function deactivate(): void {
  // VS Code disposes registered subscriptions for us.
}

async function addPathRule(): Promise<void> {
  const folder = getPrimaryWorkspaceFolder();
  const currentPattern = folder ? pathToTildePattern(folder.uri.fsPath) : '';
  const pattern = await vscode.window.showInputBox({
    title: 'Macaw: Add Path Rule',
    prompt: 'Root path pattern to map to a title label',
    value: currentPattern,
    placeHolder: '~/develop/app',
    ignoreFocusOut: true
  });

  if (!pattern) {
    return;
  }

  const label = await vscode.window.showInputBox({
    title: 'Macaw: Add Path Rule',
    prompt: 'Label shown in the window title for this root',
    value: folder ? getFolderName(folder).toUpperCase() : '',
    placeHolder: 'DEV',
    ignoreFocusOut: true
  });

  if (!label) {
    return;
  }

  const color = await vscode.window.showInputBox({
    title: 'Macaw: Add Path Rule',
    prompt: 'Hex color',
    placeHolder: '#7E57C2',
    validateInput: (value) => /^#[0-9A-Fa-f]{6}$/.test(value) ? undefined : 'Use #RRGGBB.',
    ignoreFocusOut: true
  });

  if (!color) {
    return;
  }

  const config = vscode.workspace.getConfiguration('macaw');
  const rules = getConfig().pathRules;
  const nextRule: PathRule = {
    pattern: pattern.trim(),
    label: label.trim(),
    color: color.trim()
  };

  await config.update('pathRules', upsertPathRule(rules, nextRule), vscode.ConfigurationTarget.Workspace);
  await applyMacaw();
  void vscode.window.showInformationMessage(`Macaw mapped ${nextRule.pattern} to [${nextRule.label}].`);
}

async function setProjectLabel(): Promise<void> {
  const currentLabel = getConfig().projectLabel;
  const label = await vscode.window.showInputBox({
    title: 'Macaw: Set Project Label',
    prompt: 'Project label for the window title',
    value: currentLabel,
    ignoreFocusOut: true
  });

  if (label === undefined) {
    return;
  }

  await vscode.workspace
    .getConfiguration('macaw')
    .update('projectLabel', label.trim(), vscode.ConfigurationTarget.Workspace);
  await applyMacaw();
}

function upsertPathRule(rules: PathRule[], nextRule: PathRule): PathRule[] {
  const index = rules.findIndex((rule) => rule.pattern === nextRule.pattern);

  if (index === -1) {
    return [...rules, nextRule];
  }

  const nextRules = [...rules];
  nextRules[index] = nextRule;
  return nextRules;
}
