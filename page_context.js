(function() {
    // 1. ABSOLUTE WINDOW.OPEN NUKE (Silent)
    const blockOpen = function() { return null; };
    
    try { Object.defineProperty(window, 'open', { value: blockOpen, writable: false, configurable: false }); } catch(e) {}
    try { Object.defineProperty(window, 'confirm', { value: () => false, writable: false, configurable: false }); } catch(e) {}
    try { Object.defineProperty(window, 'alert', { value: () => {}, writable: false, configurable: false }); } catch(e) {}

    // 2. IFrame Proxy Destructor (Silent)
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(node) {
        const result = originalAppendChild.call(this, node);
        if (node.tagName && node.tagName.toLowerCase() === 'iframe') {
            try {
                if (node.contentWindow) {
                    Object.defineProperty(node.contentWindow, 'open', { value: blockOpen, writable: false, configurable: false });
                    Object.defineProperty(node.contentWindow, 'confirm', { value: () => false, writable: false, configurable: false });
                    Object.defineProperty(node.contentWindow, 'alert', { value: () => {}, writable: false, configurable: false });
                }
            } catch(e) {}
        }
        return result;
    };

    // 3. Programmatic/Simulated Click Blocker (Silent)
    const origClick = HTMLElement.prototype.click;
    try {
        Object.defineProperty(HTMLElement.prototype, 'click', {
            value: function() {
                if (this.tagName && this.tagName.toLowerCase() === 'a' && this.target === '_blank') return;
                return origClick.call(this);
            },
            writable: false,
            configurable: false
        });
    } catch(e) {}

    const origDispatch = EventTarget.prototype.dispatchEvent;
    try {
        Object.defineProperty(EventTarget.prototype, 'dispatchEvent', {
            value: function(event) {
                if (event && event.type === 'click' && this.tagName && this.tagName.toLowerCase() === 'a' && this.target === '_blank') return false;
                return origDispatch.call(this, event);
            },
            writable: false,
            configurable: false
        });
    } catch(e) {}

    // 4. Prevent BeforeUnload Traps (Silent)
    let lastClickTime = 0;
    document.addEventListener('click', () => { lastClickTime = Date.now(); }, true);
    window.addEventListener('beforeunload', (e) => {
        if (Date.now() - lastClickTime > 1500) {
            e.stopImmediatePropagation();
        }
    }, true);
})();
