import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { DYNAMODB_CLIENT } from './constants';
import { ItunesPodcast } from '../common/dto/itunes.dto';

const TABLE_NAME = 'Podcasts';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @Inject(DYNAMODB_CLIENT)
    private readonly dynamoDbClient: DynamoDBDocumentClient,
  ) {}

  async savePodcasts(
    podcasts: ItunesPodcast[],
    searchTerm: string,
  ): Promise<void> {
    if (podcasts.length === 0) {
      this.logger.log('No podcasts to save.');
      return;
    }

    // A BatchWriteCommand is more efficient than many single PutCommands
    const putRequests = podcasts.map((podcast) => ({
      PutRequest: {
        Item: {
          ...podcast,
          searchedTerm: searchTerm,
          updatedAt: new Date().toISOString(),
        },
      },
    }));

    // DynamoDB BatchWrite has a limit of 25 items per request
    // We can add chunking logic here if we expect more than 25 results
    const command = new BatchWriteCommand({
      RequestItems: {
        [TABLE_NAME]: putRequests,
      },
    });

    try {
      this.logger.log(`Saving ${podcasts.length} podcasts to DynamoDB.`);
      await this.dynamoDbClient.send(command);
    } catch (error) {
      this.logger.error('Failed to save podcasts to DynamoDB', error);
      throw new Error('Could not save data to database.');
    }
  }
}
