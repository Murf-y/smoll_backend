import * as crypto from 'crypto'
import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { MongoServerError } from 'mongodb'
import mongoose from 'mongoose'


/**
 * Check if string is a valid ObjectId MongoDB
 * @param id
 * @returns {boolean}
 * @description create a new ObjectId from the given id, the id can only by valid if the new ObjectId is equal to the given id, otherwise it is not valid
 */
export const checkIfValidObjectId = (id: string) => {
  const ObjectId = mongoose.Types.ObjectId
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id
}


export const handleMongoDuplicateKeyError = (error: MongoServerError) => {
  // if error code is 11000, it means that the email is already taken
  if (error.code === 11000) {
    // E11000 duplicate key error collection: ninjacodb.users index: email_1 dup key: { email: "test@test.com" }
    // extract the fields { email } from the error message
    const fields = error.message.match(/\{(.+)\}/)
    if (fields) {
      const field = fields[1].split(':')[0]
      throw new BadRequestException(`${field} is already taken`)
    }

    throw new InternalServerErrorException(error)
  }
  throw new InternalServerErrorException(error.cause)
}
