import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Injectable()
export class VaultService {
  // 🚧 Temporary logic: replace with smart contract lookup
  async isVaultUnlocked(cid: string): Promise<{ status: boolean; unlockTime: number }> {
    const unlockMap: Record<string, number> = {
      // mock CID => unlock time (timestamp in ms)
      'demo123': Date.now() - 1000, // already unlocked
      'locked123': Date.now() + 86400000, // unlocks in 1 day
    };

    const unlockTime = unlockMap[cid] ?? Date.now(); // assume unlocked by default
    const now = Date.now();
    return {
      status: now >= unlockTime,
      unlockTime,
    };
  }

  async streamFile(cid: string, res: Response) {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const fileStream = await axios.get(url, { responseType: 'stream' });

    res.setHeader('Content-Type', fileStream.headers['content-type'] || 'application/octet-stream');
    fileStream.data.pipe(res);
  }
}
