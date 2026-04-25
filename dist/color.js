"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.macawColorKeys = void 0;
exports.buildColorCustomizations = buildColorCustomizations;
exports.getContrastColor = getContrastColor;
exports.macawColorKeys = [
    'titleBar.activeBackground',
    'titleBar.activeForeground',
    'statusBar.background',
    'activityBar.background'
];
function buildColorCustomizations(background) {
    return {
        'titleBar.activeBackground': background,
        'titleBar.activeForeground': getContrastColor(background),
        'statusBar.background': background,
        'activityBar.background': background
    };
}
function getContrastColor(hexColor) {
    const normalized = hexColor.replace('#', '');
    const red = parseInt(normalized.slice(0, 2), 16);
    const green = parseInt(normalized.slice(2, 4), 16);
    const blue = parseInt(normalized.slice(4, 6), 16);
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
    return luminance > 0.6 ? '#000000' : '#FFFFFF';
}
//# sourceMappingURL=color.js.map