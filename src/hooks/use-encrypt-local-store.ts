import { Dispatch, SetStateAction } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const encryptSerializer = (value: unknown) => {
  const serialized = JSON.stringify(value);
  const encrypted = btoa(serialized);
  return encrypted;
};

const decryptSerializer = (value: string) => {
  const decrypted = atob(value);
  const deserialized = JSON.parse(decrypted);
  return deserialized;
};

export default function useEncryptLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>, () => void] {
  return useLocalStorage<T>(btoa(key), initialValue, {
    serializer: encryptSerializer,
    deserializer: decryptSerializer,
  });
}
