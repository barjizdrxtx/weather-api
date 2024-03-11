import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './user/admin.module';


@Module({
    imports: [


        AdminModule,
        AuthModule,


    ],
})
export class CoreModule { }
