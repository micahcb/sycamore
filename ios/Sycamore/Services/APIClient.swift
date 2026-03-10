import Foundation

struct APIError: LocalizedError {
    let message: String
    let statusCode: Int?
    var errorDescription: String? { message }
}

final class APIClient {
    static let shared = APIClient()

    private let baseURL: URL
    private let session: URLSession
    private let authStore: AuthStore

    init(baseURL: URL = Config.apiBaseURL, authStore: AuthStore = .shared) {
        self.baseURL = baseURL
        self.authStore = authStore
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        self.session = URLSession(configuration: config)
    }

    private func url(path: String, query: [String: String]? = nil) -> URL? {
        let pathTrimmed = path.hasPrefix("/") ? String(path.dropFirst()) : path
        var comp = URLComponents(url: baseURL.appendingPathComponent(pathTrimmed), resolvingAgainstBaseURL: false)
        if let query = query, !query.isEmpty {
            comp?.queryItems = query.map { URLQueryItem(name: $0.key, value: $0.value) }
        }
        return comp?.url
    }

    private func request<T: Decodable>(
        path: String,
        method: String = "GET",
        body: Encodable? = nil,
        query: [String: String]? = nil,
        requiresAuth: Bool = false
    ) async throws -> T {
        guard let url = url(path: path, query: query) else {
            throw APIError(message: "Invalid URL", statusCode: nil)
        }
        var req = URLRequest(url: url)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        if requiresAuth, let token = authStore.token {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        if let body = body {
            req.httpBody = try JSONEncoder().encode(AnyEncodable(body))
        }
        let (data, res) = try await session.data(for: req)
        guard let http = res as? HTTPURLResponse else {
            throw APIError(message: "Invalid response", statusCode: nil)
        }
        if http.statusCode == 401 {
            authStore.logout()
            throw APIError(message: "Session expired. Please sign in again.", statusCode: 401)
        }
        if http.statusCode >= 400 {
            let errorBody = (try? JSONDecoder().decode(ErrorBody.self, from: data)) ?? ErrorBody(error: "Request failed")
            throw APIError(message: errorBody.error, statusCode: http.statusCode)
        }
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return try decoder.decode(T.self, from: data)
    }

    // MARK: - Public (no auth)

    func sendOtp(phone: String) async throws {
        let _: EmptyJSON = try await request(path: "auth/send-otp", method: "POST", body: ["phone": phone])
    }

    func verifyOtp(phone: String, code: String) async throws -> VerifyResponse {
        try await request(path: "auth/verify", method: "POST", body: ["phone": phone, "code": code])
    }

    // MARK: - Protected

    func createLinkToken() async throws -> LinkTokenResponse {
        try await request(path: "api/link/token", method: "POST", body: [String: String](), requiresAuth: true)
    }

    func exchangeToken(publicToken: String) async throws -> ExchangeResponse {
        try await request(path: "api/token/exchange", method: "POST", body: ["public_token": publicToken], requiresAuth: true)
    }

    func getAccounts() async throws -> AccountsResponse {
        try await request(path: "api/accounts", requiresAuth: true)
    }

    func getTransactions(startDate: String? = nil, endDate: String? = nil) async throws -> TransactionsResponse {
        var query = [String: String]()
        if let s = startDate { query["start_date"] = s }
        if let e = endDate { query["end_date"] = e }
        return try await request(path: "api/transactions", query: query.isEmpty ? nil : query, requiresAuth: true)
    }
}

private struct ErrorBody: Decodable {
    let error: String
}

private struct EmptyJSON: Decodable {}

private struct AnyEncodable: Encodable {
    let value: Encodable
    init(_ value: Encodable) { self.value = value }
    func encode(to encoder: Encoder) throws { try value.encode(to: encoder) }
}

struct LinkTokenResponse: Decodable {
    let linkToken: String
    enum CodingKeys: String, CodingKey { case linkToken = "link_token" }
}

struct ExchangeResponse: Decodable {
    let accessToken: String
    let itemId: String
    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case itemId = "item_id"
    }
}
