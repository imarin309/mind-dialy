# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

React、TypeScript、Viteで構築されたマインドマップWebアプリケーション。階層的なマインドマップを作成し、ノードを展開/編集して、Markdown形式でエクスポートできる。

## コマンド

### 開発
```bash
npm run dev          # 開発サーバーを起動
make exe             # 開発サーバーを起動（代替）
```

### ビルド & プレビュー
```bash
npm run build        # 型チェックとプロダクションビルド
npm run preview      # プロダクションビルドをプレビュー
```

### コード品質
```bash
npm run lint         # ESLintを実行
make format          # ESLintで自動修正（--fix）
```

### その他
```bash
npm install          # 依存関係をインストール
make clean           # ビルド成果物を削除（dist、dist-ssr、.viteキャッシュ）
```

## アーキテクチャ

### 状態管理パターン
マインドマップのツリー構造には**イミュータブルな状態更新**を使用している。`src/domain/mindmap.tsx`の全操作（追加、削除、更新）は既存のノードを変更せず、新しいノードツリーを作成する。このパターンによりReactが変更を正しく検知し、コンポーネントを再レンダリングできる。

**重要**: ノード操作を修正する際は、必ず新しいオブジェクト/配列を返すこと。既存のものを直接変更しないこと。

### コンポーネント階層
- **App.tsx**: 単一のツリー（`rootNode`）としてマインドマップ全体の状態を管理するルートコンポーネント
- **Header**: リセットと保存（Markdown出力）機能を提供
- **MindMapNode**: 自身と子ノードを再帰的にレンダリングするコンポーネント
  - パフォーマンス最適化のため`memo()`を使用
  - ノードの展開、ホバー状態、アクションボタンを処理
  - 接続線付きで子ノードを再帰的にレンダリング
- **EditableField**: タイトルとテキストフィールド両方で使用可能な再利用可能なインライン編集コンポーネント

### ドメインロジック（`src/domain/mindmap.tsx`）
全てのマインドマップ操作は、ツリーを受け取り新しいツリーを返す純粋関数：
- `addChildToNode`: 対象ノードを再帰的に探索し、新しい子を追加
- `deleteNodeById`: IDでノードを再帰的にフィルタリング
- `updateNodeById` / `updateNodeTextById`: ノードを再帰的に探索して更新
- `convertToMarkdown`: ツリーを階層的なMarkdownに変換（#のレベルはツリーの深さに対応）

**ノードID生成**: 一意性のため`Date.now()` + `Math.random()`を使用。

### スタイリング
- **Tailwind CSS**: ユーティリティクラス用（`tailwind.config.js`で設定）
- **カスタムCSS**: `src/styles/theme.css`にノード固有のスタイル（アニメーション、グラデーション、接続線）
- CSSクラス命名規則: 説明的なケバブケース（例：`node-container`、`children-row`）

### アニメーションとインタラクション
- **motion**（Framer Motion）ライブラリでスムーズなアニメーション
- ノードはスケールアニメーションで展開/折りたたみ（展開時1.8倍）
- z-index管理: 展開中のノード（50）> ホバー中のノード（100）> 通常（10）
- ノードをクリックで展開/折りたたみ。展開時のみ編集可能
- ノード展開時にオーバーレイ背景が表示される

### 状態フロー
1. ユーザーがUIを操作（子を追加、削除、編集）
2. コンポーネントがAppから渡されたハンドラ関数を呼び出す
3. Appがドメイン関数を呼び出して新しいツリーを取得
4. Appが新しいツリーで`setRootNode`を呼び出す
5. Reactが影響を受けるコンポーネントを再レンダリング（memoで不要な再レンダリングを防止）

### エクスポート機能
保存関数（`App.tsx`の`saveMindMap`）はタイムスタンプ付きMarkdownファイルを生成し、ブラウザダウンロードをトリガーする。形式: `mindmap_YYYYMMDD_HHMM.md`
