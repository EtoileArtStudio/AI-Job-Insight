# AI Job Insight 詳細設計書 - 共通AI応答基盤機能

---

# 1. 機能概要

## 1.1 機能名

共通AI応答基盤機能

## 1.2 機能ID

FUNC-COMMON-AI-001

## 1.3 機能の目的

外部AIサービスとの通信および応答整形を行う汎用的な基盤機能を提供する。

本機能は、AI Job Insightに限らず、将来的に別プロダクト（Shopping Insight等）への横展開を見据えた共通基盤として設計される。

## 1.4 位置づけ

- **共通基盤機能**：プロダクト固有の概念（案件、商品など）を含まない汎用機能
- **再利用可能**：Job固有機能から利用され、他プロダクトでも再利用可能
- **依存方向**：本機能はJob固有機能に依存しない

## 1.5 利用される画面

なし（データ処理機能のため画面なし）

---

# 2. 処理の実現方式

## 2.1 技術スタック

- 言語：TypeScript
- 通信方式：HTTPS REST API
- 非同期処理：async / await
- エラーハンドリング：try / catch

## 2.2 実装場所（想定）

```
src/
  core/
    ai/
      client.ts         # AI通信処理
      transform.ts      # AI応答整形処理
      types.ts          # 型定義
      index.ts          # エントリーポイント
```

## 2.3 対応AIサービス

- OpenAI API
- Google Gemini API

## 2.4 拡張性

新たなAIサービス追加時は、`client.ts`にサービス固有の通信処理を追加することで対応可能。

---

# 3. 入力データ

## 3.1 AI通信処理の入力

|項目名|型|必須|説明|
|---|---|---|---|
|service|'openai' \| 'gemini'|○|使用するAIサービス種別|
|apiKey|string|○|APIキー|
|prompt|string|○|AIへ送信するプロンプト文|
|modelName|string|○|使用するAIモデル名|
|temperature|number|任意|生成の多様性を制御するパラメータ（デフォルト：0.7）|
|maxTokens|number|任意|最大トークン数|

**TypeScript型定義**
```typescript
interface AIClientRequest {
  service: 'openai' | 'gemini';
  apiKey: string;
  prompt: string;
  modelName: string;
  temperature?: number;
  maxTokens?: number;
}
```

## 3.2 AI応答整形処理の入力

|項目名|型|必須|説明|
|---|---|---|---|
|rawResponse|string|○|AIから返却された生の応答テキスト|
|responseFormat|'json' \| 'text'|任意|期待する応答形式（デフォルト：'text'）|

**TypeScript型定義**
```typescript
interface AITransformRequest {
  rawResponse: string;
  responseFormat?: 'json' | 'text';
}
```

---

# 4. 出力データ

## 4.1 AI通信処理の出力

|項目名|型|説明|
|---|---|---|
|rawResponse|string|AIから返却された生の応答テキスト|
|error|Error \| null|エラー発生時のエラーオブジェクト|

**TypeScript型定義**
```typescript
interface AIClientResponse {
  rawResponse?: string;
  error?: Error;
}
```

## 4.2 AI応答整形処理の出力

|項目名|型|説明|
|---|---|---|
|content|string|整形後のコンテンツ|
|structuredData|Record<string, any> \| null|JSON形式にパースされた構造化データ|
|parseError|string \| null|パースエラー発生時のエラーメッセージ|

**TypeScript型定義**
```typescript
interface GenericAIResponse {
  content: string;
  structuredData?: Record<string, any>;
  parseError?: string;
}
```

---

# 5. 処理の流れ

## 5.1 AI通信処理フロー

```
1. AIサービス種別の判定
2. サービス別エンドポイントURLの取得
3. リクエストヘッダーの構築
   - OpenAI: Authorization: Bearer {apiKey}
   - Gemini: API Key をクエリパラメータに付与
4. リクエストボディの構築
5. AI APIへHTTPSリクエスト送信（fetch）
6. タイムアウト管理（デフォルト30秒）
7. レスポンス待機
8. HTTPステータスコードの確認
   - 200: 正常
   - 4xx: クライアントエラー
   - 5xx: サーバーエラー
9. エラー時はエラー情報を返却
10. 正常時は生レスポンステキストを返却
```

## 5.2 AI応答整形処理フロー

```
1. 生レスポンステキストの取得
2. responseFormatの確認
3. responseFormat === 'json' の場合
   a. JSON.parse() を試行
   b. 成功時は structuredData として返却
   c. 失敗時は parseError に情報を格納
4. responseFormat === 'text' の場合
   a. テキストとしてそのまま content に格納
5. 整形済みデータの返却
```

---

# 6. エラー処理

## 6.1 AI通信処理のエラー

|エラー内容|発生条件|対応|
|---|---|---|
|ネットワークエラー|AIサービスへの接続失敗|エラーオブジェクトを返却、呼び出し元でユーザーへ通知|
|タイムアウト|30秒以内に応答なし|エラーオブジェクトを返却、呼び出し元でユーザーへ通知|
|認証エラー（401）|APIキー不正|エラーオブジェクトを返却、呼び出し元でAPIキー再設定を促す|
|レート制限エラー（429）|APIリクエスト制限超過|エラーオブジェクトを返却、呼び出し元で再試行を促す|
|サーバーエラー（5xx）|AIサービス側の障害|エラーオブジェクトを返却、呼び出し元でユーザーへ通知|

## 6.2 AI応答整形処理のエラー

|エラー内容|発生条件|対応|
|---|---|---|
|JSON パースエラー|不正なJSON形式|parseError に情報を格納、content にテキストとして格納|
|空レスポンス|AIからの応答が空|content に空文字を格納、structuredData は null|

---

# 7. 使用するデータ

|データ名|保存場所|説明|
|---|---|---|
|APIキー|localStorage|ユーザーが設定したAPIキー（呼び出し元が管理）|
|AIサービス設定|localStorage|使用するAIサービスの種別情報（呼び出し元が管理）|

**Note**: 本共通基盤機能ではデータ保存を行わない。データ保存は呼び出し元（Job固有機能など）の責務とする。

---

# 8. AIプロンプト仕様

本共通基盤機能ではプロンプトの内容を定義しない。

プロンプト内容は呼び出し元（Job固有機能、Shopping固有機能など）で定義し、本機能へ渡される。

---

# 9. 外部API仕様

## 9.1 OpenAI API

**エンドポイント**
```
POST https://api.openai.com/v1/chat/completions
```

**リクエストヘッダー**
```
Authorization: Bearer {apiKey}
Content-Type: application/json
```

**リクエストボディ例**
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "{prompt}"
    }
  ],
  "temperature": 0.7
}
```

**レスポンス例**
```json
{
  "choices": [
    {
      "message": {
        "content": "AIの応答テキスト"
      }
    }
  ]
}
```

## 9.2 Google Gemini API

**エンドポイント**
```
POST https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={apiKey}
```

**リクエストボディ例**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "{prompt}"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7
  }
}
```

**レスポンス例**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "AIの応答テキスト"
          }
        ]
      }
    }
  ]
}
```

---

# 10. Job固有機能との連携

Job固有機能は、本共通基盤機能を以下の流れで利用する。

1. Job固有のプロンプト生成（Job固有機能の責務）
2. 共通AI通信処理を呼び出し（本共通機能）
3. 共通AI応答整形処理を呼び出し（本共通機能）
4. Job固有のデータ構造へ変換（Job固有機能の責務）

**連携のポイント**
- 共通機能はJob固有の概念を持たない
- プロンプト内容はJob固有機能で定義
- データ構造の最終的な解釈はJob固有機能で実施

---

# 11. 将来の横展開

## 11.1 Shopping Insight への適用

Shopping固有機能でも同様の流れで利用可能。

1. Shopping固有のプロンプト生成
2. 共通AI通信処理を呼び出し（再利用）
3. 共通AI応答整形処理を呼び出し（再利用）
4. Shopping固有のデータ構造へ変換

**横展開の利点**
- AI通信ロジックの再実装が不要
- エラーハンドリングの一貫性維持
- 新AIサービス対応時の修正箇所を最小化

---

# 12. テスト方針

## 12.1 単体テスト

- AI通信処理のモック化テスト
- 各AIサービスのエンドポイント構築テスト
- エラーハンドリングテスト
- タイムアウト処理テスト
- AI応答整形処理のパーステスト

## 12.2 統合テスト

- 実際のAI APIを使用した疎通テスト
- Job固有機能との連携テスト

---

# 13. 非機能要件

## 13.1 パフォーマンス

- タイムアウト時間：30秒
- リトライ処理：呼び出し元の責務

## 13.2 セキュリティ

- APIキーはlocalStorageに暗号化せず保存（ブラウザの制約）
- HTTPS通信を必須とする

## 13.3 拡張性

- 新AIサービス追加時の拡張ポイント明確化
- インターフェース（型定義）の後方互換性維持

---

# 14. 関連ドキュメント

- AI Job Insight 基本仕様書 - 4.7 共通基盤機能ブロック
- AI Job Insight_詳細仕様書_共通可視化機能.md
- AI Job Insight_詳細仕様書_AI応答サービス機能.md（既存、Phase 3 にて本共通機能へ移行済み）

---

# 15. 変更履歴

|日付|バージョン|変更内容|担当者|
|---|---|---|---|
|2026-03-15|1.0|新規作成|コーディング担当|
