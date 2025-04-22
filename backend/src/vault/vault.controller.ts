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

  @Get(':vaultId')
  async fetchVaultFiles(@Param('vaultId') vaultId: string, @Res() res: Response) {
    const status = await this.vaultService.getVaultStatus(vaultId);

    if (!status.isOpen) {
      throw new ForbiddenException(
        `Vault is locked. Unlocks at ${new Date(Number(status.unlockTime) * 1000).toISOString()}`,
      );
    }

    return this.vaultService.streamFilesFromVault(vaultId, res);
  }

  @Get(':vaultId/status')
  async getStatus(@Param('vaultId') vaultId: string) {
    return this.vaultService.getVaultStatus(vaultId);
  }
}