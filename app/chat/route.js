"use server" ;

import 'dotenv/config' ;
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai";
import {TaskType} from "@google/generative-ai"

const openai = new OpenAI ({
  apiKey: process.env.GEMINI_API_KEY , // using process.env keeps the key off the client safe
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
 // this tells the SDK to send requests to Gemini's OpenAI-compatible endpoints
});


async function POST(request){
  const {message} = await request.json()

  //1) user ke query ka vector embedding bana do 
  // for every chunk we made the vector embedding client ready
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004", // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT ,
    title: "let's see",
  });

  //2) vector store ke sath connection banana hai 
  const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings,
    {
      url: 'http://localhost:6333' ,
      collectionName: 'first-rag-database' ,
    }
  )
  //3) vector embedding me search karna hai 
  const vectorSearcher = vectorStore.asRetriever({
    k: 3,
  })

  const relevantchunks = vectorSearcher.invoke(userQueery) ; // relavantChunks contains metadata and content

  // 4. Make a system propmt now

  const System_Prompt =
  `
  You are an AI assistant who helps resolving user query based on the context available
  to you from a PDF file with the content and page number .
  Only answer query based on the available context from that file only . 
  Take you time and please double check it. Also, give some analogy from your side so that the user understands the problem well

  COntext:
  ${JSON.stringify(relevantchunks)} ;

  `
   const response = await openai.chat.completions.create({ // calls Gemini API
      model: "gemini-2.0-flash" ,
      messages: [
        { role: "system", 
          content: System_Prompt ,
          },

        {role: 'user', content: message },
      
      ],
    });

  return Response.json({
    response: response.choices[0].message.content
  })
  
  

}

chat() ;