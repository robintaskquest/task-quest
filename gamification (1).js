// gamification.js - Sistema de gamificação melhorado

// Níveis e experiência necessária
const levelRequirements = [
    { level: 1, xpRequired: 0 },
    { level: 2, xpRequired: 100 },
    { level: 3, xpRequired: 250 },
    { level: 4, xpRequired: 450 },
    { level: 5, xpRequired: 700 },
    { level: 6, xpRequired: 1000 },
    { level: 7, xpRequired: 1350 },
    { level: 8, xpRequired: 1750 },
    { level: 9, xpRequired: 2200 },
    { level: 10, xpRequired: 2700 },
    { level: 11, xpRequired: 3250 },
    { level: 12, xpRequired: 3850 },
    { level: 13, xpRequired: 4500 },
    { level: 14, xpRequired: 5200 },
    { level: 15, xpRequired: 5950 },
    { level: 16, xpRequired: 6750 },
    { level: 17, xpRequired: 7600 },
    { level: 18, xpRequired: 8500 },
    { level: 19, xpRequired: 9450 },
    { level: 20, xpRequired: 10450 }
];

// Pontos de XP por prioridade
const xpByPriority = {
    normal: 10,
    high: 20,
    urgent: 30
};

// Adicionar experiência ao usuário
function addExperience(xp) {
    appState.user.xp += xp;
    
    // Verificar se subiu de nível
    checkLevelUp();
    
    // Atualizar interface
    updateUserInfo();
    
    // Salvar dados do usuário
    saveUserData();
    
    // Exibir notificação
    showXpNotification(xp, true);
}

// Remover experiência do usuário (quando desmarca tarefa)
function removeExperience(xp) {
    appState.user.xp -= xp;
    
    // Garantir que XP não fique negativo
    if (appState.user.xp < 0) {
        appState.user.xp = 0;
    }
    
    // Verificar se desceu de nível
    checkLevelDown();
    
    // Atualizar interface
    updateUserInfo();
    
    // Salvar dados do usuário
    saveUserData();
    
    // Exibir notificação
    showXpNotification(xp, false);
}

// Verificar se o usuário subiu de nível
function checkLevelUp() {
    // Encontrar o próximo nível
    const nextLevel = levelRequirements.find(
        level => level.level > appState.user.level && level.xpRequired <= appState.user.xp
    );
    
    if (nextLevel) {
        // Subir de nível
        const oldLevel = appState.user.level;
        appState.user.level = nextLevel.level;
        
        // Atualizar XP necessário para o próximo nível
        updateNextLevelXp();
        
        // Exibir notificação de subida de nível
        showLevelUpNotification(oldLevel, nextLevel.level);
        
        // Tocar som de subida de nível
        playLevelUpSound();
        
        // Mostrar animação de estrela
        showLevelUpAnimation();
    }
}

// Verificar se o usuário desceu de nível
function checkLevelDown() {
    // Encontrar o nível atual
    const currentLevelData = levelRequirements.find(
        level => level.level === appState.user.level
    );
    
    // Encontrar o nível anterior
    const previousLevelData = levelRequirements.find(
        level => level.level === appState.user.level - 1
    );
    
    // Se o XP atual for menor que o necessário para o nível atual e houver um nível anterior
    if (appState.user.xp < currentLevelData.xpRequired && previousLevelData) {
        // Descer de nível
        const oldLevel = appState.user.level;
        appState.user.level = previousLevelData.level;
        
        // Atualizar XP necessário para o próximo nível
        updateNextLevelXp();
        
        // Exibir notificação de descida de nível
        showLevelDownNotification(oldLevel, previousLevelData.level);
    }
}

// Atualizar XP necessário para o próximo nível
function updateNextLevelXp() {
    const nextLevelData = levelRequirements.find(
        level => level.level === appState.user.level + 1
    );
    
    if (nextLevelData) {
        appState.user.nextLevelXp = nextLevelData.xpRequired;
    } else {
        // Se estiver no nível máximo
        const maxLevel = levelRequirements[levelRequirements.length - 1];
        appState.user.nextLevelXp = maxLevel.xpRequired;
    }
}

// Exibir notificação de XP
function showXpNotification(xp, isGain) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `xp-notification ${isGain ? 'gain' : 'loss'}`;
    notification.textContent = `${isGain ? '+' : '-'}${xp} XP`;
    
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
        }, 2000);
    }, 10);
}

// Exibir notificação de subida de nível
function showLevelUpNotification(oldLevel, newLevel) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'level-notification level-up';
    notification.innerHTML = `
        <i class="fas fa-arrow-up"></i>
        <span>Nível ${oldLevel} → ${newLevel}</span>
    `;
    
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

// Exibir notificação de descida de nível
function showLevelDownNotification(oldLevel, newLevel) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'level-notification level-down';
    notification.innerHTML = `
        <i class="fas fa-arrow-down"></i>
        <span>Nível ${oldLevel} → ${newLevel}</span>
    `;
    
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

// Tocar som de subida de nível
function playLevelUpSound() {
    const audio = document.getElementById('level-up-sound');
    if (audio) {
        audio.play();
    }
}

// Mostrar animação de estrela ao subir de nível
function showLevelUpAnimation() {
    const animationContainer = document.getElementById('level-up-animation');
    
    // Limpar animações anteriores
    animationContainer.innerHTML = '';
    
    // Criar estrela
    const star = document.createElement('div');
    star.className = 'level-up-star';
    star.innerHTML = '<i class="fas fa-star"></i>';
    
    // Adicionar ao container
    animationContainer.appendChild(star);
    
    // Mostrar container
    animationContainer.style.display = 'block';
    
    // Esconder após a animação
    setTimeout(() => {
        animationContainer.style.display = 'none';
    }, 1500);
}

// Calcular estatísticas de gamificação
function calculateGamificationStats() {
    // Calcular XP total ganho
    const totalXpGained = tasks
        .filter(task => task.completed)
        .reduce((total, task) => total + task.xp, 0);
    
    // Calcular tarefas concluídas por prioridade
    const completedByPriority = {
        normal: tasks.filter(task => task.completed && task.priority === 'normal').length,
        high: tasks.filter(task => task.completed && task.priority === 'high').length,
        urgent: tasks.filter(task => task.completed && task.priority === 'urgent').length
    };
    
    // Calcular sequência atual de dias com tarefas concluídas
    const streak = calculateStreak();
    
    return {
        totalXpGained,
        completedByPriority,
        streak
    };
}

// Calcular sequência atual de dias com tarefas concluídas
function calculateStreak() {
    // Implementação básica - pode ser expandida
    return 0;
}

// Obter XP com base na prioridade da tarefa
function getXpForPriority(priority) {
    return xpByPriority[priority] || xpByPriority.normal;
}

// Atualizar XP da tarefa com base na prioridade
function updateTaskXpBasedOnPriority(taskId, priority) {
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {
        // Atualizar XP da tarefa
        task.xp = getXpForPriority(priority);
        
        // Se a tarefa estiver concluída, atualizar XP do usuário
        if (task.completed) {
            // Remover XP antigo
            removeExperience(task.xp);
            
            // Adicionar novo XP
            addExperience(getXpForPriority(priority));
        }
        
        // Salvar tarefas
        saveTasks();
    }
}

// Adicionar estilos CSS para notificações
function addGamificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .xp-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            border-radius: 4px;
            font-weight: bold;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 1000;
        }
        
        .xp-notification.gain {
            background-color: #4caf50;
            color: white;
        }
        
        .xp-notification.loss {
            background-color: #f44336;
            color: white;
        }
        
        .xp-notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .level-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            padding: 20px 30px;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 1000;
        }
        
        .level-notification.level-up {
            background-color: #4a6fa5;
            color: white;
        }
        
        .level-notification.level-down {
            background-color: #f44336;
            color: white;
        }
        
        .level-notification i {
            display: block;
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .level-notification span {
            font-size: 1.2rem;
        }
        
        .level-notification.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    `;
    
    document.head.appendChild(style);
}

// Inicializar sistema de gamificação
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar estilos CSS para notificações
    addGamificationStyles();
    
    // Atualizar XP necessário para o próximo nível
    updateNextLevelXp();
    
    // Atualizar campo de XP no formulário de adicionar tarefa quando a prioridade mudar
    const prioritySelect = document.getElementById('task-priority');
    const xpInput = document.getElementById('task-xp');
    
    if (prioritySelect && xpInput) {
        prioritySelect.addEventListener('change', () => {
            xpInput.value = getXpForPriority(prioritySelect.value);
        });
        
        // Definir valor inicial
        xpInput.value = getXpForPriority(prioritySelect.value);
    }
});
