import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export const generateStoryAndImage = async (wordPairs) => {
    try {
        // İngilizce hikaye oluşturma
        const wordList = wordPairs.map(pair => `${pair.english} (${pair.turkish})`).join(', ');
        const englishStoryResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Create a short story in English using these English-Turkish word pairs. Use each word at least once:
                         Words: ${wordList}
                         
                         The story should be engaging and demonstrate the usage of each word clearly.`
            }],
        });

        const englishStory = englishStoryResponse.choices[0].message.content;

        // Türkçe çeviri oluşturma
        const translationResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Translate this English story to Turkish, keeping it natural and fluent:
                         
                         ${englishStory}`
            }],
        });

        const turkishStory = translationResponse.choices[0].message.content;

        // Kelime kullanımı açıklamaları
        const explanationResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Hikayede kullanılan kelimelerin açıklaması:
                         
                         Hikaye: ${englishStory}
                         
                         Kelimeler: ${wordList}
                         
                         Her kelime için:
                         1. Kelimenin İngilizcesi ve Türkçesi
                         2. Hikayede nasıl kullanıldığı
                         3. Varsa farklı kullanım örnekleri
                         
                         Lütfen bu açıklamayı Türkçe olarak yap.`
            }],
        });

        const explanations = explanationResponse.choices[0].message.content;

        // Görsel oluşturma
        const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Create a vibrant and educational illustration that represents this story: ${englishStory}`,
            n: 1,
            size: "1024x1024",
        });

        return {
            englishStory,
            turkishStory,
            explanations,
            imageUrl: imageResponse.data[0].url
        };
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}; 