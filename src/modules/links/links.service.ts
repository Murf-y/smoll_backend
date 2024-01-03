import { CreateLinkDto } from './dto/create-link.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LinksService {
  create(createLinkDto: CreateLinkDto) {
    return 'This action adds a new link'
  }

  findAll() {
    return `This action returns all links`
  }

  findOne(id: number) {
    return `This action returns a #${id} link`
  }

  remove(id: number) {
    return `This action removes a #${id} link`
  }
}
