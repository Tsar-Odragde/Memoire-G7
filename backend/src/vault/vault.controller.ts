import {
    Controller,
    Get,
    Param,
    Res,
    ForbiddenException,
  } from '@nestjs/common';
  import { VaultService } from './vault.service';
  import { Response } from 'express';
  
  @Controller('vault')
  export class VaultController {
    constructor(private readonly vaultService: VaultService) {}
  
    @Get(':cid')
    async fetchFile(@Param('cid') cid: string, @Res() res: Response) {
      const unlocked = await this.vaultService.isVaultUnlocked(cid);
  
      if (!unlocked.status) {
        throw new ForbiddenException(
          `Vault is locked. Unlocks at ${new Date(unlocked.unlockTime).toISOString()}`,
        );
      }
  
      return this.vaultService.streamFile(cid, res);
    }
  }
  