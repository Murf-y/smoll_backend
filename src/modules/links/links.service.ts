import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateLinkDto } from './dto/create-link.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Link, LinkDocument } from './schemas/link.schema'
import { Model } from 'mongoose'

@Injectable()
export class LinksService {
  constructor(@InjectModel(Link.name) private readonly linkModel: Model<LinkDocument>) {}

  async create(createLinkDto: CreateLinkDto) {
    // Validate the URL
    const { longUrl } = createLinkDto

    const regex = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    )
    if (!regex.test(longUrl)) {
      throw new BadRequestException('Invalid URL')
    }

    const trialLimit = 10
    let trials = 0

    while (true) {
      // Shuffling the URL
      const shuffledUrl = longUrl
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('')

      // Create the short URL by using base64 encoding
      const shortUrl = Buffer.from(shuffledUrl)
        .toString('base64')
        .slice(trials, trials + 8)

      // Check if the short URL already exists (shortUrl is an index in the schema)
      const existingLink = await this.linkModel.findOne({ shortUrl })

      if (!existingLink) {
        const createdLink = new this.linkModel({ longUrl, shortUrl })
        return createdLink.save()
      } else {
        // If the short URL already exists, try again
        trials++
        if (trials > trialLimit) {
          throw new BadRequestException('Cannot create a short URL')
        }
      }
    }
  }

  async findOne(shortUrl: string) {
    const link = await this.linkModel.findOne({ shortUrl })

    if (!link) {
      throw new BadRequestException('Invalid URL')
    }

    return link
  }
}
