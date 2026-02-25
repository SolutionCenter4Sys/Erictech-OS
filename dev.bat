@echo off
title Erictech-OS — Dev Server
color 0B

echo.
echo  =========================================
echo   ERICTECH — Sistema de Gestao de OS
echo   Iniciando servidor de desenvolvimento...
echo  =========================================
echo.

cd /d "%~dp0"

:: Verifica se node_modules existe
if not exist "node_modules\" (
    echo  [!] node_modules nao encontrado.
    echo  [*] Executando npm install...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo  [ERRO] Falha ao instalar dependencias.
        pause
        exit /b 1
    )
    echo.
)

echo  [*] Servidor rodando em: http://localhost:9500
echo  [*] Pressione Ctrl+C para encerrar.
echo.

call npm run dev
