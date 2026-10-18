# Laboratório Interativo de Probabilidade

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss&logoColor=white)
![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26?logo=html5&logoColor=white)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-green)

Aplicação web interativa para exploração, experimentação e compreensão dos conceitos fundamentais da teoria das probabilidades. O projeto funciona inteiramente no navegador, com simulações físicas em tempo real, gráficos comparativos e explicações detalhadas sobre os fenômenos probabilísticos.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades Principais](#funcionalidades-principais)
  - [Laboratório de Dados](#laboratório-de-dados)
  - [Laboratório de Roletas](#laboratório-de-roletas)
  - [Laboratório de Cartas](#laboratório-de-cartas)
  - [Área de Desafios](#área-de-desafios)
  - [Estatísticas Gerais](#estatísticas-gerais)
- [Diferencial Pedagógico](#diferencial-pedagógico)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação e Execução Local](#instalação-e-execução-local)
- [Compilação para Produção](#compilação-para-produção)
- [Licença](#licença)

---

## Visão Geral

O projeto foi desenvolvido para permitir que estudantes e interessados em matemática visualizem e testem conceitos probabilísticos na prática, confrontando os cálculos teóricos com resultados experimentais obtidos em simulações.

A interface possui design limpo em modo claro, tipografia nítida, layout responsivo adaptável a dispositivos móveis e desktops, e navegação direta entre os módulos de aprendizado.

---

## Funcionalidades Principais

### Laboratório de Dados
- **Simulação Física em Canvas**: animação em tempo real com dados tridimensionais que rolam, colidem com as bordas e desaceleram suavemente até a face sorteada.
- **Seleção de Dados**: escolha entre 1, 2 ou 3 dados simultâneos com soma automática dos resultados.
- **Lançamentos em Lote**: botões para lançar 1x, 10x, 100x ou 1000x rapidamente para análise amostral.
- **Gráfico Comparativo**: visualização lado a lado da distribuição teórica versus a frequência experimental observada.
- **Matriz do Espaço Amostral**: representação em grade de todos os 36 pares ordenados possíveis para 2 dados, com realce visual interativo da soma selecionada.

### Laboratório de Roletas
- **Roleta Interativa com Física Angular**: desaceleração inercial realista e oscilação da agulha indicadora.
- **Personalização de Setores**: criação, edição e exclusão de fatias com definição de nomes, cores e pesos proporcionais.
- **Modelos Pré-definidos**: configurações prontas como Roleta Justa (4 cores iguais), Desbalanceada (80/20), Prêmios Raros e Par/Ímpar.
- **Probabilidade Geométrica**: cálculo da área circular e razão em relação à circunferência completa (360°).
- **Histórico e Comparação**: acompanhamento contínuo dos resultados obtidos em relação aos valores esperados.

### Laboratório de Cartas
- **Mesa de Cartas com Efeito 3D**: visualização realista de cartas de baralho com animações de distribuição e virada.
- **Investigação de Eventos**: filtragem por Ases, cartas vermelhas, figuras (Valete, Dama e Rei), naipes específicos e números pares.
- **Com ou Sem Reposição**: estudo prático da independência de eventos (espaço fixo de 52 cartas) e de eventos dependentes com redução gradual do espaço amostral (52 para 51, 50, etc.).
- **Visualização do Espaço Amostral**: exibição das 52 cartas organizadas por naipe com destaque em tempo real nas cartas favoráveis ao evento investigado.

### Área de Desafios
- **Questões Conceituais**: desafios de múltipla escolha cobrindo dados, roletas, baralho e princípios fundamentais da probabilidade.
- **Feedback Imediato**: justificativa detalhada ao selecionar cada alternativa para esclarecer acertos e equívocos.
- **Sistema de Dicas e Explicações**: recurso de apoio para raciocínio e explicação teórica aprofundada após cada resposta.

### Estatísticas Gerais
- **Consolidação dos Experimentos**: painel integrado que registra todas as ações realizadas durante a navegação.
- **Demonstração da Lei dos Grandes Números**: indicador visual que evidencia como o aumento da quantidade de testes faz a frequência observada convergir para a probabilidade teórica.
- **Marcos de Exploração**: acompanhamento de objetivos alcançados ao longo dos experimentos.

---

## Diferencial Pedagógico

O principal objetivo da plataforma é explicar o motivo pelo qual os resultados acontecem:
- Por que a soma 7 em dois dados é a mais provável (possui 6 combinações favoráveis: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1), enquanto a soma 2 possui apenas uma (1+1).
- Como o tamanho da fatia de uma roleta determina matematicamente a probabilidade pelo seu ângulo central em relação a 360°.
- Como a retirada de uma carta sem reposição altera tanto os casos favoráveis quanto o total do espaço amostral na jogada seguinte.

---

## Tecnologias Utilizadas

- **React 19**: construção da interface reativa baseada em componentes.
- **TypeScript**: tipagem estática rigorosa para garantir segurança e consistência no código.
- **Vite 6**: ferramenta de compilação e empacotamento com suporte a Hot Module Replacement (HMR).
- **Tailwind CSS 4**: estilização utilitária com design minimalista em modo claro.
- **HTML5 Canvas**: renderização das simulações físicas e dinâmicas da roleta e dos dados em 60 quadros por segundo.

---

## Instalação e Execução Local

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes)

### Passos para rodar localmente

1. Clone o repositório ou acesse a pasta do projeto:
```bash
cd probabilidade
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador no endereço indicado no terminal (normalmente `http://localhost:5173`).

---

## Compilação para Produção

Para gerar os arquivos otimizados para publicação:

```bash
npm run build
```

Os arquivos prontos serão gerados no diretório `dist/`. Para testar a versão de produção localmente:

```bash
npm run preview
```

---

## Licença

Este projeto está sob a licença [MIT](LICENSE).
