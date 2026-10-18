# Agent compatibility

This table is capability-based. “Plugin exists” and “the host can enforce V1”
are deliberately separate claims.

| Agent | Packaging documented | Request-local history rewrite | Project status |
| --- | --- | --- | --- |
| Pi | Extension package | Yes, `context` transform | Full V1 adapter |
| OpenCode | V2 package plugin; V1 compatibility entry | Yes, request-local `context` hook in V2 and message transform in V1 | Full V1 lifecycle adapter; read guard throws before tool execution |
| MiMo Code | Project file plugin under `.mimocode/plugins/` | Yes, experimental message/system transforms | Source-verified experimental adapter; read guard uses the typed cancellation result |
| DeepSeek Harness | Cordis function plugin | Yes, durable message projections plus prompt sections | V1 adapter; trusted source must remain available when resuming |
| Gemini CLI | Extension with `hooks/hooks.json` | Text-only `BeforeModel` request view | Supported for text messages; non-text tool payloads are outside the stable hook API |
| Codex | Agent Plugin | No; `UserPromptSubmit` only adds context | Installable protocol skill; runtime enforcement not claimed |
| Claude Code | Plugin | No arbitrary pre-model history replacement | Installable protocol skill; runtime enforcement not claimed |
| Cursor | Plugin | No arbitrary pre-model history replacement | Installable protocol skill; runtime enforcement not claimed |
| Antigravity | Skills, rules, workflows | No documented per-model request rewrite hook found | Skipped |
| WorkBuddy | Skills, experts, connectors | No documented per-model request rewrite hook found | Skipped |

## Runtime limits and skipped hosts

- OpenCode V2 documents a per-session `context` hook that mutates messages and
  system instructions only for the outgoing model request. Its tool hook can
  reject a protected read before execution. V1 compatibility uses the older
  message/system transform hooks and requires OpenCode 1.18.29 or later for the
  package object entry point. See [OpenCode V2 plugins](https://dev.opencode.ai/v2/docs/build/plugins/)
  and [the V1 migration table](https://dev.opencode.ai/v2/docs/build/plugins/migrate-v1).
- MiMo Code's maintained `@mimo-ai/plugin` source types expose message/system
  transforms and a cancellable `tool.execute.before` result. The project file
  loader scans `.mimocode/plugins/`, but the public plugin guide still contains
  inherited `.opencode` paths. Support is marked experimental until the
  documentation and API stability catch up. See the
  [plugin type source](https://github.com/XiaomiMiMo/MiMo-Code/blob/main/packages/plugin/src/index.ts),
  [current config reference](https://github.com/XiaomiMiMo/MiMo-Code/blob/main/packages/opencode/src/skill/builtin/.bundle/mimocode-docs/reference/config.md),
  and [path documentation issue](https://github.com/XiaomiMiMo/MiMo-Code/issues/1151).

- Codex documents Agent Plugin packaging and lifecycle hooks, but
  `UserPromptSubmit` adds context rather than replacing the prompt or history,
  and its current post-tool hook does not expose a general updated tool-output
  field. The included Codex plugin therefore provides protocol guidance only.
  See [Codex plugins](https://developers.openai.com/plugins/concepts/plugins)
  and [Codex hooks](https://learn.chatgpt.com/docs/hooks).
- Claude Code documents plugins and lets `PostToolUse` replace the current tool
  output, but `UserPromptSubmit` cannot replace the prompt and there is no
  documented `BeforeModel` equivalent for rewriting arbitrary earlier history.
  The `.claude-plugin` manifest therefore packages the same protocol skill but
  no lifecycle hook.
  See [Claude Code plugins](https://code.claude.com/docs/en/plugins) and
  [hooks](https://code.claude.com/docs/en/hooks).
- Cursor documents hooks and Agent Plugin packaging. Its prompt hook is a
  continue/block gate, while post-tool replacement is limited to the current
  MCP output; neither is a full-history request transform. The `.cursor-plugin`
  manifest therefore packages the same protocol skill but no lifecycle hook. See
  [Cursor hooks](https://prod.cursor.com/docs/hooks) and
  [plugins](https://prod.cursor.com/docs/reference/plugins).
- Antigravity's public material documents `.agents/skills`, rules, and
  workflows, not a hook that receives and replaces every outgoing model
  request. See Google's [Antigravity skills guide](https://codelabs.developers.google.com/antigravity/how-to-create-agent-skills-for-antigravity-cli).
- WorkBuddy documents skills, experts, connectors, and Buddy Apps, but no
  equivalent request-history interception API. See
  [WorkBuddy skills](https://open.workbuddy.cn/en/docs/skill),
  [experts](https://open.workbuddy.cn/en/docs/expert), and
  [connectors](https://open.workbuddy.cn/en/docs/connector).

This is a current documented-capability decision, not a permanent rejection.
A skipped host can be added when its official API exposes a deterministic
request-local transform with enough provenance to enforce the trust boundary.
