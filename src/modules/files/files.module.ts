import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileSchema } from './schema/file.schema';
import { StorageServiceProvider } from './storage/stroage.provider';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
  controllers: [FilesController],
  providers: [FilesService, StorageServiceProvider],
  exports: [FilesService],
})
export class FilesModule {}
