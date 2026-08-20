document.addEventListener('DOMContentLoaded', () => {
    const linkEsqueciSenha = document.getElementById('link-esqueci-senha');
    const infoContato = document.getElementById('info-contato-escola');

    if (linkEsqueciSenha && infoContato) {
        linkEsqueciSenha.addEventListener('click', (event) => {
            // Evita o comportamento padrão do link de rolar para o topo da página (href="#")
            event.preventDefault(); 
            
            // Alterna a exibição da div entre bloco e oculta
            if (infoContato.style.display === 'block') {
                infoContato.style.display = 'none';
            } else {
                infoContato.style.display = 'block';
            }
        });
    }
});