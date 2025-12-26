// Configurações de autenticação
const ADMIN_PASSWORD = "admin830070"; // Senha personalizada do administrador
const SESSION_KEY = "adminLoggedIn";

// Verificar se já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    if (isLoggedIn()) {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
});

// Função para verificar se está logado
function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "true";
}

// Mostrar tela de login
function showLoginScreen() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    createLoginParticles();
}

// Mostrar painel admin
function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    // Inicializar o painel admin
    createFloatingParticles();
    loadSampleData();
    setupTabs();
    updateStats();
    renderAllTabs();
}

// Processar login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        // Login bem-sucedido
        sessionStorage.setItem(SESSION_KEY, "true");
        
        // Efeito de transição
        document.getElementById('loginContainer').classList.add('fade-out');
        
        setTimeout(() => {
            showAdminPanel();
            showNotification('🎉 Login realizado com sucesso! Bem-vindo ao painel!', 'success');
        }, 500);
        
    } else {
        // Senha incorreta
        showLoginError('❌ Senha incorreta! Tente novamente.');
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
        
        // Efeito de shake na caixa de login
        const loginBox = document.querySelector('.login-box');
        loginBox.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginBox.style.animation = 'loginBoxFloat 3s ease-in-out infinite';
        }, 500);
    }
});

// Função de logout
function logout() {
    if (confirm('Tem certeza que deseja sair do painel administrativo?')) {
        sessionStorage.removeItem(SESSION_KEY);
        showLoginScreen();
        showLoginNotification('👋 Logout realizado com sucesso!', 'info');
    }
}

// Mostrar erro de login
function showLoginError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.innerHTML = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 10001;
        animation: slideInRight 0.5s ease-out;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 500);
    }, 3000);
}

// Mostrar notificação de login
function showLoginNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `login-notification ${type}`;
    notification.innerHTML = message;
    
    const colors = {
        success: 'linear-gradient(135deg, #1dd1a1, #55a3ff)',
        error: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        info: 'linear-gradient(135deg, #54a0ff, #5f27cd)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 10001;
        animation: slideInRight 0.5s ease-out;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

// Criar partículas de login
function createLoginParticles() {
    const particlesContainer = document.getElementById('loginParticles');
    if (!particlesContainer) return;
    
    // Limpar partículas existentes
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'login-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Adicionar animação de shake
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// Prevenir acesso direto sem login
window.addEventListener('beforeunload', function() {
    if (!isLoggedIn()) {
        sessionStorage.removeItem(SESSION_KEY);
    }
});

// Dados simulados dos formulários
let formsData = {
    pending: [],
    approved: [],
    rejected: []
};

let currentFormId = null;
let currentRejectId = null;

// Sistema de login já inicializado acima

// Carregar dados de exemplo
function loadSampleData() {
    // Tentar carregar dados do localStorage primeiro
    const savedForms = JSON.parse(localStorage.getItem('adminForms'));
    
    if (savedForms) {
        formsData = savedForms;
    } else {
        // Dados de exemplo para demonstração
        formsData.pending = [
            {
                id: 'FORM001',
                nomeGame: 'Lilly Sunshine',
                idadePersonagem: '5',
                nomeReal: 'Maria Silva',
                discord: 'maria#1234',
                idServidor: 'ID12345',
                historia: 'Era uma vez uma menina chamada Lilly que adorava brincar no parque...',
                date: '2024-12-26 14:30',
                status: 'pending'
            },
            {
                id: 'FORM002',
                nomeGame: 'Tommy Rainbow',
                idadePersonagem: '6',
                nomeReal: 'João Santos',
                discord: 'joao#5678',
                idServidor: 'ID67890',
                historia: 'Tommy era um garoto muito alegre que sempre via arco-íris depois da chuva...',
                date: '2024-12-26 15:45',
                status: 'pending'
            },
            {
                id: 'FORM003',
                nomeGame: 'Bella Unicorn',
                idadePersonagem: '4',
                nomeReal: 'Ana Costa',
                discord: 'ana#9999',
                idServidor: 'ID11111',
                historia: 'Bella acreditava em unicórnios e sempre procurava por eles no jardim...',
                date: '2024-12-26 16:20',
                status: 'pending'
            }
        ];

        formsData.approved = [
            {
                id: 'FORM004',
                nomeGame: 'Charlie Star',
                idadePersonagem: '7',
                nomeReal: 'Pedro Lima',
                discord: 'pedro#4444',
                idServidor: 'ID22222',
                historia: 'Charlie sempre olhava para as estrelas e sonhava em ser astronauta...',
                date: '2024-12-25 10:15',
                status: 'approved',
                approvedDate: '2024-12-26 09:00'
            }
        ];

        formsData.rejected = [
            {
                id: 'FORM005',
                nomeGame: 'Max Thunder',
                idadePersonagem: '8',
                nomeReal: 'Lucas Oliveira',
                discord: 'lucas#7777',
                idServidor: 'ID33333',
                historia: 'Max era muito forte e sempre brigava com todos...',
                date: '2024-12-25 08:30',
                status: 'rejected',
                rejectedDate: '2024-12-26 08:45',
                rejectReason: 'História não condiz com o comportamento infantil esperado. Personagem muito agressivo.'
            }
        ];
        
        // Salvar dados de exemplo no localStorage
        localStorage.setItem('adminForms', JSON.stringify(formsData));
    }
}

// Configurar sistema de abas
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remover classe active de todas as abas
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Adicionar classe active na aba clicada
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Atualizar estatísticas
function updateStats() {
    const pendingCount = formsData.pending.length;
    const approvedCount = formsData.approved.length;
    const rejectedCount = formsData.rejected.length;

    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('approvedCount').textContent = approvedCount;
    document.getElementById('rejectedCount').textContent = rejectedCount;

    document.getElementById('pendingTabCount').textContent = pendingCount;
    document.getElementById('approvedTabCount').textContent = approvedCount;
    document.getElementById('rejectedTabCount').textContent = rejectedCount;
}

// Renderizar todas as abas
function renderAllTabs() {
    renderForms('pending');
    renderForms('approved');
    renderForms('rejected');
}

// Renderizar formulários
function renderForms(status) {
    const container = document.getElementById(`${status}Forms`);
    const forms = formsData[status];

    if (forms.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">${getEmptyIcon(status)}</div>
                <h3>Nenhum formulário ${getStatusText(status)}</h3>
                <p>Quando houver formulários ${getStatusText(status)}, eles aparecerão aqui.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = forms.map(form => `
        <div class="form-card ${status}" data-id="${form.id}">
            <div class="status-badge ${status}">${getStatusBadge(status)}</div>
            <div class="form-header">
                <div class="form-id">${form.id}</div>
                <div class="form-date">${formatDate(form.date)}</div>
            </div>
            <div class="form-info">
                <p><strong>🎮 Nome in game:</strong> ${form.nomeGame}</p>
                <p><strong>👶 Idade:</strong> ${form.idadePersonagem} anos</p>
                <p><strong>👤 Nome real:</strong> ${form.nomeReal}</p>
                <p><strong>💬 Discord:</strong> ${form.discord}</p>
                <p><strong>🆔 ID Servidor:</strong> ${form.idServidor}</p>
                ${form.rejectReason ? `<div class="reject-reason"><h4>❌ Motivo da Reprovação:</h4><p>${form.rejectReason}</p></div>` : ''}
            </div>
            <div class="form-actions">
                <button class="btn btn-info btn-small" onclick="viewForm('${form.id}')">👁️ Ver Detalhes</button>
                ${getActionButtons(status, form.id)}
            </div>
        </div>
    `).join('');
}

// Obter ícone para estado vazio
function getEmptyIcon(status) {
    const icons = {
        pending: '⏳',
        approved: '✅',
        rejected: '❌'
    };
    return icons[status];
}

// Obter texto do status
function getStatusText(status) {
    const texts = {
        pending: 'pendentes',
        approved: 'aprovados',
        rejected: 'reprovados'
    };
    return texts[status];
}

// Obter badge do status
function getStatusBadge(status) {
    const badges = {
        pending: '⏳ Pendente',
        approved: '✅ Aprovado',
        rejected: '❌ Reprovado'
    };
    return badges[status];
}

// Obter botões de ação baseado no status
function getActionButtons(status, formId) {
    if (status === 'pending') {
        return `
            <button class="btn btn-success btn-small" onclick="approveForm('${formId}')">✅ Aprovar</button>
            <button class="btn btn-danger btn-small" onclick="rejectForm('${formId}')">❌ Reprovar</button>
        `;
    } else if (status === 'approved') {
        return `
            <button class="btn btn-warning btn-small" onclick="moveToPending('${formId}', 'approved')">⏳ Pendente</button>
            <button class="btn btn-danger btn-small" onclick="rejectForm('${formId}')">❌ Reprovar</button>
        `;
    } else {
        return `
            <button class="btn btn-success btn-small" onclick="approveForm('${formId}')">✅ Aprovar</button>
            <button class="btn btn-warning btn-small" onclick="moveToPending('${formId}', 'rejected')">⏳ Pendente</button>
        `;
    }
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

// Visualizar formulário completo
function viewForm(formId) {
    const form = findFormById(formId);
    if (!form) return;

    currentFormId = formId;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="form-detail">
            <h4>🎮 Informações do Personagem</h4>
            <p><strong>Nome in game:</strong> ${form.nomeGame}</p>
            <p><strong>Idade do personagem:</strong> ${form.idadePersonagem} anos</p>
            <p><strong>Nome real:</strong> ${form.nomeReal}</p>
            <p><strong>Discord:</strong> ${form.discord}</p>
            <p><strong>ID no servidor:</strong> ${form.idServidor}</p>
        </div>
        
        <div class="form-detail">
            <h4>📚 História do Personagem</h4>
            <p>${form.historia}</p>
        </div>
        
        <div class="form-detail">
            <h4>📅 Informações do Formulário</h4>
            <p><strong>ID:</strong> ${form.id}</p>
            <p><strong>Data de envio:</strong> ${formatDate(form.date)}</p>
            <p><strong>Status atual:</strong> ${getStatusBadge(form.status)}</p>
            ${form.approvedDate ? `<p><strong>Data de aprovação:</strong> ${formatDate(form.approvedDate)}</p>` : ''}
            ${form.rejectedDate ? `<p><strong>Data de reprovação:</strong> ${formatDate(form.rejectedDate)}</p>` : ''}
        </div>
        
        ${form.rejectReason ? `
            <div class="form-detail reject-reason">
                <h4>❌ Motivo da Reprovação</h4>
                <p>${form.rejectReason}</p>
            </div>
        ` : ''}
    `;
    
    document.getElementById('formModal').style.display = 'block';
}

// Encontrar formulário por ID
function findFormById(formId) {
    for (let status in formsData) {
        const form = formsData[status].find(f => f.id === formId);
        if (form) return form;
    }
    return null;
}

// Aprovar formulário
function approveForm(formId) {
    const form = findFormById(formId);
    if (!form) return;

    // Remover de onde está
    removeFormFromCurrentStatus(formId);
    
    // Adicionar aos aprovados
    form.status = 'approved';
    form.approvedDate = new Date().toISOString();
    delete form.rejectReason;
    delete form.rejectedDate;
    formsData.approved.push(form);

    updateAndRender();
    createConfetti(); // Adicionar confetes
    showNotification(`✅ Formulário ${formId} aprovado com sucesso!`, 'success');
}

// Reprovar formulário
function rejectForm(formId) {
    currentRejectId = formId;
    document.getElementById('rejectReason').value = '';
    document.getElementById('rejectModal').style.display = 'block';
}

// Confirmar reprovação
function confirmReject() {
    const reason = document.getElementById('rejectReason').value.trim();
    if (!reason) {
        showNotification('❌ Por favor, digite o motivo da reprovação!', 'error');
        return;
    }

    const form = findFormById(currentRejectId);
    if (!form) return;

    // Remover de onde está
    removeFormFromCurrentStatus(currentRejectId);
    
    // Adicionar aos reprovados
    form.status = 'rejected';
    form.rejectedDate = new Date().toISOString();
    form.rejectReason = reason;
    delete form.approvedDate;
    formsData.rejected.push(form);

    updateAndRender();
    closeRejectModal();
    showNotification(`❌ Formulário ${currentRejectId} reprovado!`, 'error');
}

// Mover para pendentes
function moveToPending(formId, currentStatus) {
    const form = findFormById(formId);
    if (!form) return;

    // Remover de onde está
    removeFormFromCurrentStatus(formId);
    
    // Adicionar aos pendentes
    form.status = 'pending';
    delete form.approvedDate;
    delete form.rejectedDate;
    delete form.rejectReason;
    formsData.pending.push(form);

    updateAndRender();
    showNotification(`⏳ Formulário ${formId} movido para pendentes!`, 'info');
}

// Remover formulário do status atual
function removeFormFromCurrentStatus(formId) {
    for (let status in formsData) {
        formsData[status] = formsData[status].filter(f => f.id !== formId);
    }
}

// Aprovar todos os pendentes
function approveAll() {
    if (formsData.pending.length === 0) {
        showNotification('❌ Não há formulários pendentes para aprovar!', 'error');
        return;
    }

    const count = formsData.pending.length;
    formsData.pending.forEach(form => {
        form.status = 'approved';
        form.approvedDate = new Date().toISOString();
        formsData.approved.push(form);
    });
    
    formsData.pending = [];
    updateAndRender();
    createConfetti(); // Adicionar confetes
    showNotification(`✅ ${count} formulários aprovados com sucesso!`, 'success');
}

// Reprovar todos os pendentes
function rejectAll() {
    if (formsData.pending.length === 0) {
        showNotification('❌ Não há formulários pendentes para reprovar!', 'error');
        return;
    }

    const reason = prompt('Digite o motivo da reprovação em massa:');
    if (!reason) return;

    const count = formsData.pending.length;
    formsData.pending.forEach(form => {
        form.status = 'rejected';
        form.rejectedDate = new Date().toISOString();
        form.rejectReason = reason;
        formsData.rejected.push(form);
    });
    
    formsData.pending = [];
    updateAndRender();
    showNotification(`❌ ${count} formulários reprovados!`, 'error');
}

// Mover todos para pendentes
function moveAllToPending(fromStatus) {
    if (formsData[fromStatus].length === 0) {
        showNotification(`❌ Não há formulários ${getStatusText(fromStatus)} para mover!`, 'error');
        return;
    }

    const count = formsData[fromStatus].length;
    formsData[fromStatus].forEach(form => {
        form.status = 'pending';
        delete form.approvedDate;
        delete form.rejectedDate;
        delete form.rejectReason;
        formsData.pending.push(form);
    });
    
    formsData[fromStatus] = [];
    updateAndRender();
    showNotification(`⏳ ${count} formulários movidos para pendentes!`, 'info');
}

// Limpar reprovados
function clearRejected() {
    if (formsData.rejected.length === 0) {
        showNotification('❌ Não há formulários reprovados para limpar!', 'error');
        return;
    }

    if (confirm('Tem certeza que deseja limpar todos os formulários reprovados? Esta ação não pode ser desfeita.')) {
        const count = formsData.rejected.length;
        formsData.rejected = [];
        updateAndRender();
        showNotification(`🗑️ ${count} formulários reprovados removidos!`, 'info');
    }
}

// Exportar lista de aprovados
function exportApproved() {
    if (formsData.approved.length === 0) {
        showNotification('❌ Não há formulários aprovados para exportar!', 'error');
        return;
    }

    let csvContent = 'ID,Nome in Game,Idade,Nome Real,Discord,ID Servidor,Data Aprovação\n';
    
    formsData.approved.forEach(form => {
        csvContent += `${form.id},${form.nomeGame},${form.idadePersonagem},${form.nomeReal},${form.discord},${form.idServidor},${formatDate(form.approvedDate)}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formularios_aprovados_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('📊 Lista de aprovados exportada com sucesso!', 'success');
}

// Atualizar dados e renderizar
function updateAndRender() {
    // Salvar no localStorage
    localStorage.setItem('adminForms', JSON.stringify(formsData));
    updateStats();
    renderAllTabs();
}

// Atualizar dados
function refreshData() {
    // Recarregar dados do localStorage
    const savedForms = JSON.parse(localStorage.getItem('adminForms'));
    if (savedForms) {
        formsData = savedForms;
    }
    
    updateAndRender();
    showNotification('🔄 Dados atualizados!', 'info');
}

// Aprovar do modal
function approveFromModal() {
    if (currentFormId) {
        approveForm(currentFormId);
        closeModal();
    }
}

// Reprovar do modal
function rejectFromModal() {
    if (currentFormId) {
        closeModal();
        rejectForm(currentFormId);
    }
}

// Fechar modal
function closeModal() {
    document.getElementById('formModal').style.display = 'none';
    currentFormId = null;
}

// Fechar modal de reprovação
function closeRejectModal() {
    document.getElementById('rejectModal').style.display = 'none';
    currentRejectId = null;
}

// Mostrar notificação
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 10001;
        animation: slideInRight 0.5s ease-out;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    const colors = {
        success: 'linear-gradient(135deg, #1dd1a1, #55a3ff)',
        error: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        info: 'linear-gradient(135deg, #54a0ff, #5f27cd)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const formModal = document.getElementById('formModal');
    const rejectModal = document.getElementById('rejectModal');
    
    if (event.target === formModal) {
        closeModal();
    }
    if (event.target === rejectModal) {
        closeRejectModal();
    }
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('🎯 Painel Admin carregado com sucesso! 🌟');
// Criar partículas flutuantes
function createFloatingParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Inicializar partículas quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Código movido para o sistema de login
});

// Efeito de confetes para ações de sucesso
function createConfetti() {
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#a29bfe'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            z-index: 10000;
            border-radius: 50%;
            box-shadow: 0 0 6px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

// Adicionar animação de confetes
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);