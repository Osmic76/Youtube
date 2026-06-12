# YouTube Takeout Manager

デスクトップアプリで YouTube Takeout データを管理するツール。Electron と TypeScript で構築されています。

## 機能

- 📁 **YouTube Takeout データのインポート** - Google Takeout からエクスポートした YouTube データを読み込み
- 🎬 **動画管理** - すべてのアップロード済み動画を一覧表示・検索
- 📊 **統計情報表示** - 再生数、高評価数、コメント数などを表示
- 📋 **再生リスト管理** - 再生リストの表示と整理
- 🏷️ **カスタムタグ** - 動画にカスタムタグを追加・削除
- 🔍 **検索・フィルタリング** - タイトルで検索、再生リストでフィルタリング

## 技術スタック

- **Electron** - デスクトップアプリケーション
- **React** - UI フレームワーク
- **TypeScript** - 型安全な開発
- **Electron Builder** - アプリケーションのビルド・パッケージング

## インストール

```bash
npm install
```

## 開発

```bash
npm start
```

Electron と React 開発サーバーが同時に起動します。

## ビルド

```bash
npm run build
```

プラットフォーム別の実行ファイルが `dist/` に生成されます。

## プロジェクト構造

```
Youtube/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── VideoList.tsx
│   │   ├── VideoDetail.tsx
│   │   └── PlaylistView.tsx
│   ├── utils/
│   │   └── takeoutParser.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
│   └── index.html
├── electron.js
├── preload.js
├── package.json
└── tsconfig.json
```

## 使用方法

1. Google Takeout から YouTube データをダウンロード
2. アプリを起動して「Load Takeout」ボタンをクリック
3. Takeout フォルダを選択
4. データが読み込まれ、管理画面が表示されます

## 今後の予定

- [ ] Takeout JSON データのパース実装
- [ ] ローカルデータベース（SQLite）の統合
- [ ] 再生リストの作成・編集機能
- [ ] 統計情報のグラフ表示
- [ ] エクスポート機能
- [ ] ダークモード

## ライセンス

MIT
