# Agent compatibility

This table is capability-based. “Plugin exists” and “the host can enforce V1”
are deliberately separate claims.

| Agent | Packaging documented | Request-local history rewrite | Project status |
| --- | --- | --- | --- |
| Pi | Extension package | Yes, `context` transform | Full V1 adapter |
| DeepSeek Harness | Cordis function plugin | Yes, durable message projections plus prompt sections | V1 adapter; trusted source must remain available when resuming |
| Gemini CLI | Extension with `hooks/hooks.json` | Text-only `BeforeModel` request view | Supported for text messages; non-text tool payloads are outside the stable hook API |
| Codex | Agent Plugin | No; `UserPromptSubmit` only adds context | Installable protocol skill; runtime enforcement not claimed |
| Claude Code | Plugin | No arbitrary pre-model history replacement | Installable protocol skill; runtime enforcement not claimed |
| Cursor | Plugin | No arbitrary pre-model history replacement | Installable protocol skill; runtime enforcement not claimed |
| Antigravity | Skills, rules, workflows | No documented per-model request rewrite hook found | Skipped |
| WorkBuddy | Skills, experts, connectors | No documented per-model request rewrite hook found | Skipped |

## Runtime limits and skipped hosts

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
