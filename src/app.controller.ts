import { Controller, Get, Req, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  @Get("/createPdf/:fileName")
  async createPdfCall(@Req() req){
    const data = await this.appService.createPdf(req.params.fileName);
    return data;
  }

  @Post("/savePdf")
  async savePdfCall(@Req() req){
    console.log(req.body)
    const data = await this.appService.savePdf(req.body);
    return data;
  }
}
