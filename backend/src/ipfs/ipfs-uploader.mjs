import { create } from 'ipfs-http-client';

export async function uploadToIpfs(buffer) {
  const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
  const result = await ipfs.add(buffer);
  return result.cid.toString();
}
