import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house")
                }
                .tag(0)
            AccountsView()
                .tabItem {
                    Label("Accounts", systemImage: "creditcard")
                }
                .tag(1)
            TransactionsView()
                .tabItem {
                    Label("Transactions", systemImage: "list.bullet")
                }
                .tag(2)
        }
    }
}
