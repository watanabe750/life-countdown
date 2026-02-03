# Life Countdown

「今を大切に生きるための時間の可視化」をテーマにしたWebアプリです。生年月日と目標年齢を入力すると、残り時間がリアルタイムでカウントダウン表示されます。

## セットアップ・起動方法

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# テストの実行
npm run test
```

## 機能

- **カウントダウン表示**: 残り時間を年/月/週/日/時/分/秒の単位で表示
- **単位切り替え**: segmented control で表示単位を切り替え可能
- **設定の永続化**: localStorage に保存され、再読み込みしても維持される
- **プライバシー重視**: データは端末内のみに保存され、外部送信しません

## 計算仕様

### 目標日時（ゴール）の定義

- 生年月日の「同月同日」の 00:00 を基準に、目標年齢に到達した瞬間をゴールとする
- 例: 2000年5月20日生まれ、80歳 → 2080年5月20日 00:00（ローカル時刻）

### 残り時間の計算

```
残り時間 = goalDateTime - now（ミリ秒差分）
```

- すでにゴールを過ぎている場合は `0` 表示（マイナス表示しない）

### 単位変換ルール（平均換算で統一）

| 単位 | 換算式 |
|------|--------|
| 秒 | ms / 1000 |
| 分 | 秒 / 60 |
| 時 | 分 / 60 |
| 日 | 時 / 24 |
| 週 | 日 / 7 |
| 月 | 日 / 30.4375（平均月 = 365.25 / 12） |
| 年 | 日 / 365.2425（平均太陽年） |

### 表示形式

- 秒: 整数（小数点なし）
- その他: 小数点以下2桁

## 技術スタック

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Vitest + React Testing Library

## プロジェクト構成

```
src/
├── components/
│   ├── CountdownCard.tsx    # カウントダウン表示部分
│   ├── SettingsModal.tsx    # 設定モーダル
│   └── UnitSwitcher.tsx     # 単位切替コントロール
├── hooks/
│   └── useLocalStorage.ts   # localStorage永続化フック
├── utils/
│   └── timeUtils.ts         # 時間計算ユーティリティ
├── test/
│   └── setup.ts             # テスト設定
├── App.tsx                  # メインアプリケーション
├── types.ts                 # 型定義
├── main.tsx                 # エントリーポイント
└── index.css                # グローバルスタイル
```

## データの保存

- **localStorage キー**:
  - `life-countdown-settings`: 生年月日と目標年齢
  - `life-countdown-unit`: 選択中の表示単位

- **外部送信なし**: すべてのデータは端末内の localStorage にのみ保存されます

## ライセンス

MIT
