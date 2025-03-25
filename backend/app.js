const express = require('express');
const app = express();
const PORT = 3000; // or any port you prefer

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, World from Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});