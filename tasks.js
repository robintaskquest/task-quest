// tasks.js - Gerenciamento de tarefas

// Array para armazenar todas as tarefas
let tasks = [];

// Carregar tarefas do armazenamento local
function loadTasks() {
    const savedTasks = localStorage.getItem('taskquest_tasks');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    
    // Atualizar interface
    updateTaskLists();
}

// Salvar tarefas no armazenamento local
function saveTasks() {
    localStorage.setItem('taskquest_tasks', JSON.stringify(tasks));
}

// Adicionar nova tarefa
function addTask(task) {
    tasks.push(task);
    saveTasks();
    updateTaskLists();
}

// Remover tarefa
function removeTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    updateTaskLists();
}

// Marcar tarefa como concluída ou não concluída
function toggleTaskCompletion(taskId) {
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {
        task.completed = !task.completed;
        
        // Se a tarefa foi marcada como concluída, adicionar XP
        if (task.completed) {
            addExperience(task.xp);
        } else {
            // Se a tarefa foi desmarcada, remover XP
            removeExperience(task.xp);
        }
        
        saveTasks();
        updateTaskLists();
    }
}

// Atualizar listas de tarefas na interface
function updateTaskLists() {
    // Limpar listas existentes
    document.getElementById('all-tasks').innerHTML = '';
    document.getElementById('work-tasks').innerHTML = '';
    document.getElementById('home-tasks').innerHTML = '';
    document.getElementById('personal-tasks').innerHTML = '';
    
    // Filtrar tarefas com base na visualização atual
    const filteredTasks = filterTasksByView();
    
    // Agrupar tarefas por categoria
    const workTasks = filteredTasks.filter(task => task.category === 'work');
    const homeTasks = filteredTasks.filter(task => task.category === 'home');
    const personalTasks = filteredTasks.filter(task => task.category === 'personal');
    
    // Renderizar tarefas em cada lista
    renderTaskList(filteredTasks, 'all-tasks');
    renderTaskList(workTasks, 'work-tasks');
    renderTaskList(homeTasks, 'home-tasks');
    renderTaskList(personalTasks, 'personal-tasks');
}

// Filtrar tarefas com base na visualização atual (dia, semana, mês)
function filterTasksByView() {
    const currentDate = appState.currentView === 'day' 
        ? appState.currentDate 
        : new Date(appState.currentDate);
    
    return tasks.filter(task => {
        const taskDate = new Date(task.date);
        
        switch (appState.currentView) {
            case 'day':
                return isSameDay(taskDate, currentDate);
            
            case 'week':
                // Obter primeiro dia da semana
                const firstDayOfWeek = getFirstDayOfWeek(currentDate);
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                
                return taskDate >= firstDayOfWeek && taskDate <= lastDayOfWeek;
            
            case 'month':
                return taskDate.getMonth() === currentDate.getMonth() && 
                       taskDate.getFullYear() === currentDate.getFullYear();
            
            default:
                return true;
        }
    });
}

// Renderizar lista de tarefas
function renderTaskList(taskList, containerId) {
    const container = document.getElementById(containerId);
    
    // Ordenar tarefas por prioridade e depois por título
    taskList.sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, normal: 2 };
        
        // Primeiro ordenar por prioridade
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        // Se mesma prioridade, ordenar por título
        return a.title.localeCompare(b.title);
    });
    
    // Renderizar cada tarefa
    taskList.forEach(task => {
        const taskElement = createTaskElement(task);
        container.appendChild(taskElement);
    });
    
    // Exibir mensagem se não houver tarefas
    if (taskList.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-list-message';
        emptyMessage.textContent = 'Nenhuma tarefa para este período';
        container.appendChild(emptyMessage);
    }
}

// Criar elemento HTML para uma tarefa
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-card priority-${task.priority}`;
    
    if (task.completed) {
        taskElement.classList.add('completed');
    }
    
    // Formatar data da tarefa
    const taskDate = new Date(task.date);
    const formattedDate = taskDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    // Definir texto de prioridade
    let priorityText = 'Normal';
    if (task.priority === 'high') priorityText = 'Alta';
    if (task.priority === 'urgent') priorityText = 'Urgente';
    
    taskElement.innerHTML = `
        <div class="task-header">
            <span class="task-title">${task.title}</span>
            <span class="task-priority ${task.priority}">${priorityText}</span>
        </div>
        <div class="task-description">${task.description || 'Sem descrição'}</div>
        <div class="task-footer">
            <span class="task-date">${formattedDate}</span>
            <span class="task-xp"><i class="fas fa-star"></i> ${task.xp} XP</span>
            <div class="task-actions">
                <button class="task-action-btn complete" data-id="${task.id}" title="Marcar como ${task.completed ? 'não concluída' : 'concluída'}">
                    <i class="fas fa-${task.completed ? 'times' : 'check'}"></i>
                </button>
                <button class="task-action-btn delete" data-id="${task.id}" title="Excluir tarefa">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // Adicionar eventos aos botões
    taskElement.querySelector('.task-action-btn.complete').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTaskCompletion(task.id);
    });
    
    taskElement.querySelector('.task-action-btn.delete').addEventListener('click', (e) => {
        e.stopPropagation();
        removeTask(task.id);
    });
    
    // Adicionar evento para abrir detalhes da tarefa
    taskElement.addEventListener('click', () => {
        // Implementar visualização detalhada da tarefa (opcional)
        console.log('Detalhes da tarefa:', task);
    });
    
    return taskElement;
}

// Obter tarefas para uma data específica
function getTasksForDate(date) {
    return tasks.filter(task => {
        const taskDate = new Date(task.date);
        return isSameDay(taskDate, date);
    });
}

// Obter tarefas concluídas para uma data específica
function getCompletedTasksForDate(date) {
    return getTasksForDate(date).filter(task => task.completed);
}

// Obter tarefas pendentes para uma data específica
function getPendingTasksForDate(date) {
    return getTasksForDate(date).filter(task => !task.completed);
}

// Calcular estatísticas de tarefas
function calculateTaskStats() {
    const today = new Date();
    const todayTasks = getTasksForDate(today);
    const completedTasks = todayTasks.filter(task => task.completed);
    
    return {
        total: todayTasks.length,
        completed: completedTasks.length,
        pending: todayTasks.length - completedTasks.length,
        completionRate: todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0
    };
}
