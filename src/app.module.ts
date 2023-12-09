import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransferAssetController } from './transferAsset/transferAsset.controller';
import { TransferAssetService } from './transferAsset/transferAsset.service';
import { WATController } from './wat/wat.controller';
import { WATService } from './wat/wat.service';

@Module({
  imports: [],
  controllers: [WATController, TransferAssetController, AppController],
  providers: [WATService, AppService, TransferAssetService],
})
export class AppModule {}
