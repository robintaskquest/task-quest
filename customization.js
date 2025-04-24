// customization.js - Sistema de personalização (cores, planos de fundo e colunas)

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar personalização
    initCustomization();
    
    // Configurar botão de personalização
    const customizationBtn = document.getElementById('customization-btn');
    const customizationModal = document.getElementById('customization-modal');
    
    customizationBtn.addEventListener('click', () => {
        customizationModal.style.display = 'block';
    });
    
    // Fechar modal ao clicar no X
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            customizationModal.style.display = 'none';
        });
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === customizationModal) {
            customizationModal.style.display = 'none';
        }
    });
    
    // Configurar abas de personalização
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover classe active de todos os botões
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            btn.classList.add('active');
            
            // Esconder todos os conteúdos
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Mostrar conteúdo correspondente
            const tabId = btn.dataset.tab;
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });
    
    // Configurar esquemas de cores
    const colorSchemes = document.querySelectorAll('.color-scheme');
    colorSchemes.forEach(scheme => {
        scheme.addEventListener('click', () => {
            const schemeName = scheme.dataset.scheme;
            applyColorScheme(schemeName);
        });
    });
    
    // Configurar opções de plano de fundo
    const backgroundOptions = document.querySelectorAll('.background-option');
    backgroundOptions.forEach(option => {
        option.addEventListener('click', () => {
            const bgValue = option.dataset.bg;
            applyBackground(bgValue);
        });
    });
    
    // Configurar formulário de personalização de colunas
    const columnsForm = document.getElementById('columns-form');
    columnsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saveColumnNames();
    });
});

// Inicializar personalização
function initCustomization() {
    // Carregar configurações salvas
    loadCustomizationSettings();
}

// Carregar configurações de personalização
function loadCustomizationSettings() {
    // Carregar esquema de cores
    const savedColorScheme = localStorage.getItem('robin_task_quest_color_scheme');
    if (savedColorScheme) {
        applyColorScheme(savedColorScheme);
    }
    
    // Carregar plano de fundo
    const savedBackground = localStorage.getItem('robin_task_quest_background');
    if (savedBackground) {
        applyBackground(savedBackground);
    }
    
    // Carregar nomes das colunas
    loadColumnNames();
}

// Aplicar esquema de cores
function applyColorScheme(schemeName) {
    // Remover esquema anterior
    document.documentElement.removeAttribute('data-color-scheme');
    
    // Aplicar novo esquema
    if (schemeName !== 'default') {
        document.documentElement.setAttribute('data-color-scheme', schemeName);
    }
    
    // Salvar no localStorage
    localStorage.setItem('robin_task_quest_color_scheme', schemeName);
}

// Aplicar plano de fundo
function applyBackground(bgValue) {
    // Remover classes de plano de fundo
    document.body.classList.remove('bg-doodle', 'bg-image', 'bg-mountains-night', 'bg-purple-gradient', 'bg-neon-doodle', 'bg-cabin', 'bg-field', 'bg-pink-mountains', 'bg-sunset-valley');
    
    // Aplicar novo plano de fundo
    if (bgValue === 'doodle') {
        document.body.classList.add('bg-doodle');
    } else if (bgValue !== 'none') {
        document.body.classList.add('bg-image');
        
        // Adicionar classe específica com base no nome do arquivo
        if (bgValue.includes('c3uhsgo1vx541.jpg')) {
            document.body.classList.add('bg-mountains-night');
        } else if (bgValue.includes('1276993.jpg')) {
            document.body.classList.add('bg-purple-gradient');
        } else if (bgValue.includes('wp14199750.webp')) {
            document.body.classList.add('bg-neon-doodle');
        } else if (bgValue.includes('cozy-cabin-in-the-woods')) {
            document.body.classList.add('bg-cabin');
        } else if (bgValue.includes('wallpaper2you_376223.jpg')) {
            document.body.classList.add('bg-field');
        } else if (bgValue.includes('9f7a0042715479838c35364624063f02.jpg')) {
            document.body.classList.add('bg-pink-mountains');
        } else if (bgValue.includes('sunset-mountain-valley')) {
            document.body.classList.add('bg-sunset-valley');
        }
    }
    
    // Salvar no localStorage
    localStorage.setItem('robin_task_quest_background', bgValue);
}

// Carregar nomes das colunas
function loadColumnNames() {
    // Carregar do localStorage
    const savedColumnNames = localStorage.getItem('robin_task_quest_column_names');
    
    if (savedColumnNames) {
        const columnNames = JSON.parse(savedColumnNames);
        
        // Atualizar campos do formulário
        document.getElementById('column-work').value = columnNames.work;
        document.getElementById('column-home').value = columnNames.home;
        document.getElementById('column-personal').value = columnNames.personal;
        
        // Atualizar títulos das colunas
        updateColumnTitles(columnNames);
    }
}

// Salvar nomes das colunas
function saveColumnNames() {
    // Obter valores dos campos
    const workColumn = document.getElementById('column-work').value.trim();
    const homeColumn = document.getElementById('column-home').value.trim();
    const personalColumn = document.getElementById('column-personal').value.trim();
    
    // Validar valores
    if (!workColumn || !homeColumn || !personalColumn) {
        alert('Todos os campos devem ser preenchidos.');
        return;
    }
    
    // Criar objeto com nomes das colunas
    const columnNames = {
        work: workColumn,
        home: homeColumn,
        personal: personalColumn
    };
    
    // Salvar no localStorage
    localStorage.setItem('robin_task_quest_column_names', JSON.stringify(columnNames));
    
    // Atualizar títulos das colunas
    updateColumnTitles(columnNames);
    
    // Fechar modal
    document.getElementById('customization-modal').style.display = 'none';
    
    // Mostrar mensagem de sucesso
    showNotification('Nomes das colunas atualizados com sucesso!');
}

// Atualizar títulos das colunas
function updateColumnTitles(columnNames) {
    // Atualizar títulos das categorias
    document.querySelector('.category[data-category="work"] h2').textContent = columnNames.work;
    document.querySelector('.category[data-category="home"] h2').textContent = columnNames.home;
    document.querySelector('.category[data-category="personal"] h2').textContent = columnNames.personal;
    
    // Atualizar opções no formulário de adição de tarefa
    const categorySelect = document.getElementById('task-category');
    if (categorySelect) {
        Array.from(categorySelect.options).forEach(option => {
            if (option.value === 'work') {
                option.textContent = columnNames.work;
            } else if (option.value === 'home') {
                option.textContent = columnNames.home;
            } else if (option.value === 'personal') {
                option.textContent = columnNames.personal;
            }
        });
    }
}

// Mostrar notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Adicionar ao corpo do documento
    document.body.appendChild(notification);
    
    // Animar notificação
    setTimeout(() => {
        notification.classList.add('show');
        
        // Remover após animação
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 10);
}
