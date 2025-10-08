#!/bin/bash

# ============================================================================
# Script de limpieza y construcción para SIGED Front
# ============================================================================
# Este script limpia completamente el proyecto y realiza un nuevo build

echo "🧹 Limpiando proyecto SIGED..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Borrar carpeta .next
echo -e "${YELLOW}📁 Eliminando carpeta .next...${NC}"
if [ -d ".next" ]; then
    sudo rm -rf .next
    echo -e "${GREEN}✅ Carpeta .next eliminada${NC}"
else
    echo -e "${YELLOW}⚠️  Carpeta .next no existe${NC}"
fi

# 2. Borrar caché de node_modules
echo -e "${YELLOW}📁 Eliminando caché de node_modules...${NC}"
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo -e "${GREEN}✅ Caché eliminada${NC}"
else
    echo -e "${YELLOW}⚠️  Caché no existe${NC}"
fi

# 3. Corregir permisos del directorio actual
echo -e "${YELLOW}🔐 Corrigiendo permisos...${NC}"
sudo chown -R $USER:programadores .
sudo chmod -R 775 .
echo -e "${GREEN}✅ Permisos corregidos${NC}"

# 4. Construir proyecto
echo -e "${YELLOW}🏗️  Construyendo proyecto...${NC}"
npm run build

# Verificar si el build fue exitoso
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completado exitosamente!${NC}"
    echo -e "${GREEN}🚀 Puedes iniciar el servidor con: npm start${NC}"
else
    echo -e "${RED}❌ Error en el build${NC}"
    exit 1
fi
