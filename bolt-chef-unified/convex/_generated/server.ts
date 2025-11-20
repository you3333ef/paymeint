import type {
  ActionBuilder,
  MutationBuilder,
  QueryBuilder,
} from "convex/server";

export type DatabaseReader<T extends string = string> = {
  get: (id: any) => Promise<any>;
  list: () => Promise<any[]>;
};

export type DatabaseWriter = {
  insert: (tableName: string, document: any) => Promise<any>;
  patch: (id: any, updates: Partial<any>) => Promise<void>;
  replace: (id: any, document: any) => Promise<void>;
  delete: (id: any) => Promise<void>;
};

export type QueryCtx = {
  db: DatabaseReader;
  auth: any;
};

export type MutationCtx = {
  db: DatabaseWriter & DatabaseReader;
  auth: any;
};

export type ApiFromModules<M extends object> = {
  [K in keyof M]: M[K] extends {
    (...args: any[]): Promise<any>;
  }
    ? (...args: Parameters<M[K]>) => ReturnType<M[K]>
    : never;
};
