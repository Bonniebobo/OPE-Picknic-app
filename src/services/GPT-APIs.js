import Constants from 'expo-constants';

const { OPENAI_API_KEY, AZURE_ENDPOINT, AZURE_API_KEY } = Constants.expoConfig.extra;

// OpenAI API call for text
export async function call_openai_api(sysMessage, userMessage, assistMessage, model = "gpt-4", temperature = 0.7) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: sysMessage },
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: assistMessage }
                ],
                temperature: temperature,
                max_tokens: 2000
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('OpenAI API Error:', data.error);
            throw new Error(data.error.message);
        }

        const content = data.choices[0].message.content;
        
        // Extract JSON from the response
        const jsonMatch = content.match(/<OUTPUT>([\s\S]*?)<\/OUTPUT>/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
        
        return JSON.parse(content);
    } catch (error) {
        console.error('OpenAI API call failed:', error);
        throw error;
    }
}

// Azure OpenAI API call for text
export async function call_azure_openai_api(sysMessage, userMessage, assistMessage, model = "gpt-4", temperature = 0.7) {
    try {
        const response = await fetch(`${AZURE_ENDPOINT}/openai/deployments/${model}/chat/completions?api-version=2024-02-15-preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': AZURE_API_KEY
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: sysMessage },
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: assistMessage }
                ],
                temperature: temperature,
                max_tokens: 2000
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('Azure OpenAI API Error:', data.error);
            throw new Error(data.error.message);
        }

        const content = data.choices[0].message.content;
        
        // Extract JSON from the response
        const jsonMatch = content.match(/<OUTPUT>([\s\S]*?)<\/OUTPUT>/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
        
        return JSON.parse(content);
    } catch (error) {
        console.error('Azure OpenAI API call failed:', error);
        throw error;
    }
}

// OpenAI Vision API call for image analysis
export async function call_openai_api_vision(imageBase64, prompt, model = "gpt-4-vision-preview", temperature = 0.7) {
    try {
        console.log("Calling OpenAI Vision API with model:", model);
        console.log("Prompt:", prompt);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: prompt
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                temperature: temperature,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        
        console.log("OpenAI Vision API response status:", response.status);
        
        if (data.error) {
            console.error('OpenAI Vision API Error:', data.error);
            throw new Error(data.error.message);
        }

        const content = data.choices[0].message.content;
        console.log("OpenAI Vision API content:", content);
        
        // Extract JSON from the response
        const jsonMatch = content.match(/<OUTPUT>([\s\S]*?)<\/OUTPUT>/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
        
        return JSON.parse(content);
    } catch (error) {
        console.error('OpenAI Vision API call failed:', error);
        throw error;
    }
}

// Azure OpenAI Vision API call for image analysis
export async function call_azure_openai_api_vision(imageBase64, prompt, model = "gpt-4-vision", temperature = 0.7) {
    try {
        const response = await fetch(`${AZURE_ENDPOINT}/openai/deployments/${model}/chat/completions?api-version=2024-02-15-preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': AZURE_API_KEY
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: prompt
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                temperature: temperature,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('Azure OpenAI Vision API Error:', data.error);
            throw new Error(data.error.message);
        }

        const content = data.choices[0].message.content;
        
        // Extract JSON from the response
        const jsonMatch = content.match(/<OUTPUT>([\s\S]*?)<\/OUTPUT>/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
        
        return JSON.parse(content);
    } catch (error) {
        console.error('Azure OpenAI Vision API call failed:', error);
        throw error;
    }
} 