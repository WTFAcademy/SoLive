function randomBool() {
  return Math.random() < 0.5;
}

function randomInteger() {
  return Math.floor(Math.random() * 100);
}

export function randomByte() {
  return Math.floor(Math.random() * 256);
}
function randomBytes32() {
  const characters = '0123456789abcdef';
  let bytes32 = '0x';
  for (let i = 0; i < 64; i++) {
    bytes32 += characters[Math.floor(Math.random() * characters.length)];
  }
  return bytes32;
}

function randomAddress() {
  const characters = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += characters[Math.floor(Math.random() * characters.length)];
  }
  return address;
}

function randomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let string = '';
  const length = Math.floor(Math.random() * 10) + 1;
  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return string;
}

// TODO add all solidity type default values.
export default function randomSolidityValue(type:string) {
  let value = null;
  if (type === 'bool') {
    value = randomBool();
  }
  if (type.includes('int') || type.includes('uint')) {
    value = randomInteger();
  }

  if (type.includes('bytes32')) {
    value = randomBytes32();
  }

  if (type === 'address') {
    value = randomAddress();
  }

  if (type === 'string') {
    value = randomString();
  }

  if (type.includes('[]')) {
    value = [value];
  }
  return value;
}
