<?php

declare(strict_types=1);

namespace Listory\Runtime;

use Eleph\Runtime\Catalogue\BootCheck;
use Eleph\Runtime\Gateway\Runtime;
use Eleph\Runtime\Gateway\UnitOfWorkFactory;
use Eleph\Runtime\Policy\ReadGate;
use Eleph\Runtime\Policy\ViewerProvider;
use Eleph\Runtime\Policy\WriteGate;
use Eleph\Runtime\Storage\StorageAdaptor;
use Eleph\Runtime\Type\NullProcessorRegistry;
use Eleph\SQLite\Database;
use Listory\Entity\Catalogue;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

/** The same generated contracts and write path serve HTTP, CLI and tests. */
final class RuntimeFactory
{
    public static function create(
        StorageAdaptor $storage,
        ViewerProvider $viewers,
        Database $database,
        LoggerInterface $logger = new NullLogger(),
    ): Runtime {
        $container = new Container();
        $catalogue = new Catalogue($container);
        $runtime = new Runtime(
            $storage,
            $catalogue,
            new UnitOfWorkFactory($storage, $catalogue, new NullProcessorRegistry(), $logger),
            new ReadGate($catalogue, $viewers, $logger),
            new WriteGate($catalogue, $viewers),
        );

        // Register handlers for generated contracts here, before the boot check.
        $container->set(\Listory\Entity\Checklist\Contract\ChecklistSyncItemsSideEffect::class, new \Listory\Contract\ChecklistSyncItems($runtime));

        (new BootCheck($catalogue, $container))->run();

        return $runtime;
    }
}
