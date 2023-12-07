import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('receiverTest/:sendAmount/:receiverstartingbalance')
  receiverTest(
    @Param('sendAmount') sendAmount: number,
    @Param('receiverstartingbalance') receiverstartingbalance: number,
  ): string {
    return `About to execute receiverTest with Params, sendAmount: ${sendAmount}, receiverstartingbalance: ${receiverstartingbalance}`;
    // return this.appService.getHello();
  }
}
