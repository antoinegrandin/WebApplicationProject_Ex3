'use strict';

const express = require('express');

// Constants
const PORT = process.env.PORT || 8081;

// App
const app = express();
app.use(express.static('public'))
app.listen(PORT, console.log(`App running on port http://localhost:${PORT}/page.html`)  );
