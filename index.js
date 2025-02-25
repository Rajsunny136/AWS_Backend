const express = require("express");
const cors = require("cors");
const sequelize = require("./config/dbConfig");
const routes = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
); // Enable CORS for all origins

// Routes
app.use("/api/user", routes);

const PORT = process.env.PORT || 4000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ Database synchronized successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Error syncing database:", err));
