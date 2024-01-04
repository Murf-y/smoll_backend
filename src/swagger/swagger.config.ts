import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

const title = 'Smoll API'

/**
 * Setup swagger in the application
 * @param app {INestApplication}
 * @param apiVersion {string}
 * @returns {void}
 * @description This function is used to setup swagger in the application
 */
export const SwaggerConfig = (app: INestApplication, apiVersion: string) => {
  const options = new DocumentBuilder().setTitle(title).setVersion(apiVersion).build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup(`/api/doc`, app, document)
}
