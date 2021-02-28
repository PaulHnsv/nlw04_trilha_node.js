import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

/**
 *
 * Route params => Parametros que compõem a rota
 * routes.get("answers/:value/:nota")
 *
 * Query params => Parametros que vem depois do ?
 * nome={valor}
 */

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u),
    });

    if (!surveyUser) {
      throw new AppError("Survey User does not exists");
      //   return response.status(400).json({
      //     error: "Survey User does not exists",
      //   });
    }

    surveyUser.value = Number(value);

    //salva se não existir o caso o contrário faz update no banco de dados
    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController };
