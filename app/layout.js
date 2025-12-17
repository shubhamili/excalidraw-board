import './globals.css'

export const metadata = {
  title: 'Excalidraw Board',
  description: 'A board management application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}