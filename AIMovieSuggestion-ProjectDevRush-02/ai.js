const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const askAI = async (currently_watching) => {
    // const prompt = "Explain how AI works";
    const prompt = `[
        'tt0944947', // Game of Thrones
        'tt0903747', // Breaking Bad
        'tt1475582', // Sherlock
        'tt0108778', // Friends
        'tt0455275', // Prison Break
        'tt0773262'  // Dexter
    ];


replace this and give only recommended 3 non repetitive imdb codes only hollywood for a user who likes ${currently_watching} and give me the updated array only without backticks and no markdowns, no extra text or explaination in text format only with movie name in comments`

    const result = await model.generateContent(prompt)
    // console.log(result);
    return result.response.text();
}

const main = async () => {
    const recomendation = await askAI("Batman Begins");
    console.log(recomendation);
}

main();
module.exports = { askAI }