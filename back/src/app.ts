import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { publicRouter } from "./mainroutes";


export const app = express();
app.use(express.json());
app.use(cors());

app.use('/', publicRouter);

app.use((req, res)=>{
    res.status(404).json({message: 'Not found.'})
})

app.use(( error: Error, req:Request, res:Response, next:NextFunction)=>{
    console.log(error);
    res.status(500).json({message: 'Internal server error. Selfdestruction initiated.'})
})