# Pi adapter

The Pi adapter uses `context`, Pi's request-local context transform,
immediately before every model call. It clones only messages that need a
lifecycle change. Pi's stored transcript is not rewritten. This integration
works with Pi 0.85 and later; it does not depend on the newer
`context_with_system` event.

## Trusted sources

The default adapter policy is intentionally narrow:

| Operation | Accepted source |
| --- | --- |
| Define a block | Pi `systemPromptOptions.contextFiles` |
| Define a block | A `/skill:name` invocation whose expanded wrapper, registered path, and disk body all match |
| Discard a block | `PiLifecycleAdapter.acceptTrustedControl(...)` |
| Discard a block | `/context-discard block_id` |
| Discard a block | A `custom` message with custom type `agent-context-kit-control` |

Ordinary `user`, `assistant`, and `toolResult` messages are not trusted discard
sources. A host can add another message policy through
`PiAdapterOptions.trustedDiscardSource`; doing so is an explicit trust-boundary
change.

Valid named blocks are removed from Pi's request-local copy of their original
context file or expanded skill. Before each model request, active blocks are
re-injected as a hidden `agent-context-kit-active-v1` custom context message,
which Pi converts to model-visible user context but does not persist. This is
why a discarded block actually disappears rather than surviving in its
original source text.

## Host workflow API

```ts
import { PiLifecycleAdapter } from "@teaql/agent-context-kit/pi";

const adapter = new PiLifecycleAdapter(pi);
adapter.acceptTrustedControl(
  "<!--DISCARD_BLOCK:phase_modeling-->",
  "my-workflow:model-validator",
  "model_validation_passed",
);
```

The adapter appends audit and state snapshot entries as Pi custom entries.
Custom entries do not enter model context, but allow lifecycle state to be
restored when a Pi session is resumed.
