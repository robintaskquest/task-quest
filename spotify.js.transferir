// spotify.js - Menu recolhível para playlists do Spotify

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o elemento do menu Spotify existe
    const spotifyContainer = document.getElementById('spotify-container');
    if (!spotifyContainer) {
        console.error('Elemento do menu Spotify não encontrado!');
        return;
    }

    // Obter elementos
    const spotifyToggle = document.getElementById('spotify-toggle');
    const spotifyContent = document.getElementById('spotify-content');
    const playlistButtons = document.querySelectorAll('.playlist-button');

    // Verificar estado salvo do menu (aberto/fechado)
    const isSpotifyMenuOpen = localStorage.getItem('robin_task_quest_spotify_menu') === 'open';
    
    // Aplicar estado inicial
    if (isSpotifyMenuOpen) {
        spotifyContent.classList.add('open');
        spotifyToggle.classList.add('active');
    }

    // Adicionar evento ao botão de toggle
    spotifyToggle.addEventListener('click', () => {
        spotifyContent.classList.toggle('open');
        spotifyToggle.classList.toggle('active');
        
        // Salvar estado
        if (spotifyContent.classList.contains('open')) {
            localStorage.setItem('robin_task_quest_spotify_menu', 'open');
        } else {
            localStorage.setItem('robin_task_quest_spotify_menu', 'closed');
        }
    });

    // Adicionar eventos aos botões de playlist
    playlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remover classe ativa de todos os botões
            playlistButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            button.classList.add('active');
            
            // Obter URL da playlist
            const playlistUrl = button.getAttribute('data-playlist-url');
            
            // Atualizar iframe do Spotify
            updateSpotifyEmbed(playlistUrl);
            
            // Salvar playlist selecionada
            localStorage.setItem('robin_task_quest_selected_playlist', button.getAttribute('data-playlist-type'));
        });
    });

    // Carregar playlist salva
    const savedPlaylist = localStorage.getItem('robin_task_quest_selected_playlist');
    if (savedPlaylist) {
        const savedButton = document.querySelector(`.playlist-button[data-playlist-type="${savedPlaylist}"]`);
        if (savedButton) {
            // Simular clique no botão da playlist salva
            savedButton.click();
        }
    } else {
        // Se não houver playlist salva, selecionar a primeira por padrão
        const firstButton = document.querySelector('.playlist-button');
        if (firstButton) {
            firstButton.click();
        }
    }

    // Função para atualizar o iframe do Spotify
    function updateSpotifyEmbed(playlistUrl) {
        const spotifyEmbed = document.getElementById('spotify-embed');
        if (spotifyEmbed && playlistUrl) {
            spotifyEmbed.src = playlistUrl;
        }
    }
});
