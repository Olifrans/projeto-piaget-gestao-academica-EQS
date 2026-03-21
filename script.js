// ==================== CONFIGURAÇÕES DA IA ====================
const USE_AI = false; // Mude para true se tiver chave API
const OPENAI_API_KEY = ""; // Coloque sua chave API aqui
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MESSAGE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=`;

// ==================== SISTEMA DE AUTENTICAÇÃO ====================
class Auth {
    constructor() {
        this.users = [
            { id: 1, name: 'Administrador', email: 'admin@academico.com', password: 'admin123', role: 'admin', avatar: 'A' }
        ];
        this.currentUser = null;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('academico_user', JSON.stringify(user));
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('academico_user');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('academico_user');
            if (stored) this.currentUser = JSON.parse(stored);
        }
        return this.currentUser;
    }

    isAuthenticated() { return this.getCurrentUser() !== null; }
}

// ==================== DATABASE PRINCIPAL ====================
class Database {
    constructor() {
        this.escolas = [];
        this.professores = [];
        this.alunos = [];
        this.carregarDados();
    }

    carregarDados() {
        const dados = localStorage.getItem('academico_pro_ultimate');
        if (dados) {
            const parsed = JSON.parse(dados);
            this.escolas = parsed.escolas || [];
            this.professores = parsed.professores || [];
            this.alunos = parsed.alunos || [];
        }
        if (this.escolas.length === 0) this.carregarExemplos();
    }

    carregarExemplos() {
        this.escolas = [
            { id: 'ESC1', nome: 'Escola Municipal Central', endereco: 'Av. Principal, 1000', telefone: '(11) 99999-9999', email: 'central@escola.com', diretor: 'Dr. João Silva', cnpj: '00.000.000/0001-00', dataCadastro: new Date().toISOString() },
            { id: 'ESC2', nome: 'Colégio Estadual Tecnológico', endereco: 'Rua das Flores, 500', telefone: '(11) 88888-8888', email: 'tecnologico@escola.com', diretor: 'Profa. Maria Santos', cnpj: '11.111.111/0001-11', dataCadastro: new Date().toISOString() }
        ];
        this.professores = [
            { id: 'PROF1', nome: 'Carlos Alberto', email: 'carlos@escola.com', telefone: '(11) 77777-7777', cpf: '123.456.789-01', especialidade: 'Matemática', salario: 5000, escolaId: 'ESC1', dataAdmissao: '2023-01-15', dataCadastro: new Date().toISOString() },
            { id: 'PROF2', nome: 'Ana Paula', email: 'ana@escola.com', telefone: '(11) 66666-6666', cpf: '987.654.321-01', especialidade: 'Português', salario: 4800, escolaId: 'ESC1', dataAdmissao: '2023-02-10', dataCadastro: new Date().toISOString() }
        ];
        this.alunos = [
            { id: 'ALU1', nome: 'Pedro Souza', email: 'pedro@email.com', telefone: '(11) 55555-5555', cpf: '111.222.333-44', dataNascimento: '2010-05-15', matricula: '2024001', turma: '9º Ano A', escolaId: 'ESC1', notas: [{ valor: 8.5, disciplina: 'Matemática' }, { valor: 9.0, disciplina: 'Português' }], media: 8.75, dataCadastro: new Date().toISOString() },
            { id: 'ALU2', nome: 'Mariana Oliveira', email: 'mariana@email.com', telefone: '(11) 44444-4444', cpf: '555.666.777-88', dataNascimento: '2010-08-22', matricula: '2024002', turma: '9º Ano A', escolaId: 'ESC1', notas: [{ valor: 7.5, disciplina: 'Matemática' }, { valor: 8.0, disciplina: 'Português' }], media: 7.75, dataCadastro: new Date().toISOString() }
        ];
        this.salvar();
    }

    salvar() {
        localStorage.setItem('academico_pro_ultimate', JSON.stringify({
            escolas: this.escolas,
            professores: this.professores,
            alunos: this.alunos
        }));
    }

    getStats() {
        return {
            totalEscolas: this.escolas.length,
            totalProfessores: this.professores.length,
            totalAlunos: this.alunos.length,
            mediaGeral: (this.alunos.reduce((acc, a) => acc + (a.media || 0), 0) / this.alunos.length || 0).toFixed(2)
        };
    }
}

// ==================== MÓDULO FINANCEIRO ====================
class Financeiro {
    constructor() {
        this.transacoes = this.carregarTransacoes();
    }

    carregarTransacoes() {
        const saved = localStorage.getItem('financas_academico');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, descricao: 'Salário Professores', valor: 25000, tipo: 'despesa', categoria: 'salario', data: '2024-03-01' },
            { id: 2, descricao: 'Mensalidades', valor: 45000, tipo: 'receita', categoria: 'mensalidade', data: '2024-03-05' },
            { id: 3, descricao: 'Material Didático', valor: 5000, tipo: 'despesa', categoria: 'material', data: '2024-03-10' }
        ];
    }

    salvar() { localStorage.setItem('financas_academico', JSON.stringify(this.transacoes)); }
    adicionar(t) { t.id = Date.now(); this.transacoes.push(t); this.salvar(); return t; }
    getSaldo() { return this.getReceitasTotal() - this.getDespesasTotal(); }
    getReceitasTotal() { return this.transacoes.filter(t => t.tipo === 'receita').reduce((a, t) => a + t.valor, 0); }
    getDespesasTotal() { return this.transacoes.filter(t => t.tipo === 'despesa').reduce((a, t) => a + t.valor, 0); }
}

// ==================== SISTEMA DE NOTIFICAÇÕES ====================
class NotificationSystem {
    constructor() {
        this.notificacoes = [];
        const saved = localStorage.getItem('notificacoes');
        if (saved) this.notificacoes = JSON.parse(saved);
        else this.notificacoes = [{ id: 1, titulo: 'Bem-vindo!', mensagem: 'Sistema Acadêmico Pro está pronto para uso.', tipo: 'info', lida: false, data: new Date().toISOString() }];
        this.salvar();
    }
    salvar() { localStorage.setItem('notificacoes', JSON.stringify(this.notificacoes)); }
    adicionar(titulo, mensagem, tipo = 'info') {
        const notif = { id: Date.now(), titulo, mensagem, tipo, lida: false, data: new Date().toISOString() };
        this.notificacoes.unshift(notif);
        this.salvar();
        this.mostrarToast(notif);
        return notif;
    }
    mostrarToast(notif) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.innerHTML = `<strong>${notif.titulo}</strong><br>${notif.mensagem}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
    }
    getNaoLidas() { return this.notificacoes.filter(n => !n.lida); }
    marcarComoLida(id) { const n = this.notificacoes.find(n => n.id === id); if (n) n.lida = true; this.salvar(); }
}

// ==================== CHATBOT COM INTELIGÊNCIA ARTIFICIAL ====================
class IntelligentChatbot {
    constructor() {
        this.contexto = {
            sistema: "Piaget - Gestão Acadêmica",
            versao: "2.0.0",
            dataAtual: new Date().toLocaleString('pt-BR')
        };
        this.isThinking = false;
        this.apiAvailable = USE_AI && OPENAI_API_KEY;
        this.historicoConversa = [];
        this.intencoes = this.carregarIntencoes();
        this.init();
    }

    init() {
        this.loadContext();
        this.setupEventListeners();
        this.updateAIStatus();
    }

    loadContext() {
        if (typeof db !== 'undefined' && db) {
            const stats = db.getStats();
            this.contexto.estatisticas = stats;
        }
        if (typeof financeiro !== 'undefined' && financeiro) {
            this.contexto.financeiro = {
                receitas: financeiro.getReceitasTotal(),
                despesas: financeiro.getDespesasTotal(),
                saldo: financeiro.getSaldo()
            };
        }
        if (typeof db !== 'undefined' && db && db.escolas) {
            this.contexto.escolas = db.escolas.map(e => ({
                nome: e.nome,
                diretor: e.diretor,
                alunos: db.alunos.filter(a => a.escolaId === e.id).length,
                professores: db.professores.filter(p => p.escolaId === e.id).length
            }));
        }
        if (typeof db !== 'undefined' && db && db.alunos) {
            this.contexto.alunos = db.alunos.map(a => ({
                nome: a.nome,
                turma: a.turma,
                media: a.media,
                status: (a.media || 0) >= 7 ? 'Aprovado' : 'Recuperação'
            }));
        }
    }

    carregarIntencoes() {
        return {
            saudacao: {
                palavras: ['olá', 'oi', 'opa', 'e aí', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'salve'],
                resposta: (nome) => `Olá! 👋 ${nome ? `Seja bem-vindo(a) ${nome}! ` : ''}Sou o assistente virtual do Piaget. Como posso ajudar você hoje?`
            },
            cadastro_escola: {
                palavras: ['cadastrar escola', 'nova escola', 'criar escola', 'como cadastro escola', 'adicionar escola'],
                resposta: () => `🏫 **COMO CADASTRAR UMA ESCOLA:**

1. No menu lateral, clique em **"Escolas"**
2. Preencha o formulário com:
   • Nome da instituição
   • Endereço completo
   • Telefone e email
   • Nome do diretor(a)
   • CNPJ (opcional)
3. Clique em **"Cadastrar Escola"**

Após o cadastro, a escola aparecerá na lista e você poderá associar professores e alunos!`
            },
            cadastro_professor: {
                palavras: ['cadastrar professor', 'novo professor', 'contratar professor', 'como cadastro professor', 'adicionar professor'],
                resposta: () => `👨‍🏫 **COMO CADASTRAR UM PROFESSOR:**

1. Acesse o menu **"Professores"**
2. Selecione a escola onde ele atuará
3. Preencha:
   • Nome completo
   • Email e telefone
   • CPF
   • Especialidade (Matemática, Português, etc)
   • Salário
   • Data de admissão
4. Clique em **"Cadastrar Professor"**

O professor será automaticamente vinculado à escola selecionada!`
            },
            cadastro_aluno: {
                palavras: ['cadastrar aluno', 'matricular aluno', 'nova matrícula', 'como cadastro aluno', 'adicionar aluno'],
                resposta: () => `👨‍🎓 **COMO CADASTRAR UM ALUNO:**

1. Vá ao menu **"Alunos"**
2. Selecione a escola e informe a turma
3. Preencha:
   • Nome completo
   • Email e telefone
   • CPF
   • Data de nascimento
4. Opcional: adicione uma nota inicial
5. Clique em **"Cadastrar Aluno"**

A matrícula será gerada automaticamente!`
            },
            estatisticas: {
                palavras: ['estatísticas', 'resumo', 'quantos', 'total', 'número de', 'quantas escolas', 'quantos alunos', 'quantos professores'],
                resposta: () => this.generateStatsReport()
            },
            relatorio: {
                palavras: ['relatório', 'gerar relatório', 'relatório pdf', 'exportar relatório', 'relatório geral'],
                resposta: () => `📄 **COMO GERAR RELATÓRIOS:**

1. Acesse o menu **"Relatórios"**
2. Escolha o tipo:
   • Geral - Visão completa do sistema
   • Por Escola - Dados específicos
   • Desempenho - Análise acadêmica
   • Financeiro - Fluxo de caixa
3. Clique em **"Gerar PDF"** ou **"Exportar Excel"**

O arquivo será baixado automaticamente!`
            },
            financeiro: {
                palavras: ['financeiro', 'finanças', 'dinheiro', 'saldo', 'receita', 'despesa', 'fluxo de caixa'],
                resposta: () => `💰 **MÓDULO FINANCEIRO:**

**Para registrar despesa/receita:**
1. Acesse **"Financeiro"**
2. Preencha descrição e valor
3. Selecione o tipo (Receita/Despesa)
4. Escolha a categoria
5. Informe a data
6. Clique em **"Registrar"**

**Dados atuais:**
• Receitas: R$ ${this.contexto.financeiro?.receitas?.toLocaleString() || 0}
• Despesas: R$ ${this.contexto.financeiro?.despesas?.toLocaleString() || 0}
• Saldo: R$ ${this.contexto.financeiro?.saldo?.toLocaleString() || 0}`
            },
            navegacao: {
                palavras: ['ir para', 'abrir', 'navegar', 'mostrar', 'acessar'],
                resposta: (modulo) => {
                    const moduloEncontrado = this.extractModule(modulo);
                    if (moduloEncontrado) {
                        this.navigateToModule(moduloEncontrado);
                        return `✅ Navegando para o módulo **${moduloEncontrado}**. Aguarde um momento...`;
                    }
                    return null;
                }
            },
            ajuda: {
                palavras: ['ajuda', 'comandos', 'o que você pode fazer', 'funcionalidades', 'como usar'],
                resposta: () => this.getCommandsList()
            },
            atendente: {
                palavras: ['atendente', 'suporte', 'humano', 'falar com alguém', 'whatsapp', 'contato'],
                resposta: () => `📞 **FALE COM UM ATENDENTE!**

Clique no botão de WhatsApp no canto inferior direito do chat para abrir a conversa.

Nosso horário de atendimento: Segunda a Sexta, 8h às 18h.`
            },
            despedida: {
                palavras: ['tchau', 'até mais', 'falou', 'valeu', 'obrigado', 'agradeço', 'bye'],
                resposta: () => `Até mais! 👋 Se precisar de ajuda, estou aqui. Tenha um ótimo dia!`
            }
        };
    }

    updateAIStatus() {
        const statusElement = document.getElementById('aiStatus');
        if (statusElement) {
            if (this.apiAvailable) {
                statusElement.innerHTML = '<i class="fas fa-microchip"></i> IA OpenAI Online <span class="ai-online">●</span>';
                statusElement.style.color = '#10b981';
            } else {
                statusElement.innerHTML = '<i class="fas fa-brain"></i> IA Inteligente (Modo Avançado)';
                statusElement.style.color = '#6b7280';
            }
        }
    }

    setupEventListeners() {
        setInterval(() => {
            this.loadContext();
        }, 30000);
    }

    async processMessage(mensagem) {
        if (this.isThinking) return null;
        
        this.isThinking = true;
        this.historicoConversa.push({ role: 'user', content: mensagem });
        
        try {
            let resposta;
            
            if (this.apiAvailable) {
                resposta = await this.callOpenAI(mensagem);
            } else {
                resposta = this.processWithNLP(mensagem);
            }
            
            this.historicoConversa.push({ role: 'assistant', content: resposta });
            
            if (this.historicoConversa.length > 20) {
                this.historicoConversa = this.historicoConversa.slice(-20);
            }
            
            return resposta;
            
        } catch (error) {
            console.error('Erro no chatbot:', error);
            return this.processWithNLP(mensagem);
        } finally {
            this.isThinking = false;
        }
    }

    async callOpenAI(mensagem) {
        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `Você é um assistente virtual do sistema "Piaget - Gestão Acadêmica". 
                            
                            INFORMAÇÕES DO SISTEMA:
                            - ${this.contexto.sistema} versão ${this.contexto.versao}
                            - ${this.contexto.estatisticas?.totalEscolas || 0} escolas cadastradas
                            - ${this.contexto.estatisticas?.totalProfessores || 0} professores
                            - ${this.contexto.estatisticas?.totalAlunos || 0} alunos
                            - Média geral: ${this.contexto.estatisticas?.mediaGeral || 0}
                            - Receitas: R$ ${this.contexto.financeiro?.receitas?.toLocaleString() || 0}
                            - Despesas: R$ ${this.contexto.financeiro?.despesas?.toLocaleString() || 0}
                            - Saldo: R$ ${this.contexto.financeiro?.saldo?.toLocaleString() || 0}
                            
                            REGRAS:
                            1. Seja amigável, profissional e objetivo
                            2. Responda em português do Brasil
                            3. Use emojis para tornar a conversa mais agradável
                            4. Se o usuário pedir para abrir um módulo, oriente como fazer
                            5. Se o usuário pedir estatísticas, forneça os dados do contexto
                            6. Se o usuário pedir cadastro, dê o passo a passo
                            7. Mantenha respostas concisas mas completas`
                        },
                        ...this.historicoConversa.slice(-5),
                        { role: 'user', content: mensagem }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                return data.choices[0].message.content;
            }
            
            throw new Error('Resposta inválida da API');
            
        } catch (error) {
            console.error('Erro na chamada OpenAI:', error);
            return this.processWithNLP(mensagem);
        }
    }

    processWithNLP(mensagem) {
        const msg = mensagem.toLowerCase();
        
        const sentimento = this.analisarSentimento(msg);
        
        let melhorIntencao = null;
        let maiorScore = 0;
        
        for (const [nome, intencao] of Object.entries(this.intencoes)) {
            for (const palavra of intencao.palavras) {
                if (msg.includes(palavra)) {
                    const score = this.calcularSimilaridade(msg, palavra);
                    if (score > maiorScore) {
                        maiorScore = score;
                        melhorIntencao = nome;
                    }
                }
            }
        }
        
        if (melhorIntencao && maiorScore > 0.5) {
            const intencao = this.intencoes[melhorIntencao];
            let resposta = intencao.resposta();
            
            if (melhorIntencao === 'navegacao' && resposta === null) {
                const modulo = this.extractModule(msg);
                if (modulo) {
                    this.navigateToModule(modulo);
                    resposta = `✅ Navegando para o módulo **${modulo}**. Aguarde um momento...`;
                } else {
                    resposta = "Para qual módulo você gostaria de ir? (Escolas, Professores, Alunos, Financeiro, Relatórios ou Notificações)";
                }
            }
            
            if (melhorIntencao === 'saudacao' && typeof auth !== 'undefined' && auth.getCurrentUser()) {
                resposta = intencao.resposta(auth.getCurrentUser().name);
            }
            
            if (sentimento === 'negativo') {
                resposta += "\n\n🤗 Se precisar de mais ajuda, estou aqui para você!";
            }
            
            return resposta;
        }
        
        return this.respostaInteligentePadrao(msg);
    }

    analisarSentimento(texto) {
        const palavrasPositivas = ['bom', 'ótimo', 'excelente', 'gostei', 'obrigado', 'valeu', 'legal'];
        const palavrasNegativas = ['ruim', 'péssimo', 'problema', 'erro', 'bug', 'difícil', 'confuso'];
        
        let score = 0;
        palavrasPositivas.forEach(p => { if (texto.includes(p)) score++; });
        palavrasNegativas.forEach(p => { if (texto.includes(p)) score--; });
        
        if (score > 0) return 'positivo';
        if (score < 0) return 'negativo';
        return 'neutro';
    }

    calcularSimilaridade(texto, palavra) {
        if (texto.includes(palavra)) return 1;
        
        const palavrasTexto = texto.split(' ');
        for (const pt of palavrasTexto) {
            if (pt.length > 3 && palavra.includes(pt) || pt.includes(palavra)) {
                return 0.7;
            }
        }
        return 0;
    }

    generateStatsReport() {
        if (!this.contexto.estatisticas) return "Aguarde, carregando estatísticas...";
        
        const stats = this.contexto.estatisticas;
        
        return `📊 **RELATÓRIO COMPLETO - PIAGET** 📊

**📈 MÉTRICAS GLOBAIS:**
• 🏫 Escolas: ${stats.totalEscolas} instituições
• 👨‍🏫 Professores: ${stats.totalProfessores} profissionais
• 👨‍🎓 Alunos: ${stats.totalAlunos} estudantes
• 📊 Média Geral: ${stats.mediaGeral}/10

**💰 RESUMO FINANCEIRO:**
• 📈 Receitas: R$ ${this.contexto.financeiro?.receitas?.toLocaleString() || 0}
• 📉 Despesas: R$ ${this.contexto.financeiro?.despesas?.toLocaleString() || 0}
• 💰 Saldo: R$ ${this.contexto.financeiro?.saldo?.toLocaleString() || 0}

**🏫 DETALHAMENTO POR ESCOLA:**
${this.contexto.escolas?.map(e => `• ${e.nome}: ${e.alunos} alunos, ${e.professores} professores`).join('\n') || 'Nenhuma escola cadastrada'}

**👨‍🎓 DESEMPENHO DOS ALUNOS:**
${this.contexto.alunos?.slice(0, 5).map(a => `• ${a.nome}: ${a.media} - ${a.status}`).join('\n') || 'Nenhum aluno cadastrado'}

*Dados atualizados em tempo real | ${new Date().toLocaleString()}*`;
    }

    getCommandsList() {
        return `🤖 **COMANDOS DISPONÍVEIS**

📌 **NAVEGAÇÃO:**
• "ir para [módulo]" - Ex: "ir para escolas"
• "abrir [módulo]" - Ex: "abrir financeiro"

📊 **INFORMAÇÕES:**
• "estatísticas" ou "resumo" - Ver dados completos do sistema
• "relatório rápido" - Gerar resumo executivo

📝 **CADASTROS:**
• "como cadastrar escola" - Tutorial passo a passo
• "como cadastrar professor" - Tutorial passo a passo
• "como cadastrar aluno" - Tutorial passo a passo

📄 **RELATÓRIOS:**
• "gerar relatório PDF" - Gerar relatório em PDF
• "exportar Excel" - Exportar dados para Excel

💰 **FINANCEIRO:**
• "financeiro" - Ver dados financeiros
• "saldo" - Ver saldo atual

💬 **SUPORTE:**
• "atendente" - Contato via WhatsApp
• "ajuda" - Este menu

🎯 **EXEMPLOS DE PERGUNTAS:**
• Quantos alunos temos?
• Qual a média geral?
• Me mostre o desempenho dos alunos
• Como faço para cadastrar um professor?

*Dica: Quanto mais específica sua pergunta, melhor posso ajudar!*`;
    }

    respostaInteligentePadrao(mensagem) {
        if (mensagem.includes('aluno') && (mensagem.includes('quantos') || mensagem.includes('total'))) {
            return `📊 Temos **${this.contexto.estatisticas?.totalAlunos || 0} alunos** cadastrados no sistema.`;
        }
        
        if (mensagem.includes('professor') && (mensagem.includes('quantos') || mensagem.includes('total'))) {
            return `📊 Temos **${this.contexto.estatisticas?.totalProfessores || 0} professores** cadastrados no sistema.`;
        }
        
        if (mensagem.includes('escola') && (mensagem.includes('quantas') || mensagem.includes('total'))) {
            return `📊 Temos **${this.contexto.estatisticas?.totalEscolas || 0} escolas** cadastradas no sistema.`;
        }
        
        if (mensagem.includes('média') || mensagem.includes('media')) {
            return `📊 A média geral dos alunos é **${this.contexto.estatisticas?.mediaGeral || 0}** pontos.`;
        }
        
        if (mensagem.includes('melhor') && mensagem.includes('aluno')) {
            const melhorAluno = this.contexto.alunos?.reduce((melhor, atual) => 
                (atual.media > melhor.media) ? atual : melhor, { media: 0 });
            if (melhorAluno && melhorAluno.media > 0) {
                return `🏆 O melhor aluno é **${melhorAluno.nome}** com média **${melhorAluno.media}**!`;
            }
            return "Ainda não temos alunos cadastrados para determinar o melhor aluno.";
        }
        
        return `🤔 **Não entendi completamente sua pergunta.**

💡 **SUGESTÕES:**
• Digite "ajuda" para ver todos os comandos
• Pergunte "como cadastrar escola"
• Pergunte "estatísticas" para ver dados do sistema
• Pergunte "relatório rápido" para um resumo executivo

*Como posso ajudar melhor?*`;
    }

    extractModule(msg) {
        const modules = {
            'dashboard': ['dashboard', 'painel', 'principal', 'início'],
            'escolas': ['escola', 'escolas', 'instituição'],
            'professores': ['professor', 'professores', 'docente'],
            'alunos': ['aluno', 'alunos', 'estudante', 'matrícula'],
            'financeiro': ['financeiro', 'finanças', 'dinheiro', 'saldo', 'receita', 'despesa'],
            'relatorios': ['relatório', 'relatorios', 'relatorio', 'pdf', 'excel'],
            'notificacoes': ['notificação', 'notificações', 'alerta', 'mensagem']
        };
        
        for (const [modulo, keywords] of Object.entries(modules)) {
            if (keywords.some(k => msg.includes(k))) {
                return modulo;
            }
        }
        return null;
    }

    navigateToModule(modulo) {
        const navLink = document.querySelector(`[data-module="${modulo}"]`);
        if (navLink) {
            navLink.click();
        }
    }
}

// ==================== VARIÁVEIS GLOBAIS ====================
const auth = new Auth();
const db = new Database();
const financeiro = new Financeiro();
const notifications = new NotificationSystem();
let chatbot = null;
let realtimeChart = null;
let realtimeData = [];
let wsInterval = null;
let currentModule = 'dashboard';
let unreadCount = 1;

// ==================== FUNÇÕES DE UI ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (toast && toastMessage) {
        toastMessage.innerHTML = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function closeModal() { 
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.remove('active'); 
}

// ==================== FUNÇÕES DO CHATBOT ====================
function toggleChatbot() {
    const window = document.getElementById('chatbotWindow');
    if (!window) return;
    
    const isActive = window.classList.contains('active');
    
    if (isActive) {
        window.classList.remove('active');
    } else {
        window.classList.add('active');
        resetChatbotBadge();
        setTimeout(() => {
            const input = document.getElementById('chatbotInput');
            if (input) input.focus();
        }, 300);
    }
}

function updateChatbotBadge() {
    const badge = document.getElementById('chatbotBadge');
    if (!badge) return;
    unreadCount++;
    badge.textContent = unreadCount;
    badge.style.display = 'flex';
}

function resetChatbotBadge() {
    unreadCount = 0;
    const badge = document.getElementById('chatbotBadge');
    if (badge) {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
}

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    let formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/•/g, '•');
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${sender === 'bot' ? '<i class="fab fa-whatsapp"></i>' : ''}
            <div>
                ${sender === 'bot' ? '<strong>Assistente Piaget</strong>' : '<strong>Você</strong>'}
                <p>${formattedMessage}</p>
                <small>${timeStr}</small>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    const window = document.getElementById('chatbotWindow');
    if (!window || !window.classList.contains('active')) {
        updateChatbotBadge();
    }
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

async function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (message === "") return;
    
    const sendButton = document.querySelector('.chatbot-input button');
    if (sendButton) sendButton.disabled = true;
    input.disabled = true;
    
    addMessageToChat(message, 'user');
    input.value = "";
    
    showTypingIndicator();
    
    try {
        if (chatbot) {
            const response = await chatbot.processMessage(message);
            removeTypingIndicator();
            addMessageToChat(response, 'bot');
            
            if (message.toLowerCase().includes('atendente')) {
                setTimeout(() => {
                    abrirWhatsApp();
                }, 1000);
            }
        } else {
            removeTypingIndicator();
            addMessageToChat("Desculpe, o assistente não está disponível no momento.", 'bot');
        }
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        removeTypingIndicator();
        addMessageToChat("Desculpe, ocorreu um erro. Por favor, tente novamente.", 'bot');
    } finally {
        input.disabled = false;
        if (sendButton) sendButton.disabled = false;
        input.focus();
    }
}

function sendQuickMessage(message) {
    const input = document.getElementById('chatbotInput');
    if (input) {
        input.value = message;
        sendChatbotMessage();
    }
}

function handleChatbotKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatbotMessage();
    }
}

function abrirWhatsApp() {
    const mensagem = encodeURIComponent("Olá! Preciso de ajuda com o sistema Piaget.");
    window.open(`${WHATSAPP_MESSAGE_URL}${mensagem}`, '_blank');
    showToast("Redirecionando para WhatsApp...", "info");
}

function showWelcomeMessage() {
    if (!chatbot) return;
    
    setTimeout(() => {
        const userName = auth.getCurrentUser()?.name || '';
        const welcomeMessage = `Olá${userName ? ' ' + userName : ''}! 👋 Bem-vindo ao **Piaget - Gestão Acadêmica**!
        
Sou seu assistente com **Inteligência Artificial**. Posso ajudar você com:
• 📝 Cadastros (escolas, professores, alunos)
• 📊 Relatórios e análises completas
• 💰 Gestão financeira
• 📈 Estatísticas em tempo real
• 🔔 Notificações

**Digite "ajuda"** para ver todos os comandos ou me pergunte qualquer coisa!

Como posso ajudar você hoje?`;
        
        addMessageToChat(welcomeMessage, 'bot');
        updateChatbotBadge();
    }, 2000);
}

// ==================== CRUD ESCOLAS ====================
function renderEscolas(searchTerm = '') {
    let escolas = [...db.escolas];
    if (searchTerm) escolas = escolas.filter(e => e.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const container = document.getElementById('listaEscolas');
    if (!container) return;
    
    if (escolas.length === 0) { 
        container.innerHTML = '<div style="text-align: center; padding: 40px;">Nenhuma escola cadastrada</div>'; 
        return; 
    }

    let html = '<table class="table-modern"><thead><tr><th>Nome</th><th>Diretor</th><th>Email</th><th>Telefone</th><th>Ações</th></tr></thead><tbody>';
    escolas.forEach(escola => {
        html += `<tr>
                    <td><strong>${escola.nome}</strong></td>
                    <td>${escola.diretor}</td>
                    <td>${escola.email}</td>
                    <td>${escola.telefone}</td>
                    <td>
                        <button class="btn btn-outline" style="padding: 6px 12px; margin-right: 5px;" onclick="verDetalhes('escola', '${escola.id}')"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-danger" style="padding: 6px 12px;" onclick="excluirItem('escola', '${escola.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

// ==================== CRUD PROFESSORES ====================
function renderProfessores(searchTerm = '') {
    let professores = [...db.professores];
    if (searchTerm) professores = professores.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const container = document.getElementById('listaProfessores');
    if (!container) return;
    
    if (professores.length === 0) { 
        container.innerHTML = '<div style="text-align: center; padding: 40px;">Nenhum professor cadastrado</div>'; 
        return; 
    }

    let html = '<table class="table-modern"><thead><tr><th>Nome</th><th>Especialidade</th><th>Email</th><th>Escola</th><th>Salário</th><th>Ações</th></tr></thead><tbody>';
    professores.forEach(prof => {
        const escola = db.escolas.find(e => e.id === prof.escolaId);
        html += `<tr>
                    <td><strong>${prof.nome}</strong></td>
                    <td><span class="badge badge-success">${prof.especialidade}</span></td>
                    <td>${prof.email}</td>
                    <td>${escola?.nome || 'N/A'}</td>
                    <td>R$ ${prof.salario?.toLocaleString()}</td>
                    <td>
                        <button class="btn btn-outline" style="padding: 6px 12px; margin-right: 5px;" onclick="verDetalhes('professor', '${prof.id}')"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-danger" style="padding: 6px 12px;" onclick="excluirItem('professor', '${prof.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

// ==================== CRUD ALUNOS ====================
function renderAlunos(searchTerm = '') {
    let alunos = [...db.alunos];
    if (searchTerm) alunos = alunos.filter(a => a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || a.matricula.includes(searchTerm));

    const container = document.getElementById('listaAlunos');
    if (!container) return;
    
    if (alunos.length === 0) { 
        container.innerHTML = '<div style="text-align: center; padding: 40px;">Nenhum aluno cadastrado</div>'; 
        return; 
    }

    let html = '<table class="table-modern"><thead><tr><th>Nome</th><th>Matrícula</th><th>Turma</th><th>Média</th><th>Escola</th><th>Ações</th></tr></thead><tbody>';
    alunos.forEach(aluno => {
        const escola = db.escolas.find(e => e.id === aluno.escolaId);
        const status = (aluno.media || 0) >= 7 ? '✅ Aprovado' : '⚠️ Recuperação';
        html += `<tr>
                    <td><strong>${aluno.nome}</strong></td>
                    <td><span class="badge badge-warning">${aluno.matricula}</span></td>
                    <td>${aluno.turma}</td>
                    <td><strong>${aluno.media || '0.00'}</strong> - ${status}</td>
                    <td>${escola?.nome || 'N/A'}</td>
                    <td>
                        <button class="btn btn-outline" style="padding: 6px 12px; margin-right: 5px;" onclick="verDetalhes('aluno', '${aluno.id}')"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-danger" style="padding: 6px 12px;" onclick="excluirItem('aluno', '${aluno.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function atualizarSelectEscolas() {
    const selectProf = document.getElementById('prof_escolaId');
    const selectAluno = document.getElementById('aluno_escolaId');
    const options = '<option value="">Selecione uma escola</option>' + db.escolas.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
    if (selectProf) selectProf.innerHTML = options;
    if (selectAluno) selectAluno.innerHTML = options;
}

function verDetalhes(tipo, id) {
    let item = null;
    if (tipo === 'escola') item = db.escolas.find(e => e.id === id);
    else if (tipo === 'professor') item = db.professores.find(p => p.id === id);
    else if (tipo === 'aluno') item = db.alunos.find(a => a.id === id);

    if (!item) return;
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;
    
    let html = '<div style="line-height: 1.8;">';
    for (let [key, value] of Object.entries(item)) {
        if (key !== 'id') {
            if (key === 'notas') {
                html += `<p><strong>${key}:</strong> ${value.length} notas registradas</p>`;
            } else {
                html += `<p><strong>${key}:</strong> ${value}</p>`;
            }
        }
    }
    html += '</div>';
    content.innerHTML = html;
    modal.classList.add('active');
}

function excluirItem(tipo, id) {
    Swal.fire({
        title: 'Confirmar exclusão',
        text: 'Tem certeza que deseja excluir este registro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            if (tipo === 'escola') db.escolas = db.escolas.filter(e => e.id !== id);
            else if (tipo === 'professor') db.professores = db.professores.filter(p => p.id !== id);
            else if (tipo === 'aluno') db.alunos = db.alunos.filter(a => a.id !== id);
            db.salvar();
            if (tipo === 'escola') renderEscolas();
            else if (tipo === 'professor') renderProfessores();
            else if (tipo === 'aluno') renderAlunos();
            renderDashboard();
            showToast('Registro excluído com sucesso!');
        }
    });
}

// ==================== DASHBOARD ====================
function renderDashboard() {
    const stats = db.getStats();
    const financeStats = { receitas: financeiro.getReceitasTotal(), despesas: financeiro.getDespesasTotal(), saldo: financeiro.getSaldo() };

    const statsContainer = document.getElementById('statsContainer');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-card"><div><i class="fas fa-school fa-2x" style="color: var(--primary);"></i></div><div class="stat-value">${stats.totalEscolas}</div><div class="stat-label">Escolas</div></div>
            <div class="stat-card"><div><i class="fas fa-chalkboard-user fa-2x" style="color: var(--success);"></i></div><div class="stat-value">${stats.totalProfessores}</div><div class="stat-label">Professores</div></div>
            <div class="stat-card"><div><i class="fas fa-users fa-2x" style="color: var(--warning);"></i></div><div class="stat-value">${stats.totalAlunos}</div><div class="stat-label">Alunos</div></div>
            <div class="stat-card"><div><i class="fas fa-chart-line fa-2x" style="color: var(--info);"></i></div><div class="stat-value">${stats.mediaGeral}</div><div class="stat-label">Média Geral</div></div>
            <div class="stat-card"><div><i class="fas fa-dollar-sign fa-2x" style="color: var(--success);"></i></div><div class="stat-value">R$ ${financeStats.receitas.toLocaleString()}</div><div class="stat-label">Receitas</div></div>
            <div class="stat-card"><div><i class="fas fa-chart-line fa-2x" style="color: var(--danger);"></i></div><div class="stat-value">R$ ${financeStats.despesas.toLocaleString()}</div><div class="stat-label">Despesas</div></div>
        `;
    }

    const alunosPorEscola = db.escolas.map(e => ({ nome: e.nome, qtd: db.alunos.filter(a => a.escolaId === e.id).length }));
    const ctx = document.getElementById('distribuicaoChart')?.getContext('2d');
    if (ctx) {
        if (window.distribuicaoChart) window.distribuicaoChart.destroy();
        window.distribuicaoChart = new Chart(ctx, { 
            type: 'bar', 
            data: { 
                labels: alunosPorEscola.map(e => e.nome), 
                datasets: [{ 
                    label: 'Alunos por Escola', 
                    data: alunosPorEscola.map(e => e.qtd), 
                    backgroundColor: 'rgba(59,130,246,0.8)',
                    borderRadius: 10
                }] 
            }, 
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } }
            } 
        });
    }
    
    if (chatbot) chatbot.loadContext();
}

// ==================== FINANCEIRO ====================
function renderFinanceiro() {
    const financeStats = document.getElementById('financeStats');
    if (financeStats) {
        financeStats.innerHTML = `
            <div class="stat-card"><div class="stat-value">R$ ${financeiro.getSaldo().toLocaleString()}</div><div class="stat-label">Saldo Atual</div></div>
            <div class="stat-card"><div class="stat-value">R$ ${financeiro.getReceitasTotal().toLocaleString()}</div><div class="stat-label">Receitas</div></div>
            <div class="stat-card"><div class="stat-value">R$ ${financeiro.getDespesasTotal().toLocaleString()}</div><div class="stat-label">Despesas</div></div>
        `;
    }
    
    const container = document.getElementById('listaTransacoes');
    if (container) {
        container.innerHTML = `<table class="table-modern"><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Valor</th><th>Ações</th></tr></thead><tbody>
            ${financeiro.transacoes.map(t => `<tr><td>${t.data}</td><td>${t.descricao}</td><td>${t.categoria}</td><td><span style="background: ${t.tipo === 'receita' ? 'var(--success)' : 'var(--danger)'}">${t.tipo}</span></td><td>R$ ${t.valor.toLocaleString()}</td><td><button class="btn btn-danger" style="padding: 5px 10px;" onclick="excluirTransacao(${t.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
        </tbody></table>`;
    }
}

function excluirTransacao(id) { 
    financeiro.transacoes = financeiro.transacoes.filter(t => t.id !== id); 
    financeiro.salvar(); 
    renderFinanceiro(); 
    showToast('Transação excluída!'); 
}

// ==================== EXPORT FUNCTIONS ====================
function exportarExcelEscolas() { exportarParaExcel(db.escolas, 'escolas'); }
function exportarExcelProfessores() { exportarParaExcel(db.professores, 'professores'); }
function exportarExcelAlunos() { exportarParaExcel(db.alunos, 'alunos'); }
function exportarExcelFinanceiro() { exportarParaExcel(financeiro.transacoes, 'financeiro'); }

function exportarParaExcel(data, nome) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nome);
    XLSX.writeFile(wb, `${nome}_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Arquivo Excel exportado!');
}

async function gerarRelatorioPDF() {
    const tipo = document.getElementById('tipoRelatorio')?.value || 'geral';
    const stats = db.getStats();
    const escolas = db.escolas;
    const alunos = db.alunos;
    const professores = db.professores;
    
    let html = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h1 style="color: #3b82f6;">Piaget - Relatório ${tipo}</h1>
            <p><strong>Gerado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <hr>
            <h2>Resumo Geral</h2>
            <ul>
                <li>Total de Escolas: ${stats.totalEscolas}</li>
                <li>Total de Professores: ${stats.totalProfessores}</li>
                <li>Total de Alunos: ${stats.totalAlunos}</li>
                <li>Média Geral: ${stats.mediaGeral}</li>
            </ul>
            <h2>Escolas</h2>
            <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse;">
                <tr style="background: #f3f4f6;"><th>Nome</th><th>Diretor</th><th>Email</th><th>Alunos</th><th>Professores</th></tr>
                ${escolas.map(e => {
                    const qtdAlunos = alunos.filter(a => a.escolaId === e.id).length;
                    const qtdProfessores = professores.filter(p => p.escolaId === e.id).length;
                    return `<tr><td>${e.nome}</td><td>${e.diretor}</td><td>${e.email}</td><td>${qtdAlunos}</td><td>${qtdProfessores}</td></tr>`;
                }).join('')}
            </table>
            <h2>Alunos</h2>
            <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse;">
                <tr style="background: #f3f4f6;"><th>Nome</th><th>Matrícula</th><th>Turma</th><th>Média</th><th>Status</th></tr>
                ${alunos.map(a => {
                    const status = (a.media || 0) >= 7 ? 'Aprovado' : 'Recuperação';
                    return `<tr><td>${a.nome}</td><td>${a.matricula}</td><td>${a.turma}</td><td>${a.media || '0.00'}</td><td>${status}</td></tr>`;
                }).join('')}
            </table>
            <hr>
            <p style="text-align: center; color: #6b7280;">Relatório gerado pelo Sistema Piaget - Gestão Acadêmica</p>
        </div>
    `;
    
    const element = document.createElement('div'); 
    element.innerHTML = html; 
    document.body.appendChild(element);
    await html2pdf().from(element).save();
    document.body.removeChild(element);
    showToast('PDF gerado!');
}

function exportarRelatorioExcel() { exportarExcelEscolas(); }

// ==================== NOTIFICAÇÕES ====================
function renderNotificacoes() {
    const container = document.getElementById('listaNotificacoes');
    if (!container) return;
    
    container.innerHTML = `<div class="card-header"><h3>Notificações (${notifications.getNaoLidas().length} não lidas)</h3></div>
        ${notifications.notificacoes.map(n => `<div class="content-card" style="border-left: 4px solid ${n.tipo === 'success' ? 'var(--success)' : 'var(--info)'}"><strong>${n.titulo}</strong><br><small>${new Date(n.data).toLocaleString()}</small><p>${n.mensagem}</p>${!n.lida ? `<button class="btn btn-primary" style="margin-top: 10px;" onclick="marcarNotificacaoLida(${n.id})">Marcar como lida</button>` : ''}</div>`).join('')}`;
}

function enviarNotificacaoDemo() {
    Swal.fire({
        title: 'Nova Notificação', 
        html: '<input id="titulo" class="swal2-input" placeholder="Título"><textarea id="msg" class="swal2-textarea" placeholder="Mensagem"></textarea>', 
        preConfirm: () => {
            const titulo = document.getElementById('titulo')?.value, 
                  msg = document.getElementById('msg')?.value;
            if (titulo && msg) { 
                notifications.adicionar(titulo, msg, 'info'); 
                renderNotificacoes(); 
                showToast('Notificação enviada!');
                if (chatbot) {
                    addMessageToChat(`📢 **Nova notificação:** ${titulo}`, 'bot');
                }
            }
        }
    });
}

function marcarNotificacaoLida(id) { 
    notifications.marcarComoLida(id); 
    renderNotificacoes(); 
}

// ==================== WEBSOCKET SIMULADO ====================
function iniciarWebSocket() {
    if (wsInterval) clearInterval(wsInterval);
    
    wsInterval = setInterval(() => {
        const stats = db.getStats();
        const wsStatus = document.getElementById('wsStatus');
        if (wsStatus) {
            wsStatus.innerHTML = '<i class="fas fa-plug"></i><span>Conectado (Tempo Real)</span>';
            wsStatus.className = 'ws-status connected';
        }
        
        const newData = {
            timestamp: new Date().toLocaleTimeString(),
            alunos: stats.totalAlunos,
            professores: stats.totalProfessores,
            receitas: financeiro.getReceitasTotal()
        };
        
        realtimeData.push(newData);
        if (realtimeData.length > 10) realtimeData.shift();
        
        const ctx = document.getElementById('realtimeChart')?.getContext('2d');
        if (ctx && realtimeData.length > 0) {
            if (realtimeChart) realtimeChart.destroy();
            realtimeChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: realtimeData.map((_, i) => `T${i+1}`),
                    datasets: [
                        { label: 'Alunos', data: realtimeData.map(d => d.alunos), borderColor: 'rgb(59,130,246)', backgroundColor: 'rgba(59,130,246,0.1)', tension: 0.4, fill: true },
                        { label: 'Professores', data: realtimeData.map(d => d.professores), borderColor: 'rgb(16,185,129)', backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.4, fill: true },
                        { label: 'Receitas (R$ mil)', data: realtimeData.map(d => d.receitas / 1000), borderColor: 'rgb(245,158,11)', backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.4, fill: true }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } }
                }
            });
        }
    }, 5000);
}

// ==================== NAVEGAÇÃO ====================
function switchModule(module) {
    currentModule = module;
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`[data-module="${module}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    const modules = ['dashboard', 'escolas', 'professores', 'alunos', 'financeiro', 'relatorios', 'notificacoes'];
    modules.forEach(m => {
        const el = document.getElementById(`${m}Module`);
        if (el) el.style.display = m === module ? 'block' : 'none';
    });

    const titles = { 
        dashboard: 'Dashboard Acadêmico', 
        escolas: 'Gestão de Escolas', 
        professores: 'Gestão de Professores', 
        alunos: 'Gestão de Alunos', 
        financeiro: 'Módulo Financeiro', 
        relatorios: 'Relatórios', 
        notificacoes: 'Notificações' 
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.innerText = titles[module] || 'Piaget Acadêmico';

    if (module === 'dashboard') renderDashboard();
    else if (module === 'escolas') renderEscolas();
    else if (module === 'professores') { renderProfessores(); atualizarSelectEscolas(); }
    else if (module === 'alunos') { renderAlunos(); atualizarSelectEscolas(); }
    else if (module === 'financeiro') renderFinanceiro();
    else if (module === 'notificacoes') renderNotificacoes();
}

// ==================== EVENT LISTENERS DOS FORMULÁRIOS ====================
function setupFormListeners() {
    const formEscola = document.getElementById('formEscola');
    if (formEscola) {
        formEscola.addEventListener('submit', (e) => {
            e.preventDefault();
            const escola = {
                id: 'ESC' + Date.now(),
                nome: document.getElementById('escola_nome').value,
                endereco: document.getElementById('escola_endereco').value,
                telefone: document.getElementById('escola_telefone').value,
                email: document.getElementById('escola_email').value,
                diretor: document.getElementById('escola_diretor').value,
                cnpj: document.getElementById('escola_cnpj').value || '',
                dataCadastro: new Date().toISOString()
            };
            db.escolas.push(escola);
            db.salvar();
            renderEscolas();
            renderDashboard();
            atualizarSelectEscolas();
            showToast('Escola cadastrada com sucesso!');
            formEscola.reset();
            if (chatbot) {
                addMessageToChat(`📢 **Notificação:** Uma nova escola "${escola.nome}" foi cadastrada!`, 'bot');
            }
        });
    }
    
    const formProfessor = document.getElementById('formProfessor');
    if (formProfessor) {
        formProfessor.addEventListener('submit', (e) => {
            e.preventDefault();
            const professor = {
                id: 'PROF' + Date.now(),
                nome: document.getElementById('prof_nome').value,
                email: document.getElementById('prof_email').value,
                telefone: document.getElementById('prof_telefone').value,
                cpf: document.getElementById('prof_cpf').value,
                especialidade: document.getElementById('prof_especialidade').value,
                salario: parseFloat(document.getElementById('prof_salario').value),
                escolaId: document.getElementById('prof_escolaId').value,
                dataAdmissao: document.getElementById('prof_dataAdmissao').value || new Date().toISOString().split('T')[0],
                dataCadastro: new Date().toISOString()
            };
            db.professores.push(professor);
            db.salvar();
            renderProfessores();
            renderDashboard();
            showToast('Professor cadastrado com sucesso!');
            formProfessor.reset();
        });
    }
    
    const formAluno = document.getElementById('formAluno');
    if (formAluno) {
        formAluno.addEventListener('submit', (e) => {
            e.preventDefault();
            const notaInicial = parseFloat(document.getElementById('aluno_nota').value);
            const notas = notaInicial ? [{ valor: notaInicial, disciplina: 'Inicial' }] : [];
            const aluno = {
                id: 'ALU' + Date.now(),
                nome: document.getElementById('aluno_nome').value,
                email: document.getElementById('aluno_email').value,
                telefone: document.getElementById('aluno_telefone').value,
                cpf: document.getElementById('aluno_cpf').value,
                dataNascimento: document.getElementById('aluno_dataNascimento').value || '',
                matricula: 'MAT' + Date.now(),
                turma: document.getElementById('aluno_turma').value,
                escolaId: document.getElementById('aluno_escolaId').value,
                notas: notas,
                media: notaInicial || 0,
                dataCadastro: new Date().toISOString()
            };
            db.alunos.push(aluno);
            db.salvar();
            renderAlunos();
            renderDashboard();
            showToast('Aluno cadastrado com sucesso!');
            formAluno.reset();
        });
    }
    
    const formTransacao = document.getElementById('formTransacao');
    if (formTransacao) {
        formTransacao.addEventListener('submit', (e) => {
            e.preventDefault();
            financeiro.adicionar({
                descricao: document.getElementById('transacao_descricao').value,
                valor: parseFloat(document.getElementById('transacao_valor').value),
                tipo: document.getElementById('transacao_tipo').value,
                categoria: document.getElementById('transacao_categoria').value,
                data: document.getElementById('transacao_data').value || new Date().toISOString().split('T')[0]
            });
            renderFinanceiro();
            renderDashboard();
            showToast('Transação registrada!');
            formTransacao.reset();
        });
    }
    
    const buscaEscola = document.getElementById('buscaEscola');
    if (buscaEscola) buscaEscola.addEventListener('input', (e) => renderEscolas(e.target.value));
    
    const buscaProfessor = document.getElementById('buscaProfessor');
    if (buscaProfessor) buscaProfessor.addEventListener('input', (e) => renderProfessores(e.target.value));
    
    const buscaAluno = document.getElementById('buscaAluno');
    if (buscaAluno) buscaAluno.addEventListener('input', (e) => renderAlunos(e.target.value));
}

// ==================== ADICIONAR HTML DO CHATBOT ====================
function addChatbotHTML() {
    const chatbotHTML = `
    <div class="chatbot-container" id="chatbotContainer">
        <div class="chatbot-button" id="chatbotButton" onclick="toggleChatbot()">
            <i class="fab fa-whatsapp"></i>
            <span class="chatbot-badge" id="chatbotBadge">1</span>
        </div>
        
        <div class="chatbot-window" id="chatbotWindow">
            <div class="chatbot-header">
                <div class="chatbot-header-info">
                    <i class="fab fa-whatsapp"></i>
                    <div>
                        <h3>Assistente Piaget</h3>
                        <p>IA Online - Respondo em tempo real</p>
                    </div>
                </div>
                <button class="chatbot-close" onclick="toggleChatbot()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="message bot">
                    <div class="message-content">
                        <i class="fab fa-whatsapp"></i>
                        <div>
                            <strong>Assistente Piaget</strong>
                            <p>Olá! 👋 Sou o assistente virtual com IA do sistema Piaget. Como posso ajudar você hoje?</p>
                            <small>Agora</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chatbot-suggestions" id="chatbotSuggestions">
                <button class="suggestion-chip" onclick="sendQuickMessage('Como cadastrar uma escola?')">
                    <i class="fas fa-school"></i> Cadastrar Escola
                </button>
                <button class="suggestion-chip" onclick="sendQuickMessage('Como cadastrar um professor?')">
                    <i class="fas fa-chalkboard-user"></i> Cadastrar Professor
                </button>
                <button class="suggestion-chip" onclick="sendQuickMessage('Como cadastrar um aluno?')">
                    <i class="fas fa-user-graduate"></i> Cadastrar Aluno
                </button>
                <button class="suggestion-chip" onclick="sendQuickMessage('Como gerar relatórios?')">
                    <i class="fas fa-chart-line"></i> Gerar Relatórios
                </button>
                <button class="suggestion-chip" onclick="sendQuickMessage('estatísticas')">
                    <i class="fas fa-chart-pie"></i> Estatísticas
                </button>
                <button class="suggestion-chip" onclick="sendQuickMessage('falar com atendente')">
                    <i class="fas fa-headset"></i> Atendente
                </button>
            </div>
            
            <div class="chatbot-input">
                <input type="text" id="chatbotInput" placeholder="Digite sua mensagem..." onkeypress="handleChatbotKeyPress(event)">
                <button onclick="sendChatbotMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            
            <div class="ai-status" id="aiStatus">
                <i class="fas fa-microchip"></i> IA Inteligente | Modo Avançado
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    addChatbotHTML();
    
    document.querySelectorAll('.nav-link').forEach(link => { 
        link.addEventListener('click', () => {
            const module = link.dataset.module;
            if (module) switchModule(module);
        }); 
    });
    
    setupFormListeners();
});

// ==================== LOGIN ====================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (auth.login(email, password)) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';
            const user = auth.getCurrentUser();
            document.getElementById('userAvatar').textContent = user.avatar;
            document.getElementById('userName').textContent = user.name;
            
            chatbot = new IntelligentChatbot();
            
            iniciarWebSocket();
            atualizarSelectEscolas();
            switchModule('dashboard');
            notifications.adicionar('Login realizado', `Bem-vindo, ${user.name}!`, 'success');
            
            setTimeout(() => {
                showWelcomeMessage();
            }, 2000);
        } else {
            Swal.fire('Erro', 'Email ou senha inválidos', 'error');
        }
    });
}

function logout() { 
    auth.logout(); 
    if (wsInterval) clearInterval(wsInterval); 
    document.getElementById('loginScreen').style.display = 'flex'; 
    document.getElementById('appContainer').style.display = 'none'; 
    showToast('Logout realizado!'); 
}

// ==================== EXPOSIÇÃO GLOBAL ====================
window.verDetalhes = verDetalhes;
window.excluirItem = excluirItem;
window.closeModal = closeModal;
window.logout = logout;
window.exportarExcelEscolas = exportarExcelEscolas;
window.exportarExcelProfessores = exportarExcelProfessores;
window.exportarExcelAlunos = exportarExcelAlunos;
window.exportarExcelFinanceiro = exportarExcelFinanceiro;
window.gerarRelatorioPDF = gerarRelatorioPDF;
window.exportarRelatorioExcel = exportarRelatorioExcel;
window.enviarNotificacaoDemo = enviarNotificacaoDemo;
window.marcarNotificacaoLida = marcarNotificacaoLida;
window.excluirTransacao = excluirTransacao;

window.toggleChatbot = toggleChatbot;
window.sendChatbotMessage = sendChatbotMessage;
window.sendQuickMessage = sendQuickMessage;
window.handleChatbotKeyPress = handleChatbotKeyPress;
window.abrirWhatsApp = abrirWhatsApp;