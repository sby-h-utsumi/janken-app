#!/usr/bin/env node

// 簡単なテストバージョン
console.log('🎮 じゃんけんゲーム テスト版');
console.log('═══════════════════════════════');

// chalk ライブラリのテスト
try {
    const chalk = await import('chalk');
    console.log(chalk.default.green('✅ chalk ライブラリ: 正常'));
} catch (error) {
    console.log('❌ chalk ライブラリエラー:', error.message);
}

// inquirer ライブラリのテスト
try {
    const inquirer = await import('inquirer');
    console.log('✅ inquirer ライブラリ: 正常');
    
    // 簡単な質問をテスト
    console.log('\n対話型テストを開始...');
    const answer = await inquirer.default.prompt([
        {
            type: 'list',
            name: 'test',
            message: 'テストメニュー:',
            choices: [
                'オプション1',
                'オプション2',
                '終了'
            ]
        }
    ]);
    
    console.log(`あなたの選択: ${answer.test}`);
    console.log('✅ 対話型テスト成功！');
    
} catch (error) {
    console.log('❌ inquirer ライブラリエラー:', error.message);
}

console.log('\n🎉 テスト完了！');
console.log('全ての機能が正常であれば、app.js も動作するはずです。');