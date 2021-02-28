import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class UserController {
  //create and update
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
      // return response.status(400).json({
      //   error: err,
      // });
    }

    // if (!(await schema.isValid(request.body))) {
    //   return response.status(400).json({
    //     error: "Validation Failed!",
    //   });
    // }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExist = await usersRepository.findOne({
      email,
    });

    if (userAlreadyExist) {
      throw new AppError("User already exists!");
      // return response.status(400).json({
      //   error: "User already exists!",
      // });
    }

    const user = usersRepository.create({
      name,
      email,
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }

  async delete(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userAlreadyExist = await usersRepository.findOne({
      email,
    });

    if (!userAlreadyExist) {
      throw new AppError("User not already exists!");
    }

    // const deleteUser = usersRepository.({
    //   email: `${request.body.email}`,
    // });

    await usersRepository.delete(userAlreadyExist.id);
    await surveysUsersRepository.delete({ user_id: userAlreadyExist.id });

    return response.status(200).json({ message: "User deleted sucess" });
  }

  async find(request: Request, response: Response) {
    const { name } = request.params;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.params, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExist = await usersRepository.find({
      name,
    });

    if (!userAlreadyExist) {
      throw new AppError("User not already exists!");
    }

    return response.status(200).json(userAlreadyExist);
  }
}

export { UserController };
