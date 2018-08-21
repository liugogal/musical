import { Get, Controller, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    /*@Get(':id')
    root(@Param() param): string {
        console.log(`id:` + param.id);

        // ChildProcess.
        let childProcess: ChildProcess = exec('pwd', (error: Error | null, stdout: string, stderr: string) => {
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);

        });
        console.log(childProcess.pid);

        return this.appService.root();
    }*/

    @Get('/startRecord/:channel')
    startRecord(@Param() param): any {

        return this.appService.startRecord(param.channel);

    }

    @Get('/stopRecord/:channel')
    stopRecord(@Param() param): any {

        return this.appService.stopRecord(param.channel);

    }
}
