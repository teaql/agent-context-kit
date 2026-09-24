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

## Status

The first implementation includes:

- the [V1 protocol specification](docs/protocol-v1.md);
- a strict parser with diagnostics;
- session block state and audit events;
- consume-once ephemeral message handling;
- a Pi extension adapter;
- protocol and adapter conformance tests;
- and a real Pi runtime integration test with a provider-boundary context trace.

## Install in Pi

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
