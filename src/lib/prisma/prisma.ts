import { PrismaClient } from '@prisma/client'

let instance: PrismaClient

export class PrismaClientSingleton {
  constructor() {
    if (instance) {
      throw new Error('You can only create one PrismaClient instance')
    }
    instance = new PrismaClient()
  }
 
  getInstance() {
    return instance
  }
}

const prismaClientSingleton = Object.freeze(new PrismaClientSingleton())

export default prismaClientSingleton.getInstance()