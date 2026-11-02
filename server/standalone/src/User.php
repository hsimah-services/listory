<?php

declare(strict_types=1);

namespace Listory\Standalone;

use Eleph\SQLite\Database;

/** Local accounts. Usernames are case-insensitive because the column uses NOCASE collation. */
final readonly class User
{
    public function __construct(
        public string $id,
        public string $role,
        public int $sessionVersion,
    ) {}

    /** Returns the enabled account with this username, or null when none matches. */
    public static function findEnabled(Database $db, string $username): ?self
    {
        $row = $db->select('SELECT id, role, session_version FROM listory_users WHERE username = ? AND enabled = 1', [$username])[0] ?? null;
        return $row ? new self((string) $row['id'], $row['role'], (int) $row['session_version']) : null;
    }

    /** Returns the enabled account when the password matches. Disabled accounts never authenticate. */
    public static function authenticate(Database $db, string $username, string $password): ?self
    {
        $row = $db->select('SELECT id, role, session_version, password_hash FROM listory_users WHERE username = ? AND enabled = 1', [$username])[0] ?? null;
        if ($row === null || !password_verify($password, (string) $row['password_hash'])) return null;
        return new self((string) $row['id'], $row['role'], (int) $row['session_version']);
    }
}
