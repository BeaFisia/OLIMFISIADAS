/**
 * FUNÇÃO DE NAVEGAÇÃO (CORRIGE O BUG DOS BOTÕES)
 * Esta função é responsável por mostrar a secção clicada e esconder as outras.
 */
function showTab(tabId) {
    // Seleciona todos os conteúdos das abas
    const tabs = document.querySelectorAll('.tab-content');
    
    // Remove a classe 'active' de todas as abas
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Adiciona a classe 'active' apenas à aba que foi clicada
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    } else {
        console.error("[Erro] Aba não encontrada: " + tabId);
    }
}

/**
 * INICIALIZAÇÃO
 * Executa as funções assim que a página é carregada.
 */
document.addEventListener('DOMContentLoaded', () => {
    renderCalendario();
    renderRankings();
});

/**
 * LÓGICA DO CALENDÁRIO
 */
function getStatus(dataAtividade) {
    const hoje = new Date().toISOString().split('T')[0];
    if (dataAtividade < hoje) return '<span class="status-done">Concluído</span>';
    if (dataAtividade === hoje) return '<span class="status-progress">Em Curso</span>';
    return '<span class="status-not-started">Agendado</span>';
}

function renderCalendario() {
    const tbody = document.getElementById('corpo-calendario');
    if (!tbody) return;

    tbody.innerHTML = '';
    // Ordena por data (mais recente primeiro)
    const calendarioOrdenado = [...calendario].sort((a, b) => new Date(a.data) - new Date(b.data));

    calendarioOrdenado.forEach(ativ => {
        const dataFormatada = ativ.data.split('-').reverse().join('/');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td><strong>${ativ.nome}</strong><br><small>(${ativ.tipo})</small></td>
            <td>${ativ.descricao}</td>
            <td>${ativ.tipo === 'Engajamento' ? '2 pts' : 'Participação + Bónus'}</td>
            <td>${ativ.local}</td>
            <td>${getStatus(ativ.data)}</td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * LÓGICA DOS RANKINGS (INDIVIDUAL E GERÊNCIAS)
 */
function renderRankings() {
    // 1. RANKING INDIVIDUAL (ATLETAS)
    const tbodyAtletas = document.getElementById('corpo-atletas');
    if (tbodyAtletas) {
        tbodyAtletas.innerHTML = '';
        // Ordena pelo Ranking TOTAL (maior para menor)
        const atletasOrdenados = [...atletas].sort((a, b) => b.pontosTotal - a.pontosTotal);

        atletasOrdenados.forEach((atleta, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}º</td>
                <td>${atleta.nome}</td>
                <td>${atleta.gerencia || "---"}</td>
                <td>${atleta.pontosIntegracao}</td>
                <td><strong>${atleta.pontosTotal}</strong></td>
            `;
            tbodyAtletas.appendChild(tr);
        });
    }

    // 2. RANKING DAS GERÊNCIAS (PER CAPITA)
    const tbodyGerencias = document.getElementById('corpo-gerencias');
    if (tbodyGerencias) {
        tbodyGerencias.innerHTML = '';
        
        const somaGerencias = {};
        
        // Acumula os pontos totais por gerência
        atletas.forEach(atleta => {
            if (atleta.gerencia) {
                if (!somaGerencias[atleta.gerencia]) somaGerencias[atleta.gerencia] = 0;
                somaGerencias[atleta.gerencia] += atleta.pontosTotal;
            }
        });

        // Calcula a média per capita usando infoGerencias do data.js
        const rankingGerencias = Object.keys(somaGerencias).map(nomeG => {
            const pontosG = somaGerencias[nomeG];
            const info = infoGerencias[nomeG] || { pessoas: 1, brasao: "" };
            const perCapita = (pontosG / info.pessoas).toFixed(2);
            return { 
                nome: nomeG, 
                pontosPerCapita: parseFloat(perCapita), 
                brasao: info.brasao 
            };
        });

        // Ordena do maior para o menor per capita
        rankingGerencias.sort((a, b) => b.pontosPerCapita - a.pontosPerCapita);

        rankingGerencias.forEach((g, index) => {
            const tr = document.createElement('tr');
            // [Inferência] O uso do onerror na imagem serve para evitar o ícone de "imagem partida" caso o arquivo não exista no GitHub.
            tr.innerHTML = `
                <td>${index + 1}º</td>
                <td>
                    <img src="${g.brasao}" class="brasao-gerencia" 
                         onerror="this.style.display='none'" 
                         alt="">
                    ${g.nome}
                </td>
                <td><strong>${g.pontosPerCapita}</strong></td>
            `;
            tbodyGerencias.appendChild(tr);
        });
    }
}
