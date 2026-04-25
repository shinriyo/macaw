"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTitle = buildTitle;
function buildTitle(config, parts) {
    const label = (config.projectLabel || parts.folderName).trim();
    const prefix = config.showPathLabelInTitle && parts.pathLabel ? `[${parts.pathLabel}] ` : '';
    const language = config.showLanguageInTitle && parts.languageName ? `${parts.languageName}` : '';
    const project = label ? `「${label}」` : '';
    const title = `${prefix}${language}${project}`.trim();
    return truncateTitle(title || parts.folderName);
}
function truncateTitle(title) {
    return title.length > 80 ? `${title.slice(0, 77)}...` : title;
}
//# sourceMappingURL=title.js.map