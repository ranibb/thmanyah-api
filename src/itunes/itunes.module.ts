import { Module } from '@nestjs/common';
import { ItunesService } from './itunes.service';

@Module({
  providers: [ItunesService],
})
export class ItunesModule {}
