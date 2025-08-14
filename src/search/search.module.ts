// src/search/search.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ItunesService } from '../itunes/itunes.service';
import { DatabaseService } from '../database/database.service';
import { DYNAMODB_CLIENT } from '../database/constants';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Module({
  imports: [
    // We still need HttpModule for the ItunesService
    HttpModule,
  ],
  controllers: [SearchController],
  providers: [
    // 1. All services are declared here
    SearchService,
    ItunesService,
    DatabaseService,

    // 2. The custom DynamoDB provider is also declared directly here
    {
      provide: DYNAMODB_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const region = configService.get<string>('AWS_REGION');
        const accessKeyId = configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        );

        if (!region || !accessKeyId || !secretAccessKey) {
          throw new Error('Missing AWS configuration...');
        }

        const client = new DynamoDBClient({
          region,
          credentials: { accessKeyId, secretAccessKey },
        });

        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
})
export class SearchModule {}
