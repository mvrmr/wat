import { Controller, Get, Post, Query } from '@nestjs/common';
import { WATService } from './wat.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './wat.dto';

// registerUser, requestAsset,lockAsset(Binance),mintAsses(ploygon),burnAsset(Binance),cancelTransfer(Binance)
@ApiTags('Whisper Asset Transfer')
@Controller('wat')
export class WATController {
  constructor(private readonly watService: WATService) {}

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

    return this.watService.senderTest(
      sendAmount,
      senderStartingBalance,
      senderSalt,
    );
  }

  @Post('registerUser')
  registerUser(@Query() registerUserInput: RegisterUserDto): any {
    return this.watService.registerUser(registerUserInput);
  }
}
