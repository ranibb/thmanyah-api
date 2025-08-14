import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ItunesPodcast, ItunesSearchResponse } from '../common/dto/itunes.dto';

@Injectable()
export class ItunesService {
  private readonly logger = new Logger(ItunesService.name);
  private readonly baseUrl: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('ITUNES_API_BASE_URL');
  }

  async searchPodcasts(term: string): Promise<ItunesPodcast[]> {
    const url = `${this.baseUrl}/search`;
    this.logger.log(`Searching iTunes for term: ${term}`);

    try {
      // Use the generic <ItunesSearchResponse> to type the response data
      const response = await firstValueFrom(
        this.httpService.get<ItunesSearchResponse>(url, {
          params: {
            term,
            media: 'podcast',
            limit: 20,
          },
        }),
      );
      return response.data.results;
    } catch (error) {
      this.logger.error('Failed to fetch from iTunes API', error);
      throw new Error('Could not retrieve data from iTunes.');
    }
  }
}
