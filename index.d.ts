/* eslint-disable no-var */
import type { EnumLike, MessageFlags } from "discord.js";
import type { setTimeout } from "timers/promises";
import type { DiscordStringLimits } from "./src/@enum";
import type { AwaitOptions } from "./src/@types";
import type { SApplicationCommand } from "./src/prototypes/applicationCommand";
import type { ApplicationCommands } from "./src/prototypes/applicationCommands";
import type { SArray } from "./src/prototypes/array";
import type { SBaseInteraction } from "./src/prototypes/baseInteraction";
import type { Channels } from "./src/prototypes/channels";
import type { SClient } from "./src/prototypes/client";
import type { SCollection } from "./src/prototypes/collection";
import type { SEmbed } from "./src/prototypes/embed";
import type { SEmbedBuilder } from "./src/prototypes/embedBuilder";
import type { Emojis } from "./src/prototypes/emojis";
import type { GuildBans } from "./src/prototypes/guildBans";
import type { GuildChannels } from "./src/prototypes/guildChannels";
import type { GuildEmojis } from "./src/prototypes/guildEmojis";
import type { SGuildMember } from "./src/prototypes/guildMember";
import type { GuildMembers } from "./src/prototypes/guildMembers";
import type { GuildMessages } from "./src/prototypes/guildMessages";
import type { Guilds } from "./src/prototypes/guilds";
import type { SMessage } from "./src/prototypes/message";
import type { Messages } from "./src/prototypes/messages";
import type { Roles } from "./src/prototypes/roles";
import type { SSet } from "./src/prototypes/set";
import type { SShardClientUtil } from "./src/prototypes/shardClientUtil";
import type { SString } from "./src/prototypes/string";
import type { Users } from "./src/prototypes/users";

export * from "./src";

declare module "discord.js" {
  interface ApplicationCommand extends SApplicationCommand { }

  interface ApplicationCommandManager<
    ApplicationCommandScope = ApplicationCommand<{ guild: GuildResolvable; }>,
    PermissionsOptionsExtras = { guild: GuildResolvable; },
    PermissionsGuildType = null
  > extends ApplicationCommands<
    ApplicationCommandScope,
    PermissionsOptionsExtras,
    PermissionsGuildType,
  > { }

  interface BaseGuildEmojiManager extends Emojis { }

  interface BaseInteraction extends SBaseInteraction { }

  interface ChannelManager extends Channels { }

  interface Client<Ready> extends SClient<Ready> {
    awaitReady(): Promise<this is Client<true>>;
    awaitReady(options: AwaitOptions): Promise<this is Client<true>>;
  }

  interface Embed extends SEmbed { }

  interface EmbedBuilder extends SEmbedBuilder { }

  interface GuildBanManager extends GuildBans { }

  interface GuildChannelManager extends GuildChannels { }

  interface GuildEmojiManager extends GuildEmojis { }

  interface GuildMember extends SGuildMember { }

  interface GuildMemberManager extends GuildMembers { }

  interface GuildMessageManager extends GuildMessages { }

  interface GuildManager extends Guilds { }

  interface Message extends SMessage { }

  interface MessageManager extends Messages { }

  interface RoleManager extends Roles { }

  interface ShardClientUtil extends SShardClientUtil { }

  interface UserManager extends Users { }

  interface Collection<K, V> extends SCollection<K, V> { }
}

declare global {
  /** @DJSProtofy */
  var animated: true;
  /** @DJSProtofy */
  var disabled: true;
  /**
   * @DJSProtofy
   * @deprecated Supplying `ephemeral` for interaction response options is deprecated. Utilize flags instead.
   */
  var ephemeral: true;
  /**
   * @DJSProtofy 
   * @deprecated Supplying `fetchReply` for interaction response options is deprecated. Utilize `withResponse` instead or fetch the response after using the method.
   */
  var fetchReply: true;
  /**
   * @DJSProtofy
   * @description Shortcut for the `MessageFlags#Ephemeral` flag
   */
  var flags: MessageFlags.Ephemeral
  /** @DJSProtofy */
  var inline: true;
  /** @DJSProtofy */
  var required: true;
  /** @DJSProtofy */
  var withResponse: true;

  /** @DJSProtofy */
  declare function sleep<T = void>(...args: Parameters<typeof setTimeout<T>>): ReturnType<typeof setTimeout<T>>;

  interface Array<T> extends SArray<T> {
    random(): T
    random(amount: number): T[]
    random(amount: number, denyDuplicates: boolean): T[]
    random(amount: any): T;
  }

  interface Set<T> extends SSet<T> { }

  interface String extends SString {
    limit<T extends typeof DiscordStringLimits>(size: keyof T | T[keyof T], enumLike?: T): string
    limit<T extends EnumLike>(size: keyof T | T[keyof T] | number, enumLike: T): string
    limit(size: number): string
  }
}
