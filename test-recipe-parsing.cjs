// 测试新的结构化菜品解析功能
const { parseAIRecommendations } = require('./src/utils/aiRecipeExtractor');

// 测试数据1：标准 Markdown 格式
const testResponse1 = `好的！根据你的牛肉和土豆，我为你推荐几道美味菜品：

推荐菜品：
1. **红烧牛肉土豆 (Braised Beef with Potatoes)**
- 制作时间：90分钟
- 难度：中等
- 口味：咸香浓郁，软糯可口
- 简介：经典家常菜，牛肉软烂，土豆入味

2. **咖喱牛肉土豆 (Curry Beef and Potato)**
- 制作时间：60分钟
- 难度：简单
- 口味：香辣微甜，异域风情
- 简介：浓郁咖喱香味，开胃下饭`;

// 测试数据2：简化格式
const testResponse2 = `我推荐这些菜：

1. **土豆炖牛肉**
- 制作时间：2小时
- 难度：中等
- 口味：鲜美
- 简介：营养丰富的炖菜

2. **牛肉土豆丝**
- 制作时间：30分钟
- 难度：简单
- 口味：清爽
- 简介：快手家常菜`;

// 测试数据3：不规范格式（测试退化解析）
const testResponse3 = `我建议你做：
1. 宫保牛肉丁
2. 土豆牛肉汤
3. 香煎牛排配土豆泥`;

console.log('🧪 开始测试菜品解析功能...\n');

console.log('📋 测试1：标准 Markdown 格式');
console.log('输入:', testResponse1.substring(0, 100) + '...');
const result1 = parseAIRecommendations(testResponse1);
console.log('输出:', result1.length, '道菜');
result1.forEach((recipe, index) => {
  console.log(`  ${index + 1}. ${recipe.name} - ${recipe.cookingTime} - ${recipe.difficulty}`);
});
console.log('');

console.log('📋 测试2：简化格式');
console.log('输入:', testResponse2.substring(0, 100) + '...');
const result2 = parseAIRecommendations(testResponse2);
console.log('输出:', result2.length, '道菜');
result2.forEach((recipe, index) => {
  console.log(`  ${index + 1}. ${recipe.name} - ${recipe.cookingTime} - ${recipe.difficulty}`);
});
console.log('');

console.log('📋 测试3：不规范格式（退化解析）');
console.log('输入:', testResponse3);
const result3 = parseAIRecommendations(testResponse3);
console.log('输出:', result3.length, '道菜');
result3.forEach((recipe, index) => {
  console.log(`  ${index + 1}. ${recipe.name} - ${recipe.cookingTime} - ${recipe.difficulty}`);
});

console.log('\n✅ 测试完成');
console.log('预期行为：');
console.log('- 测试1和2应该解析成功，提取完整信息');
console.log('- 测试3应该触发退化解析，至少提取菜名');
console.log('- 所有结果都应该是可用的 RecipeCard 对象'); 