<p align="center">
  <img src="https://raw.githubusercontent.com/shinriyo/macaw/main/assets/macaw-logo.png" width="128" height="128" alt="Macaw logo">
</p>

# Macaw

Macaw is a Visual Studio Code extension for teams and developers who move between many workspaces. It changes the VS Code title and workbench colors from the current workspace root or active editor language, so you can spot the right window at a glance.

## Highlights

- GUI rule editor: run `Macaw: Open Rules`
- Path mode: map workspace roots to a label and color
- Language mode: color the window from the active editor language
- None mode: disable Macaw changes
- Japanese and other multilingual labels are supported
- Clear, save, color copy, and current-root assignment are built into the GUI

## Installation

Install from the Visual Studio Code Marketplace after release, or install the packaged VSIX manually:

1. Download `macaw-0.0.4.vsix`.
2. Open the Extensions view in VS Code.
3. Choose `Install from VSIX...`.
4. Select the downloaded file.

## Quick Start

1. Open the Command Palette.
2. Run `Macaw: Open Rules`.
3. Choose `Path`, `Language`, or `None`.
4. In Path mode, press `+`, set a label/color, and use `Use Root` to apply the current workspace root to that rule.
5. Press `Save & Apply`.

## Commands

- `Macaw: Open Rules`

## Settings

- `macaw.colorMode`: `path`, `language`, or `none`
- `macaw.pathRules`: root path mappings
- `macaw.languageColors`: language ID color mappings
- `macaw.showLanguageInTitle`
- `macaw.showPathLabelInTitle`

## Release Notes

### 0.0.4

Updates path rule color chips immediately while editing colors.

### 0.0.3

Fixes the README logo URL for the Marketplace page.

### 0.0.2

Removes the standalone Apply command from the Command Palette. Apply and Clear actions now live in the GUI rules editor.

### 0.0.1

Initial release with path rules, language colors, automatic title updates, and a GUI rules editor.

---

## 日本語

Macaw は、複数の VS Code ワークスペースを行き来する人のための拡張機能です。ワークスペースのルートパス、またはアクティブな言語に応じて、VS Code のタイトルとワークベンチ色を切り替えます。

使い方:

1. コマンドパレットで `Macaw: Open Rules` を実行します。
2. `Path` / `Language` / `None` を選びます。
3. Path mode では `+` でルールを追加し、`Use Root` で現在のルートパスを適用します。
4. `Save & Apply` で反映します。

主な機能:

- JSON を直接編集しない GUI
- パスごとのラベルと色
- 言語ごとの色
- 日本語ラベル対応
- GUI 内の Clear とカラーコードコピー

---

## 简体中文

Macaw 是一个 VS Code 扩展，适合经常在多个工作区之间切换的开发者。它可以根据当前工作区根路径或活动编辑器语言，自动调整窗口标题和界面颜色。

快速使用:

1. 在命令面板运行 `Macaw: Open Rules`。
2. 选择 `Path`、`Language` 或 `None`。
3. 在 Path 模式下，点击 `+` 添加规则，再用 `Use Root` 应用当前工作区根路径。
4. 点击 `Save & Apply` 保存并应用。

功能:

- 图形化规则编辑器
- 路径到标签/颜色的映射
- 按语言切换颜色
- 支持多语言标签
- 可清除设置并复制颜色代码

---

## 한국어

Macaw는 여러 VS Code 워크스페이스를 오가는 개발자를 위한 확장입니다. 현재 워크스페이스 루트 경로나 활성 편집기의 언어에 따라 창 제목과 워크벤치 색상을 바꿉니다.

빠른 시작:

1. 명령 팔레트에서 `Macaw: Open Rules`를 실행합니다.
2. `Path`, `Language`, `None` 중 하나를 선택합니다.
3. Path 모드에서 `+`로 규칙을 추가하고 `Use Root`로 현재 루트 경로를 적용합니다.
4. `Save & Apply`를 누릅니다.

기능:

- GUI 규칙 편집기
- 경로별 라벨과 색상
- 언어별 색상
- 다국어 라벨 지원
- GUI 안에서 Clear 및 색상 코드 복사

---

## Tiếng Việt

Macaw là tiện ích VS Code dành cho lập trình viên thường xuyên chuyển đổi giữa nhiều workspace. Tiện ích đổi tiêu đề cửa sổ và màu giao diện theo đường dẫn gốc của workspace hoặc ngôn ngữ đang mở.

Bắt đầu nhanh:

1. Mở Command Palette và chạy `Macaw: Open Rules`.
2. Chọn `Path`, `Language`, hoặc `None`.
3. Ở Path mode, bấm `+` để thêm rule, rồi bấm `Use Root` để dùng đường dẫn workspace hiện tại.
4. Bấm `Save & Apply`.

Tính năng:

- Trình chỉnh rule bằng GUI
- Gán nhãn và màu theo đường dẫn
- Gán màu theo ngôn ngữ
- Hỗ trợ nhãn đa ngôn ngữ
- Clear và sao chép mã màu ngay trong GUI
