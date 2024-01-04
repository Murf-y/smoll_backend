import { Link, LinkSchema } from './schemas/link.schema'
import { LinksController } from './links.controller'
import { LinksService } from './links.service'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }])],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
