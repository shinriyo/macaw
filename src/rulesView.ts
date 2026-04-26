import * as vscode from 'vscode';
import { applyMacaw } from './apply';
import { type ColorMode, getConfig, type PathRule } from './config';
import { defaultLanguageColors, languageNames } from './language';
import { getFolderName, getPrimaryWorkspaceFolder, pathToTildePattern } from './pathRules';

interface RulesViewState {
  colorMode: ColorMode;
  showLanguageInTitle: boolean;
  showPathLabelInTitle: boolean;
  pathRules: PathRule[];
  languageColors: Record<string, string>;
  currentRoot: string;
  currentFolderName: string;
}

type WebviewMessage =
  | { type: 'save'; state: RulesViewState }
  | { type: 'apply' }
  | { type: 'copyColor'; color: string };

let panel: vscode.WebviewPanel | undefined;

export async function openRulesView(context: vscode.ExtensionContext): Promise<void> {
  if (panel) {
    panel.reveal(vscode.ViewColumn.One);
    panel.webview.postMessage({ type: 'state', state: getRulesViewState() });
    return;
  }

  panel = vscode.window.createWebviewPanel(
    'macawRules',
    'Macaw Rules',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [context.extensionUri]
    }
  );

  panel.onDidDispose(() => {
    panel = undefined;
  }, null, context.subscriptions);

  panel.webview.html = getHtml(panel.webview, getRulesViewState());
  panel.webview.onDidReceiveMessage((message: WebviewMessage) => {
    if (message.type === 'save') {
      void saveState(message.state);
      return;
    }

    if (message.type === 'apply') {
      void applyMacaw();
      return;
    }

    if (message.type === 'copyColor') {
      void copyColor(message.color);
    }
  }, null, context.subscriptions);
}

function getRulesViewState(): RulesViewState {
  const config = getConfig();
  const folder = getPrimaryWorkspaceFolder();

  return {
    ...config,
    currentRoot: folder ? pathToTildePattern(folder.uri.fsPath) : '',
    currentFolderName: folder ? getFolderName(folder) : ''
  };
}

async function saveState(state: RulesViewState): Promise<void> {
  const config = vscode.workspace.getConfiguration('macaw');
  const rules = state.pathRules
    .map((rule) => ({
      pattern: rule.pattern.trim(),
      label: rule.label.trim(),
      color: rule.color.trim()
    }))
    .filter((rule) => rule.pattern && rule.label && /^#[0-9A-Fa-f]{6}$/.test(rule.color));

  await config.update('colorMode', state.colorMode, vscode.ConfigurationTarget.Workspace);
  await config.update('showLanguageInTitle', state.showLanguageInTitle, vscode.ConfigurationTarget.Workspace);
  await config.update('showPathLabelInTitle', state.showPathLabelInTitle, vscode.ConfigurationTarget.Workspace);
  await config.update('pathRules', rules, vscode.ConfigurationTarget.Workspace);
  await config.update('languageColors', cleanLanguageColors(state.languageColors), vscode.ConfigurationTarget.Workspace);
  await applyMacaw();
  void vscode.window.showInformationMessage('Macaw rules saved.');
}

async function copyColor(color: string): Promise<void> {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return;
  }

  await vscode.env.clipboard.writeText(color);
}

function cleanLanguageColors(languageColors: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(languageColors)
      .filter(([languageId, color]) => languageId && /^#[0-9A-Fa-f]{6}$/.test(color))
  );
}

function getHtml(webview: vscode.Webview, state: RulesViewState): string {
  const nonce = getNonce();
  const encodedState = JSON.stringify(state).replace(/</g, '\\u003c');
  const encodedLanguages = JSON.stringify(
    Object.entries(languageNames).map(([id, name]) => ({
      id,
      name,
      color: defaultLanguageColors[id]
    }))
  ).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Macaw Rules</title>
  <style>
    :root {
      color-scheme: light dark;
      --gap: 14px;
    }

    body {
      margin: 0;
      padding: 24px;
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
    }

    main {
      max-width: 980px;
      margin: 0 auto;
    }

    h1 {
      margin: 0 0 20px;
      font-size: 24px;
      font-weight: 650;
    }

    h2 {
      margin: 28px 0 12px;
      font-size: 15px;
      font-weight: 650;
    }

    .settings {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: var(--gap);
      align-items: end;
    }

    .mode-panel {
      margin-top: 22px;
      padding: 14px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      background: var(--vscode-sideBar-background);
    }

    .mode-panel[hidden] {
      display: none;
    }

    .mode-panel.disabled {
      opacity: 0.48;
      pointer-events: none;
    }

    label {
      display: grid;
      gap: 6px;
      color: var(--vscode-descriptionForeground);
    }

    input:not([type="checkbox"]),
    select {
      min-height: 30px;
      box-sizing: border-box;
      border: 1px solid var(--vscode-input-border, transparent);
      color: var(--vscode-input-foreground);
      background: var(--vscode-input-background);
      padding: 5px 8px;
      border-radius: 3px;
      font: inherit;
    }

    input[type="color"] {
      width: 48px;
      padding: 2px;
    }

    .toggles {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 18px;
      margin-top: 16px;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toggle input[type="checkbox"] {
      width: 14px;
      height: 14px;
      margin: 0;
      accent-color: var(--vscode-checkbox-selectBackground);
      flex: 0 0 auto;
    }

    .rules {
      display: grid;
      gap: 8px;
    }

    .rule {
      display: grid;
      grid-template-columns: minmax(220px, 1.8fr) 82px minmax(120px, 0.8fr) 56px 98px 34px;
      gap: 8px;
      align-items: end;
      padding: 10px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      background: var(--vscode-sideBar-background);
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }

    .inline-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 0 0 12px;
    }

    button {
      min-height: 30px;
      border: 0;
      border-radius: 3px;
      padding: 5px 12px;
      color: var(--vscode-button-foreground);
      background: var(--vscode-button-background);
      font: inherit;
      cursor: pointer;
    }

    button:hover {
      background: var(--vscode-button-hoverBackground);
    }

    button.secondary {
      color: var(--vscode-button-secondaryForeground);
      background: var(--vscode-button-secondaryBackground);
    }

    button.secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }

    button.color-chip {
      border: 1px solid var(--vscode-panel-border);
      font-variant-numeric: tabular-nums;
    }

    button.color-chip:hover {
      border-color: var(--vscode-focusBorder);
      filter: brightness(1.08);
    }

    button.compact {
      padding-inline: 8px;
      white-space: nowrap;
    }

    button.icon {
      width: 34px;
      padding: 0;
      font-size: 18px;
      line-height: 1;
    }

    button.danger {
      width: 34px;
      min-width: 34px;
      height: 30px;
      padding: 0;
      border: 1px solid var(--vscode-inputValidation-errorBorder, #BE1100);
      color: #FFFFFF;
      background: var(--vscode-inputValidation-errorBackground, #BE1100);
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
    }

    button.danger:hover,
    button.danger:focus {
      background: #D32F2F;
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: 2px;
    }

    .hint {
      margin-top: 8px;
      color: var(--vscode-descriptionForeground);
    }

    .empty-state {
      margin: 0;
      color: var(--vscode-descriptionForeground);
    }

    @media (max-width: 760px) {
      body {
        padding: 16px;
      }

      .rule {
        grid-template-columns: 1fr;
      }

      input[type="color"] {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <main>
    <h1>Macaw Rules</h1>

    <section class="settings">
      <label>
        Color mode
        <select id="colorMode">
          <option value="path">Path</option>
          <option value="language">Language</option>
          <option value="none">None</option>
        </select>
      </label>
    </section>

    <div class="toggles">
      <label class="toggle"><input id="showPathLabelInTitle" type="checkbox"> Show path label in title</label>
      <label class="toggle"><input id="showLanguageInTitle" type="checkbox"> Show language in title</label>
    </div>

    <section id="pathPanel" class="mode-panel">
      <h2>Root Path Mappings</h2>
      <div class="inline-actions">
        <button id="addBlank" class="secondary">Add Blank Rule</button>
      </div>
      <div id="rules" class="rules"></div>
      <p class="hint">Pattern is only used in Path mode. First matching path rule wins.</p>
    </section>

    <section id="languagePanel" class="mode-panel">
      <h2>Language Color</h2>
      <div class="rule">
        <label>
          Pattern
          <input type="text" value="Not used in Language mode" disabled>
        </label>
        <label>
          Language
          <select id="languageSelect"></select>
        </label>
        <label>
          Color
          <input id="languageColor" type="color">
        </label>
        <button id="languagePreview" type="button" class="secondary"></button>
        <span></span>
      </div>
    </section>

    <section id="nonePanel" class="mode-panel disabled">
      <h2>Disabled</h2>
      <p class="empty-state">Color and title changes are disabled while Color mode is None.</p>
    </section>

    <div class="actions">
      <button id="save">Save & Apply</button>
      <button id="apply" class="secondary">Apply Current Settings</button>
    </div>
  </main>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const state = ${encodedState};
    const languages = ${encodedLanguages};
    const colorMode = document.getElementById('colorMode');
    const showPathLabelInTitle = document.getElementById('showPathLabelInTitle');
    const showLanguageInTitle = document.getElementById('showLanguageInTitle');
    const rules = document.getElementById('rules');
    const pathPanel = document.getElementById('pathPanel');
    const languagePanel = document.getElementById('languagePanel');
    const nonePanel = document.getElementById('nonePanel');
    const languageSelect = document.getElementById('languageSelect');
    const languageColor = document.getElementById('languageColor');
    const languagePreview = document.getElementById('languagePreview');

    function render(nextState) {
      Object.assign(state, nextState);
      colorMode.value = state.colorMode;
      showPathLabelInTitle.checked = state.showPathLabelInTitle;
      showLanguageInTitle.checked = state.showLanguageInTitle;
      renderMode();
      renderLanguageOptions();
      rules.replaceChildren(...state.pathRules.map((rule, index) => renderRule(rule, index)));
    }

    function renderMode() {
      pathPanel.hidden = state.colorMode !== 'path';
      languagePanel.hidden = state.colorMode !== 'language';
      nonePanel.hidden = state.colorMode !== 'none';
      const disabled = state.colorMode === 'none';
      showPathLabelInTitle.disabled = disabled;
      showLanguageInTitle.disabled = disabled;
    }

    function renderLanguageOptions() {
      if (languageSelect.options.length === 0) {
        for (const language of languages) {
          const option = document.createElement('option');
          option.value = language.id;
          option.textContent = language.name;
          languageSelect.append(option);
        }
      }

      const selected = languageSelect.value || languages[0]?.id || 'typescript';
      languageSelect.value = selected;
      languageColor.value = state.languageColors[selected] || defaultLanguageColor(selected);
      updateLanguagePreview();
    }

    function renderRule(rule, index) {
      const row = document.createElement('div');
      row.className = 'rule';

      row.append(
        field('Pattern', textInput(rule.pattern, (value) => state.pathRules[index].pattern = value)),
        useCurrentRootButton(index),
        field('Label', textInput(rule.label, (value) => state.pathRules[index].label = value)),
        field('Color', colorInput(rule.color, (value) => state.pathRules[index].color = value)),
        preview(rule),
        removeButton(index)
      );

      return row;
    }

    function field(labelText, input) {
      const label = document.createElement('label');
      label.textContent = labelText;
      label.append(input);
      return label;
    }

    function textInput(value, onInput) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = value;
      input.addEventListener('input', () => onInput(input.value));
      return input;
    }

    function colorInput(value, onInput) {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#1976D2';
      input.addEventListener('input', () => onInput(input.value));
      return input;
    }

    function preview(rule) {
      return colorChip(rule.color);
    }

    function removeButton(index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'danger';
      button.title = 'Remove rule';
      button.textContent = '×';
      button.addEventListener('click', () => {
        state.pathRules.splice(index, 1);
        render(state);
      });
      return button;
    }

    function useCurrentRootButton(index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary compact';
      button.title = 'Apply current workspace root to this pattern';
      button.textContent = 'Use Root';
      button.addEventListener('click', () => {
        state.pathRules[index].pattern = state.currentRoot || '~/develop/*';
        render(state);
      });
      return button;
    }

    function collectState() {
      return {
        colorMode: colorMode.value,
        showLanguageInTitle: showLanguageInTitle.checked,
        showPathLabelInTitle: showPathLabelInTitle.checked,
        pathRules: state.pathRules,
        languageColors: state.languageColors,
        currentRoot: state.currentRoot,
        currentFolderName: state.currentFolderName
      };
    }

    function addRule(rule) {
      state.pathRules.push(rule);
      render(state);
    }

    function defaultLanguageColor(languageId) {
      return languages.find((language) => language.id === languageId)?.color || '#1976D2';
    }

    function updateLanguageColor() {
      state.languageColors[languageSelect.value] = languageColor.value;
      updateLanguagePreview();
    }

    function updateLanguagePreview() {
      const selected = languageSelect.value;
      const label = languages.find((language) => language.id === selected)?.name || selected;
      languagePreview.textContent = label + ' ' + languageColor.value;
      languagePreview.style.background = languageColor.value;
      languagePreview.style.color = contrast(languageColor.value);
      languagePreview.title = 'Copy ' + languageColor.value;
    }

    function colorChip(color) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'color-chip';
      button.textContent = color;
      button.title = 'Copy ' + color;
      button.style.background = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '';
      button.style.color = contrast(color);
      button.addEventListener('click', () => copyColor(button, color));
      return button;
    }

    function copyColor(button, color) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return;
      }

      vscode.postMessage({ type: 'copyColor', color });
      const original = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => {
        button.textContent = original;
      }, 900);
    }

    function contrast(hex) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        return '';
      }

      const red = parseInt(hex.slice(1, 3), 16);
      const green = parseInt(hex.slice(3, 5), 16);
      const blue = parseInt(hex.slice(5, 7), 16);
      const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
      return luminance > 0.6 ? '#000000' : '#FFFFFF';
    }

    document.getElementById('addBlank').addEventListener('click', () => {
      addRule({ pattern: '~/develop/*', label: 'DEV', color: '#7E57C2' });
    });

    colorMode.addEventListener('change', () => {
      state.colorMode = colorMode.value;
      render(state);
    });

    languageSelect.addEventListener('change', () => {
      languageColor.value = state.languageColors[languageSelect.value] || defaultLanguageColor(languageSelect.value);
      updateLanguagePreview();
    });

    languageColor.addEventListener('input', updateLanguageColor);
    languagePreview.addEventListener('click', () => copyColor(languagePreview, languageColor.value));

    document.getElementById('save').addEventListener('click', () => {
      vscode.postMessage({ type: 'save', state: collectState() });
    });

    document.getElementById('apply').addEventListener('click', () => {
      vscode.postMessage({ type: 'apply' });
    });

    window.addEventListener('message', (event) => {
      if (event.data.type === 'state') {
        render(event.data.state);
      }
    });

    render(state);
  </script>
</body>
</html>`;
}

function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';

  for (let i = 0; i < 32; i += 1) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return nonce;
}
