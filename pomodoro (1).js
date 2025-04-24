// pomodoro.js - Sistema de pomodoro corrigido

document.addEventListener('DOMContentLoaded', () => {
    // Variáveis globais
    let timerDisplay;
    let startButton;
    let pauseButton;
    let resetButton;
    let workModeButton;
    let breakModeButton;
    
    // Configurações padrão do pomodoro
    const defaultSettings = {
        workTime: 60,      // 60 minutos
        breakTime: 10,     // 10 minutos
        longBreakTime: 20, // 20 minutos
        pomodoroCount: 2   // 2 pomodoros até pausa longa
    };
    
    // Estado do pomodoro
    let pomodoroState = {
        isRunning: false,
        isPaused: false,
        timeLeft: defaultSettings.workTime * 60, // em segundos
        mode: 'work',
        completedPomodoros: 0,
        timer: null
    };
    
    // Configurações do pomodoro (carregadas do localStorage ou padrão)
    let pomodoroSettings = { ...defaultSettings };
    
    // Obter elementos do DOM
    timerDisplay = document.querySelector('.timer-display');
    startButton = document.getElementById('start-timer');
    pauseButton = document.getElementById('pause-timer');
    resetButton = document.getElementById('reset-timer');
    workModeButton = document.querySelector('.timer-mode-btn[data-mode="work"]');
    breakModeButton = document.querySelector('.timer-mode-btn[data-mode="break"]');
    
    // Carregar configurações salvas
    loadPomodoroSettings();
    
    // Inicializar timer
    updateTimerDisplay();
    
    // Adicionar eventos aos botões
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    workModeButton.addEventListener('click', () => switchMode('work'));
    breakModeButton.addEventListener('click', () => switchMode('break'));
    
    // Configurar modal de configurações do pomodoro
    const pomodoroSettingsBtn = document.getElementById('pomodoro-settings');
    const pomodoroSettingsModal = document.getElementById('pomodoro-settings-modal');
    const pomodoroSettingsForm = document.getElementById('pomodoro-settings-form');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    pomodoroSettingsBtn.addEventListener('click', openPomodoroSettingsModal);
    pomodoroSettingsForm.addEventListener('submit', savePomodoroSettings);
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pomodoroSettingsModal.style.display = 'none';
        });
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === pomodoroSettingsModal) {
            pomodoroSettingsModal.style.display = 'none';
        }
    });
    
    // Pré-carregar sons
    const pomodoroSound = document.getElementById('pomodoro-sound');
    const taskCompleteSound = document.getElementById('task-complete-sound');
    
    // Verificar se os elementos de áudio existem
    if (!pomodoroSound) {
        console.error('Elemento de áudio para pomodoro não encontrado!');
        // Criar elemento de áudio para pomodoro se não existir
        const audioElement = document.createElement('audio');
        audioElement.id = 'pomodoro-sound';
        audioElement.src = 'sounds/16774__brucie__mobile-ring-tone.wav';
        audioElement.preload = 'auto';
        document.body.appendChild(audioElement);
    }
    
    // Solicitar permissão para notificações ao iniciar
    requestNotificationPermission();
    
    // Funções
    
    // Solicitar permissão para notificações
    function requestNotificationPermission() {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }
    
    // Abrir modal de configurações do pomodoro
    function openPomodoroSettingsModal() {
        // Preencher campos com valores atuais
        document.getElementById('work-time').value = pomodoroSettings.workTime;
        document.getElementById('break-time').value = pomodoroSettings.breakTime;
        document.getElementById('long-break-time').value = pomodoroSettings.longBreakTime;
        document.getElementById('pomodoro-count').value = pomodoroSettings.pomodoroCount;
        
        // Mostrar modal
        pomodoroSettingsModal.style.display = 'block';
    }
    
    // Salvar configurações do pomodoro
    function savePomodoroSettings(event) {
        event.preventDefault();
        
        // Obter valores dos campos
        const workTime = parseInt(document.getElementById('work-time').value);
        const breakTime = parseInt(document.getElementById('break-time').value);
        const longBreakTime = parseInt(document.getElementById('long-break-time').value);
        const pomodoroCount = parseInt(document.getElementById('pomodoro-count').value);
        
        // Validar valores
        if (workTime < 1 || workTime > 60) {
            alert('Tempo de trabalho deve estar entre 1 e 60 minutos.');
            return;
        }
        
        if (breakTime < 1 || breakTime > 30) {
            alert('Tempo de pausa deve estar entre 1 e 30 minutos.');
            return;
        }
        
        if (longBreakTime < 5 || longBreakTime > 60) {
            alert('Tempo de pausa longa deve estar entre 5 e 60 minutos.');
            return;
        }
        
        if (pomodoroCount < 1 || pomodoroCount > 10) {
            alert('Número de pomodoros até pausa longa deve estar entre 1 e 10.');
            return;
        }
        
        // Atualizar configurações
        pomodoroSettings = {
            workTime,
            breakTime,
            longBreakTime,
            pomodoroCount
        };
        
        // Salvar configurações no localStorage
        localStorage.setItem('robin_task_quest_pomodoro_settings', JSON.stringify(pomodoroSettings));
        
        // Resetar timer com novas configurações
        resetTimer();
        
        // Fechar modal
        pomodoroSettingsModal.style.display = 'none';
    }
    
    // Carregar configurações do pomodoro do armazenamento local
    function loadPomodoroSettings() {
        const savedSettings = localStorage.getItem('robin_task_quest_pomodoro_settings');
        
        if (savedSettings) {
            pomodoroSettings = JSON.parse(savedSettings);
        } else {
            // Se não houver configurações salvas, usar as padrão
            pomodoroSettings = { ...defaultSettings };
            // Salvar configurações padrão
            localStorage.setItem('robin_task_quest_pomodoro_settings', JSON.stringify(pomodoroSettings));
        }
        
        // Atualizar tempo restante com base nas configurações
        resetTimer();
    }
    
    // Iniciar timer
    function startTimer() {
        if (pomodoroState.isPaused) {
            pomodoroState.isPaused = false;
        }
        
        if (!pomodoroState.isRunning) {
            pomodoroState.isRunning = true;
            
            // Iniciar contagem regressiva
            pomodoroState.timer = setInterval(() => {
                pomodoroState.timeLeft--;
                
                if (pomodoroState.timeLeft <= 0) {
                    // Timer concluído
                    clearInterval(pomodoroState.timer);
                    pomodoroState.isRunning = false;
                    
                    // Tocar som de notificação
                    playPomodoroSound();
                    
                    // Mostrar notificação
                    showTimerNotification();
                    
                    // Alternar entre trabalho e pausa
                    if (pomodoroState.mode === 'work') {
                        // Incrementar contador de pomodoros concluídos
                        pomodoroState.completedPomodoros++;
                        
                        // Verificar se deve ser uma pausa longa
                        if (pomodoroState.completedPomodoros % pomodoroSettings.pomodoroCount === 0) {
                            pomodoroState.timeLeft = pomodoroSettings.longBreakTime * 60;
                        } else {
                            pomodoroState.timeLeft = pomodoroSettings.breakTime * 60;
                        }
                        
                        switchMode('break');
                    } else {
                        pomodoroState.timeLeft = pomodoroSettings.workTime * 60;
                        switchMode('work');
                    }
                    
                    updateTimerDisplay();
                } else {
                    updateTimerDisplay();
                }
            }, 1000);
        }
        
        // Atualizar estado dos botões
        startButton.disabled = true;
        pauseButton.disabled = false;
    }
    
    // Pausar timer
    function pauseTimer() {
        if (pomodoroState.isRunning) {
            clearInterval(pomodoroState.timer);
            pomodoroState.isRunning = false;
            pomodoroState.isPaused = true;
            
            // Atualizar estado dos botões
            startButton.disabled = false;
            pauseButton.disabled = true;
        }
    }
    
    // Reiniciar timer
    function resetTimer() {
        // Parar timer se estiver rodando
        if (pomodoroState.isRunning) {
            clearInterval(pomodoroState.timer);
            pomodoroState.isRunning = false;
        }
        
        // Reiniciar estado
        pomodoroState.isPaused = false;
        
        // Definir tempo com base no modo atual
        if (pomodoroState.mode === 'work') {
            pomodoroState.timeLeft = pomodoroSettings.workTime * 60;
        } else {
            if (pomodoroState.completedPomodoros % pomodoroSettings.pomodoroCount === 0 && pomodoroState.completedPomodoros > 0) {
                pomodoroState.timeLeft = pomodoroSettings.longBreakTime * 60;
            } else {
                pomodoroState.timeLeft = pomodoroSettings.breakTime * 60;
            }
        }
        
        // Atualizar display
        updateTimerDisplay();
        
        // Atualizar estado dos botões
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
    
    // Alternar entre modos de trabalho e pausa
    function switchMode(mode) {
        // Parar timer se estiver rodando
        if (pomodoroState.isRunning) {
            clearInterval(pomodoroState.timer);
            pomodoroState.isRunning = false;
        }
        
        pomodoroState.mode = mode;
        pomodoroState.isPaused = false;
        
        // Atualizar botões de modo
        if (mode === 'work') {
            workModeButton.classList.add('active');
            breakModeButton.classList.remove('active');
            pomodoroState.timeLeft = pomodoroSettings.workTime * 60;
        } else {
            workModeButton.classList.remove('active');
            breakModeButton.classList.add('active');
            
            if (pomodoroState.completedPomodoros % pomodoroSettings.pomodoroCount === 0 && pomodoroState.completedPomodoros > 0) {
                pomodoroState.timeLeft = pomodoroSettings.longBreakTime * 60;
            } else {
                pomodoroState.timeLeft = pomodoroSettings.breakTime * 60;
            }
        }
        
        // Atualizar display
        updateTimerDisplay();
        
        // Atualizar estado dos botões
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
    
    // Atualizar display do timer
    function updateTimerDisplay() {
        const minutes = Math.floor(pomodoroState.timeLeft / 60);
        const seconds = pomodoroState.timeLeft % 60;
        
        // Formatar com zeros à esquerda
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        
        timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
        
        // Atualizar título da página
        document.title = `(${formattedMinutes}:${formattedSeconds}) Robin Task Quest`;
    }
    
    // Tocar som de notificação do pomodoro
    function playPomodoroSound() {
        // Tentar obter o elemento de áudio
        const audio = document.getElementById('pomodoro-sound');
        
        if (audio) {
            // Garantir que o áudio seja reproduzido do início
            audio.currentTime = 0;
            
            // Definir volume
            audio.volume = 0.7;
            
            // Reproduzir som
            const playPromise = audio.play();
            
            // Tratar possíveis erros de reprodução
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('Erro ao reproduzir som do pomodoro:', error);
                    // Tentar reproduzir novamente após interação do usuário
                    document.addEventListener('click', function playOnClick() {
                        audio.play();
                        document.removeEventListener('click', playOnClick);
                    }, { once: true });
                });
            }
        } else {
            console.error('Elemento de áudio para pomodoro não encontrado!');
        }
        
        // Vibrar dispositivo se API disponível (para dispositivos móveis)
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
    }
    
    // Mostrar notificação de timer concluído
    function showTimerNotification() {
        // Verificar se o navegador suporta notificações
        if ('Notification' in window) {
            // Verificar permissão
            if (Notification.permission === 'granted') {
                createNotification();
            } else if (Notification.permission !== 'denied') {
                // Solicitar permissão
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        createNotification();
                    }
                });
            }
        }
        
        // Criar notificação na página
        const notification = document.createElement('div');
        notification.className = 'pomodoro-notification';
        
        // Definir mensagem com base no modo
        const message = pomodoroState.mode === 'work' 
            ? 'Pomodoro concluído! Hora de uma pausa.' 
            : 'Pausa concluída! Hora de voltar ao trabalho.';
        
        // Adicionar ícone e mensagem
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${pomodoroState.mode === 'work' ? 'fa-coffee' : 'fa-laptop-code'}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${pomodoroState.mode === 'work' ? 'Pomodoro concluído!' : 'Pausa concluída!'}</div>
                <div class="notification-message">${message}</div>
            </div>
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
            }, 5000);
        }, 10);
    }
    
    // Criar notificação do navegador
    function createNotification() {
        const title = pomodoroState.mode === 'work' 
            ? 'Pomodoro concluído!' 
            : 'Pausa concluída!';
        
        const body = pomodoroState.mode === 'work' 
            ? 'Hora de uma pausa.' 
            : 'Hora de voltar ao trabalho.';
        
        // Criar notificação do navegador
        const notification = new Notifi
(Content truncated due to size limit. Use line ranges to read in chunks)