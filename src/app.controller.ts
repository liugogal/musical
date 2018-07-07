import { Get, Controller, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get(':id')
    root(@Param() param): string {
        console.log(`id:` + param.id);
        return this.appService.root();
    }
}
