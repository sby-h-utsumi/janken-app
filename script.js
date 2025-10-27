// ゲームの状態を管理するオブジェクト
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

// DOM要素の取得
const elements = {
    playerChoice: document.getElementById('playerChoice'),
    computerChoice: document.getElementById('computerChoice'),
    result: document.getElementById('result'),
    wins: document.getElementById('wins'),
    losses: document.getElementById('losses'),
    draws: document.getElementById('draws')
};

/**
 * コンピューターの選択をランダムに生成
 * @returns {string} rock, paper, scissors のいずれか
 */
function getComputerChoice() {
    const choices = Object.keys(gameState.choices);
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

/**
 * 勝敗を判定する関数
 * @param {string} playerChoice - プレイヤーの選択
 * @param {string} computerChoice - コンピューターの選択
 * @returns {string} 'win', 'lose', 'draw' のいずれか
 */
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    }
    
    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    
    return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
}

/**
 * 結果メッセージを生成
 * @param {string} result - 勝敗結果
 * @param {string} playerChoice - プレイヤーの選択
 * @param {string} computerChoice - コンピューターの選択
 * @returns {string} 結果メッセージ
 */
function getResultMessage(result, playerChoice, computerChoice) {
    const playerName = gameState.choices[playerChoice].name;
    const computerName = gameState.choices[computerChoice].name;
    
    switch (result) {
        case 'win':
            return `🎉 あなたの勝ち！ ${playerName} vs ${computerName}`;
        case 'lose':
            return `😔 あなたの負け... ${playerName} vs ${computerName}`;
        case 'draw':
            return `🤝 引き分け！ ${playerName} vs ${computerName}`;
        default:
            return '結果不明';
    }
}

/**
 * 画面表示を更新
 * @param {string} playerChoice - プレイヤーの選択
 * @param {string} computerChoice - コンピューターの選択
 * @param {string} result - 勝敗結果
 */
function updateDisplay(playerChoice, computerChoice, result) {
    // 選択した手を表示
    elements.playerChoice.textContent = gameState.choices[playerChoice].emoji;
    elements.computerChoice.textContent = gameState.choices[computerChoice].emoji;
    
    // 勝敗に応じて色を変更
    elements.playerChoice.className = 'choice-display';
    elements.computerChoice.className = 'choice-display';
    
    if (result === 'win') {
        elements.playerChoice.classList.add('winner');
        elements.computerChoice.classList.add('loser');
    } else if (result === 'lose') {
        elements.playerChoice.classList.add('loser');
        elements.computerChoice.classList.add('winner');
    }
    
    // 結果メッセージを表示
    elements.result.textContent = getResultMessage(result, playerChoice, computerChoice);
    elements.result.className = `result ${result}`;
    
    // スコアを更新
    elements.wins.textContent = gameState.wins;
    elements.losses.textContent = gameState.losses;
    elements.draws.textContent = gameState.draws;
}

/**
 * アニメーション効果を追加
 */
function addAnimationEffects() {
    // 選択肢をアニメーション
    elements.playerChoice.style.transform = 'scale(1.1)';
    elements.computerChoice.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        elements.playerChoice.style.transform = 'scale(1)';
        elements.computerChoice.style.transform = 'scale(1)';
    }, 300);
    
    // 結果をフェードイン
    elements.result.style.opacity = '0';
    setTimeout(() => {
        elements.result.style.opacity = '1';
    }, 100);
}

/**
 * メインのゲーム関数
 * @param {string} playerChoice - プレイヤーの選択 (rock, paper, scissors)
 */
function playGame(playerChoice) {
    // コンピューターの選択を生成
    const computerChoice = getComputerChoice();
    
    // 勝敗を判定
    const result = determineWinner(playerChoice, computerChoice);
    
    // スコアを更新
    switch (result) {
        case 'win':
            gameState.wins++;
            break;
        case 'lose':
            gameState.losses++;
            break;
        case 'draw':
            gameState.draws++;
            break;
    }
    
    // 表示を更新
    updateDisplay(playerChoice, computerChoice, result);
    
    // アニメーション効果を追加
    addAnimationEffects();
    
    // 効果音を再生（オプション）
    playSound(result);
    
    // 統計情報をコンソールに出力（デバッグ用）
    console.log(`プレイヤー: ${playerChoice}, コンピューター: ${computerChoice}, 結果: ${result}`);
}

/**
 * 効果音を再生（Web Audio API使用）
 * @param {string} result - 勝敗結果
 */
function playSound(result) {
    // ブラウザが Web Audio API をサポートしているかチェック
    if (!window.AudioContext && !window.webkitAudioContext) {
        return;
    }
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 結果に応じて異なる音程を設定
        switch (result) {
            case 'win':
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                break;
            case 'lose':
                oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
                break;
            case 'draw':
                oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4
                break;
        }
        
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('効果音の再生に失敗しました:', error);
    }
}

/**
 * ゲームをリセットする関数
 */
function resetGame() {
    // スコアをリセット
    gameState.wins = 0;
    gameState.losses = 0;
    gameState.draws = 0;
    
    // 表示をリセット
    elements.playerChoice.textContent = '❓';
    elements.computerChoice.textContent = '❓';
    elements.result.textContent = '選択してください';
    
    // CSSクラスをリセット
    elements.playerChoice.className = 'choice-display';
    elements.computerChoice.className = 'choice-display';
    elements.result.className = 'result';
    
    // スコア表示を更新
    elements.wins.textContent = '0';
    elements.losses.textContent = '0';
    elements.draws.textContent = '0';
    
    console.log('ゲームがリセットされました');
}

/**
 * キーボードショートカットを設定
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        switch (event.key.toLowerCase()) {
            case 'r':
            case '1':
                playGame('rock');
                break;
            case 'p':
            case '2':
                playGame('paper');
                break;
            case 's':
            case '3':
                playGame('scissors');
                break;
            case 'escape':
                resetGame();
                break;
        }
    });
}

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('じゃんけんゲームが開始されました！');
    console.log('キーボードショートカット:');
    console.log('R または 1: グー');
    console.log('P または 2: パー');
    console.log('S または 3: チョキ');
    console.log('ESC: リセット');
    
    setupKeyboardShortcuts();
});

// ゲーム統計を取得する関数（オプション）
function getGameStats() {
    const totalGames = gameState.wins + gameState.losses + gameState.draws;
    if (totalGames === 0) {
        return 'まだゲームをプレイしていません。';
    }
    
    const winRate = ((gameState.wins / totalGames) * 100).toFixed(1);
    return {
        totalGames,
        winRate: `${winRate}%`,
        wins: gameState.wins,
        losses: gameState.losses,
        draws: gameState.draws
    };
}