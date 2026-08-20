// Função para exibir feedback temporário
function showFeedback(tipo, mensagem, titulo = "", time = 2000) {
    // Para o modal de confirmação, retornamos uma Promise
    if (tipo === 'atencao') {
        return new Promise((resolve, reject) => {
            const modal = document.getElementById('modal-atencao');
            const titleEl = modal.querySelector('.title-atencao');
            const textEl = modal.querySelector('.text-atencao');
            const btnConfirmar = document.getElementById('modal-atencao-confirmar');
            const btnCancelar = document.getElementById('modal-atencao-cancelar');

            titleEl.textContent = titulo || "Atenção!";
            textEl.textContent = mensagem;

            modal.style.display = "block";

            // Função para fechar o modal e remover os listeners
            const closeModal = () => {
                modal.style.display = "none";
                // É importante remover os event listeners para evitar que seja acionado mais de uma vez
                btnConfirmar.removeEventListener('click', onConfirm);
                btnCancelar.removeEventListener('click', onCancel);
            };

            const onConfirm = () => {
                closeModal();
                resolve(); // A Promise é resolvida (sucesso)
            };

            const onCancel = () => {
                closeModal();
                reject(); // A Promise é rejeitada (cancelamento)
            };
            
            // Adiciona os listeners aos botões
            btnConfirmar.addEventListener('click', onConfirm);
            btnCancelar.addEventListener('click', onCancel);
        });
    } 
    
    // Lógica para os modais simples (atencao, sucesso e erro)
    let modal, titleEl, textEl;
    if (tipo === 'atencaoSimples') {
        modal = document.getElementById('modal-atencaoSimples');
        titleEl = modal.querySelector('.title-atencao');
        textEl = modal.querySelector('.text-atencao');
        if (titleEl) titleEl.textContent = titulo || "Atenção!";
    } else if (tipo === 'sucesso') {
        modal = document.getElementById('modal-sucesso');
        titleEl = modal.querySelector('.title-success');
        textEl = modal.querySelector('.text-success');
        if (titleEl) titleEl.textContent = titulo || "Sucesso!";
    } else { 
        modal = document.getElementById('modal-error');
        titleEl = modal.querySelector('.title-error');
        textEl = modal.querySelector('.text-error');
        if (titleEl) titleEl.textContent = titulo || "Erro!";
    }

    if (textEl) textEl.textContent = mensagem;
    if (modal) {
        modal.style.display = "block";
        setTimeout(() => modal.style.display = "none", time);
    }
}