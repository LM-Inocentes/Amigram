import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';

import authRoutes from "./routers/auth";
import userRoutes from "./routers/user";

// dbConnect();

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.options('*', cors());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Website is served on http://localhost:" +port);
})