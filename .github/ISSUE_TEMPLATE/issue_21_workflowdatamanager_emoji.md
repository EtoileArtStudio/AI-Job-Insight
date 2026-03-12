---
name: Bug - WorkflowDataManager絵文字混入問題
about: WorkflowDataManagerの出力・ログ・メタデータに絵文字が混入し、CP932/本番環境でUnicodeEncodeErrorが発生する
labels: bug, type: refactor, P1-高
assignees: ''
---

## 問題の概要

WorkflowDataManagerの出力・ログ・メタデータに絵文字（例: ✅, ❌, ⚠️ など）が混入しており、CP932環境や本番環境でUnicodeEncodeErrorが発生します。

- **発生箇所**: scripts/refactor/workflow_data_manager.py
- **影響範囲**: メタデータファイル、ログ出力、テスト出力
- **優先度**: 高（本番環境でのE2E試験がブロックされる）

---

## 再現手順

1. Windows/CP932環境でパイプラインを実行
2. メタデータ出力やログ出力時にUnicodeEncodeErrorが発生

---

## 根本原因

- WorkflowDataManager内部で絵文字を直接出力・記録している
- ログ・メタデータ・print出力に絵文字が混入
- CP932/Shift_JIS環境では絵文字がサポートされずエラーとなる

---

## 修正方針

- 全ての出力・ログ・メタデータから絵文字を除去し、ASCII/CP932互換文字列に置換
- fix_emoji.py等の既存スクリプトを活用し、CIで自動チェックも検討
- コーディングマニュアルの「絵文字禁止」規定を徹底

---

## 作業ブランチ戦略

- 新規ブランチ: `refactor/fix-workflowdatamanager-emoji`
- 単体テスト・既存テストスイートで検証
- main/refactorブランチへマージ後、本タスク（Issue #20）に復帰

---

## テスト計画

- [ ] 全出力・ログ・メタデータに絵文字が含まれないことを確認
- [ ] Windows/CP932環境でUnicodeEncodeErrorが発生しないことを確認
- [ ] 既存E2Eテストが正常に完了することを確認

---

## 関連情報

- コーディングマニュアル: docs/コーディングマニュアル.md
- 親Issue: #20

---

## Codexレビュー依頼

- 修正方針・ブランチ戦略の妥当性確認
- fix_emoji.py等の自動化方針の是非
- 他に見落としがないか

---

## 📋 作業報告

### ✅ 初回対応完了 (2025/10/12)

**コミット**: 988a0f0

**対応内容**:
- `scripts/workflow_data_manager.py` の絵文字を全て除去
- CP932互換文字（[OK], [ERROR], [WARN]等）に置換
- テストスイート作成: `tests/test_workflow_data_manager_emoji_fix.py`
- 全テスト成功 (4/4 PASS)

**検証結果**:
```bash
# CP932エンコードテスト
✅ WorkflowDataManagerのインポート成功
✅ 絵文字なし（CP932互換文字のみ使用）
✅ CP932エンコード可能
✅ インスタンス化成功
```

---

### 🔥 Codexレビュー結果

**指摘事項**:

1. **テストが正しく失敗しない**
   > せっかくテストを用意したのにreturn Falseしてもpytestは失敗扱いになりません

2. **他ファイルに絵文字残存**
   > rg '✅' scripts 叩けば山ほど出るだろ

3. **CI/自動チェック機能なし**
   > fix_emoji.py --checkのように検査を差し込め

**評価**: 厳しいが的確な指摘

---

### ✅ Codexレビュー対応完了 (2025/10/12)

**コミット**: 0c65e6c

#### 対応1: テストにassert追加（pytest互換）

**修正内容**:
- 全4テスト関数を `raise AssertionError` に修正
- `main()` 関数で失敗テストを適切にトラッキング

**検証結果**:
```bash
pytest tests/test_workflow_data_manager_emoji_fix.py -v
# 結果: 4/4 PASSED ✅
```

#### 対応2: repo全体の絵文字一掃

**修正ファイル一覧** (13ファイル、696+絵文字除去):

| ファイル | 削除絵文字数 |
|---------|------------|
| `workflow_pipeline_manager.py` | 307 |
| `metadata_file_manager.py` | 109 |
| `step_executor.py` | 60 |
| `run_comfyui_workflow.py` | 45 |
| `video_data_manager.py` | 38 |
| `comfyui_service_manager.py` | 36 |
| `project_config_manager.py` | 24 |
| `maintenance/manage_final_outputs.py` | 23 |
| `workflow_executor.py` | 22 |
| `smart_seed_manager.py` | 16 |
| `generate_project_directory.py` | 9 |
| `cleanup_lineage.py` | 5 |
| `utility.py` | 2 |
| **合計** | **696+** |

**実行コマンド**:
```bash
python fix_emoji.py --all
# 結果: 13ファイル修正完了
```

#### 対応3: CI対応（--checkフラグ実装）

**fix_emoji.py 機能拡張**:
- `--check` フラグ: CI/プリコミット用の検査モード
- `--all` フラグ: scripts配下の全Pythonファイルをスキャン
- 40+種類の絵文字マッピング (✅→[OK], 🔍→[SEARCH], etc.)
- 再帰的ファイルスキャン機能

**検証結果**:
```bash
python fix_emoji.py --check --all
# 結果: [OK] 絵文字は見つかりませんでした (0個) ✅
```

---

### 📊 最終検証結果

#### 1. テスト実行:
```bash
pytest tests/test_workflow_data_manager_emoji_fix.py -v
# 結果: 4/4 PASSED ✅
```

#### 2. 絵文字残存チェック:
```bash
python fix_emoji.py --check --all
# 結果: 残存絵文字 0個 ✅
```

#### 3. CP932エンコードテスト:
```
✅ 全ファイルがCP932でエンコード可能
```

---

### 📦 次のアクション

#### 1. **CI/Pre-commit統合** (任意)
- `.pre-commit-config.yaml` に `fix_emoji.py --check --all` 追加
- または GitHub Actions ワークフローに組み込み

#### 2. **PR作成・マージ**
- Codex承認後、`main` ブランチへマージ

#### 3. **Issue #20再開**
- `refactor/cli-overhaul-pipeline-executor` ブランチに戻る
- クリーンなCP932環境でE2Eテスト実行

---

### 📝 コミット履歴

```
0c65e6c [Issue #21] Codexレビュー対応: repo全体の絵文字一掃とCI対応
988a0f0 [Issue #21] WorkflowDataManagerの絵文字を除去してCP932互換性を確保
```

---

### 🎓 学んだ教訓

1. **pytest互換性**: `return False` ではなく `raise AssertionError` を使用
2. **包括的な修正**: 1ファイルではなくrepo全体をチェック
3. **自動化ツール設計**: 初めからCI統合を考慮（--checkフラグ）
4. **Codexの厳しいレビュー**: プロフェッショナル基準の重要性

---

## 🏁 完了報告

**Status**: ✅ **完了（Codex承認待ち）**

**対応サマリー**:
- ✅ テストにassert追加（pytest互換）
- ✅ scripts配下13ファイル修正（696+絵文字除去）
- ✅ CI対応（--checkフラグ実装、残存絵文字0個を検証済み）

**ブランチ**: `refactor/fix-workflowdatamanager-emoji`

**次のステップ**: Codexレビュー → マージ → Issue #20再開

---

**@Codex** ご確認お願いします。指摘事項3点すべてに対応しました。
