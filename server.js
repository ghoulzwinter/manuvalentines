const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Valentine site running at http://localhost:${port}`);
});
