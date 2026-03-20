
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

// ==================== UI CONTROLLER ====================
const auth = new Auth();
const db = new Database();
const financeiro = new Financeiro();
const notifications = new NotificationSystem();
let realtimeChart = null;
let realtimeData = [];

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.innerHTML = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function closeModal() { document.getElementById('detailModal').classList.remove('active'); }

function verDetalhes(tipo, id) {
    let item = null;
    if (tipo === 'escola') item = db.escolas.find(e => e.id === id);
    else if (tipo === 'professor') item = db.professores.find(p => p.id === id);
    else if (tipo === 'aluno') item = db.alunos.find(a => a.id === id);

    if (!item) return;
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('modalContent');
    let html = '<div style="line-height: 1.8;">';
    for (let [key, value] of Object.entries(item)) {
        if (key !== 'id') html += `<p><strong>${key}:</strong> ${value}</p>`;
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

// ==================== ESCOLAS CRUD ====================
function renderEscolas(searchTerm = '') {
    let escolas = [...db.escolas];
    if (searchTerm) escolas = escolas.filter(e => e.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const container = document.getElementById('listaEscolas');
    if (escolas.length === 0) { container.innerHTML = '<div style="text-align: center; padding: 40px;">Nenhuma escola cadastrada</div>'; return; }

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

document.getElementById('formEscola')?.addEventListener('submit', (e) => {
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
    e.target.reset();
});

document.getElementById('buscaEscola')?.addEventListener('input', (e) => renderEscolas(e.target.value));

// ==================== PROFESSORES CRUD ====================
function renderProfessores(searchTerm = '') {
    let professores = [...db.professores];
    if (searchTerm) professores = professores.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const container = document.getElementById('listaProfessores');
    if (professores.length === 0) { container.innerHTML = '<div style="text-align: center; padding: 40px;">Nenhum professor cadastrado</div>'; return; }

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

function atualizarSelectEscolas() {
    const selectProf = document.getElementById('prof_escolaId');
    const selectAluno = document.getElementById('aluno_escolaId');
    const options = '<option value="">Selecione uma escola</option>' + db.escolas.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
    if (selectProf) selectProf.innerHTML = options;
    if (selectAluno) selectAluno.innerHTML = options;
}

document.getElementById('formProfessor')?.addEventListener('submit', (e) => {
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
    e.target.reset();
});

document.getElementById('buscaProfessor')?.addEventListener('input', (e) => renderProfessores(e.target.value));

// ==================== ALUNOS CRUD ====================
function renderAlunos(searchTerm = '') {
    let alunos = [...db.alunos];
    if (searchTerm) alunos = alunos.filter(a => a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || a.matricula.includes(searchTerm));

    const container = document.getElementById('listaAlunos');
    if (alunos.length === 0) { container.innerHTML = '<div style="text-align: center; padding: 40px;">Nenhum aluno cadastrado</div>'; return; }

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

document.getElementById('formAluno')?.addEventListener('submit', (e) => {
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
    e.target.reset();
});

document.getElementById('buscaAluno')?.addEventListener('input', (e) => renderAlunos(e.target.value));

// ==================== DASHBOARD ====================
function renderDashboard() {
    const stats = db.getStats();
    const financeStats = { receitas: financeiro.getReceitasTotal(), despesas: financeiro.getDespesasTotal(), saldo: financeiro.getSaldo() };

    document.getElementById('statsContainer').innerHTML = `
                <div class="stat-card"><div><i class="fas fa-school fa-2x" style="color: var(--primary);"></i></div><div class="stat-value">${stats.totalEscolas}</div><div class="stat-label">Escolas</div></div>
                <div class="stat-card"><div><i class="fas fa-chalkboard-user fa-2x" style="color: var(--success);"></i></div><div class="stat-value">${stats.totalProfessores}</div><div class="stat-label">Professores</div></div>
                <div class="stat-card"><div><i class="fas fa-users fa-2x" style="color: var(--warning);"></i></div><div class="stat-value">${stats.totalAlunos}</div><div class="stat-label">Alunos</div></div>
                <div class="stat-card"><div><i class="fas fa-chart-line fa-2x" style="color: var(--info);"></i></div><div class="stat-value">${stats.mediaGeral}</div><div class="stat-label">Média Geral</div></div>
                <div class="stat-card"><div><i class="fas fa-dollar-sign fa-2x" style="color: var(--success);"></i></div><div class="stat-value">R$ ${financeStats.receitas.toLocaleString()}</div><div class="stat-label">Receitas</div></div>
                <div class="stat-card"><div><i class="fas fa-chart-line fa-2x" style="color: var(--danger);"></i></div><div class="stat-value">R$ ${financeStats.despesas.toLocaleString()}</div><div class="stat-label">Despesas</div></div>
            `;

    const alunosPorEscola = db.escolas.map(e => ({ nome: e.nome, qtd: db.alunos.filter(a => a.escolaId === e.id).length }));
    const ctx = document.getElementById('distribuicaoChart')?.getContext('2d');
    if (ctx) new Chart(ctx, { type: 'bar', data: { labels: alunosPorEscola.map(e => e.nome), datasets: [{ label: 'Alunos por Escola', data: alunosPorEscola.map(e => e.qtd), backgroundColor: 'rgba(59,130,246,0.8)' }] }, options: { responsive: true, maintainAspectRatio: false } });
}

// ==================== FINANCEIRO ====================
function renderFinanceiro() {
    document.getElementById('financeStats').innerHTML = `
                <div class="stat-card"><div class="stat-value">R$ ${financeiro.getSaldo().toLocaleString()}</div><div class="stat-label">Saldo Atual</div></div>
                <div class="stat-card"><div class="stat-value">R$ ${financeiro.getReceitasTotal().toLocaleString()}</div><div class="stat-label">Receitas</div></div>
                <div class="stat-card"><div class="stat-value">R$ ${financeiro.getDespesasTotal().toLocaleString()}</div><div class="stat-label">Despesas</div></div>
            `;
    const container = document.getElementById('listaTransacoes');
    container.innerHTML = `<table class="table-modern"><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Valor</th><th>Ações</th></tr></thead><tbody>
                ${financeiro.transacoes.map(t => `<tr><td>${t.data}</td><td>${t.descricao}</td><td>${t.categoria}</td><td><span style="background: ${t.tipo === 'receita' ? 'var(--success)' : 'var(--danger)'}">${t.tipo}</span></td><td>R$ ${t.valor.toLocaleString()}</td><td><button class="btn btn-danger" style="padding: 5px 10px;" onclick="excluirTransacao(${t.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
            </tbody></table>`;
}

function excluirTransacao(id) { financeiro.transacoes = financeiro.transacoes.filter(t => t.id !== id); financeiro.salvar(); renderFinanceiro(); showToast('Transação excluída!'); }

document.getElementById('formTransacao')?.addEventListener('submit', (e) => {
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
    e.target.reset();
});

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
    const tipo = document.getElementById('tipoRelatorio').value;
    const stats = db.getStats();
    const html = `<div style="padding: 20px;"><h1>Relatório ${tipo}</h1><p>Data: ${new Date().toLocaleString()}</p><hr><h2>Resumo</h2><p>Escolas: ${stats.totalEscolas} | Professores: ${stats.totalProfessores} | Alunos: ${stats.totalAlunos} | Média: ${stats.mediaGeral}</p></div>`;
    const element = document.createElement('div'); element.innerHTML = html; document.body.appendChild(element);
    await html2pdf().from(element).save();
    document.body.removeChild(element);
    showToast('PDF gerado!');
}

function exportarRelatorioExcel() { exportarExcelEscolas(); }

// ==================== NOTIFICAÇÕES ====================
function renderNotificacoes() {
    const container = document.getElementById('listaNotificacoes');
    container.innerHTML = `<div class="card-header"><h3>Notificações (${notifications.getNaoLidas().length} não lidas)</h3></div>
                ${notifications.notificacoes.map(n => `<div class="content-card" style="border-left: 4px solid ${n.tipo === 'success' ? 'var(--success)' : 'var(--info)'}"><strong>${n.titulo}</strong><br><small>${new Date(n.data).toLocaleString()}</small><p>${n.mensagem}</p>${!n.lida ? `<button class="btn btn-primary" style="margin-top: 10px;" onclick="marcarNotificacaoLida(${n.id})">Marcar como lida</button>` : ''}</div>`).join('')}`;
}

function enviarNotificacaoDemo() {
    Swal.fire({
        title: 'Nova Notificação', html: '<input id="titulo" class="swal2-input" placeholder="Título"><textarea id="msg" class="swal2-textarea" placeholder="Mensagem"></textarea>', preConfirm: () => {
            const titulo = document.getElementById('titulo').value, msg = document.getElementById('msg').value;
            if (titulo && msg) { notifications.adicionar(titulo, msg, 'info'); renderNotificacoes(); showToast('Notificação enviada!'); }
        }
    });
}

function marcarNotificacaoLida(id) { notifications.marcarComoLida(id); renderNotificacoes(); }

// ==================== WEBSOCKET SIMULADO ====================
let wsInterval;
function iniciarWebSocket() {
    wsInterval = setInterval(() => {
        const stats = db.getStats();
        document.getElementById('wsStatus').innerHTML = '<i class="fas fa-plug"></i><span>Conectado (Tempo Real)</span>';
        document.getElementById('wsStatus').className = 'ws-status connected';
    }, 5000);
}

// ==================== NAVEGAÇÃO ====================
let currentModule = 'dashboard';
function switchModule(module) {
    currentModule = module;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-module="${module}"]`).classList.add('active');
    document.getElementById('dashboardModule').style.display = module === 'dashboard' ? 'block' : 'none';
    document.getElementById('escolasModule').style.display = module === 'escolas' ? 'block' : 'none';
    document.getElementById('professoresModule').style.display = module === 'professores' ? 'block' : 'none';
    document.getElementById('alunosModule').style.display = module === 'alunos' ? 'block' : 'none';
    document.getElementById('financeiroModule').style.display = module === 'financeiro' ? 'block' : 'none';
    document.getElementById('relatoriosModule').style.display = module === 'relatorios' ? 'block' : 'none';
    document.getElementById('notificacoesModule').style.display = module === 'notificacoes' ? 'block' : 'none';

    const titles = { dashboard: 'Dashboard Acadêmico', escolas: 'Gestão de Escolas', professores: 'Gestão de Professores', alunos: 'Gestão de Alunos', financeiro: 'Módulo Financeiro', relatorios: 'Relatórios', notificacoes: 'Notificações' };
    document.getElementById('pageTitle').innerText = titles[module];

    if (module === 'dashboard') renderDashboard();
    else if (module === 'escolas') renderEscolas();
    else if (module === 'professores') { renderProfessores(); atualizarSelectEscolas(); }
    else if (module === 'alunos') { renderAlunos(); atualizarSelectEscolas(); }
    else if (module === 'financeiro') renderFinanceiro();
    else if (module === 'notificacoes') renderNotificacoes();
}

document.querySelectorAll('.nav-link').forEach(link => { link.addEventListener('click', () => switchModule(link.dataset.module)); });

// ==================== LOGIN ====================
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (auth.login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value)) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        const user = auth.getCurrentUser();
        document.getElementById('userAvatar').textContent = user.avatar;
        document.getElementById('userName').textContent = user.name;
        iniciarWebSocket();
        atualizarSelectEscolas();
        switchModule('dashboard');
        notifications.adicionar('Login realizado', `Bem-vindo, ${user.name}!`, 'success');
    } else Swal.fire('Erro', 'Email ou senha inválidos', 'error');
});

function logout() { auth.logout(); if (wsInterval) clearInterval(wsInterval); document.getElementById('loginScreen').style.display = 'flex'; document.getElementById('appContainer').style.display = 'none'; showToast('Logout realizado!'); }

window.verDetalhes = verDetalhes; window.excluirItem = excluirItem; window.closeModal = closeModal; window.logout = logout;
window.exportarExcelEscolas = exportarExcelEscolas; window.exportarExcelProfessores = exportarExcelProfessores; window.exportarExcelAlunos = exportarExcelAlunos;
window.exportarExcelFinanceiro = exportarExcelFinanceiro; window.gerarRelatorioPDF = gerarRelatorioPDF; window.exportarRelatorioExcel = exportarRelatorioExcel;
window.enviarNotificacaoDemo = enviarNotificacaoDemo; window.marcarNotificacaoLida = marcarNotificacaoLida; window.excluirTransacao = excluirTransacao;
