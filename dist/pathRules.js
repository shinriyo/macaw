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
exports.getPrimaryWorkspaceFolder = getPrimaryWorkspaceFolder;
exports.matchPathRule = matchPathRule;
exports.getFolderName = getFolderName;
exports.pathToTildePattern = pathToTildePattern;
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
function getPrimaryWorkspaceFolder() {
    return vscode.workspace.workspaceFolders?.[0];
}
function matchPathRule(rules, folder = getPrimaryWorkspaceFolder()) {
    if (!folder) {
        return undefined;
    }
    const folderPath = normalizePath(folder.uri.fsPath);
    const match = rules.find((rule) => patternToRegExp(rule.pattern).test(folderPath));
    return match ? { rule: match, folder } : undefined;
}
function getFolderName(folder = getPrimaryWorkspaceFolder()) {
    return folder ? path.basename(folder.uri.fsPath) : 'Workspace';
}
function pathToTildePattern(folderPath) {
    const normalized = normalizePath(folderPath);
    const home = normalizePath(os.homedir());
    return normalized === home || normalized.startsWith(`${home}/`)
        ? `~${normalized.slice(home.length)}`
        : normalized;
}
function patternToRegExp(pattern) {
    const expanded = normalizePath(expandHome(pattern));
    const escaped = expanded
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '[^/]*');
    return new RegExp(`^${escaped}$`);
}
function expandHome(pattern) {
    if (pattern === '~') {
        return os.homedir();
    }
    if (pattern.startsWith('~/')) {
        return path.join(os.homedir(), pattern.slice(2));
    }
    return pattern;
}
function normalizePath(value) {
    return path.resolve(value).replace(/\\/g, '/');
}
//# sourceMappingURL=pathRules.js.map