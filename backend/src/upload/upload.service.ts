import { Injectable } from '@nestjs/common';
import { IpfsService } from '../ipfs/ipfs.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly ipfsService: IpfsService,
    private readonly blockchainService: BlockchainService,
  ) {}

  async processUpload(files: Express.Multer.File[], lockTime: string, name: string) {
    const cids: string[] = [];

    for (const file of files) {
      const cid = await this.ipfsService.upload(file.buffer);
      cids.push(cid);
    }

    const unlockTimestamp = Math.floor(new Date(lockTime).getTime() / 1000); // convert to seconds
    const { vaultId, txHash } = await this.blockchainService.createVault(name, cids, unlockTimestamp);

    return {
      lockTime,
      vaultId,
      txHash,
      files: files.map((f, i) => ({
        originalName: f.originalname,
        cid: cids[i],
      })),
    };
  }
}
