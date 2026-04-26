import * as vscode from 'vscode';

export const defaultLanguageColors: Record<string, string> = {
  typescript: '#3178C6',
  javascript: '#F7DF1E',
  python: '#3776AB',
  rust: '#CE422B',
  go: '#00ADD8',
  dart: '#0175C2'
};

export const languageNames: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  rust: 'Rust',
  go: 'Go',
  dart: 'Dart'
};

export function getActiveLanguageId(): string | undefined {
  return vscode.window.activeTextEditor?.document.languageId;
}

export function getLanguageColor(languageId = getActiveLanguageId()): string | undefined {
  if (!languageId) {
    return undefined;
  }

  const configuredColors = vscode.workspace
    .getConfiguration('macaw')
    .get<Record<string, string>>('languageColors', {});

  return configuredColors[languageId] ?? defaultLanguageColors[languageId];
}

export function getLanguageName(languageId = getActiveLanguageId()): string | undefined {
  if (!languageId) {
    return undefined;
  }

  return languageNames[languageId] ?? titleCase(languageId);
}

function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
