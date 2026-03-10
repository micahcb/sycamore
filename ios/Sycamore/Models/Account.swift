import Foundation

struct Account: Codable, Identifiable {
    let accountId: String
    let name: String
    let type: String
    let subtype: String
    var balances: AccountBalance?

    var id: String { accountId }

    enum CodingKeys: String, CodingKey {
        case accountId = "account_id"
        case name, type, subtype, balances
    }
}

struct AccountBalance: Codable {
    let available: Double?
    let current: Double?
    let limit: Double?
}

struct AccountsResponse: Codable {
    let accounts: [Account]
}
