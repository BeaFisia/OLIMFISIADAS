// 1. Número de atletas ativos por gerência e nome do arquivo do brasão
const infoGerencias = {
    "DS&IP": { pessoas: 9, brasao: "nome-do-arquivo-brasao-dsip.png" },
    "Vendas": { pessoas: 10, brasao: "nome-do-arquivo-brasao-vendas.png" },
    "Marketing": { pessoas: 8, brasao: "nome-do-arquivo-brasao-marketing.png" },
    "Operações": { pessoas: 15, brasao: "nome-do-arquivo-brasao-operacoes.png" }
};

// 2. Pontuação dos Atletas (Mantenha o ranking individual como estava)
const atletas = [
    { nome: "Luís Mattos", gerencia: "DS&IP", pontos: 0 },
    { nome: "Juan Esteban", gerencia: "DS&IP", pontos: 0 },
    { nome: "Beatriz Borges", gerencia: "DS&IP", pontos: 0 },
    { nome: "Raissa Pulz", gerencia: "DS&IP", pontos: 0 },
    { nome: "Camila Fernandes", gerencia: "DS&IP", pontos: 0 },
    { nome: "Carol Todesquini", gerencia: "DS&IP", pontos: 0 },
    { nome: "Yan Rodrigues", gerencia: "DS&IP", pontos: 0 },
    { nome: "Marcella Pioltine", gerencia: "DS&IP", pontos: 0 },
    { nome: "Jacqueline Reis", gerencia: "DS&IP", pontos: 0 }
];

// 3. Calendário de Atividades
const calendario = [
    { data: "2026-03-05", nome: "Quiz DSM", tipo: "Simples", local: "Teams", descricao: "Quiz rápido sobre a empresa." },
    { data: "2026-03-20", nome: "Meme Friday", tipo: "Engajamento", local: "WhatsApp", descricao: "Compartilhar o melhor meme de trabalho." }
];
