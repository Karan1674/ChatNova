const { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const chatNovaAiIndex = pc.Index('chat-nova-ai');

async function createMemory({ vectors, metadata, messageId }) {
  await chatNovaAiIndex.upsert([{
    id: messageId,
    values: vectors,
    metadata: metadata
  }]);
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  const data = await chatNovaAiIndex.query({
    vector: queryVector,
    topK: limit,
    includeMetadata: true,
    filter: metadata ? metadata : undefined
  });
  return data.matches;
}

async function deleteMemoryByMessageIds(messageIds) {
  if (!messageIds || messageIds.length === 0) return;
  await chatNovaAiIndex.deleteMany(messageIds.map(id => id.toString()));
}

module.exports = {
  createMemory,
  queryMemory,
  deleteMemoryByMessageIds
};