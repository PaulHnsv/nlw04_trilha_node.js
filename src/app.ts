import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import createConnection from "./database";
import { router } from "./routes";
import { AppError } from "./errors/AppError";

createConnection();

const app = express();

/**
 * GET => Buscar
 * POST => Salvar
 * PUT => Alterar
 * DELETE => Deletar
 * PATCH => Alterações especificas
 */

//1 param = rota da api
//2 param = request, response

//  //http://localhost:9099/(porta)
//  app.get("/", (request, response) => {
//      return response.json({message: "Hello World - NLW04"})
//  })

//  app.post("/", (request, response) =>{
//      return response.json({message: "Seus dados foram salvos com sucesso!"})
//  })

app.use(express.json());

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "Error",
      message: `Internal server error ${err.message}`,
    });
  }
);

export { app };
