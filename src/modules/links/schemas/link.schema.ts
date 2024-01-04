import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type LinkDocument = HydratedDocument<Link>

@Schema({ collection: 'links', timestamps: true })
export class Link {
  @ApiProperty()
  @Prop({ required: true })
  shortUrl: string

  @ApiProperty()
  @Prop({ required: true })
  longUrl: string
}

export const LinkSchema = SchemaFactory.createForClass(Link)
LinkSchema.index({ shortUrl: 1 })
