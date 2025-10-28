// じゃんけんゲーム - 完全動作版
console.log('スクリプト読み込み開始');

const gameState = {
    wins: 0,
    losses: 0,
    draws: 0,
    choices: {
        rock: { emoji: '✊', name: 'グー' },
        paper: { emoji: '✋', name: 'パー' },
        scissors: { emoji: '✌️', name: 'チョキ' }
    }
};

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(player, computer) {
    if (player === computer) return 'draw';
    const wins = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
    return wins[player] === computer ? 'win' : 'lose';
}

function playGame(playerChoice) {
    console.log('ゲーム開始:', playerChoice);
    
    const playerChoiceEl = document.getElementById('playerChoice');
    const computerChoiceEl = document.getElementById('computerChoice');
    const resultEl = document.getElementById('result');
    const winsEl = document.getElementById('wins');
    const lossesEl = document.getElementById('losses');
    const drawsEl = document.getElementById('draws');
    const winRateEl = document.getElementById('winRate');
    
    if (!playerChoiceEl) {
        console.error('DOM要素が見つかりません');
        return;
    }
    
    playerChoiceEl.textContent = gameState.choices[playerChoice].emoji;
    playerChoiceEl.className = 'choice-display';
    
    const computerChoice = getComputerChoice();
    computerChoiceEl.textContent = gameState.choices[computerChoice].emoji;
    computerChoiceEl.className = 'choice-display';
    
    const result = determineWinner(playerChoice, computerChoice);
    
    if (result === 'win') {
        playerChoiceEl.classList.add('winner');
        computerChoiceEl.classList.add('loser');
        gameState.wins++;
    } else if (result === 'lose') {
        playerChoiceEl.classList.add('loser');
        computerChoiceEl.classList.add('winner');
        gameState.losses++;
    } else {
        gameState.draws++;
    }
    
    const messages = {
        win: `🎉 あなたの勝ち！ ${gameState.choices[playerChoice].name} vs ${gameState.choices[computerChoice].name}`,
        lose: `😔 あなたの負け... ${gameState.choices[playerChoice].name} vs ${gameState.choices[computerChoice].name}`,
        draw: `🤝 引き分け！ ${gameState.choices[playerChoice].name} vs ${gameState.choices[computerChoice].name}`
    };
    
    resultEl.textContent = messages[result];
    resultEl.className = 'result ' + result;
    
    winsEl.textContent = gameState.wins;
    lossesEl.textContent = gameState.losses;
    drawsEl.textContent = gameState.draws;
    
    const total = gameState.wins + gameState.losses + gameState.draws;
    const winRate = total > 0 ? ((gameState.wins / total) * 100).toFixed(1) : 0;
    winRateEl.textContent = winRate + '%';
    
    try {
        localStorage.setItem('jankenStats', JSON.stringify(gameState));
    } catch (e) {}
}

function resetGame() {
    const total = gameState.wins + gameState.losses + gameState.draws;
    if (total > 0 && !confirm('スコアをリセットしますか？')) return;
    
    gameState.wins = 0;
    gameState.losses = 0;
    gameState.draws = 0;
    
    document.getElementById('playerChoice').textContent = '❓';
    document.getElementById('computerChoice').textContent = '❓';
    document.getElementById('result').textContent = '手を選んでゲームを開始しましょう！';
    document.getElementById('playerChoice').className = 'choice-display';
    document.getElementById('computerChoice').className = 'choice-display';
    document.getElementById('result').className = 'result';
    document.getElementById('wins').textContent = '0';
    document.getElementById('losses').textContent = '0';
    document.getElementById('draws').textContent = '0';
    document.getElementById('winRate').textContent = '-%';
    
    try {
        localStorage.setItem('jankenStats', JSON.stringify(gameState));
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了');
    
    try {
        const saved = localStorage.getItem('jankenStats');
        if (saved) {
            const stats = JSON.parse(saved);
            gameState.wins = stats.wins || 0;
            gameState.losses = stats.losses || 0;
            gameState.draws = stats.draws || 0;
            
            document.getElementById('wins').textContent = gameState.wins;
            document.getElementById('losses').textContent = gameState.losses;
            document.getElementById('draws').textContent = gameState.draws;
            
            const total = gameState.wins + gameState.losses + gameState.draws;
            const winRate = total > 0 ? ((gameState.wins / total) * 100).toFixed(1) : 0;
            document.getElementById('winRate').textContent = winRate + '%';
        }
    } catch (e) {}
    
    document.addEventListener('keydown', function(event) {
        switch (event.key.toLowerCase()) {
            case 'r': case '1': event.preventDefault(); playGame('rock'); break;
            case 'p': case '2': event.preventDefault(); playGame('paper'); break;
            case 's': case '3': event.preventDefault(); playGame('scissors'); break;
            case ' ': case 'escape': event.preventDefault(); resetGame(); break;
        }
    });
    
    console.log('初期化完了');
});

console.log('スクリプト読み込み完了');
