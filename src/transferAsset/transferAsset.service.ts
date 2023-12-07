import { Injectable } from '@nestjs/common';

@Injectable()
export class TransferAssetService {
  findAll(): string {
    return `Hello there from ${__filename}`;
  }
}
