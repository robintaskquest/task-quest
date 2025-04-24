// auth.js - Sistema de autenticação com Google

document.addEventListener('DOMContentLoaded', () => {
    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyBxJK3UeGGCuIYZafX6H7xIQZXkUgXbz8w",
        authDomain: "robin-task-quest.firebaseapp.com",
        projectId: "robin-task-quest",
        storageBucket: "robin-task-quest.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef1234567890abcdef"
    };

    // Inicializar Firebase (verificar se já não foi inicializado)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Elementos da UI
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const userProfileElement = document.getElementById('user-profile-info');
    const loginStatusElement = document.getElementById('login-status');
    const syncButton = document.getElementById('sync-button');
    const googleCalendarToggle = document.getElementById('google-calendar-toggle');

    // Estado de autenticação
    let currentUser = null;

    // Verificar estado de autenticação ao carregar
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // Usuário está logado
            currentUser = user;
            updateUIForLoggedInUser(user);
            loadUserData(user.uid);
        } else {
            // Usuário não está logado
            currentUser = null;
            updateUIForLoggedOutUser();
        }
    });

    // Adicionar evento ao botão de login
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
            
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    // Login bem-sucedido
                    const user = result.user;
                    const credential = result.credential;
                    
                    // Salvar token de acesso para uso posterior com a API do Google Calendar
                    const accessToken = credential.accessToken;
                    localStorage.setItem('google_access_token', accessToken);
                    
                    // Atualizar UI
                    updateUIForLoggedInUser(user);
                    
                    // Mostrar notificação de sucesso
                    showNotification('Login realizado com sucesso!', 'success');
                    
                    // Verificar se é o primeiro login e criar dados iniciais
                    checkFirstLogin(user.uid);
                })
                .catch((error) => {
                    console.error('Erro no login:', error);
                    showNotification('Erro ao fazer login. Tente novamente.', 'error');
                });
        });
    }

    // Adicionar evento ao botão de logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            firebase.auth().signOut()
                .then(() => {
                    // Logout bem-sucedido
                    updateUIForLoggedOutUser();
                    showNotification('Logout realizado com sucesso!', 'success');
                })
                .catch((error) => {
                    console.error('Erro no logout:', error);
                    showNotification('Erro ao fazer logout. Tente novamente.', 'error');
                });
        });
    }

    // Adicionar evento ao botão de sincronização
    if (syncButton) {
        syncButton.addEventListener('click', () => {
            if (currentUser) {
                syncUserData(currentUser.uid);
                showNotification('Sincronizando dados...', 'info');
            } else {
                showNotification('Faça login para sincronizar seus dados.', 'warning');
            }
        });
    }

    // Adicionar evento ao toggle do Google Calendar
    if (googleCalendarToggle) {
        googleCalendarToggle.addEventListener('change', () => {
            if (currentUser) {
                const isEnabled = googleCalendarToggle.checked;
                updateCalendarIntegration(isEnabled);
                
                if (isEnabled) {
                    fetchGoogleCalendarEvents();
                    showNotification('Integração com Google Calendar ativada!', 'success');
                } else {
                    showNotification('Integração com Google Calendar desativada.', 'info');
                }
            } else {
                googleCalendarToggle.checked = false;
                showNotification('Faça login para usar a integração com Google Calendar.', 'warning');
            }
        });
    }

    // Atualizar UI para usuário logado
    function updateUIForLoggedInUser(user) {
        if (loginStatusElement) {
            loginStatusElement.textContent = 'Conectado';
            loginStatusElement.classList.add('logged-in');
        }
        
        if (userProfileElement) {
            userProfileElement.innerHTML = `
                <div class="user-avatar">
                    <img src="${user.photoURL || 'img/default-avatar.png'}" alt="Avatar">
                </div>
                <div class="user-info">
                    <span class="user-name">${user.displayName}</span>
                    <span class="user-email">${user.email}</span>
                </div>
            `;
        }
        
        if (loginButton) loginButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
        if (syncButton) syncButton.style.display = 'block';
        if (googleCalendarToggle) googleCalendarToggle.disabled = false;
        
        // Verificar se a integração com Google Calendar está ativa
        const calendarIntegration = localStorage.getItem('google_calendar_integration') === 'true';
        if (googleCalendarToggle) googleCalendarToggle.checked = calendarIntegration;
        
        // Se a integração estiver ativa, buscar eventos
        if (calendarIntegration) {
            fetchGoogleCalendarEvents();
        }
    }

    // Atualizar UI para usuário deslogado
    function updateUIForLoggedOutUser() {
        if (loginStatusElement) {
            loginStatusElement.textContent = 'Desconectado';
            loginStatusElement.classList.remove('logged-in');
        }
        
        if (userProfileElement) {
            userProfileElement.innerHTML = `
                <div class="user-avatar">
                    <img src="img/default-avatar.png" alt="Avatar">
                </div>
                <div class="user-info">
                    <span class="user-name">Visitante</span>
                    <span class="user-email">Faça login para sincronizar</span>
                </div>
            `;
        }
        
        if (loginButton) loginButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (syncButton) syncButton.style.display = 'none';
        if (googleCalendarToggle) {
            googleCalendarToggle.checked = false;
            googleCalendarToggle.disabled = true;
        }
        
        // Limpar token de acesso
        localStorage.removeItem('google_access_token');
    }

    // Verificar se é o primeiro login e criar dados iniciais
    function checkFirstLogin(userId) {
        const db = firebase.firestore();
        
        db.collection('users').doc(userId).get()
            .then((doc) => {
                if (!doc.exists) {
                    // Primeiro login, criar dados iniciais
                    const localData = {
                        tasks: JSON.parse(localStorage.getItem('robin_task_quest_tasks') || '[]'),
                        level: parseInt(localStorage.getItem('robin_task_quest_level') || '1'),
                        xp: parseInt(localStorage.getItem('robin_task_quest_xp') || '0'),
                        settings: {
                            theme: localStorage.getItem('robin_task_quest_theme') || 'light',
                            colorScheme: localStorage.getItem('robin_task_quest_color_scheme') || 'default',
                            background: localStorage.getItem('robin_task_quest_background') || 'none',
                            columnNames: JSON.parse(localStorage.getItem('robin_task_quest_column_names') || '{"work":"Trabalho","home":"Casa","personal":"Pessoal"}')
                        },
                        lastSync: new Date().toISOString()
                    };
                    
                    // Salvar dados no Firestore
                    db.collection('users').doc(userId).set(localData)
                        .then(() => {
                            console.log('Dados iniciais criados com sucesso!');
                        })
                        .catch((error) => {
                            console.error('Erro ao criar dados iniciais:', error);
                        });
                } else {
                    // Não é o primeiro login, verificar se precisa sincronizar
                    const lastLocalSync = localStorage.getItem('robin_task_quest_last_sync');
                    const lastServerSync = doc.data().lastSync;
                    
                    if (!lastLocalSync || new Date(lastServerSync) > new Date(lastLocalSync)) {
                        // Dados do servidor são mais recentes, carregar
                        loadUserData(userId);
                    } else {
                        // Dados locais são mais recentes, sincronizar
                        syncUserData(userId);
                    }
                }
            })
            .catch((error) => {
                console.error('Erro ao verificar primeiro login:', error);
            });
    }

    // Carregar dados do usuário do Firestore
    function loadUserData(userId) {
        const db = firebase.firestore();
        
        db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    
                    // Carregar tarefas
                    if (data.tasks) {
                        localStorage.setItem('robin_task_quest_tasks', JSON.stringify(data.tasks));
                        // Atualizar UI de tarefas
                        if (window.updateTasksUI) {
                            window.updateTasksUI();
                        }
                    }
                    
                    // Carregar nível e XP
                    if (data.level) {
                        localStorage.setItem('robin_task_quest_level', data.level);
                        // Atualizar UI de nível
                        if (window.updateLevelUI) {
                            window.updateLevelUI(data.level, data.xp);
                        }
                    }
                    
                    if (data.xp) {
                        localStorage.setItem('robin_task_quest_xp', data.xp);
                    }
                    
                    // Carregar configurações
                    if (data.settings) {
                        if (data.settings.theme) {
                            localStorage.setItem('robin_task_quest_theme', data.settings.theme);
                            document.documentElement.setAttribute('data-theme', data.settings.theme);
                        }
                        
                        if (data.settings.colorScheme) {
                            localStorage.setItem('robin_task_quest_color_scheme', data.settings.colorScheme);
                            document.documentElement.setAttribute('data-color-scheme', data.settings.colorScheme);
                        }
                        
                        if (data.settings.background) {
                            localStorage.setItem('robin_task_quest_background', data.settings.background);
                            // Atualizar plano de fundo
                            if (window.updateBackground) {
                                window.updateBackground(data.settings.background);
                            }
                        }
                        
                        if (data.settings.columnNames) {
                            localStorage.setItem('robin_task_quest_column_names', JSON.stringify(data.settings.columnNames));
                            // Atualizar nomes das colunas
                            if (window.updateColumnNames) {
                                window.updateColumnNames(data.settings.columnNames);
                            }
                        }
                    }
                    
                    // Atualizar timestamp de sincronização
                    localStorage.setItem('robin_task_quest_last_sync', new Date().toISOString());
                    
                    showNotification('Dados carregados com sucesso!', 'success');
                }
            })
            .catch((error) => {
                console.error('Erro ao carregar dados do usuário:', error);
                showNotification('Erro ao carregar dados. Tente novamente.', 'error');
            });
    }

    // Sincronizar dados do usuário com o Firestore
    function syncUserData(userId) {
        const db = firebase.firestore();
        
        const userData = {
            tasks: JSON.parse(localStorage.getItem('robin_task_quest_tasks') || '[]'),
            level: parseInt(localStorage.getItem('robin_task_quest_level') || '1'),
            xp: parseInt(localStorage.getItem('robin_task_quest_xp') || '0'),
            settings: {
                theme: localStorage.getItem('robin_task_quest_theme') || 'light',
                colorScheme: localStorage.getItem('robin_task_quest_color_scheme') || 'default',
                background: localStorage.getItem('robin_task_quest_background') || 'none',
                columnNames: JSON.parse(localStorage.getItem('robin_task_quest_column_names') || '{"work":"Trabalho","home":"Casa","personal":"Pessoal"}')
            },
            lastSync: new Date().toISOString()
        };
        
        db.collection('users').doc(userId).set(userData, { merge: true })
            .then(() => {
                // Atualizar timestamp de sincronização
                localStorage.setItem('robin_task_quest_last_sync', userData.lastSync);
                showNotification('Dados sincronizados com sucesso!', 'success');
            })
            .catch((error) => {
                console.error('Erro ao sincronizar dados:', error);
                showNotification('Erro ao sincronizar dados. Tente novamente.', 'error');
            });
    }

    // Atualizar estado da integração com Google Calendar
    function updateCalendarIntegration(isEnabled) {
        localStorage.setItem('google_calendar_integration', isEnabled.toString());
    }

    // Buscar eventos do Google Calendar
    function fetchGoogleCalendarEvents() {
        const accessToken = localStorage.getItem('google_access_token');
        
        if (!accessToken) {
            console.error('Token de acesso não encontrado!');
            return;
        }
        
        // Definir intervalo de datas (próximos 30 dias)
        const now = new Date();
        const timeMin = now.toISOString();
        const timeMax = new Date(now.setDate(now.getDate() + 30)).toISOString();
        
        // Fazer requisição para a API do Google Calendar
        fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('E
(Content truncated due to size limit. Use line ranges to read in chunks)