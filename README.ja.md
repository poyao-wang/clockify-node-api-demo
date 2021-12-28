# clockify-node-api-demo

これは、[ClockifyAPI](https://clockify.me/developers-api) に接続するバックエンド API のデモです。
GET リクエストを使用して、[Clockify](https://clockify.me) のデータベースに項目を追加/削除/更新できます。

_他の言語で読んでください： [English](README.md)_

<p>&nbsp;</p>

## 目次

- [テックスタック](#テックスタック)
- [インストール](#インストール)
- [設定](#設定)
- [API](#api)
  - [プロジェクト](#プロジェクト)
  - [タスク](#タスク)
  - [時間エントリ](#時間エントリ)

<p>&nbsp;</p>

## テックスタック

- nodejs

- [axios](https://www.npmjs.com/package/axios)

  - [ClockifyAPI](https://clockify.me/developers-api) への http リクエストするために使用される

- [express](https://www.npmjs.com/package/express)

  - API サーバーのルーティングに使用される

- [jest](https://www.npmjs.com/package/jest)

  - API のテスティングに使用される

<p>&nbsp;</p>

## インストール

リポジトリをクローンする

```bash
  git clone https://github.com/poyao-wang/clockify-node-api-demo.git
```

プロジェクトディレクトリに移動します

```bash
  cd clockify-node-api-demo
```

パッケージをインストールする

```bash
  npm install
```

サーバーを起動します

```bash
  npm run start
```

<p>&nbsp;</p>

## 設定

config.json の設定ファイルを、自分の Clockify アカウント情報に変更します。

```bash
{
  ... ,
  "apiKey": "YOUR_KEY",
  "userId": "YOUR_USERID",
  "workspaceId": "YOUR_WORKSPACEID"
}
```

<p>&nbsp;</p>

## API

### プロジェクト

プロジェクトを追加/削除/更新します。

**新しいプロジェクトを作成するには**

```bash
GET /api/projects/new-project/NEW_PROJECT_NAME?color=COLOR_CODE
```

**既存のプロジェクトを削除するには**

```bash
GET /api/projects/delete-by-id/PROJECT_ID
```

**名前で既存のプロジェクトを検索するには**

```bash
GET /api/projects/find-by-name/PROJECT_NAME
```

**既存のプロジェクトを更新するには**

```bash
GET /api/projects/update-by-id/PROJECT_ID?name=NEW_PROJECT_NAMR&color=NEW_COLOR_CODE
```

<p>&nbsp;</p>

### タスク

既存のプロジェクトの下でタスクを追加/削除/更新します。

**新しいタスクを作成するには**

```bash
GET /api/tasks/new-task/projectId/PROJECT_ID/name/NEW_TASK_NAME?estimate=ESTIMATE_TIME
```

**既存のタスクを削除するには**

```bash
GET /api/tasks/delete-by-id/projectId/PROJECT_ID/taskId/TASK_ID
```

**名前で既存のタスクを検索するには**

```bash
GET /api/tasks/find-by-name/projectId/PROJECT_ID/name/TASK_NAME
```

**既存のタスクを更新するには**

```bash
GET /api/tasks/find-by-name/projectId/PROJECT_ID/taskId/TASK_ID?name=NEW_NAME&estimate=NEW_ESTIMATE_TIME
```

<p>&nbsp;</p>

### 時間エントリ

時間エントリを作成/停止します。

**時間エントリを作成するには**

```bash
GET /api/time-entries/new-entry?tagId=TAG_ID&description=DESCRIPTION&projectId=PROJECT_ID&taskId=TASK_ID
```

**ロールバックして時間エントリを作成するには**

```bash
GET /api/time-entries/new-entry/rollback?rollBackMinutes=ROLL_BACK_MINUTES?tagId=TAG_ID&description=DESCRIPTION&projectId=PROJECT_ID&taskId=TASK_ID
```

**現在の時間エントリを停止するには**

```bash
GET /api/time-entries/stop-current
```

**ロールバックして時間エントリを停止するには**

```bash
GET /api/time-entries/stop-current/rollback?rollBackMinutes=ROLL_BACK_MINUTES
```
