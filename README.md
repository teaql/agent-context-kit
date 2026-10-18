# agent-context-kit

`agent-context-kit` is a small, deterministic context-lifecycle protocol for
coding agents. Markdown HTML comments declare content that is visible for one
model response or remains active until a trusted workflow explicitly discards
it.

```markdown
<!--ephemeral-->
Large tool output that may be consumed once.

<!--BLOCK_ID:phase_modeling-->
Rules that remain active across requests.
<!--/BLOCK_ID:phase_modeling-->

<!--DISCARD_BLOCK:phase_modeling-->
```

V1 deliberately does not summarize, compress, rank, retrieve, or infer when a
phase is complete. It builds a request-local context view and leaves the host's
transcript and Markdown sources unchanged.

<table>
  <tr>
    <td align="center"><a href="#codex"><img src="assets/coding-agents/codex.svg" width="56" height="56" alt="Codex"><br>Codex</a></td>
    <td align="center"><a href="#claude-code"><img src="assets/coding-agents/claude-code.svg" width="56" height="56" alt="Claude Code"><br>Claude Code</a></td>
    <td align="center"><a href="#cursor"><img src="assets/coding-agents/cursor.svg" width="56" height="56" alt="Cursor"><br>Cursor</a></td>
    <td align="center"><a href="#gemini-cli"><img src="assets/coding-agents/gemini-cli.svg" width="56" height="56" alt="Gemini CLI"><br>Gemini CLI</a></td>
  </tr>
  <tr>
    <td align="center"><a href="#pi"><img src="assets/coding-agents/pi.svg" width="56" height="56" alt="Pi"><br>Pi</a></td>
    <td align="center"><a href="#opencode"><img src="assets/coding-agents/opencode.svg" width="56" height="56" alt="OpenCode"><br>OpenCode</a></td>
    <td align="center"><a href="#mimo-code"><img src="assets/coding-agents/mimocode.svg" width="56" height="56" alt="MiMo Code"><br>MiMo Code</a></td>
    <td align="center"><a href="#deepseek-harness"><img src="assets/coding-agents/deepseek-harness.svg" width="56" height="56" alt="DeepSeek Harness"><br>DeepSeek Harness</a></td>
  </tr>
</table>

The coding-agent tiles match the companion
[TeaQL Agent Kit](https://github.com/teaql/teaql-agent-kit). OpenCode, MiMo
Code, and DeepSeek use the same licensed Lobe Icons source and tile treatment;
Pi uses the mascot geometry and color documented by its MIT-licensed project.
Every agent listed as supported below now has a tile.

## Supported agents

Support is split by what each host can enforce at the model-request boundary:

| Support tier | Agents | What is supported |
| --- | --- | --- |
| Full V1 runtime | **Pi**, **OpenCode** | Persistent blocks, trusted discard, consume-once ephemeral messages, and protected-read feedback |
| Runtime with host limits | **Gemini CLI**, **DeepSeek Harness**, **MiMo Code** | Gemini CLI is text-only; DeepSeek Harness uses durable projections; MiMo Code relies on officially typed but experimental message-transform hooks |
| Installable protocol plugin | **Codex**, **Claude Code**, **Cursor** | Protocol authoring and integration guidance; full runtime enforcement is not claimed |
| Evaluated, not currently supported | Antigravity, WorkBuddy | No documented request-history rewrite API, so no package is published |

In short, runtime adapters are available for **Pi**, **OpenCode**, **MiMo
Code**, **Gemini CLI**, and **DeepSeek Harness**. Installable guidance plugins
are available for **Codex**, **Claude Code**, and **Cursor**. See the
[compatibility matrix](docs/compatibility.md) for the exact host constraints.

## Status

The implementation includes:

- the [V1 protocol specification](docs/protocol-v1.md);
- a strict parser with diagnostics;
- session block state and audit events;
- consume-once ephemeral message handling;
- a configurable cross-host read guard that redirects protected
  generated-library reads to TeaQL workspace context;
- a Pi extension adapter;
- an OpenCode V1/V2 package plugin with request-local context and read guards;
- a MiMo Code file plugin with request-local context and cancellable read guards;
- a Gemini CLI extension adapter for the stable text-message hook API;
- a DeepSeek Harness function plugin with durable ephemeral projections;
- installable Codex, Claude Code, and Cursor protocol-guidance plugins;
- an evidence-based compatibility matrix for Claude Code, Cursor,
  Antigravity, and WorkBuddy;
- protocol and adapter conformance tests;
- and a real Pi runtime integration test with a provider-boundary context trace.

## Installation

The installable package does not imply identical runtime capabilities. Check
the support tiers above before relying on consume-once behavior on a host with
documented limits.

### Pi

Pi 0.85 or later and Node.js 22.19 or later are required. Install the package
for your user account directly from GitHub:

```bash
pi install git:github.com/teaql/agent-context-kit
```

The package manifest automatically loads `src/adapters/pi.ts`; no manual
`--extension` flag is needed on later runs. Confirm that Pi registered the
package, then start Pi normally:

```bash
pi list
pi
```

To install it only for the current project, run this from the project root:

```bash
pi install git:github.com/teaql/agent-context-kit -l
```

This writes the package source to `.pi/settings.json`. Pi will ask you to trust
the project before it loads project-local extensions. Teammates who share that
settings file get the missing package on startup after granting project trust.

To try the extension for one Pi run without changing settings:

```bash
pi -e git:github.com/teaql/agent-context-kit
```

For local development, point Pi at a checkout instead:

```bash
pi install /absolute/path/to/agent-context-kit
```

After installation, put a strict block declaration in a trusted Pi context
file such as `AGENTS.md`:

```markdown
<!--BLOCK_ID:phase_modeling-->
Keep these modeling rules active across model requests.
<!--/BLOCK_ID:phase_modeling-->
```

Discard it explicitly from Pi when the phase is complete:

```text
/context-discard phase_modeling
```

Remove the user-level GitHub installation with:

```bash
pi remove git:github.com/teaql/agent-context-kit
```

Pi packages execute with the current user's permissions. Review an extension's
source before installing it.

#### Protect generated libraries from reads

Add `.agent-context-kit.json` to the workspace when TeaQL already supplies the
business context and Pi should not scan generated libraries:

```json
{
  "readGuard": {
    "paths": ["generated/library"],
    "message": "This is generated content. TeaQL workspace context already provides the complete business model; use that context instead.",
    "bashMode": "literal"
  }
}
```

The Pi extension blocks matching `read`, `ls`, `grep`, and `find` calls and
returns the configured guidance to the model. Shell handling is configurable;
OpenShell can provide the non-bypassable filesystem boundary. See the
[read-guard guide](docs/read-guard.md) for configuration, limitations, and an
OpenShell allowlist example.

### Gemini CLI

Install directly from GitHub, then restart Gemini CLI:

```bash
gemini extensions install https://github.com/teaql/agent-context-kit
```

Confirm it is enabled with `/extensions list`. The bundled `BeforeModel` hook
handles the stable text-message view; Gemini CLI does not expose non-text tool
payloads to this hook. See the [Gemini CLI adapter guide](docs/gemini-cli-adapter.md).

### DeepSeek Harness

Clone the repository and register its function plugin in a Harness overlay:

```bash
git clone https://github.com/teaql/agent-context-kit.git
```

```yaml
- insert:
    - id: agent-context-kit
      name: '/absolute/path/to/agent-context-kit/src/adapters/deepseek-harness.ts'
```

Start Harness with that overlay using the command appropriate to your Harness
checkout or deployment. Put trusted declarations in `.agent-context-kit.md`
at the session working directory. See the
[DeepSeek Harness adapter guide](docs/deepseek-harness-adapter.md).

### OpenCode

OpenCode V2 can install the package plugin directly from GitHub:

```bash
opencode plugin add github:teaql/agent-context-kit
```

For project-scoped installation, add `"github:teaql/agent-context-kit"` to the
`plugins` array in `opencode.jsonc`. Put trusted declarations and discards in
`.agent-context-kit.md`; the plugin removes consumed ephemeral history only in
the outgoing request. A workspace `.agent-context-kit.json` also enables the
protected-read redirect. OpenCode V2 is preferred; the package includes the
officially documented V1 compatibility entry point for OpenCode 1.18.29 or
later. See the [OpenCode adapter guide](docs/opencode-adapter.md).

### MiMo Code

MiMo Code 0.1.15 or later is required. Install this package under MiMo Code's
project configuration directory, then copy the one-line file-plugin entry:

```bash
mkdir -p .mimocode/plugins
npm install --prefix .mimocode github:teaql/agent-context-kit
cp .mimocode/node_modules/@teaql/agent-context-kit/integrations/mimocode/agent-context-kit.ts \
  .mimocode/plugins/agent-context-kit.ts
```

Restart `mimo`, and keep trusted lifecycle declarations in
`.agent-context-kit.md`. MiMo's current source scans `.mimocode/plugins/`, even
though an older public plugin page still names the upstream OpenCode path. The
adapter is therefore source-verified and marked experimental until MiMo's
public plugin documentation catches up. See the
[MiMo Code adapter guide](docs/mimocode-adapter.md).

### Codex

Add this repository as a marketplace, then open the plugin browser:

```bash
codex plugin marketplace add teaql/agent-context-kit
codex
```

Run `/plugins`, select the **TeaQL** source, and install
`agent-context-kit`. Start a new task after installation. This installs the
protocol-authoring skill; current Codex hooks cannot enforce request-local
history replacement.

### Claude Code

Add the repository marketplace and install the plugin:

```bash
claude plugin marketplace add teaql/agent-context-kit
claude plugin install agent-context-kit@teaql
```

Start a new Claude Code session. For local development without installing a
marketplace, use `claude --plugin-dir /absolute/path/to/agent-context-kit`.
This plugin supplies the protocol skill only; it does not claim full V1 runtime
enforcement.

### Cursor

Cursor's documented local-plugin directory is the most direct installation
path until this repository is published in a Cursor marketplace:

```bash
mkdir -p ~/.cursor/plugins/local
git clone https://github.com/teaql/agent-context-kit.git ~/.cursor/plugins/local/agent-context-kit
```

Restart Cursor or run **Developer: Reload Window**, then open **Customize** and
confirm `agent-context-kit` is present. Local plugin imports can be disabled by
organization policy. This installs the protocol skill, not a full lifecycle
runtime adapter.

### Antigravity and WorkBuddy

No installation is published for these hosts. Their public documentation
covers skills, rules, experts, or connectors, but not a deterministic hook that
can replace arbitrary prior messages before every model request. They remain
explicitly skipped rather than receiving a misleading partial adapter.

## Development

Node.js 22.19 or later is required.

```bash
npm install
npm test
npm run typecheck
```

### Real Pi runtime trace

Run a complete Pi session and record the exact context presented at the model
provider boundary:

```bash
npm run trace:pi
```

The command uses Pi's real `AgentSession`, extension runner, request transform,
and tool loop. It substitutes Pi's deterministic local faux provider for a
network model, so the trace is repeatable and requires no API key. The JSONL
record is written to `.artifacts/pi-context-trace.jsonl` and contains every
provider request plus a final persistent-transcript check.

The fixture produces these transitions:

| Provider request | `phase_modeling` | Ephemeral tool output |
| --- | --- | --- |
| 1 | active and visible | absent |
| 2 | active and visible | original content |
| 3 | active and visible | tombstone |
| 4, after trusted discard | absent | tombstone |

The final trace record also proves that the persistent Pi transcript still
contains the original ephemeral output and does not contain the request-local
tombstone. `npm test` runs this integration test after the unit suite.

Load the Pi extension directly while developing:

```bash
pi --extension ./src/adapters/pi.ts
```

Pi context files are treated as trusted block-definition sources. Expanded Pi
skills are trusted only when their wrapper names a skill path already present
in Pi's registered skill list. Discard directives are accepted only through
the adapter's trusted control API or `/context-discard`; ordinary user,
assistant, and tool-result messages cannot discard blocks by default.

See [the Pi adapter guide](docs/pi-adapter.md) for the trust policy and public
integration API.

## Other agents

- [Gemini CLI adapter](docs/gemini-cli-adapter.md)
- [DeepSeek Harness adapter](docs/deepseek-harness-adapter.md)
- [OpenCode adapter](docs/opencode-adapter.md)
- [MiMo Code adapter](docs/mimocode-adapter.md)
- [Capability and skip matrix](docs/compatibility.md)

The repository root also carries Codex, Claude Code, and Cursor plugin
manifests. Their shared `context-lifecycle` skill helps author and review the
protocol, but does not claim runtime lifecycle enforcement: none of those
hosts currently documents an arbitrary pre-model history replacement seam.
