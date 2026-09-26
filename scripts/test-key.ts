import { privateKeyToAccount } from 'viem/accounts';

try {
  const privateKey = '0xMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg4w4XIQsQT5aV+D6zE03FHhmmBnDCkpbcdHxf1885nq6hRANCAAR1R/Bwp6mfnvo98E6c1TIPFi9G2PPotk0jDPIwzC6auJCJT3dZKgWKLHQIH8S2ZuJZczkNbJblaN98xdsNdcid';
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  console.log('Account generated successfully!', account.address);
} catch (e: any) {
  console.error('Error generating account:', e.message);
}
