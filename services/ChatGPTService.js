// services/OpenAI.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to safely stringify objects to prevent circular references
const safeStringify = (obj) => {
    const seen = new Set();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return; // Return undefined to avoid circular reference
            }
            seen.add(value);
        }
        return value;
    });
};

class ChatGPTService {
    static async getResponse(prompt) {
        // Use environment variable for API key or fall back to reading from file
        const apiKey = process.env.OPENAI_API_KEY || fs.readFileSync(path.join(__dirname, 'apikey.txt'), 'utf8').trim();

        if (!apiKey) {
            throw new Error('API key is missing.');
        }

        const endpoint = 'https://api.openai.com/v1/completions'; // For GPT-3 (text-davinci-003)
        // For GPT-4, you might want to use the new chat API endpoint
        // const endpoint = 'https://api.openai.com/v1/chat/completions';

        try {
            const response = await axios.post(
                endpoint,
                {
                    model: 'text-davinci-003', // Or 'gpt-4' for GPT-4 (if available)
                    prompt: prompt,            // The prompt passed from the user
                    max_tokens: 100,           // Max number of tokens in the response
                    temperature: 0.7,          // Controls randomness of the output
                    n: 1,                      // Number of responses to return
                    stop: ['\n'],              // Stop at newline
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Check if response data is valid
            if (response.data && response.data.choices && response.data.choices[0]) {
                return response.data.choices[0].text.trim();
            } else {
                throw new Error('Invalid response from OpenAI API.');
            }
        } catch (error) {
            console.error('Error fetching response from OpenAI:', safeStringify(error));  // Safe error logging
            throw new Error('Unable to fetch response from OpenAI API');
        }
    }
}

module.exports = ChatGPTService;
