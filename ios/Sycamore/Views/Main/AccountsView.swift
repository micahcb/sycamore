import SwiftUI

struct AccountsView: View {
    @State private var accounts: [Account] = []
    @State private var loading = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            Group {
                if loading && accounts.isEmpty {
                    ProgressView("Loading accounts…")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if accounts.isEmpty {
                    ContentUnavailableView(
                        "No accounts",
                        systemImage: "creditcard",
                        description: Text("Link a bank from the Home tab to see your accounts here.")
                    )
                } else {
                    List(accounts) { account in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(account.name)
                                .font(.headline)
                            Text("\(account.type) · \(account.subtype)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            if let balances = account.balances, let current = balances.current {
                                Text(Format.currency(current))
                                    .font(.subheadline)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
            .navigationTitle("Accounts")
            .refreshable {
                await loadAccounts()
            }
            .onAppear {
                Task { await loadAccounts() }
            }
            .alert("Error", isPresented: .constant(errorMessage != nil)) {
                Button("OK") { errorMessage = nil }
            } message: {
                if let msg = errorMessage {
                    Text(msg)
                }
            }
        }
    }

    private func loadAccounts() async {
        loading = true
        errorMessage = nil
        defer { loading = false }
        do {
            let response = try await APIClient.shared.getAccounts()
            await MainActor.run {
                accounts = response.accounts
            }
        } catch {
            if (error as? APIError)?.statusCode != 400 {
                await MainActor.run {
                    errorMessage = (error as? APIError)?.message ?? error.localizedDescription
                }
            }
        }
    }
}
