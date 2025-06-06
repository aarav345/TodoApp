import http from "http";
import app from "./app.js";
const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})