import { Controller, Get, Param } from '@nestjs/common';
import { TransferAssetService } from './transferAsset.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transfer Asset')
@Controller('transferAsset')
export class TransferAssetController {
  constructor(private readonly transferAssetService: TransferAssetService) {}

  @Get('receiverTest/:sendAmount/:receiverstartingbalance/:receiversalt')
  receiverTest(
    @Param('sendAmount') sendAmount: number,
    @Param('receiverstartingbalance') receiverstartingbalance: number,
    @Param('receiversalt') receiversalt: number,
  ): string {
    return this.transferAssetService.receiverTest(
      sendAmount,
      receiverstartingbalance,
      receiversalt,
    );

    // return `About to execute receiverTest with Params, sendAmount: ${sendAmount}, receiverstartingbalance: ${receiverstartingbalance}`;
    // return this.appService.getHello();
  }
}
