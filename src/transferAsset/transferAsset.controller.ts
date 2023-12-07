import { Controller, Get, Param, Query } from '@nestjs/common';
import { TransferAssetService } from './transferAsset.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transfer Asset')
@Controller('transferAsset')
export class TransferAssetController {
  constructor(private readonly transferAssetService: TransferAssetService) {}

  @Get('receiverTest/:sendAmount/:receiverStartingBalance/:receiverSalt')
  receiverTest(
    @Param('sendAmount') sendAmount: number,
    @Param('receiverStartingBalance') receiverStartingBalance: number,
    @Param('receiverSalt') receiverSalt: number,
  ): any {
    sendAmount =
      typeof sendAmount == 'string' ? parseInt(sendAmount) : sendAmount;

    receiverStartingBalance =
      typeof receiverStartingBalance == 'string'
        ? parseInt(receiverStartingBalance)
        : receiverStartingBalance;

    receiverSalt =
      typeof receiverSalt == 'string' ? parseInt(receiverSalt) : receiverSalt;

    return this.transferAssetService.receiverTest(
      sendAmount,
      receiverStartingBalance,
      receiverSalt,
    );
  }

  @Get('senderTest')
  senderTest(
    @Query('sendAmount') sendAmount: number,
    @Query('senderStartingBalance') senderStartingBalance: number,
    @Query('senderSalt') senderSalt: number,
  ): any {
    sendAmount =
      typeof sendAmount == 'string' ? parseInt(sendAmount) : sendAmount;

    senderStartingBalance =
      typeof senderStartingBalance == 'string'
        ? parseInt(senderStartingBalance)
        : senderStartingBalance;

    senderSalt =
      typeof senderSalt == 'string' ? parseInt(senderSalt) : senderSalt;

    return this.transferAssetService.senderTest(
      sendAmount,
      senderStartingBalance,
      senderSalt,
    );
  }
}
