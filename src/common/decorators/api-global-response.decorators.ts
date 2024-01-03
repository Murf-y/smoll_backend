import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponseOptions,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger'
import { INTERNAL_SERVER_EXCEPTION_MESSAGE, NOT_FOUND_EXCEPTION_MESSAGE } from '../constants'
import { ResponseDto } from '../dtos/response.dto'
import { Type, applyDecorators } from '@nestjs/common'

type ApiOkResponseOptions = Omit<ApiResponseOptions, 'schema'> & {
  isArray?: boolean
}

export const ApiGlobalResponse = (options?: ApiOkResponseOptions) => {
  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiConsumes('application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              payload: {},
              timestamp: {
                type: 'number',
              },
            },
          },
        ],
      },
      ...options,
    }),
    ApiNotFoundResponse({
      description: NOT_FOUND_EXCEPTION_MESSAGE,
      status: 404,
      schema: {
        properties: {
          error: {
            properties: {
              statusCode: {
                type: 'number',
                example: 404,
              },
              message: {
                type: 'string',
                example: NOT_FOUND_EXCEPTION_MESSAGE,
              },
              error: {
                type: 'string',
                example: 'Not Found',
              },
            },
          },
          timestamp: {
            type: 'number',
            example: 1617826799860,
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: INTERNAL_SERVER_EXCEPTION_MESSAGE,
      status: 500,
      schema: {
        properties: {
          error: {
            properties: {
              statusCode: {
                type: 'number',
                example: 500,
              },
              message: {
                type: 'string',
                example: INTERNAL_SERVER_EXCEPTION_MESSAGE,
              },
              error: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
          timestamp: {
            type: 'number',
            example: 1617826799860,
          },
        },
      },
    })
  )
}
