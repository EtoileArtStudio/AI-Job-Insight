---
name: Bug - PipelineExecutor/StepExecutor Interface Mismatch
about: Issue #14と#17の間でインターフェース不整合が発生
title: '[Bug] PipelineExecutorとStepExecutorのインターフェース不整合'
labels: bug, refactoring, high-priority
assignees: ''
---

## 問題の概要

Issue #14（StepExecutorリファクタ）とIssue #17（PipelineExecutor実装）の間で**インターフェースの不整合**が発生しており、新実装同士が連携できない状態になっています。

**発見経緯**: Issue #19 Phase 2のE2Eテスト実行中に発見  
**優先度**: High（新実装の統合テストがブロックされている）

---

## 再現手順

```bash
# refactor/cli-overhaul-pipeline-executor ブランチで実行
python -m scripts.refactor.pipeline_cli \
  --project-config projects/DragonBravers001/project_config_v2.json \
  execute preview_pipeline \
  --start-from preview_taiji_motion1 \
  --single-step
```

**期待される結果**: ステップが正常に実行される

**実際の結果**:
```
[OK] StepExecutor 依存関係注入完了（WorkflowExecutor自己管理）
[START] ComfyUIステップを実行: ①対峙プレビューモーション
[ERROR] ComfyUIステップ実行失敗: 'NoneType' object has no attribute 'workflow_config'
```

---

## 根本原因

### 新StepExecutor (scripts/refactor/step_executor.py)

Issue #14で導入された型安全なインターフェース:

```python
@dataclass 
class StepContext:
    step_id: str
    phase_id: str
    scene: str
    motion_index: int

class StepExecutor:
    def __init__(self, workflow_executor, workflow_data_mgr, metadata_repo, video_data_mgr):
        # コンストラクタで依存性注入
        
    def run(self, step_def: Dict, context: StepContext) -> StepResult:
        # StepContext型を期待
```

### PipelineExecutor (scripts/refactor/pipeline_executor.py)

Issue #17で実装されたが、**旧StepExecutorをインポート**している:

```python
def create_step_executor_factory(config_loader: ConfigLoader) -> callable:
    def factory():
        from scripts.step_executor import StepExecutor  # ← 旧実装を参照
        executor = StepExecutor()
        return executor
```

**問題点**:
- ❌ 新StepExecutor (`scripts.refactor.step_executor`) ではなく旧実装を使用
- ❌ Issue #14のリファクタ成果が未統合
- ❌ 型安全なStepContextが活用されていない

---

## インターフェース比較

| 観点 | 新StepExecutor (StepContext型) | 旧StepExecutor (辞書型) | 評価 |
|------|-------------------------------|------------------------|------|
| 型安全性 | ✅ データクラスで明示的 | ❌ 辞書型で暗黙的 | 新が優位 |
| IDE補完 | ✅ フィールド名が自動補完 | ❌ 補完不可 | 新が優位 |
| エラー検出 | ✅ 実行前に型チェック可能 | ❌ 実行時エラーのみ | 新が優位 |
| 可読性 | ✅ 明示的な構造 | ⚠️ ドキュメント依存 | 新が優位 |
| 移行コスト | ❌ 書き換え必要 | ✅ そのまま使用可 | 旧が優位 |

**総合評価**: 新StepContext の方が**合理性が高い**（型安全性、保守性、可読性で優位）

---

## 提案する修正方針

### Option A: PipelineExecutorを新StepExecutorに対応（推奨）

**方針**:
1. `pipeline_cli.py` のインポートを `scripts.refactor.step_executor` に変更
2. PipelineExecutor で `StepContext` オブジェクトを生成
3. 新StepExecutor のコンストラクタ引数に対応した依存性注入

**メリット**:
- ✅ Issue #14のリファクタ成果を活用
- ✅ 新実装同士の統合が完了
- ✅ 型安全な設計を維持

**デメリット**:
- ⚠️ PipelineExecutor の修正が必要
- ⚠️ 依存性注入の実装が複雑化

### Option B: 新StepExecutorを旧インターフェースに対応（非推奨）

**方針**: 新StepExecutorに `initialize()` メソッドを追加し、辞書型に対応

**デメリット**:
- ❌ Issue #14のリファクタが後退
- ❌ 型安全性の喪失

### 推奨: **Option A**

理由: 新StepExecutorの設計の方が合理的であり、Issue #14の成果を無駄にすべきではない

---

## 作業ブランチ戦略

### 提案: 現在のブランチで修正（推奨）

```bash
# 作業ブランチ
refactor/cli-overhaul-pipeline-executor
```

**理由**:
- このブランチはIssue #19（PipelineExecutor統合）のために作成された
- StepExecutorとの統合はこのIssueのスコープ内
- 別ブランチを切ると管理が複雑化

---

## 修正タスクの詳細

### 1. pipeline_cli.py の修正

```python
# 修正前
from scripts.step_executor import StepExecutor  # 旧

# 修正後
from scripts.refactor.step_executor import StepExecutor, StepContext  # 新
```

### 2. StepExecutor ファクトリの修正

```python
def factory():
    # 新StepExecutorのコンストラクタに必要な依存性を注入
    workflow_executor = create_workflow_executor(config_loader)
    workflow_data_mgr = create_workflow_data_manager()
    metadata_repo = create_metadata_repository()
    video_data_mgr = create_video_data_manager()
    
    executor = StepExecutor(
        workflow_executor=workflow_executor,
        workflow_data_mgr=workflow_data_mgr,
        metadata_repo=metadata_repo,
        video_data_mgr=video_data_mgr
    )
    return executor
```

### 3. PipelineExecutor での StepContext 生成

```python
from scripts.refactor.step_executor import StepContext

# StepContextオブジェクトを生成
step_context = StepContext(
    step_id=step.get("id"),
    phase_id=context.get("phase_id", "unknown"),
    scene=step.get("scene"),
    motion_index=step.get("motion_index", 1),
    custom_parameters=step.get("custom_parameters")
)

step_result = step_executor.run(step, step_context)
```

---

## 影響範囲

### 修正が必要なファイル

- `scripts/refactor/pipeline_cli.py`
- `scripts/refactor/pipeline_executor.py`
- `scripts/refactor/config_loader.py`（必要に応じて）

### 影響を受けないファイル

- `scripts/refactor/step_executor.py`（修正不要）
- `scripts/refactor/workflow_cli.py`（独立）
- `scripts/step_executor.py`（旧実装、そのまま残す）

---

## テスト計画

### 単体テスト
- [ ] StepContext生成ロジックのテスト
- [ ] StepExecutorファクトリのテスト

### 統合テスト
- [ ] PipelineExecutor + StepExecutor の連携テスト

### E2Eテスト
- [ ] `preview_taiji_motion1` ステップの実行成功（Issue #19）
- [ ] 旧実装との出力比較

---

## 関連情報

**詳細分析ドキュメント**: `docs/refactor/Issue20_StepExecutor_PipelineExecutor_Interface_Mismatch.md`

**関連Issue**:
- #14: StepExecutor単独化とCLIスケルトン実装
- #17: CLI整備完了
- #19: PipelineExecutor統合とE2Eテスト（本不具合によりブロック中）

**ブランチ**: `refactor/cli-overhaul-pipeline-executor`

---

## Codexレビュー依頼

以下の点について確認をお願いします:

1. **修正方針の妥当性**: Option A（PipelineExecutorを新StepExecutorに対応）で問題ないか
2. **StepContext型の合理性**: 辞書型ではなくデータクラスを使用する設計で良いか
3. **作業ブランチ**: 現在のブランチで作業を続けて問題ないか
4. **その他の懸念事項**: 見落としている問題や代替案の有無

よろしくお願いいたします。
