import * as vscode from 'vscode';
import { buildColorCustomizations, macawColorKeys } from './color';
import { getConfig } from './config';
import { getActiveLanguageId, getLanguageColor, getLanguageName } from './language';
import { getFolderName, matchPathRule } from './pathRules';
import { buildTitle } from './title';

const windowTitleKey = 'title';

export async function applyMacaw(): Promise<void> {
  const config = getConfig();

  if (config.colorMode === 'none') {
    return;
  }

  const languageId = getActiveLanguageId();
  const languageName = getLanguageName(languageId);
  const pathMatch = matchPathRule(config.pathRules);
  const color = config.colorMode === 'path'
    ? pathMatch?.rule.color
    : getLanguageColor(languageId);

  if (color) {
    await updateColors(buildColorCustomizations(color));
  }

  await updateWindowTitle(buildTitle(config, {
    folderName: getFolderName(pathMatch?.folder),
    languageName,
    pathLabel: pathMatch?.rule.label
  }));
}

export async function clearMacaw(): Promise<void> {
  await updateColors(undefined);
  await updateWindowTitle(undefined);
}

async function updateColors(next: Record<string, string> | undefined): Promise<void> {
  const workbench = vscode.workspace.getConfiguration('workbench');
  const current = workbench.get<Record<string, unknown>>('colorCustomizations', {});
  const merged: Record<string, unknown> = { ...current };

  for (const key of macawColorKeys) {
    delete merged[key];
  }

  if (next) {
    Object.assign(merged, next);
  }

  if (sameJson(current, merged)) {
    return;
  }

  await workbench.update('colorCustomizations', merged, vscode.ConfigurationTarget.Workspace);
}

async function updateWindowTitle(next: string | undefined): Promise<void> {
  const windowConfig = vscode.workspace.getConfiguration('window');
  const current = windowConfig.get<string | undefined>(windowTitleKey);

  if (current === next) {
    return;
  }

  await windowConfig.update(windowTitleKey, next, vscode.ConfigurationTarget.Workspace);
}

function sameJson(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
