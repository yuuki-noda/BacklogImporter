## 概要

このプロジェクトは Backlog から

- Wiki
- 課題

の中身を取得し、gitlab へ移行するためのプロジェクトです。

各サービスの API 解説

- [gitlab](https://docs.gitlab.com/api/rest/)
- [backlog](https://developer.nulab.com/ja/docs/backlog/)

## 実行環境

- node
  - 20.17.00
- npm
  - 10.8.2

## env ファイル

使用する場合は env ファイル作成し埋めてください。

- BACKLOG_API_KEY
  - backlog で発行した APIKey
- GITLAB_API_KEY
  - 個人用アクセストークン
- BACKLOG_PROJECT_KEY
  - backlog の対象 project の key
- GITLAB_PROJECT_KEY
  - import 先の対象の project の key

例

```.env
BACKLOG_API_KEY=hogehoge
GITLAB_API_KEY=fugafuga
```

## 準備

いくつかファイルを生成しますが、ディレクトリを作ったり作ってなかったりするため、以下のディレクトリを作成してください

- ./output
- ./output/resource/wikis
- ./output/resource/tickets

## コマンド

すべて `npm run {command}` 形式で入力してください

### get_wikis

backlog から wiki のリストを取得します。

取得するもの

- wiki の ID
- wiki の名前

### get_wikis_detail

上記で取得した ID から wiki の中身を取得します。

またこの段階で、backlog 形式で記載された content を markdown 方式に変換します

取得するもの.

- wiki の content
- attachments の id
- attachments の fileName
- attachments の extName
- wiki の gitlab content

### get_wikis_attachments

添付ファイルをダウンロードし保存します

命名規則は`backlog-{attachmentID}.{ext}`です

また Attachment に以下の情報を保存します

- replacedName
- markdown

### create_markdown

上記で取得した情報で、markdown ファイルを生成します。

また backlog は title が path になってるため、それに沿ってディレクトリを作成します。

`./output/wiki`以下にファイルが生成されます

### get_tickets

課題を取得します。

サンプルでは POS_FOOD プロジェクトでの課題の検索例なので、ここは編集をしてください.

### get_tickets_attachments

課題の添付ファイルを取得します

取得したファイルは`./output/resource/tickets`以下に保存されます

命名規則は`backlog-{attachmentID}.{ext}`です

### post_issues_attachments

添付ファイルを gitlab に upload します

ここで gitlab から返却された添付ファイルのリンクの markdown を格納します

e.g.

```markdown
![backlog-223311.png](uploads/hogehogefugafuga/backlog-223311.png)
```

### post_issues

gitlab に課題を作成します

backlog 側のパラメータを gitlab のどのパラメータに反映させるかのマッピングは実装をお願いします

## 運用方法

### wiki の移行

各コマンドでファイルを取得したら wiki のリポジトリに push するのが一番楽です.

1. get_wikis
2. get_wikis_detail
3. get_wikis_attachments
4. create_markdown

を順番に実行し、`./src/output/wiki`にできた md ファイルを wiki のリポジトリにコピーして push しましょう。

`./src/utils/constant/filePath.ts`に添付ファイルの保存場所が記載されているため。添付ファイルはその通りに配置するか、path の文字列を変換してください

### 課題の移行

いくつかソースコードの変更が必要です。

- `./src/issue/getTicket.ts`
  - 移行したい課題の検索条件を編集してください
- `./src/model/*`
  - `Ticket.ts`と`Wiki.ts`以外は編集必須
- `./src/issue/postIssues.ts`
  - マッピングに応じて、クエリパラメータを編集してください

#### `./src/model/*`のマッピングについて

以下にある backlog や gitlab の各値は API 経由や GUI で確認することができます

- Category
  - backlog の category の ID
  - 対応する gitlab の 要素。POS の場合は labels に追加してます
- Milestone
  - backlog の milestone の ID
  - gitlab の milestone の ID
- Prioriy
  - backlog の prioriy の ID
  - 対応する gitlab の要素。POS の場合は labels に追加してます
- Status
  - backlog の status の ID
  - 対応する gitlab の要素。POS の場合は labels に追加してます
- User
  - backlog の user の ID
  - 対応する gitlab の user の ID
