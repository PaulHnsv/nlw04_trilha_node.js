import { Router } from "express";
import { AnswerController } from "./controllers/AnswerController";
import { Npscontroller } from "./controllers/NpsController";
import { SendMailController } from "./controllers/SendMailcontroller";
import { SurveysController } from "./controllers/SurveysController";
import { UserController } from "./controllers/UserController";
import { SurveysUsersRepository } from "./repositories/SurveysUsersRepository";

const router = Router();

//herança em node.js
const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npscontroller = new Npscontroller();

router.get("/surveys", surveysController.show);
router.get("/answers/:value", answerController.execute);
router.get("/nps/:survey_id", npscontroller.execute);
router.get("/findUsers/:name", userController.find);

router.post("/users", userController.create);
router.post("/surveys", surveysController.create);
router.post("/sendMail", sendMailController.execute);

router.delete("/users", userController.delete);
router.delete("/surveys", surveysController.delete);

export { router };
