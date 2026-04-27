import * as vscode from 'vscode';
import { applyMacaw } from './apply';
import { openRulesView } from './rulesView';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('macaw.openRules', async () => {
      await openRulesView(context);
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
