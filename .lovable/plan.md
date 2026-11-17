# CabinVolt: full trust-first upgrade

## Goal
Make the existing checker a clear, evidence-backed travel reference: what was checked, what is restricted, what remains unknown, and what the traveler should do next. Preserve CabinVolt’s dark cockpit identity, amber accent, existing fonts, and safety-first uncertainty. This is a phased upgrade, not a replacement with a generic directory or a new visual brand.

## Baseline and limits
- The current application calculates locally from a static registry; it is not a live recall or policy service. During the tested checker flow, requests went to the app and Google Fonts, with no observed submission of model or serial inputs. This does not establish hosting-log retention or all possible traffic.
- Unknown-model and serial-check examples both remained “Needs verification.” All five existing tests passed. The checker produced no browser errors in that session, and the phone viewport had no page-wide horizontal overflow.
- Airline, recall, calculator, methodology, and sources pages returned successfully with distinct titles and descriptions. This is not a complete accessibility, source-accuracy, performance, or security certification.
- The uploaded review includes proposals and observations about an earlier package. Audit actual behavior before treating each statement as a defect. Do not add fake live-lookup status, new review dates, or claimed regulatory verification.

## Phase 1 — Audit evidence and remove unsupported certainty
1. Inventory every source, affected model, notice, and airline rule; reconcile duplicated notices and distinguish model counts from recall-event counts.
2. Verify official documents for recall scope, capacity, quantity, in-flight use, and power-bank recharging. Preserve ICAO’s distinction between recharging the bank and using it to recharge a device; apply stricter documented airline conditions separately.
3. Prioritize India-route claims and every rule that currently produces a prohibition. When primary evidence cannot be obtained, identify secondary reporting and unresolved applicability; keep precautionary warnings without calling them independently verified regulatory findings.
4. Replace “Live check” with “Instant check.” State that results use a dated dataset, not current external searches. Explain app release, dataset publication, document publication/effective dates, and actual verification dates separately.
5. Replace blanket privacy claims with observed implementation facts, including external fonts and official links. Do not promise absence of hosting logs without checking hosting behavior.

**Exit gate:** each restriction has an evidence record or is explicitly flagged for verification; no unsupported current/official/cleared claims remain. Record unavailable documents as open evidence issues rather than fabricating certainty.

## Phase 2 — Strengthen the deterministic decision engine
1. Keep all decisions in the existing single rule engine. Add strict types and input validation, replacing unchecked dynamic assumptions.
2. Return separate recall, capacity, quantity, carriage, onboard-use, recharging, and airline-evidence states, alongside overall restriction / approval required / incomplete / no restriction identified in checked rules.
3. Link every finding to the exact supporting rule, scope, dates, evidence quality, and next action. Keep “no match in checked notices” distinct from “not recalled,” and capacity compliance distinct from flight clearance.
4. Evaluate freshness per rule using a documented review interval, rather than deriving it only from the app edition. Separate conflicting evidence from conflicting capacity inputs. Explicit restrictions remain visible; unresolved applicability remains verification, not clearance or a fabricated ban.
5. Evaluate every operating carrier in a connecting itinerary. Show which segment imposes each condition; never silently substitute the marketing carrier.

**Exit gate:** concrete tests cover every published decision rule, exact and exclusive capacity thresholds, quantity limits, serial length/prefix, manufacture dates, seller/condition scope, unknown and ambiguous models, missing/invalid inputs, rating conflicts, stale evidence, and carrier conflicts. A passing capacity check cannot hide a recall or unresolved eligibility.

## Phase 3 — Rebuild the traveler’s checker flow
1. Make the checker and result the dominant adjacent desktop experience; put the result directly below the form on phones. Keep the brand prominent and reduce competing counters and uppercase labels.
2. Provide keyboard-accessible model suggestions with manufacturer identity and explicit selection. Exact matches may be recognized; similar identifiers must never be silently substituted.
3. Add “I don’t know my model” and a clear label-location illustration. Reveal capacity when it is unknown and only ask for serial, manufacture date, purchase channel, or unit conditions when those answers affect eligibility. The current engine supports several of these inputs that the form does not expose.
4. Allow operating carriers for connecting flights and clear route applicability without collecting unnecessary itinerary details.
5. Show one overall headline, a short explanation, the next relevant action, independent checks, and dated evidence links. Use warning icons and text; red means an actual hazard or restriction, not merely missing information.
6. Add a compact printable packing summary and official-policy links. Any optional share link excludes serial numbers and personal itinerary details; unresolved checks remain visible in the summary.

**Exit gate:** real unknown-model, serial-based recall, explicit ban, approval-required, and connecting-carrier flows work by keyboard on desktop and phone, without clipping or disruptive focus changes.

## Phase 4 — Editorial credibility and usable reference pages
1. Standardize evidence presentation across results, airline pages, recall pages, Method, and Sources: issuer, document title, supporting excerpt, applicability, publication/effective dates, actual verification date, and limitations.
2. Add a correction policy, evidence-change history, coverage boundaries, and record-specific report-error action. Request the real publisher/editor identity and reporting destination; do not invent names, contact details, or endorsements.
3. Keep useful distinct model and airline pages; do not generate thin combinations solely for search traffic. Validate every content route’s unique title, description, Open Graph fields, and Twitter card. Add a sitemap and canonical URLs only after the intended public URL is known.
4. Add reduced-motion behavior, associated field labels, meaningful error messages, accessible gauges, focus indicators, and non-color-only status presentation. Use existing semantic tokens and shared controls, consolidating duplicated form patterns.
5. Measure representative mobile performance and document actual results. Optimize fonts, animation, rendering, and loading based on those measurements, not a claimed “100×” improvement.

**Exit gate:** all content routes, critical keyboard flows, mobile layouts, metadata, and internal links are checked; remaining manual screen-reader and field-performance verification is explicitly documented.

## Phase 5 — Review operations, monitoring, and recovery
Start with the static, version-controlled approach; it needs no new account system just to make the checker trustworthy.
1. Add registry validation and automated regression checks before dataset changes can ship. Keep source hashes or permitted snapshots, material-change records, and reviewed dataset versions.
2. Document who reviews changed evidence, how proposed changes are approved, how stale/broken sources are flagged, and how a previous reviewed release is restored. Test recovery in a non-production context.
3. Add scheduled link/change checks and failure reporting where the connected repository or hosting supports them; source changes create review tasks, never automatic safety verdicts.
4. If live recall lookup or multi-editor management is later needed, enable Lovable Cloud only for that scope. Add authenticated editorial access and MFA, input validation, rate limits, timeouts, and explicit current/cached/unavailable states. Upstream failure must never mean “no recall.” Keep AI extraction as a review aid, never an autonomous publisher.

**Exit gate:** checks detect an intentionally invalid dataset and broken source; a prior reviewed dataset can be restored; any live service has tested failure behavior and accurate privacy disclosures.

## Phase 6 — Release and sustainable expansion
1. Finish evidence, test, accessibility, privacy, performance, and recovery gates before announcing the upgrade as launch-ready. Document unresolved evidence items honestly.
2. Prepare repository documentation and automation for the user’s douphealth account. Git connection is performed in Lovable’s Project settings → Git; connecting creates a new private repository. Do not claim an existing Git connection or repository was verified from local files.
3. Publish only on explicit request. Validate the deployed app and metadata after release; a local preview check is not proof of deployed behavior.
4. Restore Greek-language parity and dependable offline access only after core rules and evidence states stabilize. Expand airline/recall coverage at a maintainable review cadence. Treat live recall lookup as the separately scoped service described above.

## Technical implementation
- Preserve TanStack Start routing and the static registry evaluated by `src/lib/logic.ts`; extend its result contract rather than introducing parallel decision engines.
- Evolve the JSON into linked source documents, recall events, affected-model scopes, and airline rules using stable IDs. Keep versioned fixtures and an adapter during migration so existing pages continue to work.
- Each rule records issuer, source, supporting excerpt, publication/effective dates where known, last verified date, review status, applicability, structured conditions, and dataset version. Unknown dates remain null; legacy dates are not automatically promoted into verification dates.
- Keep browser-safe deterministic evaluation independent of network services. Source ingestion and editorial tools, if introduced, remain separate from verdict computation.
- Organize tests into rule-specific cases, data-integrity checks, route checks, and browser flows. Add network failure tests only when a lookup service actually exists.
- Follow platform runtime, authentication, and schema guidance before implementing any server-side additions. Record structural changes in `AGENTS.md` and maintain a lean `roadmap.md` during implementation.

## Deliverables and dependencies
Deliver in the phase order above, with a verified checkpoint after each phase. The first approved implementation phase is the evidence audit and truthful wording, not a simultaneous rewrite of every feature.

Required later: authoritative source access; real publisher/editor and correction details; intended public URL; user-controlled Git connection; and explicit permission for publishing or any optional Cloud service. Missing evidence never blocks honest uncertainty, but it does block a claim of independently verified clearance.