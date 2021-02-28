import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  /**
   * const resposta = await execute()
   * Para funçoes asincronas que retornam uma promisse
   * .then() e .catch() retornam uma Promise, eles podem ser
   * encadeados - uma operação chamada composition.
   */

  async execute(to: string, subject: string, variables: object, path: string) {
    //pegamos o caminho do diretorio do handlebars e fazemos o "fs" ler ele no formato utf-8
    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    //compilamos o template já formatado
    const mailTemplateParse = handlebars.compile(templateFileContent);

    //passamos para o template as informções contidas nos parametros da função
    const html = mailTemplateParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: "NPS <noreplay@nps.com.br>",
    });

    console.log("Message sent: %s", message.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
