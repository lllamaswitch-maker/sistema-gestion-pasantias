import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('instituciones')
  getInstituciones() {
    return this.appService.getInstituciones();
  }

  @Get('carreras')
  getCarreras() {
    return this.appService.getCarreras();
  }
  @Get('rrhh/dashboard-stats')
  getDashboardRrhh() {
    return this.appService.getDashboardRrhh();
  }
}