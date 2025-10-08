#!/bin/bash

# ============================================================================
# Script para iniciar el servidor de desarrollo de SIGED
# ============================================================================
# Este script limpia y arranca el servidor de desarrollo

echo "🚀 Iniciando servidor de desarrollo SIGED..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Verificar que node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
    npm install
fi

# 2. Corregir permisos si es necesario
if [ -d ".next" ]; then
    echo -e "${YELLOW}🔐 Verificando permisos...${NC}"
    sudo chown -R $USER:programadores .next 2>/dev/null || true
fi

# 3. Iniciar servidor
echo -e "${GREEN}✅ Iniciando servidor en http://localhost:6170${NC}"
npm run dev
