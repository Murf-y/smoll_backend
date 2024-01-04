import { ApiGlobalResponse } from 'common/decorators/api-global-response.decorators'
import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CreateLinkDto } from './dto/create-link.dto'
import { LinksService } from './links.service'
import { Throttle } from '@nestjs/throttler'

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiGlobalResponse()
  @Throttle(5, 60)
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto)
  }

  @Get(':shortUrl')
  @ApiGlobalResponse()
  findOne(@Param('shortUrl') shortUrl: string) {
    return this.linksService.findOne(shortUrl)
  }
}
