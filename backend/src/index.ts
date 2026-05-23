import { connectDataBase, startServer } from "./app.js";

connectDataBase()
    .then(() => {
        startServer()
    })
    .catch((error) => {
        console.error("❌ Error in connecting to database", error);
        process.exit(1);
    });
