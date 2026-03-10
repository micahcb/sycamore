import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var authStore: AuthStore
    @State private var step: Step = .phone
    @State private var phone = ""
    @State private var code = ""
    @State private var loading = false
    @State private var errorMessage: String?
    @FocusState private var codeFocused: Bool

    enum Step {
        case phone
        case code
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                if step == .phone {
                    phoneSection
                } else {
                    codeSection
                }
                if let msg = errorMessage {
                    Text(msg)
                        .font(.caption)
                        .foregroundColor(.red)
                        .multilineTextAlignment(.center)
                }
                Spacer()
            }
            .padding(24)
            .navigationTitle("Sycamore")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private var phoneSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Sign in with your phone number")
                .font(.subheadline)
                .foregroundColor(.secondary)
            TextField("Phone number", text: $phone)
                .textContentType(.telephoneNumber)
                .keyboardType(.phonePad)
                .textFieldStyle(.roundedBorder)
                .disabled(loading)
            Button(action: sendCode) {
                if loading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .frame(maxWidth: .infinity)
                } else {
                    Text("Send code")
                        .frame(maxWidth: .infinity)
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(loading || phone.trimmingCharacters(in: .whitespaces).isEmpty)
        }
    }

    private var codeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Enter the code sent to \(phone)")
                .font(.subheadline)
                .foregroundColor(.secondary)
            TextField("Verification code", text: $code)
                .textContentType(.oneTimeCode)
                .keyboardType(.numberPad)
                .textFieldStyle(.roundedBorder)
                .focused($codeFocused)
                .disabled(loading)
            Button(action: verifyCode) {
                if loading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .frame(maxWidth: .infinity)
                } else {
                    Text("Verify")
                        .frame(maxWidth: .infinity)
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(loading || code.isEmpty)
            Button("Use a different number") {
                step = .phone
                code = ""
                errorMessage = nil
            }
            .font(.caption)
        }
        .onAppear { codeFocused = true }
    }

    private func sendCode() {
        errorMessage = nil
        loading = true
        Task {
            do {
                try await APIClient.shared.sendOtp(phone: phone.trimmingCharacters(in: .whitespaces))
                await MainActor.run {
                    step = .code
                    loading = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = (error as? APIError)?.message ?? error.localizedDescription
                    loading = false
                }
            }
        }
    }

    private func verifyCode() {
        errorMessage = nil
        loading = true
        Task {
            do {
                let response = try await APIClient.shared.verifyOtp(phone: phone.trimmingCharacters(in: .whitespaces), code: code)
                await MainActor.run {
                    authStore.setSession(token: response.token, user: response.user)
                    loading = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = (error as? APIError)?.message ?? error.localizedDescription
                    loading = false
                }
            }
        }
    }
}
