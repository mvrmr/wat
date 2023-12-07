import { Controller, Get } from '@nestjs/common';
import { TransferAssetService } from './transferAsset.service';

@Controller('transferAsset')
export class TransferAssetController {
  constructor(private readonly transferAssetService: TransferAssetService) {}

  @Get()
  findAll(): string {
    return this.transferAssetService.findAll();
  }
}
