import express from "express";
import cors from 'cors';
import connectDB from './config/db.js';

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({status: 'ok'});
});

export  { app };