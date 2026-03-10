import Foundation
import Combine

/// Persists JWT and user in Keychain; provides auth state for the API client and UI.
final class AuthStore: ObservableObject {
    static let shared = AuthStore()

    private let tokenKey = "auth_token"
    private let userKey = "auth_user"

    @Published private(set) var token: String?
    @Published private(set) var user: User?

    var isLoggedIn: Bool { token != nil && user != nil }

    private init() {
        token = KeychainHelper.loadString(key: tokenKey)
        if let data = KeychainHelper.load(key: userKey),
           let decoded = try? JSONDecoder().decode(User.self, from: data) {
            user = decoded
        } else {
            user = nil
        }
    }

    func setSession(token: String, user: User) {
        _ = KeychainHelper.saveString(key: tokenKey, value: token)
        if let data = try? JSONEncoder().encode(user) {
            _ = KeychainHelper.save(key: userKey, value: data)
        }
        self.token = token
        self.user = user
    }

    func logout() {
        _ = KeychainHelper.delete(key: tokenKey)
        _ = KeychainHelper.delete(key: userKey)
        token = nil
        user = nil
    }
}
