#!/usr/bin/env node

// デバッグ版のじゃんけんゲーム
console.log('🎮 じゃんけんゲーム (デバッグ版)');
console.log('═══════════════════════════════');
console.log('Node.js バージョン:', process.version);
console.log('プラットフォーム:', process.platform);
console.log('ターミナル情報:');
console.log('- stdout.isTTY:', process.stdout.isTTY);
console.log('- stdin.isTTY:', process.stdin.isTTY);
console.log('- TERM環境変数:', process.env.TERM);

// chalk のテスト
let chalk;
try {
    chalk = (await import('chalk')).default;
    console.log(chalk.green('✅ chalk ライブラリ読み込み成功'));
} catch (error) {
    console.log('❌ chalk ライブラリエラー:', error.message);
    process.exit(1);
}

// inquirer のテスト
let inquirer;
try {
    inquirer = (await import('inquirer')).default;
    console.log(chalk.green('✅ inquirer ライブラリ読み込み成功'));
} catch (error) {
    console.log(chalk.red('❌ inquirer ライブラリエラー:', error.message));
    process.exit(1);
}

console.log('\n--- シンプルなinquirerテスト ---');

try {
    // 基本的な確認プロンプト
    const answer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'continue',
            message: '画面は正常に表示されていますか？',
            default: true
        }
    ]);
    
    if (answer.continue) {
        console.log(chalk.green('✅ inquirer は正常に動作しています！'));
        
        // じゃんけんの簡単なテスト
        console.log('\n--- じゃんけんテスト ---');
        
        const choice = await inquirer.prompt([
            {
                type: 'list',
                name: 'hand',
                message: 'あなたの手を選んでください:',
                choices: [
                    { name: '✊ グー', value: 'rock' },
                    { name: '✋ パー', value: 'paper' },
                    { name: '✌️ チョキ', value: 'scissors' }
                ]
            }
        ]);
        
        const computerChoices = ['rock', 'paper', 'scissors'];
        const computerChoice = computerChoices[Math.floor(Math.random() * 3)];
        const handEmojis = { rock: '✊', paper: '✋', scissors: '✌️' };
        const handNames = { rock: 'グー', paper: 'パー', scissors: 'チョキ' };
        
        console.log('\n' + chalk.bold('結果:'));
        console.log(`あなた: ${handEmojis[choice.hand]} ${handNames[choice.hand]}`);
        console.log(`コンピューター: ${handEmojis[computerChoice]} ${handNames[computerChoice]}`);
        
        if (choice.hand === computerChoice) {
            console.log(chalk.yellow('🤝 引き分けです！'));
        } else if (
            (choice.hand === 'rock' && computerChoice === 'scissors') ||
            (choice.hand === 'paper' && computerChoice === 'rock') ||
            (choice.hand === 'scissors' && computerChoice === 'paper')
        ) {
            console.log(chalk.green('🎉 あなたの勝ちです！'));
        } else {
            console.log(chalk.red('😔 あなたの負けです...'));
        }
        
        console.log('\n' + chalk.bold.blue('テスト完了！メインアプリも正常に動作するはずです。'));
        
    } else {
        console.log(chalk.red('❌ inquirer が正常に動作していません。'));
        console.log('解決方法:');
        console.log('1. Windows Terminal を使用してみてください');
        console.log('2. コマンドプロンプト (cmd) で実行してみてください');
        console.log('3. VS Code の統合ターミナルの設定を確認してください');
    }
    
} catch (error) {
    console.log(chalk.red('❌ エラーが発生しました:'), error.message);
    console.log('\n解決方法:');
    console.log('1. 別のターミナル (Windows Terminal, cmd) で実行してみてください');
    console.log('2. VS Code を管理者として実行してみてください');
    console.log('3. PowerShell のバージョンを確認してください: $PSVersionTable');
}

console.log('\n--- 環境情報 ---');
console.log('現在の作業ディレクトリ:', process.cwd());
console.log('引数:', process.argv);