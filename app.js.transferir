// app.js - Arquivo principal de inicialização do aplicativo

// Estado global do aplicativo
const appState = {
    currentView: 'day', // 'day', 'week', 'month'
    currentDate: new Date(),
    user: {
        level: 1,
        xp: 0,
        nextLevelXp: 100
    }
};

// Inicialização do aplicativo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    initViewSelector();
    initDateNavigator();
    initModals();
    
    // Carregar dados salvos
    loadUserData();
    loadTasks();
    
    // Atualizar interface
    updateUserInterface();
});

// Inicializar seletor de visualização (dia, semana, mês)
function initViewSelector() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe ativa de todos os botões
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            button.classList.add('active');
            
            // Atualizar visualização atual
            appState.currentView = button.dataset.view;
            
            // Atualizar interface
            updateUserInterface();
        });
    });
}

// Inicializar navegador de datas
function initDateNavigator() {
    const prevButton = document.getElementById('prev-date');
    const nextButton = document.getElementById('next-date');
    
    prevButton.addEventListener('click', () => {
        navigateDate(-1);
    });
    
    nextButton.addEventListener('click', () => {
        navigateDate(1);
    });
    
    // Atualizar data atual na interface
    updateDateDisplay();
}

// Navegar entre datas
function navigateDate(direction) {
    const currentDate = appState.currentDate;
    
    switch (appState.currentView) {
        case 'day':
            currentDate.setDate(currentDate.getDate() + direction);
            break;
        case 'week':
            currentDate.setDate(currentDate.getDate() + (direction * 7));
            break;
        case 'month':
            currentDate.setMonth(currentDate.getMonth() + direction);
            break;
    }
    
    // Atualizar interface
    updateDateDisplay();
    updateTaskLists();
}

// Atualizar exibição da data atual
function updateDateDisplay() {
    const dateElement = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    if (appState.currentView === 'day') {
        // Verificar se é hoje
        const today = new Date();
        if (isSameDay(today, appState.currentDate)) {
            dateElement.textContent = 'Hoje';
        } else {
            dateElement.textContent = appState.currentDate.toLocaleDateString('pt-BR', options);
        }
    } else if (appState.currentView === 'week') {
        // Obter primeiro e último dia da semana
        const firstDay = getFirstDayOfWeek(appState.currentDate);
        const lastDay = new Date(firstDay);
        lastDay.setDate(lastDay.getDate() + 6);
        
        const firstDayStr = firstDay.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
        const lastDayStr = lastDay.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
        
        dateElement.textContent = `${firstDayStr} - ${lastDayStr}`;
    } else if (appState.currentView === 'month') {
        dateElement.textContent = appState.currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
}

// Verificar se duas datas são o mesmo dia
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Obter o primeiro dia da semana (domingo) para uma data
function getFirstDayOfWeek(date) {
    const day = date.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
}

// Inicializar modais
function initModals() {
    // Modal de adicionar tarefa
    const addTaskButtons = document.querySelectorAll('.add-task-btn');
    const addTaskModal = document.getElementById('add-task-modal');
    const addTaskForm = document.getElementById('add-task-form');
    
    addTaskButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Preencher categoria selecionada
            const categorySelect = document.getElementById('task-category');
            const category = button.dataset.category;
            
            if (category !== 'all') {
                categorySelect.value = category;
            }
            
            // Preencher data atual
            const dateInput = document.getElementById('task-date');
            dateInput.valueAsDate = appState.currentDate;
            
            // Exibir modal
            addTaskModal.style.display = 'block';
        });
    });
    
    // Modal de configurações do pomodoro
    const pomodoroSettingsButton = document.getElementById('pomodoro-settings');
    const pomodoroSettingsModal = document.getElementById('pomodoro-settings-modal');
    
    pomodoroSettingsButton.addEventListener('click', () => {
        pomodoroSettingsModal.style.display = 'block';
    });
    
    // Fechar modais
    const closeButtons = document.querySelectorAll('.close-modal');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Submissão do formulário de adicionar tarefa
    addTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Obter valores do formulário
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const category = document.getElementById('task-category').value;
        const priority = document.getElementById('task-priority').value;
        const date = document.getElementById('task-date').value;
        const xp = parseInt(document.getElementById('task-xp').value);
        
        // Adicionar nova tarefa
        addTask({
            id: generateId(),
            title,
            description,
            category,
            priority,
            date,
            xp,
            completed: false,
            createdAt: new Date().toISOString()
        });
        
        // Fechar modal e limpar formulário
        addTaskModal.style.display = 'none';
        addTaskForm.reset();
    });
    
    // Submissão do formulário de configurações do pomodoro
    const pomodoroSettingsForm = document.getElementById('pomodoro-settings-form');
    
    pomodoroSettingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Obter valores do formulário
        const workTime = parseInt(document.getElementById('work-time').value);
        const breakTime = parseInt(document.getElementById('break-time').value);
        const longBreakTime = parseInt(document.getElementById('long-break-time').value);
        const pomodoroCount = parseInt(document.getElementById('pomodoro-count').value);
        
        // Atualizar configurações do pomodoro
        updatePomodoroSettings({
            workTime,
            breakTime,
            longBreakTime,
            pomodoroCount
        });
        
        // Fechar modal
        pomodoroSettingsModal.style.display = 'none';
    });
}

// Gerar ID único para tarefas
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Atualizar interface do usuário
function updateUserInterface() {
    // Atualizar informações do usuário
    updateUserInfo();
    
    // Atualizar listas de tarefas
    updateTaskLists();
}

// Atualizar informações do usuário na interface
function updateUserInfo() {
    const levelElement = document.querySelector('.level');
    const xpProgressElement = document.querySelector('.xp-progress');
    const xpTextElement = document.querySelector('.xp-text');
    
    levelElement.textContent = `Nível ${appState.user.level}`;
    
    const progressPercentage = (appState.user.xp / appState.user.nextLevelXp) * 100;
    xpProgressElement.style.width = `${progressPercentage}%`;
    
    xpTextElement.textContent = `${appState.user.xp}/${appState.user.nextLevelXp} XP`;
}

// Carregar dados do usuário do armazenamento local
function loadUserData() {
    const userData = localStorage.getItem('taskquest_user');
    
    if (userData) {
        appState.user = JSON.parse(userData);
    }
}

// Salvar dados do usuário no armazenamento local
function saveUserData() {
    localStorage.setItem('taskquest_user', JSON.stringify(appState.user));
}

// Função para inicializar o aplicativo quando o DOM estiver carregado
window.addEventListener('load', () => {
    console.log('TaskQuest inicializado com sucesso!');
});
