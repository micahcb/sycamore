import SwiftUI

@main
struct SycamoreApp: App {
    @StateObject private var authStore = AuthStore.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authStore)
        }
    }
}
