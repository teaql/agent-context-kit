export { lifecycleSyntax, parseMarkdown } from "./parser.ts";
export { parseReadGuardConfig, ReadGuard } from "./read-guard.ts";
export { getMessageText, LifecycleSession } from "./session.ts";
export type * from "./types.ts";
export type {
	ReadGuardBashMode,
	ReadGuardConfig,
	ReadGuardDecision,
	ReadGuardRequest,
} from "./read-guard.ts";
export { createOpenCodePlugin, openCodePlugin } from "./adapters/opencode.ts";
export { createKiloCodePlugin, kiloCodePlugin } from "./adapters/kilo.ts";
export { clinePlugin, createClinePlugin } from "./adapters/cline.ts";
export { handleCommandHook } from "./adapters/command-hook.ts";
export type { CommandHookHost, CommandHookResult } from "./adapters/command-hook.ts";
export { default } from "./adapters/opencode.ts";
