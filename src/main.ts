import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Whisper Asset Manager')
    .setDescription('Whisper Asset Manager for Constellation')
    .setVersion('1.0')
    // .addTag('wat-zkp')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const PORT = process.env.PORT || 3000;

  try {
    await app.listen(PORT);
    console.log(
      'Server listening on Port',
      PORT,
      `SwaggerUI URL: http://localhost:${PORT}/api`,
    );
  } catch (error) {
    console.log('Error in Server setup', error);
  }
}
bootstrap();
