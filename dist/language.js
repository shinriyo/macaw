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
exports.languageNames = exports.languageColors = void 0;
exports.getActiveLanguageId = getActiveLanguageId;
exports.getLanguageColor = getLanguageColor;
exports.getLanguageName = getLanguageName;
const vscode = __importStar(require("vscode"));
exports.languageColors = {
    typescript: '#3178C6',
    javascript: '#F7DF1E',
    python: '#3776AB',
    rust: '#CE422B',
    go: '#00ADD8',
    dart: '#0175C2'
};
exports.languageNames = {
    typescript: 'TypeScript',
    javascript: 'JavaScript',
    python: 'Python',
    rust: 'Rust',
    go: 'Go',
    dart: 'Dart'
};
function getActiveLanguageId() {
    return vscode.window.activeTextEditor?.document.languageId;
}
function getLanguageColor(languageId = getActiveLanguageId()) {
    return languageId ? exports.languageColors[languageId] : undefined;
}
function getLanguageName(languageId = getActiveLanguageId()) {
    if (!languageId) {
        return undefined;
    }
    return exports.languageNames[languageId] ?? titleCase(languageId);
}
function titleCase(value) {
    return value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}
//# sourceMappingURL=language.js.map