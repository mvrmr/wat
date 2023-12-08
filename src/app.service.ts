import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): string {
    return 'Whisper Asset Manager for Constellation is *Up And Running*';
  }
}
