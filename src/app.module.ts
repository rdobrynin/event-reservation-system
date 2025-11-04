import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import { LoggerModule } from 'nestjs-pino';
import {BookingModule} from "./modules/booking/booking.module";
import {EventModule} from "./modules/event/event.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('POSTGRES_HOST'),
          port: config.get<number>('POSTGRES_PORT'),
          username: config.get<string>('POSTGRES_USER'),
          password: config.get<string>('POSTGRES_PASSWORD'),
          database: config.get<string>('POSTGRES_DB'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: config.get<string>('NODE_ENV') === 'development',
          namingStrategy: new SnakeNamingStrategy(),
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
      // async dataSourceFactory(options) {
      //   if (!options) {
      //     throw new Error('Invalid options passed');
      //   }
      //
      //   return await addTransactionalDataSource(new DataSource(options));
      // },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
      BookingModule,
      EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
