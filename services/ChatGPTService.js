// services/OpenAI.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class OpenAI {
    static async getResponse(prompt) {
        // Read the API key from a file (you could use environment variables here as well)
        const apiKey = fs.readFileSync(path.join(__dirname, 'apikey.txt'), 'utf8').trim();

        if (!apiKey) {
            throw new Error('API key is missing.');
        }

        const endpoint = 'https://api.openai.com/v1/completions'; // For GPT-3 (text-davinci-003)

        try {
            // Send request to OpenAI API to get response for the prompt
            const response = await axios.post(
                endpoint,
                {
                    model: 'text-davinci-003',  // Use GPT-3 (you can change to GPT-4 if available)
                    prompt: prompt,             // The user's input (prompt)
                    max_tokens: 100,            // The maximum number of tokens for the output
                    temperature: 0.7,           // Controls the randomness of the output
                    n: 1,                       // Number of responses to return
                    stop: ['\n'],               // Stop at newline to get one complete response
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Return the text response from OpenAI
            return response.data.choices[0].text.trim();
        } catch (error) {
            console.error('Error fetching response from OpenAI:', error);
            throw new Error('Unable to fetch response from OpenAI API');
        }
    }
}

module.exports = OpenAI;
