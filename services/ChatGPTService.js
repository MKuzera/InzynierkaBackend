const OpenAI = require('openai');
class ChatGPTService {
    static async chat(req, res) {

        const client = new OpenAI({
            apiKey: process.env.CHAT,
            dangerouslyAllowBrowser: true
        });

        const response = await client.chat.completions.create({
            messages: [{ role: 'user', content: req.params.prompt }],
            model: 'gpt-4'
        });

        console.log(response.choices[0].message);
        res.json({ message: response.choices[0].message });
    }
}

module.exports = ChatGPTService;
