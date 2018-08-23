import { Module,HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './wsevents';

@Module({
    imports: [
        EventsModule,
        HttpModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
