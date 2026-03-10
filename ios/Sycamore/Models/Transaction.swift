import Foundation

struct Transaction: Codable, Identifiable {
    let transactionId: String
    let name: String?
    let amount: Double
    let date: String
    let pending: Bool?
    let accountId: String?

    var id: String { transactionId }

    enum CodingKeys: String, CodingKey {
        case transactionId = "transaction_id"
        case name, amount, date, pending
        case accountId = "account_id"
    }
}

struct TransactionsResponse: Codable {
    let transactions: [Transaction]
    let total: Int
}
