import { ApiProperty } from '@nestjs/swagger';

export enum NetworkIdentifier {
  Binance = 'binance',
  Poloygon = 'polygon',
}

export class RegisterUserDto {
  @ApiProperty()
  public userAddress: string;
  @ApiProperty()
  public initialBalance: number;
  @ApiProperty({
    enum: NetworkIdentifier,
    isArray: true,
    // example: [Object.values(NetworkIdentifier)],
  })
  public network: NetworkIdentifier[];
}
