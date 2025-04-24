// calendar-integration.js - Integração com Google Agenda

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o Firebase e a autenticação estão disponíveis
    if (typeof firebase === 'undefined' || typeof window.auth === 'undefined') {
        console.error('Firebase ou módulo de autenticação não encontrados!');
        return;
    }

    // Elementos da UI
    const googleCalendarToggle = document.getElementById('google-calendar-toggle');
    const calendarRefreshButton = document.getElementById('calendar-refresh-button');
    const calendarStatusElement = document.getElementById('calendar-status');

    // Verificar estado da integração ao carregar
    const isCalendarIntegrationEnabled = localStorage.getItem('google_calendar_integration') === 'true';
    if (googleCalendarToggle) {
        googleCalendarToggle.checked = isCalendarIntegrationEnabled;
    }

    // Adicionar evento ao botão de atualização do calendário
    if (calendarRefreshButton) {
        calendarRefreshButton.addEventListener('click', () => {
            if (window.auth.isLoggedIn()) {
                fetchAndProcessCalendarEvents();
                showNotification('Atualizando eventos do Google Agenda...', 'info');
            } else {
                showNotification('Faça login para atualizar eventos do Google Agenda.', 'warning');
            }
        });
    }

    // Adicionar evento ao toggle do Google Calendar
    if (googleCalendarToggle) {
        googleCalendarToggle.addEventListener('change', () => {
            if (window.auth.isLoggedIn()) {
                const isEnabled = googleCalendarToggle.checked;
                updateCalendarIntegration(isEnabled);
                
                if (isEnabled) {
                    fetchAndProcessCalendarEvents();
                    showNotification('Integração com Google Agenda ativada!', 'success');
                    if (calendarStatusElement) {
                        calendarStatusElement.textContent = 'Conectado';
                        calendarStatusElement.classList.add('connected');
                    }
                } else {
                    showNotification('Integração com Google Agenda desativada.', 'info');
                    if (calendarStatusElement) {
                        calendarStatusElement.textContent = 'Desconectado';
                        calendarStatusElement.classList.remove('connected');
                    }
                }
            } else {
                googleCalendarToggle.checked = false;
                showNotification('Faça login para usar a integração com Google Agenda.', 'warning');
            }
        });
    }

    // Verificar estado inicial da integração
    if (isCalendarIntegrationEnabled && window.auth.isLoggedIn()) {
        if (calendarStatusElement) {
            calendarStatusElement.textContent = 'Conectado';
            calendarStatusElement.classList.add('connected');
        }
        // Buscar eventos ao carregar se a integração estiver ativa
        fetchAndProcessCalendarEvents();
    } else {
        if (calendarStatusElement) {
            calendarStatusElement.textContent = 'Desconectado';
            calendarStatusElement.classList.remove('connected');
        }
    }

    // Atualizar estado da integração com Google Calendar
    function updateCalendarIntegration(isEnabled) {
        localStorage.setItem('google_calendar_integration', isEnabled.toString());
    }

    // Buscar e processar eventos do Google Calendar
    function fetchAndProcessCalendarEvents() {
        const accessToken = localStorage.getItem('google_access_token');
        
        if (!accessToken) {
            console.error('Token de acesso não encontrado!');
            showNotification('Token de acesso não encontrado. Faça login novamente.', 'error');
            return;
        }
        
        // Definir intervalo de datas (próximos 30 dias)
        const now = new Date();
        const timeMin = now.toISOString();
        const timeMax = new Date(now.setDate(now.getDate() + 30)).toISOString();
        
        // Atualizar status
        if (calendarStatusElement) {
            calendarStatusElement.textContent = 'Atualizando...';
        }
        
        // Fazer requisição para a API do Google Calendar
        fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar eventos do Google Agenda');
            }
            return response.json();
        })
        .then(data => {
            // Processar eventos
            processCalendarEvents(data.items);
            
            // Atualizar status
            if (calendarStatusElement) {
                calendarStatusElement.textContent = 'Conectado';
                calendarStatusElement.classList.add('connected');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar eventos do Google Agenda:', error);
            showNotification('Erro ao buscar eventos do Google Agenda. Tente novamente.', 'error');
            
            // Atualizar status em caso de erro
            if (calendarStatusElement) {
                calendarStatusElement.textContent = 'Erro';
                calendarStatusElement.classList.remove('connected');
                calendarStatusElement.classList.add('error');
            }
            
            // Se o erro for de autenticação, solicitar novo login
            if (error.message.includes('401') || error.message.includes('403')) {
                showNotification('Sessão expirada. Faça login novamente.', 'warning');
                // Desativar integração
                if (googleCalendarToggle) {
                    googleCalendarToggle.checked = false;
                }
                updateCalendarIntegration(false);
            }
        });
    }

    // Processar eventos do Google Calendar
    function processCalendarEvents(events) {
        if (!events || events.length === 0) {
            console.log('Nenhum evento encontrado no Google Agenda.');
            showNotification('Nenhum evento encontrado no Google Agenda.', 'info');
            return;
        }
        
        // Obter tarefas existentes
        const existingTasks = JSON.parse(localStorage.getItem('robin_task_quest_tasks') || '[]');
        
        // Filtrar eventos que já foram importados
        const existingEventIds = existingTasks
            .filter(task => task.googleEventId)
            .map(task => task.googleEventId);
        
        // Converter eventos para tarefas
        const newTasks = events
            .filter(event => !existingEventIds.includes(event.id))
            .map(event => {
                // Determinar data do evento
                let eventDate = '';
                if (event.start.dateTime) {
                    eventDate = new Date(event.start.dateTime).toISOString().split('T')[0];
                } else if (event.start.date) {
                    eventDate = event.start.date;
                }
                
                // Determinar prioridade com base no evento
                let priority = 'normal';
                if (event.colorId) {
                    // Cores do Google Calendar: 1-11
                    // 1, 2, 3 = normal
                    // 4, 5, 6, 7 = alta
                    // 8, 9, 10, 11 = urgente
                    const colorId = parseInt(event.colorId);
                    if (colorId >= 4 && colorId <= 7) {
                        priority = 'high';
                    } else if (colorId >= 8) {
                        priority = 'urgent';
                    }
                }
                
                // Determinar XP com base na prioridade
                let xp = 10;
                if (priority === 'high') {
                    xp = 20;
                } else if (priority === 'urgent') {
                    xp = 30;
                }
                
                return {
                    id: generateUniqueId(),
                    title: event.summary || 'Evento sem título',
                    description: event.description || 'Evento importado do Google Agenda',
                    category: 'work', // Categoria padrão para eventos
                    priority: priority,
                    date: eventDate,
                    completed: false,
                    xp: xp,
                    googleEventId: event.id,
                    createdAt: new Date().toISOString()
                };
            });
        
        // Adicionar novas tarefas
        if (newTasks.length > 0) {
            const updatedTasks = [...existingTasks, ...newTasks];
            localStorage.setItem('robin_task_quest_tasks', JSON.stringify(updatedTasks));
            
            // Atualizar UI de tarefas
            if (window.updateTasksUI) {
                window.updateTasksUI();
            }
            
            showNotification(`${newTasks.length} eventos importados do Google Agenda!`, 'success');
        } else {
            showNotification('Nenhum novo evento para importar do Google Agenda.', 'info');
        }
    }

    // Gerar ID único para tarefas
    function generateUniqueId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Mostrar notificação
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
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

    // Expor funções para uso em outros módulos
    window.calendarIntegration = {
        fetchAndProcessCalendarEvents: fetchAndProcessCalendarEvents,
        isEnabled: () => localStorage.getItem('google_calendar_integration') === 'true'
    };
});
