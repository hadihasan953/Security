import "./config/env.js";
import app from "./app.js";
import { sequelize } from "./models/index.js";

sequelize.sync().then(() => {
    console.log("Database Connected ✔✔");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀🚀`);
    });
});