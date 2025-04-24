// calendar.js - Sistema de calendário com visualização de tarefas

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar calendário
    initCalendar();
    
    // Atualizar calendário quando a visualização mudar
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(updateCalendar, 100);
        });
    });
    
    // Atualizar calendário quando a data mudar
    document.getElementById('prev-date').addEventListener('click', () => {
        setTimeout(updateCalendar, 100);
    });
    
    document.getElementById('next-date').addEventListener('click', () => {
        setTimeout(updateCalendar, 100);
    });
});

// Inicializar calendário
function initCalendar() {
    // Gerar calendário inicial
    updateCalendar();
}

// Atualizar calendário com base na visualização atual
function updateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentView = document.querySelector('.view-btn.active').dataset.view;
    
    // Limpar dias existentes (mantendo os cabeçalhos)
    const headers = Array.from(calendarGrid.querySelectorAll('.calendar-day-header'));
    calendarGrid.innerHTML = '';
    
    // Readicionar cabeçalhos
    headers.forEach(header => {
        calendarGrid.appendChild(header);
    });
    
    // Gerar calendário com base na visualização
    if (currentView === 'month') {
        generateMonthCalendar();
    } else if (currentView === 'week') {
        generateWeekCalendar();
    } else {
        generateDayCalendar();
    }
    
    // Adicionar eventos ao calendário
    populateCalendarWithTasks();
}

// Gerar calendário mensal
function generateMonthCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentDate = appState.currentDate;
    
    // Primeiro dia do mês
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    // Último dia do mês
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
    let firstDayOfWeek = firstDay.getDay();
    
    // Dias do mês anterior para preencher o início do calendário
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    // Adicionar dias do mês anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = prevMonthLastDay - i;
        
        day.appendChild(dayNumber);
        calendarGrid.appendChild(day);
    }
    
    // Adicionar dias do mês atual
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        
        // Verificar se é hoje
        if (
            today.getDate() === i &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear()
        ) {
            day.classList.add('today');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = i;
        
        day.appendChild(dayNumber);
        day.dataset.date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        calendarGrid.appendChild(day);
    }
    
    // Calcular quantos dias do próximo mês precisamos adicionar
    const totalDaysAdded = firstDayOfWeek + lastDay.getDate();
    const remainingCells = 42 - totalDaysAdded; // 6 semanas * 7 dias = 42
    
    // Adicionar dias do próximo mês
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = i;
        
        day.appendChild(dayNumber);
        calendarGrid.appendChild(day);
    }
}

// Gerar calendário semanal
function generateWeekCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentDate = appState.currentDate;
    
    // Obter o primeiro dia da semana (domingo)
    const firstDayOfWeek = getFirstDayOfWeek(currentDate);
    
    // Adicionar os 7 dias da semana
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const day = new Date(firstDayOfWeek);
        day.setDate(day.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Verificar se é hoje
        if (
            today.getDate() === day.getDate() &&
            today.getMonth() === day.getMonth() &&
            today.getFullYear() === day.getFullYear()
        ) {
            dayElement.classList.add('today');
        }
        
        // Verificar se é outro mês
        if (day.getMonth() !== currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day.getDate();
        
        dayElement.appendChild(dayNumber);
        dayElement.dataset.date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        
        calendarGrid.appendChild(dayElement);
    }
}

// Gerar calendário diário
function generateDayCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentDate = appState.currentDate;
    
    // Criar um único dia
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.classList.add('today'); // Sempre destacado
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = currentDate.getDate();
    
    dayElement.appendChild(dayNumber);
    dayElement.dataset.date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    
    // Estilizar para ocupar toda a largura
    dayElement.style.gridColumn = '1 / -1';
    dayElement.style.minHeight = '300px';
    
    calendarGrid.appendChild(dayElement);
}

// Preencher calendário com tarefas
function populateCalendarWithTasks() {
    // Obter todas as tarefas
    const allTasks = tasks || [];
    
    // Para cada tarefa, adicionar ao calendário
    allTasks.forEach(task => {
        const taskDate = new Date(task.date);
        const dateString = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}-${String(taskDate.getDate()).padStart(2, '0')}`;
        
        // Encontrar o elemento do dia correspondente
        const dayElement = document.querySelector(`.calendar-day[data-date="${dateString}"]`);
        
        if (dayElement) {
            // Criar elemento de evento
            const eventElement = document.createElement('div');
            eventElement.className = 'calendar-event';
            eventElement.dataset.taskId = task.id;
            
            // Adicionar classe de prioridade
            if (task.priority === 'high') {
                eventElement.classList.add('priority-high');
            } else if (task.priority === 'urgent') {
                eventElement.classList.add('priority-urgent');
            }
            
            // Adicionar classe de conclusão
            if (task.completed) {
                eventElement.classList.add('completed');
            }
            
            // Definir texto
            eventElement.textContent = task.title;
            
            // Adicionar evento de clique para mostrar detalhes
            eventElement.addEventListener('click', () => {
                openTaskViewModal(task.id);
            });
            
            // Adicionar ao dia
            dayElement.appendChild(eventElement);
        }
    });
}

// Obter o primeiro dia da semana (domingo) para uma data
function getFirstDayOfWeek(date) {
    const day = date.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    const diff = date.getDate() - day;
    return new Date(date.getFullYear(), date.getMonth(), diff);
}

// Abrir modal de visualização de tarefa
function openTaskViewModal(taskId) {
    // Encontrar a tarefa pelo ID
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        console.error('Tarefa não encontrada:', taskId);
        return;
    }
    
    // Preencher dados da tarefa no modal
    document.getElementById('view-task-title').textContent = task.title;
    document.getElementById('view-task-description').textContent = task.description || 'Sem descrição';
    
    // Formatar categoria
    let categoryText = '';
    switch (task.category) {
        case 'work':
            categoryText = document.querySelector('.category[data-category="work"] h2').textContent;
            break;
        case 'home':
            categoryText = document.querySelector('.category[data-category="home"] h2').textContent;
            break;
        case 'personal':
            categoryText = document.querySelector('.category[data-category="personal"] h2').textContent;
            break;
        default:
            categoryText = task.category;
    }
    document.getElementById('view-task-category').textContent = categoryText;
    
    // Formatar prioridade
    let priorityText = '';
    switch (task.priority) {
        case 'normal':
            priorityText = 'Normal';
            break;
        case 'high':
            priorityText = 'Alta';
            break;
        case 'urgent':
            priorityText = 'Urgente';
            break;
        default:
            priorityText = task.priority;
    }
    document.getElementById('view-task-priority').textContent = priorityText;
    
    // Formatar data
    const taskDate = new Date(task.date);
    const formattedDate = `${taskDate.getDate().toString().padStart(2, '0')}/${(taskDate.getMonth() + 1).toString().padStart(2, '0')}/${taskDate.getFullYear()}`;
    document.getElementById('view-task-date').textContent = formattedDate;
    
    // XP
    document.getElementById('view-task-xp').textContent = `${task.xp} XP`;
    
    // Status
    document.getElementById('view-task-status').textContent = task.completed ? 'Concluída' : 'Pendente';
    
    // Configurar botões de ação
    const completeTaskBtn = document.getElementById('complete-task-btn');
    if (task.completed) {
        completeTaskBtn.textContent = 'Marcar como Não Concluída';
    } else {
        completeTaskBtn.textContent = 'Marcar como Concluída';
    }
    
    // Adicionar eventos aos botões
    document.getElementById('edit-task-btn').onclick = () => {
        // Fechar modal de visualização
        document.getElementById('view-task-modal').style.display = 'none';
        
        // Abrir modal de edição (a ser implementado)
        // editTask(task.id);
    };
    
    completeTaskBtn.onclick = () => {
        // Alternar status de conclusão
        toggleTaskCompletion(task.id);
        
        // Fechar modal
        document.getElementById('view-task-modal').style.display = 'none';
    };
    
    document.getElementById('delete-task-btn').onclick = () => {
        // Confirmar exclusão
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            // Excluir tarefa
            deleteTask(task.id);
            
            // Fechar modal
            document.getElementById('view-task-modal').style.display = 'none';
        }
    };
    
    // Mostrar modal
    document.getElementById('view-task-modal').style.display = 'block';
}

// Configurar eventos para fechar o modal de visualização de tarefa
document.addEventListener('DOMContentLoaded', () => {
    const viewTaskModal = document.getElementById('view-task-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Fechar ao clicar no X
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewTaskModal.style.display = 'none';
        });
    });
    
    // Fechar ao clicar fora do modal
    window.addEventListener('click', (event) => {
        if (event.target === viewTaskModal) {
            viewTaskModal.style.display = 'none';
        }
    });
});
