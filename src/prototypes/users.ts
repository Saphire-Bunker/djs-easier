import { APIUser, Collection, User, UserManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings, replaceMentionCharacters, serializeRegExp, to_snake_case } from "../utils";
import { createBroadcastedUser } from "../utils/shardUtils";

export class Users {
  declare cache: UserManager["cache"];
  declare client: UserManager["client"];

  constructor() {
    Object.defineProperties(UserManager.prototype, {
      getById: { value: this.getById },
      getByGlobalName: { value: this.getByGlobalName },
      getByUsername: { value: this.getByUsername },
      getByDisplayName: { value: this.getByDisplayName },
      getInShardsById: { value: this.getInShardsById },
      getInShardsByDisplayName: { value: this.getInShardsByDisplayName },
      getInShardsByGlobalName: { value: this.getInShardsByGlobalName },
      getInShardsByUsername: { value: this.getInShardsByUsername },
      searchBy: { value: this.searchBy },
      _searchByMany: { value: this._searchByMany },
      _searchByRegExp: { value: this._searchByRegExp },
      _searchByString: { value: this._searchByString },
    });
  }

  /** @DJSProtofy */
  getById(id: string) {
    return this.cache.get(id);
  }

  /** @DJSProtofy */
  getByDisplayName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(user => {
      if (typeof name === "string") {
        return compareStrings(user.displayName, name);
      }

      return name.test(user.displayName);
    });
  }

  /** @DJSProtofy */
  getByGlobalName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(user => {
      if (user.globalName === null) return false;

      if (typeof name === "string") {
        return compareStrings(user.globalName, name);
      }

      return name.test(user.globalName);
    });
  }

  /** @DJSProtofy */
  getByUsername(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(user => {
      if (typeof name === "string") {
        return compareStrings(user.username, name);
      }

      return name.test(user.username);
    });
  }

  /** @DJSProtofy */
  getInShardsById(id: string): Promise<User | null>;
  getInShardsById(id: string, allowApiUser: true): Promise<APIUser | User | null>;
  async getInShardsById(id: string, allowApiUser?: boolean) {
    if (typeof id !== "string") return null;

    const existing = this.getById(id);
    if (existing) return existing;

    if (!this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.users.getById(id), { context: id })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? createBroadcastedUser(this.client, data)
        ?? (allowApiUser ? to_snake_case(data) : null) : null)
      .catch(() => null);
  }

  /** @DJSProtofy */
  getInShardsByDisplayName(name: string | RegExp): Promise<User | null>;
  getInShardsByDisplayName(name: string | RegExp, allowApiUser: true): Promise<APIUser | User | null>;
  async getInShardsByDisplayName(name: string | RegExp, allowApiUser?: boolean) {
    if (typeof name !== "string" && !isRegExp(name)) return null;

    const existing = this.getByDisplayName(name);
    if (existing) return existing;

    if (!this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.users.getByDisplayName(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? createBroadcastedUser(this.client, data)
        ?? (allowApiUser ? to_snake_case(data) : null) : null)
      .catch(() => null);
  }

  /** @DJSProtofy */
  getInShardsByGlobalName(name: string | RegExp): Promise<User | null>;
  getInShardsByGlobalName(name: string | RegExp, allowApiUser: true): Promise<APIUser | User | null>;
  async getInShardsByGlobalName(name: string | RegExp, allowApiUser?: boolean) {
    if (typeof name !== "string" && !isRegExp(name)) return null;

    const existing = this.getByDisplayName(name);
    if (existing) return existing;

    if (!this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.users.getByGlobalName(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? createBroadcastedUser(this.client, data)
        ?? (allowApiUser ? to_snake_case(data) : null) : null)
      .catch(() => null);
  }

  /** @DJSProtofy */
  getInShardsByUsername(name: string | RegExp): Promise<User | null>;
  getInShardsByUsername(name: string | RegExp, allowApiUser: true): Promise<APIUser | User | null>;
  async getInShardsByUsername(name: string | RegExp, allowApiUser?: boolean) {
    if (typeof name !== "string" && !isRegExp(name)) return null;

    const existing = this.getByDisplayName(name);
    if (existing) return existing;

    if (!this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.users.getByUsername(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? createBroadcastedUser(this.client, data)
        ?? (allowApiUser ? to_snake_case(data) : null) : null)
      .catch(() => null);
  }

  /** @DJSProtofy */
  searchBy<T extends string>(query: T): User | undefined;
  searchBy<T extends RegExp>(query: T): User | undefined;
  searchBy<T extends Search>(query: T): User | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): User | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, User>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return typeof query.id === "string" && this.cache.get(query.id) ||
      this.cache.find(user =>
        typeof query.displayName === "string" && compareStrings(query.displayName, user.displayName) ||
        isRegExp(query.displayName) && query.displayName.test(user.displayName) ||
        typeof query.username === "string" && compareStrings(query.username, user.username) ||
        isRegExp(query.username) && query.username.test(user.username) ||
        typeof user.globalName === "string" && (
          typeof query.globalName === "string" && compareStrings(query.globalName, user.globalName) ||
          isRegExp(query.globalName) && query.globalName.test(user.globalName)
        ));
  }

  /** @DJSProtofy */
  protected _searchByMany(queries: (string | RegExp | Search)[]) {
    const cache: this["cache"] = new Collection();
    for (const query of queries) {
      const result = this.searchBy(query);
      if (result) cache.set(result.id, result);
    }
    return cache;
  }

  /** @DJSProtofy */
  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((user) =>
      query.test(user.displayName) ||
      query.test(user.username) ||
      (typeof user.globalName === "string" && query.test(user.globalName)));
  }

  /** @DJSProtofy */
  protected _searchByString(query: string) {
    query = replaceMentionCharacters(query);
    return this.cache.get(query) ??
      this.cache.find((user) => [
        user.displayName?.toLowerCase(),
        user.globalName?.toLowerCase(),
        user.username?.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string
  displayName?: string | RegExp
  globalName?: string | RegExp
  username?: string | RegExp
}
