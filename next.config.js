/** @type {import('next').NextConfig} */
const nextConfig = {
  
  // Setup file next.config.js

  reactStrictMode: true, // Bật strict mode khi đang ở môi trường dev
  swcMinify: true, // Sử dụng SWC(Speedy Web Compiler) để minify mã JS gọn hơn. Nó là 1 trình biên dịch JS nhanh giúp tăng tốc độ build và start app
  poweredByHeader: false, // False thì nextjs sẽ k thêm header "X-Powered-By: Next.js" vào các response HTTP. Nó giúp ẩn đi thông tin về việc đang dùng nextjs, tăng bảo mật
  eslint: {
    dirs: ["."],
  },

  // trailingSlash: true, // k cần thiết, set để url có / ở cuối
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    
    // Hoặc list các domain cho phép lấy ảnh
    // domains: [
    //   "aptos-api-testnet.bluemove.net",
    //   "aptos.dev",
    //   "ipfs.bluemove.io",
    //   "ipfs.bluemove.net",
    //   "zenno.moe",
    // ],

    // unoptimized: true, // optimizer image của next gây 1 số lỗi k load được ảnh
    // Khi k dùng optimizer, ảnh bị lỗi sẽ tự gọi getServerSideProps hỏng cmnl
  },

  // Cấu hình devIndicators liên quan đến việc hiển thị các chỉ số trong quá trình chạy app. 
  // buildActivity: false sẽ khiến k hiện các chỉ số khi build như khi tái biên dịch. Nó trông clear hơn nhưng khó khăn hơn khi debug => thật ra k ảnh hưởng mấy
  devIndicators: {
    buildActivity: false,
  },

  experimental: {
    // Tính năng thử nghiệm được đưa vào trường experimental
    // esmExternals là cờ cho phép nextjs sử dụng các gọi EcmaScript Module (export import) bên ngoài mà k cần chuyển đổi sang CommonJS (module.export require). Nếu là false thì nó phải chuyển hết các gói ESM về commonjs nên build sẽ lâu hơn, do đó mặc định nextjs tự set là true để đem lại lợi ích về hiệu suất
    esmExternals: false,
  },
};

module.exports = nextConfig;
