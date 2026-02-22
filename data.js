// 1. Número de atletas ativos por gerência e nome do arquivo do brasão
const infoGerencias = {
    "DS&IP": { pessoas: 9, brasao: "DS&IP.jpg" },
    "WHSL": { pessoas: 5, brasao: "whsl.png" },
    "IBP": { pessoas: 6, brasao: "IBP.png" },
    "MPO": { pessoas: 15, brasao: "MPO.png" }
    "NDS": { pessoas: 13, brasao: "NDS.png" }
    "NDDC": { pessoas: 9, brasao: "nddc.jpg" }
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
