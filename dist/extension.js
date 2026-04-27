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
const rulesView_1 = require("./rulesView");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('macaw.openRules', async () => {
        await (0, rulesView_1.openRulesView)(context);
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
//# sourceMappingURL=extension.js.map