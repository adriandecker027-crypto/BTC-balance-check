import { mnemonicToSeedSync } from 'bip39';
import { networks, payments } from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import axios from 'axios';

// Initialize bip32 with tiny-secp256k1
const bip32 = BIP32Factory(ecc);

// Your mnemonic phrase (12 or 24 words)
const mnemonic = 'media asset mind safe shell label toss room hood picnic october drip'; // 12 or 24 words

// Convert mnemonic to seed buffer
const seed = mnemonicToSeedSync(mnemonic);

// Create root node from seed
const root = bip32.fromSeed(seed, networks.bitcoin);

// BIP44 derivation path for Bitcoin
const derivationPath = "m/44'/0'/0'/0/";

// Generate first 5 legacy P2PKH addresses
for (let i = 0; i < 5; i++) {
  const child = root.derivePath(derivationPath + i);
  const { address } = payments.p2pkh({
    privatekey: child.privateKey,
    pubkey: child.publicKey,
    network: networks.bitcoin,
  });
  const privateKeyWIF = child.toWIF(); // Wallet Import Format
  console.log(`Address ${i}: ${address}`);
  console.log(`Private Key ${i}: ${privateKeyWIF}`);
  const res = await axios.get(`https://external-web-proxy.coinledger.io/api.covalenthq.com/btc-mainnet/address/${address}/balances_v2/?quote-currency=USD`);
  console.log(res.data.data.items[0].pretty_quote)
  console.log('-----------------------------');
}
