import { Injectable } from '@nestjs/common';

@Injectable()
export class TransferAssetService {
  receiverTest(
    sendAmount: number,
    receiverstartingbalance: number,
    receiversalt: number,
  ): any {
    return `About run 'receiver Test' with Parameters sendAmount, receiverstartingbalance, receiversalt: ${sendAmount}, ${receiverstartingbalance}, ${receiversalt}`;
  }
}
