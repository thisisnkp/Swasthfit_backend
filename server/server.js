const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;



// Serve the HTML file


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
