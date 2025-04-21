import { Injectable, Logger } from '@nestjs/common';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as dotenv from 'dotenv';
import memoireVaultAbi from '../abi/memoireVault.abi.json';

dotenv.config();

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private readonly vaultAddress = process.env.VAULT_CONTRACT_ADDRESS!;

  private account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

  private walletClient = createWalletClient({
    account: this.account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
  });

  private publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
  });

  async createVault(cid: string, unlockTime: number): Promise<string> {
    this.logger.log(`Creating vault with CID=${cid} unlockTime=${unlockTime}`);

    const { request } = await this.publicClient.simulateContract({
      account: this.account,
      address: this.vaultAddress as `0x${string}`,
      abi: memoireVaultAbi,
      functionName: 'createVault',
      args: [cid, BigInt(unlockTime)],
    });

    const txHash = await this.walletClient.writeContract(request);
    this.logger.log(`Vault creation tx hash: ${txHash}`);

    return txHash;
  }
}
