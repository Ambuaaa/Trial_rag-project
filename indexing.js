import 'dotenv/config'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantClient } from "@qdrant/qdrant-js";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

//1. Read the file
async function init(){

  const collectionName = "first-rag-database";
  
  // Initialize the Qdrant client directly
  const client = new QdrantClient({
    url: 'http://localhost:6333',
  });

  // Check if the collection exists and delete it if it does
  const collectionExists = await client.getCollection(collectionName);
  if (collectionExists) {
    await client.deleteCollection(collectionName);
    console.log(`Deleted existing collection: ${collectionName}`);
  }
  
  // THIS IS FOR THE PDF FILE 
  const pdfFilePath = "D:\Full Crux Compilation Satish Chandra.pdf";
  const loader = new PDFLoader(pdfFilePath,{
    splitPages: true ,
  });
  const docs = await loader.load() ; // array ban gaya - page by page chunk ho gaya 

// this is just for checking the numer of document loaded
  console.log(`Number of documents loaded: ${docs.length}`); 
    docs.forEach((d, i) => {
  console.log(`--- Page ${i+1} ---`);
  console.log(d.pageContent.slice(0, 500)); // first 500 chars
});

  const textSplitter = new CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    });
  const texts = await textSplitter.splitDocuments(docs);
  console.log(`Number of chunks created: ${texts.length}`);

  // THIS IS FOR THE CHEERIOWEBBASELOADER
  const url = urlprovided ; // will make a urlprovider
  const loader2 = new CheerioWebBaseLoader(url) ;
  const docs2 = await loader2.load() ; 
    

// for every chunk we made the vector embedding client ready
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "let's see",
});


const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, { // har document ke upar loop karega and for every doc, using this embedding model, will make embedding and wil store in vector database
  url: 'http://localhost:6333' ,
  collectionName: 'first-rag-database' ,
}) ;

console.log('Indexing of document done...');

}

init();











