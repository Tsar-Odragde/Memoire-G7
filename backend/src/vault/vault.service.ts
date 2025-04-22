import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class VaultService {
  constructor(private readonly blockchainService: BlockchainService) {}

  async getVaultStatus(vaultId: string) {
    const { isOpen, unlockTime } = await this.blockchainService.getVaultStatus(vaultId as `0x${string}`);
    return {
      isOpen,
      unlockTime: unlockTime.toString(), 
    };
  }

  async streamFilesFromVault(vaultId: string, res: Response) {
    const cids = await this.retrieveVault(vaultId);

    if (!cids.length) {
      res.status(404).send('No files found in this vault.');
      return;
    }

    // For now stream only the first file (simplified behavior)
    const fileStream = await axios.get(`https://gateway.pinata.cloud/ipfs/${cids[0]}`, {
      responseType: 'stream',
    });

    res.setHeader('Content-Type', fileStream.headers['content-type'] || 'application/octet-stream');
    fileStream.data.pipe(res);
  }

  private async retrieveVault(vaultId: string): Promise<string[]> {
    return this.blockchainService.retrieveVault(vaultId as `0x${string}`);
  }
}
