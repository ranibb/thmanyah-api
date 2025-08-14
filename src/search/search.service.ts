// src/search/search.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ItunesService } from '../itunes/itunes.service';
import { ItunesPodcast } from '../common/dto/itunes.dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly itunesService: ItunesService,
    private readonly databaseService: DatabaseService,
  ) {}

  async searchAndStorePodcasts(term: string): Promise<ItunesPodcast[]> {
    this.logger.log(`Initiating search for term: ${term}`);

    // 1. Fetch from iTunes
    const podcasts = await this.itunesService.searchPodcasts(term);

    // 2. Store in DynamoDB, but don't block the response to the user.
    // If saving fails, we log the error but don't fail the whole request.
    this.databaseService.savePodcasts(podcasts, term).catch((error) => {
      // --- This is the corrected block ---
      if (error instanceof Error) {
        // If it's a real Error object, we can safely access .message
        this.logger.error(
          `Non-blocking database save failed: ${error.message}`,
          error.stack, // Also log the stack for better debugging
        );
      } else {
        // Handle cases where a non-Error object was thrown
        this.logger.error(
          `Non-blocking database save failed with an unknown error type: ${String(error)}`,
        );
      }
      // --- End of corrected block ---
    });

    // 3. Return the results immediately to the user
    return podcasts;
  }
}
