# Sycamore iOS

Native iOS app for Sycamore (personal finance: phone sign-in, Plaid bank linking, accounts and transactions). It uses the same backend as the web app.

## Requirements

- Xcode 15+ (recommended 16+ for LinkKit)
- iOS 15.0+
- Backend running with Twilio and Plaid configured (see repo root)

## Setup

1. **Open the project**
   - Open `Sycamore.xcodeproj` in Xcode (from the `ios/` folder).

2. **API base URL**
   - **Production:** The app uses `https://sycamore-production-0924.up.railway.app` by default (set in `Sycamore/Info.plist` under `API_BASE_URL`).
   - **Local backend:** To point at your machine, either:
     - Edit `Sycamore/Info.plist` and set `API_BASE_URL` to `http://localhost:3001`, or
     - Add a Run script / scheme environment variable `API_BASE_URL=http://localhost:3001` (and ensure the key is read in `Config.swift` from the environment).
   - For a device, use your machine’s LAN IP (e.g. `http://192.168.1.x:3001`) and ensure the backend allows that origin if required.

3. **Signing**
   - Select the Sycamore target → Signing & Capabilities and set your Development Team so the app can run on a device or simulator.

4. **Plaid LinkKit**
   - The project adds [Plaid Link iOS (LinkKit)](https://github.com/plaid/plaid-link-ios-spm) via Swift Package Manager. The first time you build, Xcode will resolve the package.
   - If you see compile errors in `PlaidLinkView.swift` (e.g. `LinkTokenConfiguration`, `Plaid.create`, `Handler`), check the [Plaid Link iOS docs](https://plaid.com/docs/link/ios/) for your LinkKit version; type names can differ between major versions.

## Run

1. Start the backend (from repo root: `npm run start` or `node src/index.js`).
2. In Xcode, pick a simulator or device and run (⌘R).

## Features

- **Sign in:** Enter phone number → receive SMS code → verify; JWT is stored in Keychain.
- **Home:** Link a bank (Plaid Link), view linked accounts, sign out.
- **Accounts:** List of linked accounts from the backend.
- **Transactions:** List of transactions (last 30 days by default).

No backend or web app code changes are required; the iOS app uses the existing API.
