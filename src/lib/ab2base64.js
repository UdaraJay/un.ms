/*
Convert  an ArrayBuffer into a string
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/

export const ab2str = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

export const str2ab = (str) => {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

export const base642ab = (base64) => {
  const base64toString = atob(base64);
  const ab = str2ab(base64toString);

  return ab;
};

/*
Export the given key and write it into the "exported-key" space.
*/
const ab2base64 = (ab) => {
  const exportedAsString = ab2str(ab);
  const exportedAsBase64 = btoa(exportedAsString);

  return exportedAsBase64;
};

export default ab2base64;
