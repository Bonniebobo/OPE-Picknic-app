# Gemini AI Recipe Image Generation 🖼️

## 概述

这个应用现在使用 Gemini AI 为推荐的菜谱生成高质量的食物照片，而不是依赖网络抓取的图片或静态占位符。

## 主要特性

### ✨ AI 生成的食物照片
- 使用 Gemini 2.0 Flash Preview Image Generation 模型
- 为每个推荐的菜谱生成专业质量的食物照片
- 确保所有地方显示的照片一致（chatbox、cooking list、recipe detail）

### 🎯 智能回退机制
- 如果 AI 图片生成失败，自动回退到一致的占位符图片
- 确保用户体验不受影响

### 🔄 异步处理
- 图片生成在后台异步进行
- 不阻塞 UI 响应
- 带有加载状态和错误处理

## 技术实现

### 新增的服务函数

**`src/services/geminiImageAnalysis.js`**
```javascript
// 生成菜谱图片的主函数
generateRecipeImageWithGemini(recipeName, description)

// 返回 data URL 格式的图片
generateRecipeImageUrl(recipeName, description)
```

### 更新的组件

**`src/utils/aiRecipeExtractor.ts`**
- `convertRecommendedToRecipeCard()` - 现在异步生成 AI 图片
- `parseAIRecommendationsWithImages()` - 新的异步版本，支持 AI 图片

**`src/components/MenuPlanningSection.tsx`**
- `handleTurnComplete()` - 更新为异步函数，优先使用 AI 图片
- 包含错误处理和回退机制

**`src/components/RecipeCard.tsx`**
- 增强的错误处理
- 更好的图片加载回退逻辑

## 使用流程

1. **用户请求菜谱推荐** → AI 分析并推荐菜谱
2. **解析菜谱信息** → 提取菜名、描述等信息
3. **生成 AI 图片** → 为每个菜谱调用 Gemini 图片生成 API
4. **显示结果** → 在聊天框中显示带有 AI 生成图片的菜谱卡片
5. **保持一致性** → 添加到 cooking list 后，图片保持相同

## 配置要求

确保在 `app.config.js` 中正确设置了 `GEMINI_API_KEY`：

```javascript
export default {
  expo: {
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      // ... 其他配置
    },
  },
};
```

## 图片生成提示词

AI 使用专业的食物摄影提示词：
- 专业食物摄影风格
- 自然光照明
- 精美摆盘
- 高分辨率和细节
- 餐厅级别的呈现
- 温暖、诱人的色彩
- 清晰的食物焦点
- 简洁的背景

## 性能优化

- 异步处理避免阻塞 UI
- 智能缓存机制（相同菜名生成相同图片）
- 错误处理确保应用稳定性
- 回退到占位符确保总是有图片显示

## 错误处理

如果图片生成失败，系统会：
1. 记录错误信息到控制台
2. 自动回退到一致的占位符图片
3. 继续正常显示菜谱卡片
4. 用户体验不受影响

## 未来改进

- [ ] 图片缓存机制（相同菜谱复用图片）
- [ ] 图片质量和风格选项
- [ ] 批量生成优化
- [ ] 图片压缩和优化
