import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { pathToFileURL } from 'url';

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);
  private uploader: any;

  private async getUploader() {
    if (!this.uploader) {
      const mjsPath = join(__dirname, 'ipfs-uploader.mjs');
      const fileUrl = pathToFileURL(mjsPath).href;

      const dynamicImport = new Function('specifier', 'return import(specifier)');
      const esmModule = await dynamicImport(fileUrl);

      this.uploader = esmModule.uploadToIpfs;
    }
    return this.uploader;
  }

  async upload(buffer: Buffer): Promise<string> {
    const uploader = await this.getUploader();
    return uploader(buffer);
  }
}
