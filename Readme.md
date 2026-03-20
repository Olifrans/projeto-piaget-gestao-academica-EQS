```markdown
# 📚 Piaget - Sistema de Gestão Acadêmica - Engenharia e Qualidade de Software - EQS

Acesso ao  Sistema: admin@academico.com
Senha: admin123

- GitHub Pages sistema modelo funcionando.
- [Acesse o link](https://olifrans.github.io/projeto-piaget-gestao-academica-EQS/)


- Vercel: Vercel sistema modelo funcionando.
- [Acesse o link](https://projeto-piaget-gestao-academica-eqs.vercel.app/)


https://therapeutic-banjo-dcb.notion.site/PROJETO-Engenharia-e-Qualidade-de-Software-329396b901af80b298cccf1ec841da6f?source=copy_link

## 📖 Sobre o Projeto

O **Sistema Piaget - Gestão Acadêmica** é uma aplicação web completa desenvolvida com tecnologias modernas (HTML5, CSS3, JavaScript ES6+) e arquitetura orientada a objetos. O sistema oferece uma solução integrada para gerenciamento de escolas, professores, alunos, finanças e relatórios, com foco em usabilidade, performance e experiência do usuário.

### 🎯 Objetivos
- Centralizar a gestão acadêmica em uma única plataforma
- Fornecer ferramentas de análise e tomada de decisão
- Automatizar processos administrativos
- Garantir segurança e persistência dos dados
- Oferecer interface intuitiva e responsiva


## ✨ Funcionalidades

### 🏫 Gestão de Escolas
- ✅ Cadastro completo de escolas
- ✅ Edição e exclusão de registros
- ✅ Busca em tempo real
- ✅ Visualização de detalhes
- ✅ Exportação para Excel


### 👨‍🏫 Gestão de Professores
- ✅ Cadastro com vínculo à escola
- ✅ Controle de especialidade e salário
- ✅ Busca por nome
- ✅ Exportação para Excel


### 👨‍🎓 Gestão de Alunos
- ✅ Matrícula automática
- ✅ Controle de notas e média
- ✅ Status de aprovação (Aprovado/Recuperação)
- ✅ Busca por nome ou matrícula
- ✅ Exportação para Excel


### 💰 Módulo Financeiro
- ✅ Registro de receitas e despesas
- ✅ Categorização por tipo
- ✅ Cálculo automático de saldo
- ✅ Extrato completo
- ✅ Exportação para Excel


### 📊 Dashboard Analítico
- ✅ KPIs em tempo real
- ✅ Gráficos interativos (Chart.js)
- ✅ Distribuição por escola
- ✅ Tendências de desempenho
- ✅ WebSocket simulado para dados em tempo real


### 📑 Relatórios Customizáveis
- ✅ Relatório Geral
- ✅ Relatório por Escola
- ✅ Relatório de Desempenho
- ✅ Relatório Financeiro
- ✅ Exportação para PDF
- ✅ Exportação para Excel


### 🔐 Autenticação
- ✅ Login seguro
- ✅ Persistência de sessão
- ✅ Logout


### 📧 Notificações
- ✅ Sistema de notificações interno
- ✅ Simulação de envio por email
- ✅ Marcar como lida/não lida



## 🚀 Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Design moderno com variáveis CSS, Flexbox e Grid
- **JavaScript ES6+** - POO, módulos, async/await

### Bibliotecas e CDNs
| Biblioteca | Versão | Finalidade |
|------------|--------|------------|
| Font Awesome | 6.4.0 | Ícones vetoriais |
| Chart.js | 4.4.0 | Gráficos interativos |
| jsPDF | 2.5.1 | Geração de PDF |
| html2pdf.js | 0.10.1 | Conversão HTML → PDF |
| SheetJS (XLSX) | 0.20.2 | Exportação para Excel |
| SweetAlert2 | 11.0.0 | Modais de confirmação |

### Persistência
- **LocalStorage** - Armazenamento local dos dados



## 📁 Estrutura do Projeto

```
piaget-gestao-academica/
│
├── index.html              # Estrutura HTML do sistema
├── style.css               # Estilos e responsividade
├── script.js               # Lógica JavaScript e POO
│
├── docs/                   # Documentação
│   └── documentacao.html   # Documentação completa
│
└── README.md               # Este arquivo
```



## 🏗️ Arquitetura do Sistema

### Camadas da Aplicação

```
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE APRESENTAÇÃO                  │
│  HTML5 / CSS3 / JavaScript (UI Components)              │
│  - Sidebar Navigation                                   │
│  - Cards e Dashboard                                    │
│  - Forms e Modals                                       │
│  - Tabelas e Gráficos (Chart.js)                        │
├─────────────────────────────────────────────────────────┤
│                  CAMADA DE CONTROLE                      │
│  UI Controller (JavaScript)                             │
│  - Gerenciamento de estado                              │
│  - Event handlers                                       │
│  - Navegação entre módulos                              │
│  - Validações e feedbacks                               │
├─────────────────────────────────────────────────────────┤
│                  CAMADA DE NEGÓCIO                       │
│  Classes POO                                            │
│  - Auth (Autenticação)                                  │
│  - Database (Persistência)                              │
│  - Financeiro (Gestão Financeira)                       │
│  - NotificationSystem (Notificações)                    │
├─────────────────────────────────────────────────────────┤
│                  CAMADA DE DADOS                         │
│  LocalStorage / IndexedDB                               │
│  - academico_pro_ultimate (escolas, prof, alunos)       │
│  - financas_academico (transações)                      │
│  - notificacoes (alertas)                               │
│  - academico_user (sessão)                              │
└─────────────────────────────────────────────────────────┘
```

### Diagrama de Classes

```
┌─────────────────────────────────────┐
│              Auth                   │
├─────────────────────────────────────┤
│ - users: Array                      │
│ - currentUser: Object               │
├─────────────────────────────────────┤
│ + login(email, password): boolean   │
│ + logout(): void                    │
│ + getCurrentUser(): Object          │
│ + isAuthenticated(): boolean        │
└─────────────────────────────────────┘
              ↑
              │
              │
┌─────────────────────────────────────┐      ┌─────────────────────────────────────┐
│            Database                 │      │           Financeiro                │
├─────────────────────────────────────┤      ├─────────────────────────────────────┤
│ - escolas: Array                    │      │ - transacoes: Array                 │
│ - professores: Array                │      ├─────────────────────────────────────┤
│ - alunos: Array                     │      │ + adicionar(transacao): Object      │
├─────────────────────────────────────┤      │ + getSaldo(): number                │
│ + carregarDados(): void             │      │ + getReceitasTotal(): number        │
│ + salvar(): void                    │      │ + getDespesasTotal(): number        │
│ + getStats(): Object                │      └─────────────────────────────────────┘
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       NotificationSystem            │
├─────────────────────────────────────┤
│ - notificacoes: Array               │
├─────────────────────────────────────┤
│ + adicionar(titulo, msg): Object    │
│ + marcarComoLida(id): void          │
│ + getNaoLidas(): Array              │
└─────────────────────────────────────┘
```

---

## 💻 Como Executar o Projeto

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexão com internet (para CDNs)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/Olifrans/projeto-piaget-gestao-academica-EQS
```

2. **Acesse a pasta do projeto**
```bash
cd piaget-gestao-academica
```

3. **Abra o arquivo index.html**
   - Opção 1: Clique duas vezes no arquivo `index.html`
   - Opção 2: Use um servidor local Liver-Server




## 🔐 Credenciais de Acesso

| Perfil | Email | Senha |
|--------|-------|-------|
| Administrador | admin@academico.com | admin123 |



## 📖 Guia de Uso

### 1. Login
- Acesse a tela inicial
- Digite as credenciais
- Clique em "Entrar"


### 2. Dashboard
- Visualize KPIs (Escolas, Professores, Alunos, Média Geral)
- Acompanhe gráficos em tempo real
- Observe métricas financeiras


### 3. Escolas
- Clique em "Escolas" no menu
- Preencha o formulário de cadastro
- Visualize a lista com busca em tempo real
- Exporte dados para Excel


### 4. Professores
- Clique em "Professores"
- Selecione a escola
- Preencha os dados do professor
- Cadastre e visualize na lista


### 5. Alunos
- Clique em "Alunos"
- Selecione a escola e turma
- Informe os dados do aluno
- Adicione nota inicial (opcional)


### 6. Financeiro
- Clique em "Financeiro"
- Registre receitas/despesas
- Visualize extrato e saldo
- Exporte para Excel


### 7. Relatórios
- Clique em "Relatórios"
- Selecione o tipo de relatório
- Gere PDF ou exporte Excel


### 8. Notificações
- Clique em "Notificações"
- Visualize alertas
- Crie novas notificações
- Marque como lida



## 🧪 Casos de Teste

| ID | Caso de Teste | Resultado Esperado |
|----|---------------|-------------------|
| TC01 | Login com credenciais válidas | Redirecionar para dashboard |
| TC02 | Cadastro de escola | Escola adicionada à lista |
| TC03 | Cadastro de professor | Professor vinculado à escola |
| TC04 | Cadastro de aluno | Aluno matriculado |
| TC05 | Registro de transação | Transação adicionada ao extrato |
| TC06 | Busca em tempo real | Lista filtrada corretamente |
| TC07 | Exclusão de registro | Registro removido |
| TC08 | Geração de relatório PDF | PDF baixado com sucesso |
| TC09 | Exportação para Excel | Arquivo XLSX gerado |
| TC10 | WebSocket em tempo real | Gráficos atualizados |



## 📊 Métricas de Performance

| Métrica | Valor Esperado | Status |
|---------|---------------|--------|
| Tempo de carregamento | < 2 segundos | ✅ |
| Busca com 1000 registros | < 500ms | ✅ |
| Renderização de gráficos | < 1 segundo | ✅ |
| Responsividade mobile | Layout adaptado | ✅ |
| Persistência de dados | 100% preservado | ✅ |



## 🔧 API Técnica

### Funções Globais

| Função | Parâmetros | Descrição |
|--------|------------|-----------|
| `verDetalhes(tipo, id)` | tipo, id | Exibe modal com detalhes |
| `excluirItem(tipo, id)` | tipo, id | Exclui entidade com confirmação |
| `exportarExcelEscolas()` | - | Exporta escolas para Excel |
| `exportarExcelProfessores()` | - | Exporta professores para Excel |
| `exportarExcelAlunos()` | - | Exporta alunos para Excel |
| `exportarExcelFinanceiro()` | - | Exporta transações para Excel |
| `gerarRelatorioPDF()` | - | Gera relatório em PDF |
| `enviarNotificacaoDemo()` | - | Abre modal para criar notificação |
| `marcarNotificacaoLida(id)` | id | Marca notificação como lida |
| `logout()` | - | Encerra sessão |


### LocalStorage Keys

| Chave | Conteúdo |
|-------|----------|
| `academico_pro_ultimate` | Escolas, professores e alunos |
| `financas_academico` | Transações financeiras |
| `notificacoes` | Histórico de notificações |
| `academico_user` | Dados do usuário logado |



## ☁️ Deploy

### Opção 1: Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Importe seu repositório
3. Faça deploy automático


### Opção 2: GitHub Pages
1. Vá em Settings → Pages
2. Selecione a branch principal
3. Salve e acesse o link gerado



## 🛠️ Melhorias Futuras

- [ ] Backend com Node.js + MongoDB
- [ ] Autenticação JWT real
- [ ] WebSocket real com Socket.io
- [ ] Gráficos 3D com Three.js
- [ ] Envio real de emails (Nodemailer)
- [ ] API RESTful
- [ ] Versão mobile (React Native)
- [ ] PWA (Progressive Web App)
- [ ] Backup na nuvem
- [ ] Dashboard personalizável



## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.



## 👨‍💻 Autor

**Francisco Oliveira**



## 🙏 Agradecimentos

- Bibliotecas open-source utilizadas
- Comunidade de desenvolvedores
- Feedback e contribuições



## 📧 Contato

Para dúvidas, sugestões ou contribuições:
- Email: fransoliveira@gmail.com
- GitHub: [@olifrans](https://github.com/Olifrans/projeto-piaget-gestao-academica-EQS)



<div align="center">
  <strong>Projeto Acadêmico Piaget - Gestão Acadêmica</strong><br>
  <em>Versão 2.0.0 - Março 2026</em>
</div>
```



