import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//Este código crea un decorador personalizado de NestJS llamado @CurrentUser(). 
// Su función es obtener el usuario autenticado que previamente guardó el AuthGuard en request.user.

export const CurrentUser = createParamDecorator(
  //createParamDecorator: Es una función que permite crear decoradores para parámetros.
  //(data: unknow, ctx: ExecutionContext) Esta función será ejecutada cada vez que alguien utilice: @CurrentUser()
  (data: unknown, ctx: ExecutionContext)  => {
    //ExecutionContezt:Contiene toda la información de la petición actual.
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);


//data: unknow Este parámetro representa los datos opcionales que puedes pasar al decorador.
// * @CurrentUser() Aquí data vale undefined
// * @CurrentUser('email') entonces data vale 'email'

//ctx: ExecutionContext Es el contexto de ejecución de la petición. Con él puedes acceder al objeto Request.