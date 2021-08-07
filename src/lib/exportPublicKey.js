/*
Convert  an ArrayBuffer into a string
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/

export const ab2str = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

export const str2ab = (str) => {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

/*
Export the given key and write it into the "exported-key" space.
*/
const exportPublicKey = async (key) => {
  const exported = await window.crypto.subtle.exportKey('spki', key);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;

  return pemExported;
};

export default exportPublicKey;
