const mongoose = require('mongoose');

let memoryServer = null;

async function connectDB() {
  const useInMemory = process.env.USE_IN_MEMORY_DB === 'true';

  if (useInMemory) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB for local testing');
    return;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusbite';
  await mongoose.connect(mongoUri);
  console.log(`Connected to MongoDB: ${mongoUri}`);
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = { connectDB, disconnectDB };
