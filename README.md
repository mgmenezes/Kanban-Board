# KanbanBoard

## Descrição
KanbanBoard é uma aplicação web para gerenciamento de tarefas utilizando a metodologia Kanban. Esta aplicação permite que usuários criem quadros pessoais, organizem tarefas em listas e acompanhem o progresso de seus projetos de forma visual e intuitiva.

## Tecnologias Utilizadas

### Backend
- .NET 6
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT para autenticação
- Arquitetura em camadas (Clean Architecture)

### Frontend (Planejado)
- React.js
- TypeScript
- Redux ou Context API para gerenciamento de estado
- Biblioteca de drag-and-drop (react-beautiful-dnd)
- Material-UI ou Tailwind CSS para componentes UI

## Estrutura do Projeto
KanbanBoard/
├── backend/
│ ├── KanbanBoard.API - Camada de apresentação (API REST)
│ ├── KanbanBoard.Core - Camada de domínio (entidades e regras de negócio)
│ ├── KanbanBoard.Infrastructure - Camada de acesso a dados e serviços externos
│ └── KanbanBoard.Tests - Testes automatizados
└── frontend/ (a ser implementado)
├── public/
└── src/


## Funcionalidades

- Autenticação e autorização de usuários
- Criação e gerenciamento de quadros Kanban
- Criação de listas dentro dos quadros (ex: "A fazer", "Em progresso", "Concluído")
- Adição, edição e exclusão de cartões (tarefas)
- Atribuição de cartões a usuários
- Movimentação de cartões entre listas (drag-and-drop)
- Filtragem e busca de cartões

## Requisitos

- .NET 6 SDK
- SQL Server 2019 ou mais recente
- Node.js e npm (para o frontend)
- Um editor de código como Visual Studio ou VS Code

## Configuração e Execução

### Backend

1. Clone o repositório:

2. bash
git clone https://github.com/seu-usuario/KanbanBoard.git
cd KanbanBoard


2. Configure a string de conexão no arquivo `appsettings.json` da API:

3. json
"ConnectionStrings": {
"DefaultConnection": "Server=.\\(db);Database=KanbanBoard;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}


3. Execute as migrações do banco de dados:

bash
cd backend/KanbanBoard.API
dotnet ef database update -p ../KanbanBoard.Infrastructure

4. Execute a aplicação:
   bash
dotnet run


### Frontend (quando implementado)

1. Navegue até a pasta frontend:
2. bash
cd frontend

2. Instale as dependências:
bash
npm install

3. Execute a aplicação:
bash
npm start



## Arquitetura

O projeto segue os princípios de Clean Architecture:

- **KanbanBoard.Core**: Contém entidades de domínio (Board, BoardList, Card, User) e interfaces para serviços
- **KanbanBoard.Infrastructure**: Implementa acesso a dados, contém o DbContext e implementações de repositórios
- **KanbanBoard.API**: Controllers, DTOs, filtros e configuração da aplicação

## Modelo de Dados

- **User**: Representa um usuário do sistema
- **Board**: Representa um quadro Kanban
- **BoardList**: Representa uma lista dentro de um quadro (ex: "A fazer")
- **Card**: Representa uma tarefa dentro de uma lista

## Melhorias Futuras

- Implementação de WebSockets para atualizações em tempo real
- Sistema de notificações
- Etiquetas e categorias para cartões
- Anexos e comentários em cartões
- Relatórios e métricas de produtividade
- Integração com ferramentas externas (GitHub, Slack, etc.)
