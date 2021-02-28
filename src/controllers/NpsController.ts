import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class Npscontroller {
  /**
   * classificação NPS
   *
   * Detratores => de 0 a 6
   * Passivo => de 7 a 8
   * Promotores => de 9 e 10
   *
   * (número de promotores - número de detratores) / (número de respondentes) x 100
   */

  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractors = surveyUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;
    const promoters = surveyUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;
    const passives = surveyUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;
    const totalAnswers = surveyUsers.length;

    const calculate = Number(
      (((promoters - detractors) / totalAnswers) * 100).toFixed(2)
    );

    return response.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps: calculate,
    });
  }
}

export { Npscontroller };
