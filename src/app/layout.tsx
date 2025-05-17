import BasicLayout from '@/layouts/BasicLayout'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ch">
      <body>
        <AntdRegistry>
          <BasicLayout>{children}</BasicLayout>
        </AntdRegistry>
      </body>
    </html>
  )
}
