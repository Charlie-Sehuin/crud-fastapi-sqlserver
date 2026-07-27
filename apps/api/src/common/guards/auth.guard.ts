import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly db: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no enviado');
    }

    const token = authHeader.replace('Bearer ', '');

    // Le pedimos a Supabase que valide el token y nos devuelva el usuario dueño
    const { data, error } = await this.db.getClient().auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    // Adjuntamos el usuario al request para que el decorator lo pueda leer después
    request.user = data.user;
    return true;
  }
}