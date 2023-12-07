import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransferAssetController } from './transferAsset/transferAsset.controller';
import { TransferAssetService } from './transferAsset/transferAsset.service';

@Module({
  imports: [],
  controllers: [AppController, TransferAssetController],
  providers: [AppService, TransferAssetService],
})
export class AppModule {}
