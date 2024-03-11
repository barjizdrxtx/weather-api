import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from './business/business.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CoreModule } from './core/core.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://tgrowstech:d0muaJM0K8giwk5g@inventory.9psh3ty.mongodb.net/weather', {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB is connected');
        });
        connection.on('error', (error) => {
          console.error('MongoDB connection error:', error);
        });
        return connection;
      },
    }),
    BusinessModule, CoreModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'tgrowsinnovations@gmail.com',
          pass: 'lkovbumjxqytmxps',
        },
      },
      defaults: {
        from: '"Tgrows Pos" tgrowsinnovations@gmail.com',
      },
      template: {
        dir: __dirname + '/../templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class AppModule { }
