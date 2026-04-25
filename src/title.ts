import type { MacawConfig } from './config';

export interface TitleParts {
  folderName: string;
  languageName?: string;
  pathLabel?: string;
}

export function buildTitle(config: MacawConfig, parts: TitleParts): string {
  const label = (config.projectLabel || parts.folderName).trim();
  const prefix = config.showPathLabelInTitle && parts.pathLabel ? `[${parts.pathLabel}] ` : '';
  const language = config.showLanguageInTitle && parts.languageName ? `${parts.languageName}` : '';
  const project = label ? `「${label}」` : '';
  const title = `${prefix}${language}${project}`.trim();

  return truncateTitle(title || parts.folderName);
}

function truncateTitle(title: string): string {
  return title.length > 80 ? `${title.slice(0, 77)}...` : title;
}
