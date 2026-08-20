document.addEventListener('DOMContentLoaded', () => {
    
    const formPerfil = document.getElementById('form-perfil');
    const btnCancel = document.querySelector('.btn-cancel');

    formPerfil.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const sobrenome = document.getElementById('sobrenome').value.trim();
        const email = document.getElementById('email').value.trim();

        // Validação de campos vazios
        if (!nome || !sobrenome) {
            showFeedback('error', 'Os campos Nome e Sobrenome são obrigatórios.', 'Atenção', 3000);
            return;
        }

        if (!email) {
            showFeedback('error', 'O campo E-mail não pode ficar vazio.', 'Atenção', 3000);
            return;
        }

        // Validação Regex de E-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFeedback('error', 'Por favor, insira um e-mail válido.', 'E-mail Inválido', 3000);
            return;
        }

        try {
            await showFeedback('atencao', 'Deseja realmente salvar as alterações no seu perfil?', 'Confirmar Salvar');
            showFeedback('sucesso', 'Seus dados foram atualizados com sucesso!', 'Perfil Atualizado', 3000);
            
            // Aqui vamos colocar o código para mandar os dados para o backend (Flask)
            
        } catch (error) {
            showFeedback('atencaoSimples', 'Nenhuma alteração foi salva.', 'Ação Cancelada', 2000);
        }
    });

    // Botão de limpar formulário
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            formPerfil.reset();
        });
    }
});