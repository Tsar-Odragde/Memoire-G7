import { Injectable, Logger } from '@nestjs/common';
import { createWalletClient, createPublicClient, http, decodeEventLog } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as dotenv from 'dotenv';
import * as abi from '../abi/memoireVault.json';

const memoireVaultAbi = abi as readonly unknown[];

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

  async createVault(name: string, cids: string[], unlockTime: number): Promise<{ vaultId: string; txHash: string }> {
    this.logger.log(`Creating vault with name="${name}" and ${cids.length} CID(s)`);

    const { request } = await this.publicClient.simulateContract({
      account: this.account,
      address: this.vaultAddress as `0x${string}`,
      abi: memoireVaultAbi,
      functionName: 'createVault',
      args: [name, cids, BigInt(unlockTime)],
    });

    const txHash = await this.walletClient.writeContract(request);
    this.logger.log(`Vault creation tx hash: ${txHash}`);

    const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash });

    const decodedLogs = receipt.logs.map(log => {
      try {
        return decodeEventLog({
          abi: memoireVaultAbi,
          eventName: 'VaultCreated',
          data: log.data,
          topics: log.topics,
        });
      } catch {
        return null;
      }
    });

    const createdEvent = decodedLogs.find(e => e?.eventName === 'VaultCreated');
    const vaultId = createdEvent?.args && 'vaultId' in createdEvent.args
      ? (createdEvent.args.vaultId as `0x${string}`)
      : '0x';

    return { vaultId, txHash };
  }

  async getVaultStatus(vaultId: `0x${string}`): Promise<{ isOpen: boolean; unlockTime: bigint }> {
    const result = await this.publicClient.readContract({
      address: this.vaultAddress as `0x${string}`,
      abi: memoireVaultAbi,
      functionName: 'getVaultStatus',
      args: [vaultId],
    });

    const [isOpen, unlockTime] = result as [boolean, bigint];
    return { isOpen, unlockTime };
  }

  async retrieveVault(vaultId: `0x${string}`): Promise<string[]> {
    const { request } = await this.publicClient.simulateContract({
      account: this.account,
      address: this.vaultAddress as `0x${string}`,
      abi: memoireVaultAbi,
      functionName: 'retrieveVault',
      args: [vaultId],
    });

    const txHash = await this.walletClient.writeContract(request);
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash });

    const decodedLogs = receipt.logs.map(log => {
      try {
        return decodeEventLog({
          abi: memoireVaultAbi,
          eventName: 'VaultRetrieved',
          data: log.data,
          topics: log.topics,
        });
      } catch {
        return null;
      }
    });

    const retrievedEvent = decodedLogs.find(e => e?.eventName === 'VaultRetrieved');
    //this.logger.debug('Retrieved event args:', retrievedEvent?.args);
    const cids = (retrievedEvent?.args as any)?.cids || [];

    return cids;
  }
}
