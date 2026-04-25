import * as vscode from 'vscode';
import { applyMacaw, clearMacaw } from './apply';
import { getConfig } from './config';
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
