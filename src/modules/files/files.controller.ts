import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/user.decorator';
import type { JwtUserInterface } from 'src/common/interface/jwt-user.interface';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ALLOWED_FILE_TYPES_CONST, MAX_FILE_SIZE_CONST } from './constant/files.constant';
import { FileResponseDto } from './dto/file-response.dto';
import { FilesService } from './files.service';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @SerializeOptions({ excludeExtraneousValues: true })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: FileResponseDto })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_CONST }),
          new FileTypeValidator({ fileType: ALLOWED_FILE_TYPES_CONST }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: JwtUserInterface,
  ): Promise<FileResponseDto> {
    const userId = user._id.toString();
    return this.filesService.uploadFile(file, userId);
  }
}
