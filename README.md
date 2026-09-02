# 秀平｜和太鼓奏者 プロフィールサイト

スマートフォン閲覧を優先した、1ページ完結の静的プロフィールサイトです。ビルド作業は不要です。

## 公開前に差し替えるもの

### 1. メイン写真

本人写真は `assets/shuhei-main.jpg` に配置済みです。公開用コピーから位置情報や撮影機器情報などのEXIFを削除し、表示用に軽量化しています。

### 2. SNSリンク

InstagramとYouTubeは、どちらも `@taikotofue.shu` への導線を設定済みです。

## GitHub Pagesで無料公開する方法

1. GitHubで新しい公開リポジトリを作成します。
2. このフォルダ内のファイルをすべてリポジトリへ追加します。
3. リポジトリの `Settings` → `Pages` を開きます。
4. `Build and deployment` の `Source` を `Deploy from a branch` にします。
5. Branchを `main`、フォルダを `/(root)` にして `Save` を押します。
6. 数分後、同じ画面に無料の公開URLが表示されます。

公開URLは通常 `https://GitHubユーザー名.github.io/リポジトリ名/` です。

## ファイル構成

- `index.html` — 掲載内容
- `styles.css` — デザインとスマホ対応
- `script.js` — コピーライト年の自動更新
- `assets/shuhei-main.jpg` — 公開用の本人写真（要追加）

メールアドレスは `taikouchi.shuhei@gmail.com` に設定済みです。

## Google Analytics 4

個人ホームページ用のGoogle tag（測定ID `G-FNFTEX8CK5`）を `index.html` の共通headへ設置しています。Measurement IDは公開情報ですが、GA4 Data API用のサービスアカウント鍵や秘密情報はこのリポジトリへ保存しないでください。
