# ui/ - 共通UIコンポーネント

プロダクト固有の概念を含まない汎用的なUIコンポーネントを配置するディレクトリ。

## 責務

- 星評価表示コンポーネント（StarRating）
- レーダーチャートコンポーネント（RadarChart）
- 結果カード表示コンポーネント（ResultCard）
- その他汎用UIコンポーネント

## 設計原則

1. プロダクト固有の文言を含まない
2. propsで柔軟にカスタマイズ可能
3. アクセシビリティ対応
4. 他プロダクトでも再利用可能

## ディレクトリ構成

```
ui/
  components/
    StarRating.tsx   # 星評価表示
    RadarChart.tsx   # レーダーチャート
    ResultCard.tsx   # 結果カード表示
```

## Phase 4実装済み

共通可視化コンポーネントの実装が完了（Issue #24）。
- StarRating: 半星表示・アクセシビリティ対応済み
- RadarChart: Rechartsを使用したレスポンシブ対応済み
- ResultCard: 4種類のバリアント（default/success/warning/info）対応済み

`src/domains/job/components/JobAnalysisResult.tsx` から利用中。

## 関連ドキュメント

- [AI Job Insight_詳細仕様書_共通可視化機能.md](../../docs/詳細設計/AI%20Job%20Insight_詳細仕様書_共通可視化機能.md)
- [共通基盤リファクタリング_機能責務一覧.md](../../docs/development/共通基盤リファクタリング_機能責務一覧.md)
