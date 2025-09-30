import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Recommended for env variables
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SwaggerAuthMiddleware implements NestMiddleware {
  // Using ConfigService is the standard way to handle env variables
  private readonly username: string;
  private readonly password: string;

  constructor(private readonly configService: ConfigService) {
    this.username = this.configService.get<string>('SWAGGER_USER', 'admin');
    this.password = this.configService.get<string>('SWAGGER_PASSWORD', 'admin');
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Check if the request is for the swagger UI or its JSON definition
    const isSwaggerRequest =
      req.originalUrl.startsWith('/api-docs') || // Path to UI
      req.originalUrl.startsWith('/api-docs-json'); // Path to generated JSON

    if (!isSwaggerRequest) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      this.sendUnauthorizedResponse(res);
      return;
    }

    const credentials = this.decodeCredentials(authHeader);
    if (credentials.username !== this.username || credentials.password !== this.password) {
      this.sendUnauthorizedResponse(res);
      return;
    }

    console.log('Swagger Authorization Successful.');
    next();
  }

  private decodeCredentials(authHeader: string): {
    username?: string;
    password?: string;
  } {
    try {
      const b64auth = authHeader.split(' ')[1];
      const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
      return { username, password };
    } catch (error) {
      return {};
    }
  }

  private sendUnauthorizedResponse(res: Response) {
    console.log('Swagger Authorization Failed.');
    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger UI"');
    res.status(401).send('Unauthorized');
  }
}
