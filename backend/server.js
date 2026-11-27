require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./config/seed');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    if (process.env.USE_IN_MEMORY_DB === 'true' || process.env.AUTO_SEED === 'true') {
      await seedDatabase();
    }
    app.listen(PORT, () => {
      console.log(`CampusBite backend running on http://localhost:${PORT}`);
      console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
