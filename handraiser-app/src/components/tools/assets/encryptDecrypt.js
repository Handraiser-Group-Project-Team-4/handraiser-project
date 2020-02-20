// export default function encryptDecrypt(type, value) {
//     if(type === 'encrypt'){
//         const myCipher = cipher('just a random stuff here');
//         value = 'ThisIsTheCohortValue: ' + value
//         return myCipher(value)
//     }
//     else{
//         const myDecipher = decipher('just a random stuff here')
//         value = 'ThisIsTheCohortValue: ' + value
//         return myDecipher(value).match(/[0-9]/gi).join('')
//     }
// }


// const cipher = salt => {
//     const textToChars = text => text.split('').map(c => c.charCodeAt(0));
//     const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
//     const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

//     return text => text.split('')
//         .map(textToChars)
//         .map(applySaltToChar)
//         .map(byteHex)
//         .join('');
// }

// const decipher = salt => {
//     const textToChars = text => text.split('').map(c => c.charCodeAt(0));
//     const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

//     return encoded => encoded.match(/.{1,2}/g)
//         .map(hex => parseInt(hex, 16))
//         .map(applySaltToChar)
//         .map(charCode => String.fromCharCode(charCode))
//         .join('');
// }

import CryptoJS from 'crypto-js'

export default function encryptDecrypt(type, value) {
    if(type === 'encrypt')
        return CryptoJS.AES.encrypt(value, "Secret Passphrase");
    else{
        var decrypted = CryptoJS.AES.decrypt(value, "Secret Passphrase");
        return decrypted.toString(CryptoJS.enc.Utf8)

    }

}
