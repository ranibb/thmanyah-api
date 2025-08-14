import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DatabaseService } from './database.service';
import { DYNAMODB_CLIENT } from './constants';

@Global()
@Module({
  providers: [
    {
      provide: DYNAMODB_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 1. Retrieve variables from the ConfigService
        const region = configService.get<string>('AWS_REGION');
        const accessKeyId = configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        );

        // 2. Validate that the environment variables are actually set
        if (!region || !accessKeyId || !secretAccessKey) {
          throw new Error(
            'Missing AWS configuration. Make sure AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are set in your .env file.',
          );
        }

        // 3. If validation passes, create the client
        // TypeScript now knows these variables are strings, not undefined.
        const client = new DynamoDBClient({
          region: region,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        });

        return DynamoDBDocumentClient.from(client);
      },
    },
    DatabaseService,
  ],
  exports: [DYNAMODB_CLIENT],
})
export class DatabaseModule {}
