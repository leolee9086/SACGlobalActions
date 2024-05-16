const clientApi = require("siyuan")
const { Plugin } = clientApi
const remote = require('@electron/remote');
const {globalShortcut,clipboard} = remote;
const rubickNative = require(globalThis.siyuan.config.system.workspaceDir + '/data/plugins/SACGlobalActions/node_modules/rubick-native')
module.exports = class SACGlobalActions extends Plugin {
    onload() {
        console.log(rubickNative)
        this.注册全局快捷键()
    }
    注册全局快捷键() {
        let altPressed = false;  // 用于跟踪Alt键是否被按下
        let debounceTimer;       // 用于防抖的计时器

        rubickNative.onInputEvent(async (e) => {
            try {
                if (e && e.event) {
                    if (e.event.type === 'KeyRelease') {
                        // 检查是否松开了Alt键
                        if (e.event.value === 'Alt') {
                            altPressed = false;
                        }
                    }
                    if (e.event.type === 'KeyPress') {
                        // 检查是否按下了Alt键
                        if (e.event.value === 'Alt') {
                            altPressed = true;
                        }
                        // 检查是否同时按下了Alt和Space
                        if (altPressed && e.event.value === 'Space') {
                            clearTimeout(debounceTimer); // 清除之前的计时器
                            debounceTimer = setTimeout(async () => { // 设置新的计时器
                                console.log('Alt + Space pressed', e);
                                // 在这里执行你需要的操作
                                const clipboardText = clipboard.readText(); // 从剪贴板读取文本
                                console.log(clipboardText)
                                const tab = await clientApi.openTab(
                                    {
                                        app: this.app,
                                        search: {
                                            k: clipboardText
                                        }
                                    }
                                );
                                clientApi.openWindow(
                                    {
                                        height: 600,
                                        width: 800,
                                        tab: tab
                                    }
                                );
                            }, 300); // 设置300毫秒的防抖时间
    
                        }
                    } else if (e.event.type === 'KeyRelease') {
                        // 检查是否释放了Alt键
                        if (e.event.value === 'Alt') {
                            altPressed = false;
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        });
    }
    onunload() {

    }
}