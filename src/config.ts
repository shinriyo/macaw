import * as vscode from 'vscode';

export type ColorMode = 'path' | 'language' | 'none';

export interface PathRule {
  pattern: string;
  label: string;
  color: string;
}

export interface MacawConfig {
  colorMode: ColorMode;
  pathRules: PathRule[];
  languageColors: Record<string, string>;
  showLanguageInTitle: boolean;
  showPathLabelInTitle: boolean;
}

const colorModes = new Set<ColorMode>(['path', 'language', 'none']);

export function getConfig(): MacawConfig {
  const config = vscode.workspace.getConfiguration('macaw');
  const colorMode = config.get<ColorMode>('colorMode', 'path');

  return {
    colorMode: colorModes.has(colorMode) ? colorMode : 'path',
    pathRules: config.get<PathRule[]>('pathRules', []).filter(isPathRule),
    languageColors: getLanguageColors(config.get<Record<string, string>>('languageColors', {})),
    showLanguageInTitle: config.get<boolean>('showLanguageInTitle', true),
    showPathLabelInTitle: config.get<boolean>('showPathLabelInTitle', true)
  };
}

function isPathRule(value: unknown): value is PathRule {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const rule = value as Record<string, unknown>;
  return typeof rule.pattern === 'string'
    && typeof rule.label === 'string'
    && typeof rule.color === 'string'
    && /^#[0-9A-Fa-f]{6}$/.test(rule.color);
}

function getLanguageColors(value: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).filter(([languageId, color]) => languageId && /^#[0-9A-Fa-f]{6}$/.test(color))
  );
}
