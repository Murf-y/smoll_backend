import { ConfigModule, ConfigService } from '@nestjs/config'
import { DatabaseService } from './database.service'
import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          // For e2e testing database configuration
          uri:
            configService.get('NODE_ENV') === 'test'
              ? configService.get('MONGODB_URL_E2E_TEST')
              : configService.get('MONGODB_URL'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
