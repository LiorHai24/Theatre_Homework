import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true, // Throw error if properties not defined in DTO are present
    transform: true, // Automatically transform payloads to DTO instances
    exceptionFactory: (errors) => {
      // Check if the error is due to non-whitelisted properties
      const nonWhitelistedError = errors.find(error => error.property === undefined);
      if (nonWhitelistedError) {
        return {
          statusCode: 400,
          message: [`Property ${nonWhitelistedError.value} is not allowed`],
          error: 'Validation Error',
          timestamp: new Date().toISOString()
        };
      }

      // Handle regular validation errors
      const messages = errors.map(error => {
        const constraints = Object.values(error.constraints || {});
        return constraints[0]; // Only return the first error message for each field
      });
      return {
        statusCode: 400,
        message: messages,
        error: 'Validation Error',
        timestamp: new Date().toISOString()
      };
    }
  }));
  await app.listen(3000);
}
bootstrap();
