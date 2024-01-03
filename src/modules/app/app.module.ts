import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '../../database/database.module'
import { LinksModule } from '../links/links.module'
import { LoggerMiddleware } from '../../common/middleware/logger.middleware'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { validateConfig } from '../config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (config: Record<string, any>) => {
        return validateConfig(config)
      },
    }),
    // ratelimits each IP to 120 requests per minute for a single endpoint
    ThrottlerModule.forRoot({
      ttl: 60, // 60 seconds
      limit: 120, // 120 requests
    }),
    DatabaseModule,
    LinksModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
