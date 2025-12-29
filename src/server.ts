import app from "./app";
import "dotenv/config.js"

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`The server is running at port: ${port}.`);
});