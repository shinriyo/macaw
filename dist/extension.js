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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const apply_1 = require("./apply");
const config_1 = require("./config");
const pathRules_1 = require("./pathRules");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('macaw.apply', async () => {
        await (0, apply_1.applyMacaw)();
    }), vscode.commands.registerCommand('macaw.clear', async () => {
        await (0, apply_1.clearMacaw)();
    }), vscode.commands.registerCommand('macaw.addPathRule', async () => {
        await addPathRule();
    }), vscode.commands.registerCommand('macaw.setProjectLabel', async () => {
        await setProjectLabel();
    }), vscode.workspace.onDidChangeWorkspaceFolders(() => void (0, apply_1.applyMacaw)()), vscode.window.onDidChangeActiveTextEditor(() => void (0, apply_1.applyMacaw)()), vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('macaw')) {
            void (0, apply_1.applyMacaw)();
        }
    }));
    void (0, apply_1.applyMacaw)();
}
function deactivate() {
    // VS Code disposes registered subscriptions for us.
}
async function addPathRule() {
    const folder = (0, pathRules_1.getPrimaryWorkspaceFolder)();
    const currentPattern = folder ? (0, pathRules_1.pathToTildePattern)(folder.uri.fsPath) : '';
    const pattern = await vscode.window.showInputBox({
        title: 'Macaw: Add Path Rule',
        prompt: 'Root path pattern to map to a title label',
        value: currentPattern,
        placeHolder: '~/develop/app',
        ignoreFocusOut: true
    });
    if (!pattern) {
        return;
    }
    const label = await vscode.window.showInputBox({
        title: 'Macaw: Add Path Rule',
        prompt: 'Label shown in the window title for this root',
        value: folder ? (0, pathRules_1.getFolderName)(folder).toUpperCase() : '',
        placeHolder: 'DEV',
        ignoreFocusOut: true
    });
    if (!label) {
        return;
    }
    const color = await vscode.window.showInputBox({
        title: 'Macaw: Add Path Rule',
        prompt: 'Hex color',
        placeHolder: '#7E57C2',
        validateInput: (value) => /^#[0-9A-Fa-f]{6}$/.test(value) ? undefined : 'Use #RRGGBB.',
        ignoreFocusOut: true
    });
    if (!color) {
        return;
    }
    const config = vscode.workspace.getConfiguration('macaw');
    const rules = (0, config_1.getConfig)().pathRules;
    const nextRule = {
        pattern: pattern.trim(),
        label: label.trim(),
        color: color.trim()
    };
    await config.update('pathRules', upsertPathRule(rules, nextRule), vscode.ConfigurationTarget.Workspace);
    await (0, apply_1.applyMacaw)();
    void vscode.window.showInformationMessage(`Macaw mapped ${nextRule.pattern} to [${nextRule.label}].`);
}
async function setProjectLabel() {
    const currentLabel = (0, config_1.getConfig)().projectLabel;
    const label = await vscode.window.showInputBox({
        title: 'Macaw: Set Project Label',
        prompt: 'Project label for the window title',
        value: currentLabel,
        ignoreFocusOut: true
    });
    if (label === undefined) {
        return;
    }
    await vscode.workspace
        .getConfiguration('macaw')
        .update('projectLabel', label.trim(), vscode.ConfigurationTarget.Workspace);
    await (0, apply_1.applyMacaw)();
}
function upsertPathRule(rules, nextRule) {
    const index = rules.findIndex((rule) => rule.pattern === nextRule.pattern);
    if (index === -1) {
        return [...rules, nextRule];
    }
    const nextRules = [...rules];
    nextRules[index] = nextRule;
    return nextRules;
}
//# sourceMappingURL=extension.js.map