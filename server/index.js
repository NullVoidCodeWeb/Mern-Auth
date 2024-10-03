const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger.js");
const { testConnection } = require("./utils/Email");

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// // Test the email connection when the server starts
// testConnection()
//   .then(() => {
//     // Start your server here
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to connect to the email server:", error);
//     // Decide whether to start the server or exit
//     process.exit(1);
//   });

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/api/auth", authRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
