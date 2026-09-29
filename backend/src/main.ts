import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
async function bootstrap(){
 const app=await NestFactory.create<NestExpressApplication>(AppModule); const uploadDir=join(process.cwd(),'uploads'); if(!existsSync(uploadDir))mkdirSync(uploadDir,{recursive:true}); app.useStaticAssets(uploadDir,{prefix:'/uploads/'});
 const origins=(process.env.CORS_ORIGINS||'http://localhost:5173,http://localhost:5174,http://localhost:5175').split(',').map(x=>x.trim()).filter(Boolean); app.enableCors({origin:(origin,cb)=>!origin||origins.includes(origin)?cb(null,true):cb(new Error('CORS origin blocked'),false),credentials:true});
 app.setGlobalPrefix('api'); app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true})); app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); const config=app.get(ConfigService); await app.listen(config.get<number>('port')??3000,'0.0.0.0');
} bootstrap();
