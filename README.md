# Documentação Técnica do Projeto

## 1. Setup Inicial

### Pré-requisitos
- **Docker**: Certifique-se de que o Docker está instalado em sua máquina. Você pode baixar e instalar o Docker [aqui](https://www.docker.com/get-started).
- **Docker Compose**: O Docker Compose é necessário para orquestrar os serviços. Ele geralmente vem junto com a instalação do Docker.

### Passos para Configuração

1. **Clone o repositório**:
   ```bash
   git clone <https://github.com/AugustoCVS/blog-escolar.git>
   cd <blog-escolar>
   ```

2. **Instale as dependências**:
   As dependências do projeto são gerenciadas pelo Yarn. O Dockerfile já cuida disso, mas se você quiser instalar localmente, execute:
   ```bash
   yarn install
   ```

3. **Configuração do Banco de Dados**:
   O projeto utiliza o PostgreSQL. As configurações do banco de dados estão no arquivo `docker-compose.yml`. Você pode alterar as variáveis de ambiente conforme necessário.

4. **Inicie os serviços**:
   Para iniciar a aplicação e o banco de dados, execute:
   ```bash
   docker-compose up --build
   ```

5. **Acesse a aplicação**:
   A aplicação estará disponível em `http://localhost:3001`.

## 2. Arquitetura da Aplicação

A arquitetura do projeto é baseada em uma estrutura de microserviços, utilizando o padrão MVC (Model-View-Controller). Abaixo estão os principais componentes:

- **Camada de Apresentação**: Utiliza o Express.js para gerenciar as rotas e controlar as requisições HTTP.
- **Camada de Serviço**: Contém a lógica de negócios, onde os serviços são responsáveis por manipular os dados e interagir com o banco de dados.
- **Camada de Persistência**: Utiliza o Prisma como ORM para interagir com o banco de dados PostgreSQL.
- **Banco de Dados**: PostgreSQL, que armazena as informações de usuários e posts.

### Estrutura de Diretórios

```
/src
  /api
    /controllers
    /routes
  /domain
  /infra
  /middlewares
  /services
  /utils
  /prisma
```

## 3. Guia de Uso das APIs

### 3.1. Endpoints de Usuário

#### 3.1.1. Criar Usuário
- **Método**: POST
- **Endpoint**: `/user/register`
- **Corpo da Requisição**:
  ```json
  {
    "name": "Nome do Usuário",
    "email": "email@exemplo.com",
    "isAdmin": false,
    "password": "senha",
    "confirm_password": "senha"
  }
  ```

#### 3.1.2. Obter Usuário por ID
- **Método**: GET
- **Endpoint**: `/user/:id`
- **Parâmetros**: `id` (ID do usuário)

#### 3.1.3. Atualizar Usuário
- **Método**: PUT
- **Endpoint**: `/user/:id`
- **Corpo da Requisição**:
  ```json
  {
    "name": "Nome Atualizado",
    "email": "email@exemplo.com"
  }
  ```

#### 3.1.4. Deletar Usuário
- **Método**: DELETE
- **Endpoint**: `/user/:id`
- **Parâmetros**: `id` (ID do usuário)

### 3.2. Endpoints de Posts

#### 3.2.1. Criar Post
- **Método**: POST
- **Endpoint**: `/posts`
- **Corpo da Requisição**:
  ```json
  {
    "title": "Título do Post",
    "content": "Conteúdo do Post",
    "authorId": "ID do Autor"
  }
  ```

#### 3.2.2. Obter Posts
- **Método**: GET
- **Endpoint**: `/posts`
- **Parâmetros**: `page`, `limit`, `title`, `content`

#### 3.2.3. Atualizar Post
- **Método**: PUT
- **Endpoint**: `/posts/:id`
- **Corpo da Requisição**:
  ```json
  {
    "title": "Título Atualizado",
    "content": "Conteúdo Atualizado",
    "authorId": "ID do Autor"
  }
  ```

#### 3.2.4. Deletar Post
- **Método**: DELETE
- **Endpoint**: `/posts/:id`
- **Parâmetros**: `id` (ID do post)

## 4. Uso da Aplicação

A aplicação foi desenvolvida para ser uma API de blog escolar, permitindo que usuários se registrem, criem posts e leiam o conteúdo.

## 5. Desafios e Experiências

Durante o desenvolvimento, a equipe enfrentou alguns desafios, como:

- **Integração com o Prisma**: A configuração inicial do Prisma e a migração do banco de dados foram desafiadoras, especialmente na definição dos modelos e relacionamentos.
- **Autenticação e Autorização**: Garantir que apenas usuários autorizados pudessem acessar certas rotas e funcionalidades exigiu um planejamento cuidadoso e a implementação de middlewares.

A equipe aprendeu a importância de uma boa documentação e comunicação durante o desenvolvimento, o que facilitou a resolução de problemas e a implementação de novas funcionalidades.
