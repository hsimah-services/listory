<?php

declare(strict_types=1);

namespace Listory\Standalone;

use Eleph\SQLite\Database;
use RuntimeException;

/** Installs the generated entity schema. Nothing is deployed yet, so there are no upgrades. */
final class Schema
{
    public const VERSION = 1;

    public static function install(Database $db): void
    {
        $version = (int) $db->scalar('PRAGMA user_version');
        if ($version === self::VERSION) return;
        if ($version !== 0 || $db->select("SELECT name FROM sqlite_master WHERE name NOT LIKE 'sqlite_%'") !== []) {
            throw new RuntimeException('Unrecognised SQLite database. Delete the development database and run install again.');
        }
        $install = require dirname(__DIR__, 2) . '/generated/sqlite/install.php';
        // The generated installer owns its transaction.
        $install($db->pdo);
        $db->transaction(static fn () => $db->pdo->exec(<<<'SQL'
            CREATE TABLE listory_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT COLLATE NOCASE NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('reader', 'editor')),
                enabled INTEGER NOT NULL DEFAULT 1,
                session_version INTEGER NOT NULL DEFAULT 0
            )
            SQL));
        $db->pdo->exec('PRAGMA user_version = ' . self::VERSION);
    }

    public static function requireReady(Database $db): void
    {
        if ((int) $db->scalar('PRAGMA user_version') !== self::VERSION) {
            throw new RuntimeException('Run the install command before serving requests.');
        }
    }
}
