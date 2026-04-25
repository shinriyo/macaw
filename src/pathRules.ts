import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import type { PathRule } from './config';

export interface PathMatch {
  rule: PathRule;
  folder: vscode.WorkspaceFolder;
}

export function getPrimaryWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
  return vscode.workspace.workspaceFolders?.[0];
}

export function matchPathRule(rules: PathRule[], folder = getPrimaryWorkspaceFolder()): PathMatch | undefined {
  if (!folder) {
    return undefined;
  }

  const folderPath = normalizePath(folder.uri.fsPath);
  const match = rules.find((rule) => patternToRegExp(rule.pattern).test(folderPath));

  return match ? { rule: match, folder } : undefined;
}

export function getFolderName(folder = getPrimaryWorkspaceFolder()): string {
  return folder ? path.basename(folder.uri.fsPath) : 'Workspace';
}

export function pathToTildePattern(folderPath: string): string {
  const normalized = normalizePath(folderPath);
  const home = normalizePath(os.homedir());

  return normalized === home || normalized.startsWith(`${home}/`)
    ? `~${normalized.slice(home.length)}`
    : normalized;
}

function patternToRegExp(pattern: string): RegExp {
  const expanded = normalizePath(expandHome(pattern));
  const escaped = expanded
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '[^/]*');

  return new RegExp(`^${escaped}$`);
}

function expandHome(pattern: string): string {
  if (pattern === '~') {
    return os.homedir();
  }

  if (pattern.startsWith('~/')) {
    return path.join(os.homedir(), pattern.slice(2));
  }

  return pattern;
}

function normalizePath(value: string): string {
  return path.resolve(value).replace(/\\/g, '/');
}
