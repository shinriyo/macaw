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
exports.applyMacaw = applyMacaw;
exports.clearMacaw = clearMacaw;
const vscode = __importStar(require("vscode"));
const color_1 = require("./color");
const config_1 = require("./config");
const language_1 = require("./language");
const pathRules_1 = require("./pathRules");
const title_1 = require("./title");
const windowTitleKey = 'title';
async function applyMacaw() {
    const config = (0, config_1.getConfig)();
    if (config.colorMode === 'none') {
        return;
    }
    const languageId = (0, language_1.getActiveLanguageId)();
    const languageName = (0, language_1.getLanguageName)(languageId);
    const pathMatch = (0, pathRules_1.matchPathRule)(config.pathRules);
    const color = config.colorMode === 'path'
        ? pathMatch?.rule.color
        : (0, language_1.getLanguageColor)(languageId);
    if (color) {
        await updateColors((0, color_1.buildColorCustomizations)(color));
    }
    await updateWindowTitle((0, title_1.buildTitle)(config, {
        folderName: (0, pathRules_1.getFolderName)(pathMatch?.folder),
        languageName,
        pathLabel: pathMatch?.rule.label
    }));
}
async function clearMacaw() {
    await updateColors(undefined);
    await updateWindowTitle(undefined);
}
async function updateColors(next) {
    const workbench = vscode.workspace.getConfiguration('workbench');
    const current = workbench.get('colorCustomizations', {});
    const merged = { ...current };
    for (const key of color_1.macawColorKeys) {
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
async function updateWindowTitle(next) {
    const windowConfig = vscode.workspace.getConfiguration('window');
    const current = windowConfig.get(windowTitleKey);
    if (current === next) {
        return;
    }
    await windowConfig.update(windowTitleKey, next, vscode.ConfigurationTarget.Workspace);
}
function sameJson(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
//# sourceMappingURL=apply.js.map