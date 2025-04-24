import TokenRefresher from '@components/tokenRefresher/TokenRefresher'

export default function AfterLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <TokenRefresher>{children}</TokenRefresher>
}
