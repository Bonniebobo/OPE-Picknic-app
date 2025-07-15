# Picknic App Setup Guide

## API密钥配置

为了让AI Assistant模式正常工作，您需要配置以下API密钥：

### 1. 创建环境变量文件

在项目根目录创建 `.env` 文件（如果还没有的话）：

```bash
# Gemini Live API - AI Assistant 模式必需
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API - 图像分析必需
OPENAI_API_KEY=your_openai_api_key_here

# Edamam Recipe API - 菜谱获取必需
EDAMAM_ID=your_edamam_app_id_here
EDAMAM_KEY=your_edamam_app_key_here
```

### 2. 获取API密钥

#### Gemini API Key
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录您的Google账户
3. 创建新的API密钥
4. 复制密钥并粘贴到 `GEMINI_API_KEY`

#### OpenAI API Key
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 登录并进入API Keys页面
3. 创建新的API密钥
4. 复制密钥并粘贴到 `OPENAI_API_KEY`

#### Edamam Recipe API
1. 访问 [Edamam Developer](https://developer.edamam.com/)
2. 注册账户并创建Recipe Search API应用
3. 获取Application ID和Application Key
4. 分别粘贴到 `EDAMAM_ID` 和 `EDAMAM_KEY`

### 3. 重启开发服务器

配置完成后，重启Expo开发服务器：

```bash
npm run start
```

### 4. 测试连接

1. 打开应用
2. 进入 Recipe Helper
3. 切换到 "🤖 AI Assistant" 模式
4. 查看连接状态指示器：
   - 绿色：AI助手已连接 ✅
   - 红色：连接失败，使用基础模式 ❌

## 功能说明

### AI Assistant 模式特性

- **智能对话**：使用自然语言描述您的食材
- **食材识别**：AI会从您的描述中识别食材
- **中文支持**：完全支持中文对话
- **离线模式**：即使连接失败也能使用基础功能
- **流畅体验**：保持原有的UI/UX设计风格

### 示例对话

```
用户: 我有西红柿、鸡蛋和面条
AI: 我识别到了这些食材：西红柿、鸡蛋、面条。很好！用西红柿、鸡蛋、面条可以做出很多美味的菜肴！你对菜系类型或烹饪时间有偏好吗？
```

## 故障排除

### 连接问题
- 检查网络连接
- 确认API密钥正确配置
- 查看控制台错误信息

### API配额
- Gemini API有免费配额限制
- OpenAI API按使用量计费
- Edamam API有请求次数限制

如有问题，请检查控制台日志获取详细错误信息。 