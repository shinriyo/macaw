"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const vscode = __importStar(require("vscode"));
const colorModes = new Set(['path', 'language', 'none']);
function getConfig() {
    const config = vscode.workspace.getConfiguration('macaw');
    const colorMode = config.get('colorMode', 'path');
    return {
        colorMode: colorModes.has(colorMode) ? colorMode : 'path',
        pathRules: config.get('pathRules', []).filter(isPathRule),
        languageColors: getLanguageColors(config.get('languageColors', {})),
        projectLabel: config.get('projectLabel', '').trim(),
        showLanguageInTitle: config.get('showLanguageInTitle', true),
        showPathLabelInTitle: config.get('showPathLabelInTitle', true)
    };
}
function isPathRule(value) {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const rule = value;
    return typeof rule.pattern === 'string'
        && typeof rule.label === 'string'
        && typeof rule.color === 'string'
        && /^#[0-9A-Fa-f]{6}$/.test(rule.color);
}
function getLanguageColors(value) {
    return Object.fromEntries(Object.entries(value).filter(([languageId, color]) => languageId && /^#[0-9A-Fa-f]{6}$/.test(color)));
}
//# sourceMappingURL=config.js.map