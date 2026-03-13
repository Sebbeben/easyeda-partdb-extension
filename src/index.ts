import * as extensionConfig from '../extension.json';

declare const eda: any;

/**
 * Called when the extension is activated.
 */
export function activate(_status?: string, _arg?: string): void {
    // Extension activated
}

/**
 * Open the main part search panel.
 */
export function openSearch(): void {
    eda.sys_IFrame.openIFrame('/iframe/search.html', 900, 650, 'partdb-search');
}

/**
 * Open the settings panel for configuring Part-DB connection.
 */
export function openSettings(): void {
    eda.sys_IFrame.openIFrame('/iframe/settings.html', 480, 380, 'partdb-settings');
}

/**
 * Show the about dialog.
 */
export function about(): void {
    eda.sys_Dialog.showInformationMessage(
        `Part-DB Integration v${extensionConfig.version}\n\nSearch and browse your Part-DB inventory directly from EasyEDA Pro.\n\nGitHub: https://github.com/Sebbeben/easyeda-partdb-extension`,
        'About Part-DB Integration'
    );
}
