#!/bin/sh
# Build every Elephentity Rust generator that Composer installed. Run from app/server.
set -eu

for package_dir in vendor/elephentity/codegen*/; do
    [ -f "$package_dir/Cargo.toml" ] || continue
    cargo build --release --locked \
        --manifest-path "$package_dir/Cargo.toml" \
        --target-dir "$package_dir/target"
done
