import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';

export default function encryptDecrypt(type, value) {
    let ciphertext;
    
    if(type === 'encrypt')
        ciphertext = CryptoAES.encrypt(value, 'asdf');
    else
        ciphertext = CryptoAES.decrypt(value, '34vqsfsnJer96YBewr97KWRYEU89qv32ve1');

    return ciphertext
}
