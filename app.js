#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import { createRequire } from 'module';

// ゲームの状態を管理するクラス
class JankenGame {
    constructor() {
        this.stats = {
            wins: 0,
            losses: 0,
            draws: 0,
            totalGames: 0
        };
        
        this.choices = {
            rock: { emoji: '✊', name: 'グー' },
            paper: { emoji: '✋', name: 'パー' },
            scissors: { emoji: '✌️', name: 'チョキ' }
        };
        
        this.winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
    }

    // ゲーム開始
    async start() {
        console.clear();
        this.displayWelcome();
        await this.gameLoop();
    }

    // ウェルカムメッセージを表示
    displayWelcome() {
        console.log(chalk.bold.blue('╔══════════════════════════════════════╗'));
        console.log(chalk.bold.blue('║') + chalk.bold.yellow('        🎮 じゃんけんゲーム 🎮        ') + chalk.bold.blue('║'));
        console.log(chalk.bold.blue('╠══════════════════════════════════════╣'));
        console.log(chalk.bold.blue('║') + chalk.white('  コンピューターと対戦しましょう！    ') + chalk.bold.blue('║'));
        console.log(chalk.bold.blue('╚══════════════════════════════════════╝'));
        console.log();
    }

    // メインゲームループ
    async gameLoop() {
        while (true) {
            try {
                const action = await this.getMainMenuChoice();
                
                switch (action) {
                    case 'play':
                        await this.playRound();
                        break;
                    case 'stats':
                        this.displayStats();
                        await this.waitForEnter();
                        break;
                    case 'rules':
                        this.displayRules();
                        await this.waitForEnter();
                        break;
                    case 'reset':
                        await this.resetStats();
                        break;
                    case 'quit':
                        this.displayGoodbye();
                        process.exit(0);
                }
            } catch (error) {
                if (error.isTtyError) {
                    console.log(chalk.red('✗ このターミナルは対話型入力をサポートしていません。'));
                    process.exit(1);
                } else {
                    console.log(chalk.red('✗ エラーが発生しました:', error.message));
                }
            }
        }
    }

    // メインメニューの選択肢を取得
    async getMainMenuChoice() {
        console.log();
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: chalk.bold.cyan('何をしますか？'),
                choices: [
                    { name: '🎯 ゲームを開始', value: 'play' },
                    { name: '📊 統計を表示', value: 'stats' },
                    { name: '📖 ルールを確認', value: 'rules' },
                    { name: '🔄 統計をリセット', value: 'reset' },
                    { name: '👋 ゲームを終了', value: 'quit' }
                ],
                pageSize: 5
            }
        ]);
        
        return answer.action;
    }

    // 1ラウンドのゲームをプレイ
    async playRound() {
        console.log();
        console.log(chalk.bold.green('🎲 ラウンド開始！'));
        console.log();

        // プレイヤーの選択を取得
        const playerChoice = await this.getPlayerChoice();
        
        // コンピューターの選択を生成
        const computerChoice = this.getComputerChoice();
        
        // 結果を判定
        const result = this.determineWinner(playerChoice, computerChoice);
        
        // 統計を更新
        this.updateStats(result);
        
        // 結果を表示
        this.displayRoundResult(playerChoice, computerChoice, result);
        
        // 続行するか確認
        await this.askToContinue();
    }

    // プレイヤーの選択を取得
    async getPlayerChoice() {
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: chalk.bold.yellow('あなたの手を選んでください:'),
                choices: [
                    { name: `${this.choices.rock.emoji} ${this.choices.rock.name}`, value: 'rock' },
                    { name: `${this.choices.paper.emoji} ${this.choices.paper.name}`, value: 'paper' },
                    { name: `${this.choices.scissors.emoji} ${this.choices.scissors.name}`, value: 'scissors' }
                ]
            }
        ]);
        
        return answer.choice;
    }

    // コンピューターの選択を生成
    getComputerChoice() {
        const choices = Object.keys(this.choices);
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }

    // 勝敗を判定
    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'draw';
        }
        
        return this.winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
    }

    // 統計を更新
    updateStats(result) {
        this.stats.totalGames++;
        
        switch (result) {
            case 'win':
                this.stats.wins++;
                break;
            case 'lose':
                this.stats.losses++;
                break;
            case 'draw':
                this.stats.draws++;
                break;
        }
    }

    // ラウンド結果を表示
    displayRoundResult(playerChoice, computerChoice, result) {
        console.log();
        console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log();
        
        // 選択した手を表示
        console.log(chalk.bold.blue('👤 あなた:      ') + 
                   chalk.bold.white(`${this.choices[playerChoice].emoji} ${this.choices[playerChoice].name}`));
        console.log(chalk.bold.red('🤖 コンピューター: ') + 
                   chalk.bold.white(`${this.choices[computerChoice].emoji} ${this.choices[computerChoice].name}`));
        
        console.log();
        
        // 結果を表示
        switch (result) {
            case 'win':
                console.log(chalk.bold.green('🎉 おめでとうございます！あなたの勝ちです！'));
                this.displayWinAnimation();
                break;
            case 'lose':
                console.log(chalk.bold.red('😔 残念！コンピューターの勝ちです...'));
                break;
            case 'draw':
                console.log(chalk.bold.yellow('🤝 引き分けです！'));
                break;
        }
        
        console.log();
        console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        
        // 現在の統計を簡単に表示
        this.displayMiniStats();
    }

    // 勝利時のアニメーション
    displayWinAnimation() {
        const fireworks = ['✨', '🎆', '🎊', '⭐', '💫'];
        let animation = '';
        
        for (let i = 0; i < 5; i++) {
            animation += fireworks[Math.floor(Math.random() * fireworks.length)] + ' ';
        }
        
        console.log(chalk.bold.yellow(animation));
    }

    // 統計の簡易表示
    displayMiniStats() {
        console.log();
        console.log(chalk.gray(`勝利: ${this.stats.wins} | 敗北: ${this.stats.losses} | 引き分け: ${this.stats.draws} | 合計: ${this.stats.totalGames}`));
    }

    // 詳細統計を表示
    displayStats() {
        console.log();
        console.log(chalk.bold.cyan('📊 ゲーム統計'));
        console.log(chalk.bold('═══════════════════════════════════════'));
        
        if (this.stats.totalGames === 0) {
            console.log(chalk.yellow('まだゲームをプレイしていません。'));
            return;
        }
        
        const winRate = ((this.stats.wins / this.stats.totalGames) * 100).toFixed(1);
        const loseRate = ((this.stats.losses / this.stats.totalGames) * 100).toFixed(1);
        const drawRate = ((this.stats.draws / this.stats.totalGames) * 100).toFixed(1);
        
        console.log(chalk.green(`🏆 勝利:     ${this.stats.wins.toString().padStart(3)} (${winRate}%)`));
        console.log(chalk.red(`💀 敗北:     ${this.stats.losses.toString().padStart(3)} (${loseRate}%)`));
        console.log(chalk.yellow(`🤝 引き分け: ${this.stats.draws.toString().padStart(3)} (${drawRate}%)`));
        console.log(chalk.blue(`📊 合計:     ${this.stats.totalGames.toString().padStart(3)}`));
        
        console.log();
        
        // 勝率に応じてコメント
        if (winRate >= 60) {
            console.log(chalk.bold.green('🌟 素晴らしい勝率です！'));
        } else if (winRate >= 40) {
            console.log(chalk.bold.yellow('⚖️  互角の戦いですね！'));
        } else {
            console.log(chalk.bold.red('💪 次は頑張りましょう！'));
        }
    }

    // ルールを表示
    displayRules() {
        console.log();
        console.log(chalk.bold.cyan('📖 じゃんけんのルール'));
        console.log(chalk.bold('═══════════════════════════════════════'));
        console.log();
        console.log(chalk.white('✊ グー   は ✌️  チョキ に') + chalk.bold.green(' 勝利'));
        console.log(chalk.white('✋ パー   は ✊ グー   に') + chalk.bold.green(' 勝利'));
        console.log(chalk.white('✌️  チョキ は ✋ パー   に') + chalk.bold.green(' 勝利'));
        console.log();
        console.log(chalk.yellow('同じ手の場合は引き分けです。'));
        console.log();
        console.log(chalk.gray('コンピューターはランダムに手を選択します。'));
    }

    // 統計リセット
    async resetStats() {
        const answer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: chalk.bold.red('本当に統計をリセットしますか？'),
                default: false
            }
        ]);
        
        if (answer.confirm) {
            this.stats = {
                wins: 0,
                losses: 0,
                draws: 0,
                totalGames: 0
            };
            console.log();
            console.log(chalk.bold.green('✅ 統計がリセットされました！'));
        } else {
            console.log();
            console.log(chalk.yellow('❌ リセットがキャンセルされました。'));
        }
    }

    // 続行確認
    async askToContinue() {
        console.log();
        const answer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: chalk.bold.cyan('もう一度プレイしますか？'),
                default: true
            }
        ]);
        
        if (!answer.continue) {
            // メインメニューに戻る前に少し待機
            console.log();
            console.log(chalk.gray('メインメニューに戻ります...'));
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
            // 連続プレイの場合は再帰的に呼び出し
            await this.playRound();
        }
    }

    // エンター待ち
    async waitForEnter() {
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: chalk.gray('エンターキーを押して続行...')
            }
        ]);
    }

    // お別れメッセージ
    displayGoodbye() {
        console.log();
        console.log(chalk.bold.blue('╔══════════════════════════════════════╗'));
        console.log(chalk.bold.blue('║') + chalk.bold.yellow('        ゲーム終了！お疲れ様！        ') + chalk.bold.blue('║'));
        console.log(chalk.bold.blue('╠══════════════════════════════════════╣'));
        
        if (this.stats.totalGames > 0) {
            const winRate = ((this.stats.wins / this.stats.totalGames) * 100).toFixed(1);
            console.log(chalk.bold.blue('║') + chalk.white(`  最終勝率: ${winRate}% (${this.stats.wins}勝/${this.stats.totalGames}戦)`.padEnd(34)) + chalk.bold.blue('║'));
        } else {
            console.log(chalk.bold.blue('║') + chalk.white('    またの機会にお楽しみください！    ') + chalk.bold.blue('║'));
        }
        
        console.log(chalk.bold.blue('╚══════════════════════════════════════╝'));
        console.log();
        console.log(chalk.bold.magenta('🎮 ありがとうございました！ 🎮'));
        console.log();
    }
}

// エラーハンドリング
process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red('予期しないエラーが発生しました:'), reason);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log();
    console.log(chalk.yellow('\n🛑 ゲームが中断されました。'));
    console.log(chalk.gray('またお会いしましょう！'));
    process.exit(0);
});

// メイン実行
console.log(chalk.gray('ゲームを初期化中...'));
const game = new JankenGame();
game.start().catch(error => {
    console.error(chalk.red('ゲーム開始エラー:'), error);
    process.exit(1);
});