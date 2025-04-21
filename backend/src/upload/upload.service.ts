import { Injectable } from '@nestjs/common';
import { IpfsService } from '../ipfs/ipfs.service';

@Injectable()
export class UploadService {
  constructor(private readonly ipfsService: IpfsService) {}

  async processUpload(files: Express.Multer.File[], lockTime: string) {
    const uploadedHashes: { cid: string; originalName: string }[] = [];

    for (const file of files) {
      const cid = await this.ipfsService.upload(file.buffer);
      uploadedHashes.push({
        cid,
        originalName: file.originalname,
      });
    }

    return {
      lockTime,
      files: uploadedHashes,
    };
  }
}

