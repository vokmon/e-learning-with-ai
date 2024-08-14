import { BaseOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

let googleModel: ChatGoogleGenerativeAI;

export const getChatGoogleGenerativeAI = () => {
  if (!googleModel) {
    googleModel = new ChatGoogleGenerativeAI({
      model: process.env.GOOGLE_AI_MODEL,
      maxOutputTokens: 8192,
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 1,
      topP: 0.95,
      topK: 64,
    });
  }
  return googleModel;
};


export const getChain = async (promptTemplate: string, parser?: BaseOutputParser ) => {
  const prompt = await PromptTemplate.fromTemplate(promptTemplate);

  const llm = getChatGoogleGenerativeAI();
  return RunnableSequence.from([prompt, llm, parser || new StringOutputParser()]);
};
