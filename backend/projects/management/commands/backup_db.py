from datetime import datetime, timezone
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import connection


class Command(BaseCommand):
    help = "Write a transactionally consistent snapshot of the SQLite database."

    def add_arguments(self, parser):
        parser.add_argument(
            "--output",
            help="Destination file (default: backups/db-<UTC timestamp>.sqlite3)",
        )

    def handle(self, *args, **options):
        if connection.vendor != "sqlite":
            raise CommandError(
                f"backup_db only supports SQLite databases, not {connection.vendor}."
            )

        if options["output"]:
            dest = Path(options["output"]).expanduser().resolve()
        else:
            stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
            dest = Path(settings.BACKUP_DIR) / f"db-{stamp}.sqlite3"

        if dest.exists():
            raise CommandError(f"{dest} already exists, refusing to overwrite.")

        dest.parent.mkdir(parents=True, exist_ok=True)

        # VACUUM INTO produces a defragmented, self-consistent copy (WAL included)
        # without stopping the server. The path is inlined rather than bound
        # because VACUUM INTO is not supported with bound parameters everywhere.
        quoted = str(dest).replace("'", "''")
        with connection.cursor() as cursor:
            cursor.execute(f"VACUUM INTO '{quoted}'")

        size = dest.stat().st_size
        self.stdout.write(
            self.style.SUCCESS(f"Backup written: {dest} ({size / 1024:.1f} KiB)")
        )
