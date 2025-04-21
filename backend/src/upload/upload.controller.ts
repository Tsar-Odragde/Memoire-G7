import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadRequestDto } from './dto/upload-request.dto';
import { multerConfig } from './utils/multer.config';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload files and set a timelock' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload one or more files with a lockTime timestamp',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        lockTime: {
          type: 'string',
          example: '2025-01-01T00:00:00Z',
        },
      },
      required: ['files', 'lockTime'],
    },
  })
  @UseInterceptors(FilesInterceptor('files', 5, multerConfig))
  async handleUpload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UploadRequestDto,
  ) {
    return this.uploadService.processUpload(files, body.lockTime);
  }
}
