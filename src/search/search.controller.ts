import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async getPodcasts(@Query('term') term: string) {
    if (!term) {
      throw new HttpException(
        'Search term is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.searchService.searchAndStorePodcasts(term);
  }
}
