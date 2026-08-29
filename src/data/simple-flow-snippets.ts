export const simpleFlowCodeTabs = [
	{
		filename: 'DictationStateMachine.swift',
		lang: 'swift',
		code: `public enum DictationPhase: Equatable, Sendable {
    case idle
    case recording
    case transcribing
    case feedback(FeedbackKind)
}

public struct DictationStateMachine: Sendable {
    public private(set) var phase: DictationPhase = .idle

    public mutating func handle(_ event: DictationEvent) -> [DictationEffect] {
        switch (phase, event) {
        case (.idle, .hotkeyPressed):
            phase = .recording
            return [.captureFocus, .startAudio]

        case (.recording, .hotkeyReleased):
            phase = .transcribing
            return [.stopAndTranscribe]

        case (.recording, .escapePressed):
            phase = .idle
            return [.cancelAudio, .returnToIdle]

        case (.transcribing, .transcriptionInserted):
            phase = .feedback(.inserted)
            return []

        case (.transcribing, .failed(let message)):
            phase = .feedback(.error(message))
            return []

        default:
            return []
        }
    }
}`,
	},
	{
		filename: 'HotkeyMonitor.swift',
		lang: 'swift',
		code: `import ApplicationServices
import CoreGraphics
import Foundation

public final class HotkeyMonitor: @unchecked Sendable {
    private var eventTap: CFMachPort?
    private var decoder: HotkeyEventDecoder

    public init(hotkey: Hotkey = .fnKey) {
        self.decoder = HotkeyEventDecoder(hotkey: hotkey)
    }

    public func start() {
        let mask = (1 << CGEventType.flagsChanged.rawValue)
        self.eventTap = CGEvent.tapCreate(
            tap: .cghidEventTap,
            place: .headInsertEventTap,
            options: .listenOnly,
            eventsOfInterest: CGEventMask(mask),
            callback: { (proxy, type, event, refcon) -> Unmanaged<CGEvent>? in
                guard let refcon = refcon else { return Unmanaged.passUnretained(event) }
                let monitor = Unmanaged<HotkeyMonitor>.fromOpaque(refcon).takeUnretainedValue()
                monitor.handleFlagsChanged(event.flags)
                return Unmanaged.passUnretained(event)
            },
            userInfo: Unmanaged.passUnretained(self).toOpaque()
        )
        
        let runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, eventTap, 0)
        CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: eventTap!, enable: true)
    }
}`,
	},
	{
		filename: 'TextInserter.swift',
		lang: 'swift',
		code: `import CoreGraphics
import Foundation

public final class SystemEventPoster: EventPosting, @unchecked Sendable {
    public func postPasteCommand() -> Bool {
        let cmdKeyCode: CGKeyCode = 55 // Command key
        let vKeyCode: CGKeyCode = 9    // 'V' key

        let source = CGEventSource(stateID: .combinedSessionState)
        guard let cmdDown = CGEvent(keyboardEventSource: source, virtualKey: cmdKeyCode, keyDown: true),
              let vDown   = CGEvent(keyboardEventSource: source, virtualKey: vKeyCode, keyDown: true),
              let vUp     = CGEvent(keyboardEventSource: source, virtualKey: vKeyCode, keyDown: false),
              let cmdUp   = CGEvent(keyboardEventSource: source, virtualKey: cmdKeyCode, keyDown: false) else {
            return false
        }

        cmdDown.flags = .maskCommand
        vDown.flags   = .maskCommand
        vUp.flags     = .maskCommand
        cmdUp.flags   = []

        // Post Command+V synthetic event tap directly to active focused application
        cmdDown.post(tap: .cghidEventTap)
        vDown.post(tap: .cghidEventTap)
        vUp.post(tap: .cghidEventTap)
        cmdUp.post(tap: .cghidEventTap)

        return true
    }
}`,
	},
];
