# SNS公開メモ

GitHub PagesでSNS公開する場合は、この `anime-survivor` フォルダの中身をGitHubリポジトリへアップしてください。

公開後に貼るURLは `index.html` ではなく、GitHub PagesのトップURLで大丈夫です。

例:

```text
https://ユーザー名.github.io/リポジトリ名/
```

GitHub側の設定:

1. GitHubで新しいリポジトリを作る
2. このフォルダの中身を全部アップする
3. `Settings` → `Pages` を開く
4. `Deploy from a branch` を選ぶ
5. `main` / `/ root` を選んで保存する

SNSカードには `assets/og-neko-fury-cutin.jpg` を使う設定を入れています。XやLINEなどで画像が出ない場合は、`index.html` の `og:image` と `twitter:image` を公開先の絶対URLに変えると安定します。

```html
<meta property="og:image" content="https://ユーザー名.github.io/リポジトリ名/assets/og-neko-fury-cutin.jpg">
<meta name="twitter:image" content="https://ユーザー名.github.io/リポジトリ名/assets/og-neko-fury-cutin.jpg">
```
