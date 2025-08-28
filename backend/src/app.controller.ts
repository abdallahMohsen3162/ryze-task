import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('')
@ApiBearerAuth('access-token') // This 
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    
    
  }

  @Get()
  getHello(): any {
    return this.appService.getHello();
  }
}
