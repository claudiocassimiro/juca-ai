import { LLMChain } from "langchain/chains";
import { ChatOllama } from "langchain/chat_models/ollama";
import { ChatPromptTemplate } from "langchain/prompts";
import handlerVectorDB from "../services/applicationService/handlerVectorDB";

export const chatPrompt = async (question: string) => {
  const context = await handlerVectorDB.search(question);

  // if (context?.length === 0) {
  //   return "Desculpe, mas não tenho informações sobre esse assunto";
  // }

  // const chat = new ChatOpenAI({ temperature: 0 });
  const chat = new ChatOllama({
    model: "llama3:latest",
    temperature: 0,
    maxRetries: 2,
    // other params...
  });

  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Você é um assistente de viagens especializado em recomendar experiências e locais em cidades turísticas. Com base no banco de dados que você possui: {context}, que contém informações detalhadas sobre restaurantes, agências de passeios, e outros pontos comerciais locais, seu objetivo é fornecer ao usuário recomendações precisas e personalizadas para locais que atendam às suas preferências e interesses específicos.

        Ao fazer suas recomendações, leve em consideração fatores como tipo de experiência (gastronômica, cultural, de aventura, etc.), faixa de preço, localização, ambiente, avaliações de outros clientes, e relevância para o perfil do usuário. Certifique-se de que as informações que você fornecer estejam 100% alinhadas com os dados do banco de dados, sem introduzir erros ou interpretações que possam induzir o usuário a erro. Sua resposta deve ser clara, informativa, e diretamente baseada nos dados disponíveis.`,
    ],
    ["human", "{question}"],
  ]);

  const chain = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
  });

  const message = await chain.call({
    context: context?.map((ctx) => ctx.pageContent),
    question,
  });

  return message;
};
