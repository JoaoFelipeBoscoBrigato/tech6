#!/bin/bash

# Script de desenvolvimento para Tech6
# Uso: ./dev.sh [comando]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Tech6 - Script de Desenvolvimento${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando. Inicie o Docker e tente novamente."
        exit 1
    fi
}

# Verificar se arquivo .env existe
check_env() {
    if [ ! -f .env ]; then
        print_warning "Arquivo .env não encontrado. Criando baseado no env.example..."
        cp env.example .env
        print_message "Arquivo .env criado! Configure as variáveis conforme necessário."
    fi
}

# Função para mostrar ajuda
show_help() {
    print_header
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start     - Iniciar todos os serviços"
    echo "  stop      - Parar todos os serviços"
    echo "  restart   - Reiniciar todos os serviços"
    echo "  logs      - Mostrar logs de todos os serviços"
    echo "  logs:api  - Mostrar logs do backend"
    echo "  logs:web  - Mostrar logs do frontend"
    echo "  logs:db   - Mostrar logs do banco"
    echo "  logs:nginx- Mostrar logs do nginx"
    echo "  status    - Verificar status dos serviços"
    echo "  health    - Verificar health dos serviços"
    echo "  clean     - Limpar tudo (volumes, containers)"
    echo "  shell     - Acessar shell do backend"
    echo "  db        - Acessar MySQL"
    echo "  help      - Mostrar esta ajuda"
    echo ""
}

# Função para iniciar serviços
start_services() {
    print_message "Iniciando serviços..."
    docker-compose up -d --build
    print_message "Serviços iniciados!"
    print_message "Acesse: http://localhost"
    print_message "API: http://localhost/api"
    print_message "Health: http://localhost/health"
}

# Função para parar serviços
stop_services() {
    print_message "Parando serviços..."
    docker-compose down
    print_message "Serviços parados!"
}

# Função para reiniciar serviços
restart_services() {
    print_message "Reiniciando serviços..."
    docker-compose restart
    print_message "Serviços reiniciados!"
}

# Função para mostrar logs
show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

# Função para verificar status
check_status() {
    print_message "Status dos containers:"
    docker-compose ps
}

# Função para verificar health
check_health() {
    print_message "Verificando health dos serviços..."
    
    # Verificar se os containers estão rodando
    if ! docker-compose ps | grep -q "Up"; then
        print_error "Nenhum serviço está rodando!"
        return 1
    fi
    
    # Verificar health do backend
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_message "✅ Backend está saudável"
    else
        print_warning "⚠️  Backend não está respondendo"
    fi
    
    # Verificar se o frontend está acessível
    if curl -f http://localhost > /dev/null 2>&1; then
        print_message "✅ Frontend está acessível"
    else
        print_warning "⚠️  Frontend não está acessível"
    fi
}

# Função para limpar tudo
clean_all() {
    print_warning "Isso irá remover todos os containers, volumes e imagens!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "Limpando tudo..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_message "Limpeza concluída!"
    else
        print_message "Operação cancelada."
    fi
}

# Função para acessar shell
access_shell() {
    print_message "Acessando shell do backend..."
    docker-compose exec backend sh
}

# Função para acessar banco
access_db() {
    print_message "Acessando MySQL..."
    docker-compose exec db mysql -u root -p
}

# Verificações iniciais
check_docker
check_env

# Processar comando
case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    logs:api)
        show_logs backend
        ;;
    logs:web)
        show_logs frontend
        ;;
    logs:db)
        show_logs db
        ;;
    logs:nginx)
        show_logs nginx
        ;;
    status)
        check_status
        ;;
    health)
        check_health
        ;;
    clean)
        clean_all
        ;;
    shell)
        access_shell
        ;;
    db)
        access_db
        ;;
    help|*)
        show_help
        ;;
esac 