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
- a Pi extension adapter; and
- protocol and adapter conformance tests.

## Development

Node.js 22.19 or later is required.

```bash
npm install
npm test
npm run typecheck
```

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
