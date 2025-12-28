import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`); // eslint-disable-line no-console
});