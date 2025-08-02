# ムリな日カレンダー

**参加できない日だけ選ぶ、逆転の発想で最速調整**

友達との飲み会や遊びの日程調整が一瞬で完了！参加できない日を選ぶだけの新しい日程調整ツールです。

🔗 **Live Demo**: [https://murinahi.vercel.app](https://murinahi.vercel.app)

## ✨ 特徴

- **🚀 超高速** - 参加できない日だけ選ぶから、調整が一瞬で完了
- **📱 かんたん操作** - ムリな日をタップするだけ。難しい設定は一切なし
- **👥 登録不要** - アカウント作成なし。URLを共有するだけで即スタート
- **📊 リアルタイム集計** - 参加者の選択状況をリアルタイムで確認
- **🔗 URL共有** - 生成されたURLをLINEやメールで簡単共有

## 🛠️ 技術スタック

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Upstash Redis
- **Deployment**: Vercel
- **Language**: TypeScript

## 🚀 開発環境のセットアップ

### 必要な環境変数

```bash
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 開発サーバーの起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

### その他のコマンド

```bash
# ビルド
npm run build

# 本番サーバーの起動
npm start

# リンター
npm run lint

# フォーマッター
npm run format
```

## 📝 使い方

1. **イベント作成**: ホームページでイベント名を入力して「イベントを作る」ボタンをクリック
2. **URL共有**: 生成されたURLをLINEやメールで参加者に共有
3. **日程選択**: 各参加者が参加できない日をカレンダーでタップ
4. **集計確認**: リアルタイムで全員の選択状況を確認し、最適な日程を決定

## 🏗️ プロジェクト構成

```
src/
├── app/
│   ├── actions.ts          # Server Actions
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   ├── HomeClient.tsx      # ホームページクライアント
│   ├── model/
│   │   └── Event.ts        # データモデル
│   ├── event/[id]/
│   │   ├── page.tsx        # イベントページ
│   │   └── EventPageClient.tsx
│   ├── api/
│   │   └── og/route.tsx    # OGP画像生成
│   ├── sitemap.ts          # サイトマップ
│   └── robots.ts           # robots.txt
└── public/                 # 静的ファイル
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [Upstash](https://upstash.com/) - サーバーレスRedis
- [Vercel](https://vercel.com/) - デプロイメントプラットフォーム
