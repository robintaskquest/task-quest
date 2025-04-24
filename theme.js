// theme.js - Sistema de tema claro/escuro

document.addEventListener('DOMContentLoaded', () => {
    // Obter elementos
    const themeToggle = document.getElementById('theme-toggle-input');
    const htmlElement = document.documentElement;
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('robin_task_quest_theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'dark';
    }
    
    // Carregar esquema de cores salvo
    const savedColorScheme = localStorage.getItem('robin_task_quest_color_scheme');
    if (savedColorScheme && savedColorScheme !== 'default') {
        htmlElement.setAttribute('data-color-scheme', savedColorScheme);
    }
    
    // Adicionar evento ao toggle
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            // Ativar tema escuro
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('robin_task_quest_theme', 'dark');
            
            // Manter o esquema de cores atual
            const currentColorScheme = htmlElement.getAttribute('data-color-scheme');
            if (currentColorScheme) {
                // Adicionar classe específica para tema escuro com este esquema de cores
                applyDarkColorScheme(currentColorScheme);
            }
        } else {
            // Ativar tema claro
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('robin_task_quest_theme', 'light');
            
            // Manter o esquema de cores atual
            const currentColorScheme = htmlElement.getAttribute('data-color-scheme');
            if (currentColorScheme) {
                // Remover classe específica para tema escuro
                removeDarkColorScheme();
            }
        }
    });
    
    // Função para aplicar tema escuro ao esquema de cores atual
    function applyDarkColorScheme(colorScheme) {
        // Adicionar variáveis CSS específicas para tema escuro com este esquema de cores
        const style = document.createElement('style');
        style.id = 'dark-color-scheme-styles';
        
        // Definir variáveis CSS para cada esquema de cores no tema escuro
        let cssVars = '';
        
        switch (colorScheme) {
            case 'pastel-blue':
                cssVars = `
                    [data-theme="dark"][data-color-scheme="pastel-blue"] {
                        --primary-color: #7ba7c7;
                        --secondary-color: #9bbfd8;
                        --accent-color: #e0b394;
                        --background-color: #1f2937;
                        --card-color: #374151;
                        --text-color: #f3f4f6;
                        --light-text: #d1d5db;
                        --border-color: #4b5563;
                    }
                `;
                break;
            case 'pastel-pink':
                cssVars = `
                    [data-theme="dark"][data-color-scheme="pastel-pink"] {
                        --primary-color: #d194b8;
                        --secondary-color: #e0b3ca;
                        --accent-color: #94d1a8;
                        --background-color: #1f2937;
                        --card-color: #374151;
                        --text-color: #f3f4f6;
                        --light-text: #d1d5db;
                        --border-color: #4b5563;
                    }
                `;
                break;
            case 'pastel-green':
                cssVars = `
                    [data-theme="dark"][data-color-scheme="pastel-green"] {
                        --primary-color: #94c7a3;
                        --secondary-color: #b3d8c0;
                        --accent-color: #d1b394;
                        --background-color: #1f2937;
                        --card-color: #374151;
                        --text-color: #f3f4f6;
                        --light-text: #d1d5db;
                        --border-color: #4b5563;
                    }
                `;
                break;
            case 'pastel-purple':
                cssVars = `
                    [data-theme="dark"][data-color-scheme="pastel-purple"] {
                        --primary-color: #b094d1;
                        --secondary-color: #c7b3e0;
                        --accent-color: #d194b8;
                        --background-color: #1f2937;
                        --card-color: #374151;
                        --text-color: #f3f4f6;
                        --light-text: #d1d5db;
                        --border-color: #4b5563;
                    }
                `;
                break;
            case 'pastel-yellow':
                cssVars = `
                    [data-theme="dark"][data-color-scheme="pastel-yellow"] {
                        --primary-color: #d1c794;
                        --secondary-color: #e0d8b3;
                        --accent-color: #94b0d1;
                        --background-color: #1f2937;
                        --card-color: #374151;
                        --text-color: #f3f4f6;
                        --light-text: #d1d5db;
                        --border-color: #4b5563;
                    }
                `;
                break;
        }
        
        style.textContent = cssVars;
        
        // Remover estilos anteriores se existirem
        const oldStyle = document.getElementById('dark-color-scheme-styles');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        // Adicionar novos estilos
        document.head.appendChild(style);
    }
    
    // Função para remover estilos específicos de tema escuro
    function removeDarkColorScheme() {
        const oldStyle = document.getElementById('dark-color-scheme-styles');
        if (oldStyle) {
            oldStyle.remove();
        }
    }
    
    // Aplicar tema escuro ao esquema de cores atual se necessário
    if (htmlElement.getAttribute('data-theme') === 'dark') {
        const currentColorScheme = htmlElement.getAttribute('data-color-scheme');
        if (currentColorScheme) {
            applyDarkColorScheme(currentColorScheme);
        }
    }
    
    // Observar mudanças no atributo data-color-scheme
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-color-scheme') {
                const colorScheme = htmlElement.getAttribute('data-color-scheme');
                const theme = htmlElement.getAttribute('data-theme');
                
                if (theme === 'dark' && colorScheme) {
                    applyDarkColorScheme(colorScheme);
                } else {
                    removeDarkColorScheme();
                }
            }
        });
    });
    
    observer.observe(htmlElement, { attributes: true });
});
