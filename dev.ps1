# Script de desenvolvimento para Tech6 (PowerShell)
# Uso: .\dev.ps1 [comando]

param(
    [string]$Command = "help"
)

# Função para imprimir mensagens coloridas
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Header {
    Write-Host "================================" -ForegroundColor Blue
    Write-Host "  Tech6 - Script de Desenvolvimento" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
}

# Verificar se Docker está rodando
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-Error "Docker não está rodando. Inicie o Docker e tente novamente."
        exit 1
    }
}

# Verificar se arquivo .env existe
function Test-EnvFile {
    if (-not (Test-Path ".env")) {
        Write-Warning "Arquivo .env não encontrado. Criando baseado no env.example..."
        Copy-Item "env.example" ".env"
        Write-Info "Arquivo .env criado! Configure as variáveis conforme necessário."
    }
}

# Função para mostrar ajuda
function Show-Help {
    Write-Header
    Write-Host "Uso: .\dev.ps1 [comando]"
    Write-Host ""
    Write-Host "Comandos disponíveis:"
    Write-Host "  start     - Iniciar todos os serviços"
    Write-Host "  stop      - Parar todos os serviços"
    Write-Host "  restart   - Reiniciar todos os serviços"
    Write-Host "  logs      - Mostrar logs de todos os serviços"
    Write-Host "  logs:api  - Mostrar logs do backend"
    Write-Host "  logs:web  - Mostrar logs do frontend"
    Write-Host "  logs:db   - Mostrar logs do banco"
    Write-Host "  logs:nginx- Mostrar logs do nginx"
    Write-Host "  status    - Verificar status dos serviços"
    Write-Host "  health    - Verificar health dos serviços"
    Write-Host "  clean     - Limpar tudo (volumes, containers)"
    Write-Host "  shell     - Acessar shell do backend"
    Write-Host "  db        - Acessar MySQL"
    Write-Host "  help      - Mostrar esta ajuda"
    Write-Host ""
}

# Função para iniciar serviços
function Start-Services {
    Write-Info "Iniciando serviços..."
    docker-compose up -d --build
    Write-Info "Serviços iniciados!"
    Write-Info "Acesse: http://localhost"
    Write-Info "API: http://localhost/api"
    Write-Info "Health: http://localhost/health"
}

# Função para parar serviços
function Stop-Services {
    Write-Info "Parando serviços..."
    docker-compose down
    Write-Info "Serviços parados!"
}

# Função para reiniciar serviços
function Restart-Services {
    Write-Info "Reiniciando serviços..."
    docker-compose restart
    Write-Info "Serviços reiniciados!"
}

# Função para mostrar logs
function Show-Logs {
    param([string]$Service = "")
    
    if ($Service -eq "") {
        docker-compose logs -f
    }
    else {
        docker-compose logs -f $Service
    }
}

# Função para verificar status
function Get-Status {
    Write-Info "Status dos containers:"
    docker-compose ps
}

# Função para verificar health
function Test-Health {
    Write-Info "Verificando health dos serviços..."
    
    # Verificar se os containers estão rodando
    $running = docker-compose ps | Select-String "Up"
    if (-not $running) {
        Write-Error "Nenhum serviço está rodando!"
        return
    }
    
    # Verificar health do backend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Info "✅ Backend está saudável"
        }
    }
    catch {
        Write-Warning "⚠️  Backend não está respondendo"
    }
    
    # Verificar se o frontend está acessível
    try {
        $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Info "✅ Frontend está acessível"
        }
    }
    catch {
        Write-Warning "⚠️  Frontend não está acessível"
    }
}

# Função para limpar tudo
function Clear-All {
    Write-Warning "Isso irá remover todos os containers, volumes e imagens!"
    $confirmation = Read-Host "Tem certeza? (y/N)"
    if ($confirmation -eq "y" -or $confirmation -eq "Y") {
        Write-Info "Limpando tudo..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        Write-Info "Limpeza concluída!"
    }
    else {
        Write-Info "Operação cancelada."
    }
}

# Função para acessar shell
function Enter-Shell {
    Write-Info "Acessando shell do backend..."
    docker-compose exec backend sh
}

# Função para acessar banco
function Enter-Database {
    Write-Info "Acessando MySQL..."
    docker-compose exec db mysql -u root -p
}

# Verificações iniciais
Test-Docker
Test-EnvFile

# Processar comando
switch ($Command) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { Show-Logs }
    "logs:api" { Show-Logs "backend" }
    "logs:web" { Show-Logs "frontend" }
    "logs:db" { Show-Logs "db" }
    "logs:nginx" { Show-Logs "nginx" }
    "status" { Get-Status }
    "health" { Test-Health }
    "clean" { Clear-All }
    "shell" { Enter-Shell }
    "db" { Enter-Database }
    default { Show-Help }
} 