import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js"
import connectDb from "./config/db.js";
import http from 'http';
import { Server } from 'socket.io';
import handleSocketConnection from './controllers/socketController.js';


const app = express();
dotenv.config();
const hostname = process.env.DEVURL;
const port = process.env.PORT;

//Connexion lel base fi config/db.js
connectDb();

app.use(cors());
app.use("/media", express.static("media"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use(bodyParser.json());
app.use("/parent",parentRoutes);
app.use("/application",applicationRoutes);





const server = http.createServer(app);
const io = new Server(server);
handleSocketConnection(io);

server.listen(port, hostname, () => {
  console.log(`Server running on ${hostname}:${port}`);
});
