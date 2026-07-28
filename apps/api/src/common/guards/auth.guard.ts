import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly db: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // Obtiene el objeto Request de la petición Http (switchToHttp)
    const authHeader = request.headers['authorization']; //Obtiene el header Authorization: Bearer eyJhbGc...

    if (!authHeader || !authHeader.startsWith('Bearer ')) { //¿Existe el header?  Comprueba que el formato sea correcto.
      throw new UnauthorizedException('Token no enviado');
    }

    const token = authHeader.replace('Bearer ', ''); //EXTRAER EL TOKEN. Solo elimina el prefijo "Bearer ".

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