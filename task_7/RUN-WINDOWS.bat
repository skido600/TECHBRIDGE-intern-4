@echo off
cd /d "%~dp0backend"
bun install
bun run dev
pause
