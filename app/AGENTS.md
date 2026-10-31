# Listory standalone: rules for agents

Listory is a checklist app. Users keep **permanent lists**, which are reusable templates of
items. They create **checklists** by merging one or more permanent lists into a single
list they tick off. This folder is the WordPress-free rebuild:

- **Server:** PHP 8.3, SQLite and Elephentity, under `app/server/`.
- **Client:** React with tsquid, Relay, Astryx and StyleX, under `app/client/`.

`server/` (the WordPress plugin) and `client/` (the Apollo client) at the repository root
are legacy. Read them to learn existing behaviour, but never change them unless the
issue says so.

## Reference implementation

`hsimah/clog` is a finished app built the same way. In agent runs it is checked out
read-only at `.reference/clog`. When an issue says **"port from clog"**, do this:

1. Copy the named file.
2. Rename `Clog` → `Listory`, `clog` → `listory`, `CLOG_` → `LISTORY_`,
   `X-Clog-` → `X-Listory-` and `app_clog_` → `app_listory_`.
3. Delete everything that belongs to clog-only features: inventory, items, locations,
   stock, barcodes, user administration and admin flags.

Never edit anything under `.reference/`. If `.reference/clog` is missing, stop (see the
last section).

## Layout

```
app/server/spec/          Elephentity specs. The source of truth for the data model.
app/server/generated/     Generated and signed. Committed. NEVER edit by hand.
app/server/src/           Handlers, policies, queries, runtime wiring    (Listory\)
app/server/standalone/    HTTP, CLI, sessions, schema install, tests    (Listory\Standalone\)
app/client/               React client
app/scripts/              Container wrappers for local development
```

## Commands

Run server commands from `app/server/`. CI has `php` and `composer` on PATH; locally,
prefix each command with `../scripts/php.sh`.

| What | Command |
|---|---|
| Install dependencies | `composer install --no-interaction --prefer-dist` |
| Build the generators (first run, or after composer.lock changes) | `composer build-generators` |
| Format specs | `vendor/bin/eleph fmt` |
| Regenerate after a spec change | `vendor/bin/eleph generate` |
| Prove specs and generated code agree | `composer check-generated` |
| Server tests | `composer test` |

After changing client queries or routes: `npm run relay && npm run routes` in `app/client`, then `vendor/bin/eleph generate` in `app/server`, then commit both.

Run client commands from `app/client/`: `npm ci`, then `npm run check`.

## Definition of done (every PR)

1. Every command in the issue's **Acceptance criteria** passes. List each one in the PR
   body with its result.
2. If anything under `app/server/` exists, `composer check-generated` and `composer test`
   pass, and `git status` shows no uncommitted generated files.
3. The root `client/` still passes `npm run lint` and `npm run build`. The agent workflow
   checks this.
4. Only the files the issue names changed, plus `generated/`, `composer.lock` and
   `package-lock.json` when the issue's commands rewrite them.

## Data model

| Entity | Fields | Edges |
|---|---|---|
| `PermanentList` (GraphQL `ListoryList`) | `title` | inverse `items`, `checklists`, `checklistItems` |
| `ListItem` (`ListoryListItem`) | `name` | `list` → PermanentList (cascade) |
| `Checklist` (`ListoryChecklist`) | `title`, `completedAt` | `sourceLists` → PermanentList (many-to-many); inverse `items` |
| `ChecklistItem` (`ListoryChecklistItem`) | `name`, `checked` | `checklist` → Checklist (cascade), `sourceList` → PermanentList (nullify) |

`List` is a reserved word in PHP. The permanent list entity is called `PermanentList` and
must never be renamed to `List`.

## Spec standards

- Entity names are singular PascalCase and match the filename.
- Every entity has a one-line `description`, `use: [ListoryRecord]`, `storage.table` in
  snake_case, `storage.handle` set to `listory_<table>`, and `integrations.graphql` with a
  `singular` and `plural` starting with `Listory`.
- Every field has a `description`. Every `string` sets `maxLength`. Decide `required`
  (must be supplied on create) and `nullable` (the column can hold NULL) separately.
- Every `cardinality: one` edge has a `description`, an explicit `onDelete` and a named
  `inverse` (`{ name: ..., unique: false }`).
- After editing a spec, run `vendor/bin/eleph fmt` and then `vendor/bin/eleph generate`,
  and commit the spec and the generated output together.

## PHP standards

- Put `declare(strict_types=1);` in every file. One class per file, and the filename
  matches the class name.
- PSR-4 namespaces:
  - `Listory\Entity\` → `generated/`
  - `Listory\` → `src/`
  - `Listory\Standalone\` → `standalone/src/`
- Use `final readonly class` unless the class needs mutable state. Use constructor
  injection. No static mutable state, no globals.
- A handler implements the interface generated under `generated/**/Contract/`. It lives in
  `src/Contract/`, named entity + member: the `syncItems` side effect on `Checklist`
  becomes `src/Contract/ChecklistSyncItems.php`. Register every handler in
  `src/Runtime/RuntimeFactory.php`.
- Read and write entities through the runtime gateway (`create`, `find`, `update`,
  `delete`, `all`). Raw SQL belongs only in `src/Query/`, and must read table names from
  the generated SQLite manifest.
- Report a broken business rule by throwing `DomainException` with a message a user can
  read.
- Do not add Composer or npm packages unless the issue says to.

## Database during the rebuild

Nothing under `app/` is deployed yet, so there is no data to preserve. `Schema::VERSION`
stays `1`. After a spec change, delete your local `app/.standalone/*.sqlite` and run
`install` again. Do not write migrations.

## Server tests

- Tests are plain PHP scripts in `app/server/standalone/tests/`, listed in the `test`
  script in `composer.json`.
- Each script requires `../bootstrap.php`, uses its own `new Database(':memory:')`, and
  uses `check(bool, string)` / `fails(callable, string)` helpers like clog's tests.
- Each script prints one `PASS: <scenario>` line per scenario. Any uncaught exception
  fails the run.

## Client standards

- Read `.reference/clog/client/AGENTS.md` and `.reference/clog/client/docs/ui-standards.md`;
  they apply here unchanged.
- Use Astryx components and tokens, and StyleX for custom styles. No Tailwind, no
  hand-rolled `<div>` layout, no raw hex or px values.
- Group components by entity: `src/components/list/`, `src/components/checklist/`. Use
  relative imports. Use `import type` for types. Never use `any`.
- Declare routes in `routes.json`. A route's entrypoint owns its query, and components read
  colocated fragments. Each Relay mutation gets its own `use…Mutation.ts` file.
- Show distinct loading, empty, not-found and retryable-error states. Forms keep local
  state, disable themselves while saving, and keep the user's input when a save fails.
- The permanent-list screens mirror clog's `location` components, and the checklist
  screens mirror clog's `item` components. Copy their structure.

## Git

- One issue per PR, on branch `claude/issue-<n>`.
- Commit messages use `type: description`, where type is one of `feat`, `fix`, `build`,
  `docs`, `test`, `chore` or `refactor`.
- Never edit `.github/workflows/`. If an issue cannot be done without a workflow change,
  stop.

## Stop instead of guessing

Do not improvise. Comment on the issue saying exactly what blocked you, and label it
`agent:needs-human`, when any of these happens:

- A command in the Acceptance criteria fails and the fix lies outside the files the issue
  names.
- A generated class, interface or method that the issue names does not exist.
- A reference file the issue names is missing.

Never disable a lint rule, skip or weaken a test, or hand-edit `generated/` to make a
check pass.
