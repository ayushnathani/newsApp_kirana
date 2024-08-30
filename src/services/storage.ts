import {MMKV} from 'react-native-mmkv';
import {NewsArticle} from '../helpers/types';

const mmkvStorage = new MMKV({
  id: 'news_app_user',
  encryptionKey: 'KiranaClub@1234',
});

export type StoredData = {
  newsData: NewsArticle[];
};

interface StorageInterface {
  get: <K extends keyof StoredData>(Key: K) => StoredData[K] | undefined;
  set: <K extends keyof StoredData>(Key: K, value: StoredData[K]) => void;
  delete: <K extends keyof StoredData>(key: K) => void;
  clear: () => void;
}

class Storage implements StorageInterface {
  private mmkvInstance: MMKV;

  constructor(instance: MMKV) {
    this.mmkvInstance = instance;
  }

  get<K extends keyof StoredData>(key: K): StoredData[K] | undefined {
    try {
      const isKeyPresent = this.mmkvInstance.contains(key);

      if (!isKeyPresent) {
        return;
      }

      const value = this.mmkvInstance.getString(key);
      if (!value) {
        return;
      }
      return JSON.parse(value);
    } catch (e) {
      console.error('Error while fetching data from local storage', e);
    }
  }

  set<K extends keyof StoredData>(key: K, value: StoredData[K]) {
    try {
      if (!value) {
        return null;
      }

      this.mmkvInstance.set(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error while fetching the value', e);
    }
  }

  delete(key: keyof StoredData) {
    try {
      this.mmkvInstance.delete(key);
    } catch (e) {
      console.error(`Error while deleting ${key}`);
    }
  }

  clear() {
    try {
      this.mmkvInstance.clearAll();
    } catch (e) {
      console.error('Error while clearing storage');
    }
  }
}

export const SyncStorage = new Storage(mmkvStorage);
