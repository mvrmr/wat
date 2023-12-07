import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Base')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  basePath(): string {
    return this.appService.healthCheck();
  }

  @Get('healthCheck')
  healthCheck() {
    return this.appService.healthCheck();
  }
}
function Tags(): (target: typeof AppController) => void | typeof AppController {
  throw new Error('Function not implemented.');
}

