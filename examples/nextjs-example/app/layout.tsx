import { getVendureClient } from '../lib/vendure-client';

// Initialize the client on the server side
if (typeof window === 'undefined') {
  try {
    getVendureClient();
  } catch (error) {
    console.error('Failed to initialize Vendure Admin Client:', error);
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Vendure Admin Dashboard</title>
        <meta name="description" content="Example Vendure Admin Dashboard" />
      </head>
      <body>
        <div className="app-container">
          <header>
            <div className="header-content">
              <h1>Vendure Admin</h1>
            </div>
          </header>
          <main>{children}</main>
          <footer>
            <div className="footer-content">
              <p>&copy; {new Date().getFullYear()} Vendure Admin Example</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
