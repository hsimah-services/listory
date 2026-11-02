# Listory

Listory is a checklist app. Keep reusable **permanent lists**, then merge one or more of
them into a **checklist** you tick off.

PHP 8.3, SQLite and Elephentity on the server, React with tsquid, Relay and Astryx in the
client. Agents and contributors follow `AGENTS.md`.

## Develop locally

The scripts in `scripts/` run PHP, Composer, Rust and Node in throwaway containers, so the
host only needs podman or docker. Run each step from the repository root.

1. Install the PHP dependencies:

   ```sh
   scripts/php.sh composer install
   ```

2. Build the Elephentity generators. Repeat this whenever `server/composer.lock` changes:

   ```sh
   scripts/php.sh composer build-generators
   ```

3. Install and build the client:

   ```sh
   scripts/node.sh npm ci
   scripts/node.sh npm run build
   ```

4. Create the SQLite database in `.standalone/`:

   ```sh
   scripts/dev.sh install
   ```

5. Add a user. The password is read from stdin, and the role is `reader` or `editor`:

   ```sh
   scripts/dev.sh user:add alice editor
   ```

6. Serve the app at <http://localhost:18474>:

   ```sh
   scripts/dev.sh
   ```

   Set `LISTORY_DEV_PORT` to use a different port.

To run the browser tests against a disposable, seeded database, use
`scripts/test-browser.sh`.
