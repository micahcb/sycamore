import SwiftUI

struct TransactionsView: View {
    @State private var transactions: [Transaction] = []
    @State private var loading = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            Group {
                if loading && transactions.isEmpty {
                    ProgressView("Loading transactions…")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if transactions.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "list.bullet")
                            .font(.system(size: 48))
                            .foregroundColor(.secondary)
                        Text("No transactions")
                            .font(.headline)
                        Text("Link a bank from the Home tab to see transactions here.")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .padding()
                } else {
                    List(transactions) { tx in
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(tx.name ?? "Unknown")
                                    .font(.subheadline)
                                Text(tx.date)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            Spacer()
                            Text(Format.currency(tx.amount))
                                .font(.subheadline)
                                .foregroundColor(tx.amount < 0 ? .red : .primary)
                            if tx.pending == true {
                                Text("Pending")
                                    .font(.caption2)
                                    .foregroundColor(.orange)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
            .navigationTitle("Transactions")
            .refreshable {
                await loadTransactions()
            }
            .onAppear {
                Task { await loadTransactions() }
            }
            .alert("Error", isPresented: Binding(
                get: { errorMessage != nil },
                set: { if !$0 { errorMessage = nil } }
            )) {
                Button("OK", role: .cancel) { errorMessage = nil }
            } message: {
                if let msg = errorMessage {
                    Text(msg)
                }
            }
        }
    }

    private func loadTransactions() async {
        loading = true
        errorMessage = nil
        defer { loading = false }
        do {
            let response = try await APIClient.shared.getTransactions()
            await MainActor.run {
                transactions = response.transactions
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
