const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const swaggerUi = require('swagger-ui-express');
// const swaggerSpecs = require('../server/swagger.js');
const swaggerSpecs = require('./swagger.js');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));