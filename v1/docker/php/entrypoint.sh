#!/bin/sh
set -e

echo "⏳ Aguardando MySQL em ${DB_HOST:-mysql}:${DB_PORT:-3306}..."

until php -r '
try {
    $dsn = sprintf("mysql:host=%s;port=%s;dbname=%s", getenv("DB_HOST") ?: "mysql", getenv("DB_PORT") ?: "3306", getenv("DB_NAME") ?: "convite");
    new PDO($dsn, getenv("DB_USER") ?: "convite", getenv("DB_PASS") ?: "convite_secret", [PDO::ATTR_TIMEOUT => 3]);
    exit(0);
} catch (Exception $e) {
    exit(1);
}
' 2>/dev/null; do
    sleep 2
done

echo "✅ MySQL disponível."

# Gera senha admin se não existir
if [ -f /var/www/html/seed.php ]; then
    php /var/www/html/seed.php
fi

echo "🚀 Iniciando PHP-FPM..."
exec php-fpm
