require("./src/config/loadenv");
const app = require('./src/app');
const connectDb = require("./src/config/db");
const initSocketServer = require('./src/sockets/socket.server');
const httpServer = require("http").createServer(app);


const PORT = process.env.PORT || 3000;

connectDb();
initSocketServer(httpServer);


httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
