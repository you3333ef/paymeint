import { FileLock } from '@/types';

interface LockMap {
  [filePath: string]: FileLock;
}

class FileLockManager {
  private locks: LockMap = {};
  private userId: string;
  private userName: string;

  constructor(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;
  }

  acquireLock(filePath: string): boolean {
    if (this.locks[filePath]) {
      return false;
    }

    this.locks[filePath] = {
      filePath,
      userId: this.userId,
      userName: this.userName,
      timestamp: new Date(),
    };

    return true;
  }

  releaseLock(filePath: string): boolean {
    if (!this.locks[filePath]) {
      return false;
    }

    if (this.locks[filePath].userId !== this.userId) {
      return false;
    }

    delete this.locks[filePath];
    return true;
  }

  forceReleaseLock(filePath: string, forceUserId: string): boolean {
    if (this.locks[filePath]?.userId === forceUserId) {
      delete this.locks[filePath];
      return true;
    }
    return false;
  }

  getLock(filePath: string): FileLock | null {
    return this.locks[filePath] || null;
  }

  getAllLocks(): FileLock[] {
    return Object.values(this.locks);
  }

  isLockedByUser(filePath: string, userId: string): boolean {
    return this.locks[filePath]?.userId === userId;
  }

  getUserLocks(userId: string): FileLock[] {
    return Object.values(this.locks).filter(lock => lock.userId === userId);
  }

  clearAllLocks(): void {
    this.locks = {};
  }

  getLockInfo(filePath: string): {
    isLocked: boolean;
    lockedByCurrentUser: boolean;
    lockInfo: FileLock | null;
  } {
    const lock = this.getLock(filePath);
    return {
      isLocked: !!lock,
      lockedByCurrentUser: lock?.userId === this.userId,
      lockInfo: lock,
    };
  }
}

export const fileLockManager = new FileLockManager('current-user-id', 'Current User');

export const acquireFileLock = async (filePath: string): Promise<boolean> => {
  return fileLockManager.acquireLock(filePath);
};

export const releaseFileLock = async (filePath: string): Promise<boolean> => {
  return fileLockManager.releaseLock(filePath);
};

export const getFileLockInfo = (filePath: string) => {
  return fileLockManager.getLockInfo(filePath);
};

export const getAllLocks = (): FileLock[] => {
  return fileLockManager.getAllLocks();
};
