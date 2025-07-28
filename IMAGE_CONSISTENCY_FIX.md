# Recipe Image Consistency Fix 🖼️

## 问题描述
在 plan menu chat 界面点击 recipe card 的 detail 按钮后，显示的照片来自 Edamam API 网页抓取，与 chatbox 和 cooking list 中的 AI 生成图片不一致。

## 解决方案
修改 `MenuPlanningSection.tsx` 中的 `handleViewRecipeDetails` 函数，确保详情页面使用 recipe card 中已有的 AI 生成图片，而不是被 Edamam API 的图片覆盖。

## 修改内容

### 修改前 ❌
```typescript
const detailedRecipe = await fetchRecipeDetails(recipe.name);
if (detailedRecipe) {
  setSelectedDetailRecipe(detailedRecipe); // 使用 Edamam 的图片
}
```

### 修改后 ✅
```typescript
const detailedRecipe = await fetchRecipeDetails(recipe.name);
if (detailedRecipe) {
  // 保留 AI 生成的图片，只使用 Edamam 的其他详细信息
  const enhancedDetailedRecipe: DetailedRecipe = {
    ...detailedRecipe,
    image: recipe.imageUrl // 使用 AI 生成或一致的占位符图片
  };
  setSelectedDetailRecipe(enhancedDetailedRecipe);
}
```

## 效果
现在整个应用中的图片完全一致：
- ✅ Chatbox 中的 recipe cards：AI 生成图片
- ✅ Cooking list 中的 recipe cards：相同的 AI 生成图片  
- ✅ Recipe detail modal：相同的 AI 生成图片
- ✅ Recipe detail screen：相同的 AI 生成图片

## 数据流
1. AI 推荐菜谱 → 生成 AI 图片 → 显示在 chatbox
2. 添加到 cooking list → 保持相同图片
3. 点击 detail → 保持相同图片，只补充其他详细信息（食材、步骤等）

这确保了用户在整个应用中看到的每个菜谱都有一致的、高质量的 AI 生成图片！
