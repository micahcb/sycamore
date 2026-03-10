import SwiftUI
import LinkKit

/// Presents Plaid Link with the given link token. On success, exchanges the public token with our backend and calls onSuccess.
struct PlaidLinkView: View {
    let linkToken: String
    let onSuccess: () -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var errorMessage: String?
    @State private var isExchanging = false

    var body: some View {
        NavigationStack {
            PlaidLinkViewControllerRepresentable(
                linkToken: linkToken,
                onSuccess: { publicToken in
                    exchangeToken(publicToken)
                },
                onExit: {
                    dismiss()
                }
            )
            .ignoresSafeArea()
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
            .overlay {
                if isExchanging {
                    ZStack {
                        Color.black.opacity(0.3)
                        VStack(spacing: 12) {
                            ProgressView()
                                .scaleEffect(1.2)
                                .tint(.white)
                            Text("Linking account…")
                                .foregroundColor(.white)
                        }
                    }
                    .ignoresSafeArea()
                }
            }
            .alert("Error", isPresented: .constant(errorMessage != nil)) {
                Button("OK") {
                    errorMessage = nil
                    dismiss()
                }
            } message: {
                if let msg = errorMessage {
                    Text(msg)
                }
            }
        }
    }

    private func exchangeToken(_ publicToken: String) {
        isExchanging = true
        Task {
            do {
                _ = try await APIClient.shared.exchangeToken(publicToken: publicToken)
                await MainActor.run {
                    isExchanging = false
                    onSuccess()
                    dismiss()
                }
            } catch {
                await MainActor.run {
                    isExchanging = false
                    errorMessage = (error as? APIError)?.message ?? error.localizedDescription
                }
            }
        }
    }
}

/// Presents Plaid Link UI using LinkKit. When the user completes the flow, onSuccess(publicToken) or onExit() is called.
private struct PlaidLinkViewControllerRepresentable: UIViewControllerRepresentable {
    let linkToken: String
    let onSuccess: (String) -> Void
    let onExit: () -> Void

    func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()
        vc.view.backgroundColor = .systemBackground
        return vc
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        guard context.coordinator.handler == nil else { return }
        let configuration = LinkTokenConfiguration(token: linkToken) { success in
            onSuccess(success.publicToken)
        }
        configuration.onExit = { _ in
            onExit()
        }
        switch Plaid.create(configuration) {
        case .failure(let error):
            DispatchQueue.main.async {
                onExit()
            }
            break
        case .success(let handler):
            context.coordinator.handler = handler
            handler.open(presentUsing: .viewController(uiViewController))
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    class Coordinator {
        var handler: Handler?
    }
}
