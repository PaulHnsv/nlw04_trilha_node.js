import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import * as yup from "yup";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const schema = yup.object().shape({
      title: yup.string().required(),
      description: yup.string().required(),
    });
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const surveysRepository = getCustomRepository(SurveysRepository);

    const surveysAlreadyExist = await surveysRepository.findOne({
      title,
    });

    if (surveysAlreadyExist) {
      throw new AppError("User already exists!");
    }

    const survey = surveysRepository.create({
      title,
      description,
    });

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const all = await surveysRepository.find();

    return response.json(all);
  }

  async delete(request: Request, response: Response) {
    const { title, description } = request.body;

    const schema = yup.object().shape({
      title: yup.string().required(),
      description: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysAlreadyExist = await surveysRepository.findOne({
      title,
    });

    if (!surveysAlreadyExist) {
      throw new AppError("survey not already exists!");
    }

    await surveysRepository.delete(surveysAlreadyExist.id);
    await surveysUsersRepository.delete({ survey_id: surveysAlreadyExist.id });

    return response.status(200).json({ message: "Survey deleted sucess" });
  }
}

export { SurveysController };
