# Voice Workspace

Voice and typed commands for apps, files and timers.

Independent local application, with a holographic interface. Requires Node.js 22 or newer.

## Run

Run `npm install`, then `npm start` and open http://127.0.0.1:8807. On Windows you can also double-click START.cmd after installation. Run `npm test` for automated checks.

## Privacy and operation

This app listens only on loopback and has no cloud deployment or remote-access configuration. Do not expose the port publicly. Source code contains no personal documents or credentials. Browser storage is local to the browser profile and origin (including the port); clearing that storage removes saved data. Back up/export anything important. Browser storage is not application-level encryption.

## Features and limitations

Typed commands work without speech recognition. Optional one-command browser SpeechRecognition may send audio to its provider and varies by browser. Optional speech synthesis speaks responses. Start/Stop explicitly controls capture. Windows app launch supports only Calculator and Notepad. Filename search is restricted to user-selected files; no uploads. Session-only timers need the tab open; background throttling can delay alerts. No always-on wake word or offline speech model.
