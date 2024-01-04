import { IsNotEmpty, IsString, IsUrl } from 'class-validator'
export class CreateLinkDto {
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  longUrl: string
}
