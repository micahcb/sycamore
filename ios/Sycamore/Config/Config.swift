import Foundation

/// API and app configuration. Set API_BASE_URL in the scheme or xcconfig for dev vs production.
enum Config {
    /// Backend base URL (no trailing slash). Default: production. Use http://localhost:3001 for dev.
    static var apiBaseURL: URL {
        let raw = ProcessInfo.processInfo.environment["API_BASE_URL"]
            ?? Bundle.main.object(forInfoDictionaryKey: "API_BASE_URL") as? String
            ?? "https://sycamore-production-0924.up.railway.app"
        let trimmed = raw.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        if trimmed.hasPrefix("http://") || trimmed.hasPrefix("https://") {
            return URL(string: trimmed) ?? URL(string: "https://sycamore-production-0924.up.railway.app")!
        }
        return URL(string: "https://\(trimmed)") ?? URL(string: "https://sycamore-production-0924.up.railway.app")!
    }
}
