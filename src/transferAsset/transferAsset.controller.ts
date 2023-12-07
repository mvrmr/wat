import { Controller, Get, Param } from '@nestjs/common';
import { TransferAssetService } from './transferAsset.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transfer Asset')
@Controller('transferAsset')
export class TransferAssetController {
  constructor(private readonly transferAssetService: TransferAssetService) {}

  @Get('receiverTest/:sendAmount/:receiverstartingbalance/:receiversalt')
  receiverTest(
    @Param('sendAmount') sendAmount,
    @Param('receiverstartingbalance') receiverstartingbalance,
    @Param('receiversalt') receiversalt,
  ): string {
    sendAmount =
      typeof sendAmount == 'string' ? parseInt(sendAmount) : sendAmount;

    receiverstartingbalance =
      typeof receiverstartingbalance == 'string'
        ? parseInt(receiverstartingbalance)
        : receiverstartingbalance;

    receiversalt =
      typeof receiversalt == 'string' ? parseInt(receiversalt) : receiversalt;

    return this.transferAssetService.receiverTest(
      sendAmount,
      receiverstartingbalance,
      receiversalt,
    );

    // return `About to execute receiverTest with Params, sendAmount: ${sendAmount}, receiverstartingbalance: ${receiverstartingbalance}`;
    // return this.appService.getHello();
  }
}
