it('isCdpMethodAllowed returns false for dangerous methods that must NOT be allowed (Codex T2)', () => {
    // Code execution surfaces — would be RCE if allowed
    expect(isCdpMethodAllowed('Runtime.evaluate')).toBe(false);
    expect(isCdpMethodAllowed('Runtime.callFunctionOn')).toBe(false);
    expect(isCdpMethodAllowed('Runtime.compileScript')).toBe(false);
    expect(isCdpMethodAllowed('Runtime.runScript')).toBe(false);
    expect(isCdpMethodAllowed('Debugger.evaluateOnCallFrame')).toBe(false);
    expect(isCdpMethodAllowed('Page.addScriptToEvaluateOnNewDocument')).toBe(false);
    expect(isCdpMethodAllowed('Page.createIsolatedWorld')).toBe(false);

    // Navigation — must use $B goto so URL blocklist applies
    expect(isCdpMethodAllowed('Page.navigate')).toBe(false);
    expect(isCdpMethodAllowed('Page.navigateToHistoryEntry')).toBe(false);

    // Exfil surfaces
    expect(isCdpMethodAllowed('Network.getResponseBody')).toBe(false);
    expect(isCdpMethodAllowed('Network.getCookies')).toBe(false);
    expect(isCdpMethodAllowed('Network.replayXHR')).toBe(false);
    expect(isCdpMethodAllowed('Network.loadNetworkResource')).toBe(false);
    expect(isCdpMethodAllowed('Storage.getCookies')).toBe(false);
    expect(isCdpMethodAllowed('Fetch.fulfillRequest')).toBe(false);

    // Browser/process-level mutators
    expect(isCdpMethodAllowed('Browser.close')).toBe(false);
    expect(isCdpMethodAllowed('Browser.crash')).toBe(false);
    expect(isCdpMethodAllowed('Target.attachToTarget')).toBe(false);
    expect(isCdpMethodAllowed('Target.createTarget')).toBe(false);
    expect(isCdpMethodAllowed('Target.setAutoAttach')).toBe(false);
    expect(isCdpMethodAllowed('Target.exposeDevToolsProtocol')).toBe(false);

    // Read-only methods we never added
    expect(isCdpMethodAllowed('Bogus.unknown')).toBe(false);
  })