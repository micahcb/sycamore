import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var authStore: AuthStore
    @State private var accounts: [Account] = []
    @State private var loading = false
    @State private var errorMessage: String?
    @State private var showPlaidLink = false
    @State private var linkToken: String?

    var body: some View {
        NavigationStack {
            List {
                Section {
                    if let user = authStore.user {
                        Label(user.phone, systemImage: "person.circle")
                    }
                    Button("Sign out") {
                        authStore.logout()
                    }
                    .foregroundColor(.red)
                }
                Section("Linked accounts") {
                    if loading && accounts.isEmpty {
                        HStack {
                            Spacer()
                            ProgressView()
                            Spacer()
                        }
                    } else if accounts.isEmpty {
                        Text("No accounts linked. Link a bank to get started.")
                            .foregroundColor(.secondary)
                        Button("Link a bank") {
                            fetchLinkTokenAndPresentPlaid()
                        }
                    } else {
                        ForEach(accounts) { account in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(account.name)
                                    .font(.headline)
                                Text("\(account.type) · \(account.subtype)")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                        Button("Link another account") {
                            fetchLinkTokenAndPresentPlaid()
                        }
                    }
                }
                if let msg = errorMessage {
                    Section {
                        Text(msg)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                }
            }
            .navigationTitle("Home")
            .refreshable {
                await loadAccounts()
            }
            .onAppear {
                Task { await loadAccounts() }
            }
            .sheet(isPresented: $showPlaidLink) {
                if let token = linkToken {
                    PlaidLinkView(linkToken: token) {
                        showPlaidLink = false
                        linkToken = nil
                        Task { await loadAccounts() }
                    }
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

    private func fetchLinkTokenAndPresentPlaid() {
        errorMessage = nil
        Task {
            do {
                let response = try await APIClient.shared.createLinkToken()
                await MainActor.run {
                    linkToken = response.linkToken
                    showPlaidLink = true
                }
            } catch {
                await MainActor.run {
                    errorMessage = (error as? APIError)?.message ?? error.localizedDescription
                }
            }
        }
    }
}
