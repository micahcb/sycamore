import Foundation

struct User: Codable, Equatable {
    let id: String
    let phone: String
}

struct VerifyResponse: Codable {
    let token: String
    let user: User
}
