import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import { AllExceptionsFilter } from './common/filters'
import { AppModule } from './modules/app/app.module'
import { HttpException, HttpStatus, Logger, ValidationError, ValidationPipe } from '@nestjs/common'
import { HttpResponseInterceptor } from './common/interceptors'
import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { RATE_LIMITER_EXCEPTION_MESSAGE } from './common/constants'
import { rateLimit } from 'express-rate-limit'
import SwaggerConfig from 'swagger'
import helmet from 'helmet'

/**
 * Bootstrap the NestJS application
 * @returns {Promise<void>}
 * @memberof Main
 * @method bootstrap
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Enable shutdown hooks
  app.enableShutdownHooks()

  // Body Parser limit
  app.use(bodyParser.json({ limit: '5mb' }))
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))

  // Globale Prefix /api/...
  app.setGlobalPrefix('api')

  // Add validation pipes for class-validator and class-transformer packages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) =>
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            errors: errors.reduce(
              (accumulator, currentValue) => ({
                ...accumulator,
                [currentValue.property]: Object.values(currentValue.constraints).join(', '),
              }),
              {}
            ),
          },
          HttpStatus.BAD_REQUEST
        ),
    })
  )

  // Use global exception filter
  app.useGlobalFilters(new AllExceptionsFilter())

  // Http Request Interceptor
  app.useGlobalInterceptors(new HttpResponseInterceptor())

  // Security Measures
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    })
  )

  // localhost:3000 is NextJS frontend
  // TODO replace it with list of allowed cros origin from .env
  const APP_URL = process.env.APP_URL || 'http://localhost:5173'
  app.enableCors({
    origin: APP_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, Accept',
    credentials: true,
  })
  app.use(compression())

  // Global rate limiter
  // limit 1 ip for 150 request under 15 minutes
  // this is for preventing brute force attack
  // routes with @Throttle() decorator will be ignored
  const maxAllowedRequest = 150
  const durationForMaxAllowedRequest = 15 * 60 * 1000
  app.use(
    rateLimit({
      windowMs: durationForMaxAllowedRequest,
      max: maxAllowedRequest,
      message: {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: RATE_LIMITER_EXCEPTION_MESSAGE,
      },
    })
  )

  // Setup swagger documentation
  SwaggerConfig(app, '1.0.0')

  // Main entry point
  const port = process.env.PORT || 3200
  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api`, 'Bootstrap')
}
bootstrap()
