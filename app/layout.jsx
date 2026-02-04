import "./globals.css";
import { Providers } from './providers';
import { Nav } from './nav';

export const metadata = {
  title: "AMM Swap",
  description: "Decentralized AMM built on Sepolia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[12%] left-[8%] w-36 h-36 bg-[#f59e0b] opacity-[0.45] blur-[70px] rounded-full" />
              <div className="absolute top-[8%] right-[12%] w-44 h-44 bg-[#ec4899] opacity-[0.35] blur-[80px] rounded-full" />
              <div className="absolute top-[55%] left-[3%] w-28 h-28 bg-[#8b5cf6] opacity-[0.4] blur-[60px] rounded-full" />
              <div className="absolute top-[65%] right-[6%] w-40 h-40 bg-[#3b82f6] opacity-[0.3] blur-[75px] rounded-full" />
              <div className="absolute bottom-[12%] left-[30%] w-24 h-24 bg-[#10b981] opacity-[0.3] blur-[55px] rounded-full" />
              <div className="absolute top-[25%] right-[28%] w-20 h-20 bg-[#f43f5e] opacity-[0.25] blur-[50px] rounded-full" />
              <div className="absolute bottom-[25%] right-[35%] w-28 h-28 bg-[#6366f1] opacity-[0.3] blur-[60px] rounded-full" />
            </div>

            {/* Floating Crypto Silhouettes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* ETH */}
              <div className="absolute top-[8%] left-[6%] crypto-float-1" style={{opacity: 0.07}}>
                <svg width="100" height="140" viewBox="0 0 60 84" fill="white">
                  <polygon points="30,0 58,28 30,36 2,28"/>
                  <polygon points="2,31 30,39 30,84 2,31" opacity="0.85"/>
                  <polygon points="58,31 30,39 30,84 58,31" opacity="0.92"/>
                </svg>
              </div>
              {/* BTC */}
              <div className="absolute top-[12%] right-[5%] crypto-float-2" style={{opacity: 0.06}}>
                <svg width="110" height="110" viewBox="0 0 70 70" fill="white">
                  <circle cx="35" cy="35" r="32" stroke="white" strokeWidth="3.5" fill="none"/>
                  <text x="35" y="48" textAnchor="middle" fontSize="34" fill="white" fontWeight="bold">₿</text>
                </svg>
              </div>
              {/* SOL */}
              <div className="absolute top-[60%] left-[2%] crypto-float-3" style={{opacity: 0.065}}>
                <svg width="90" height="90" viewBox="0 0 90 90" fill="white">
                  <circle cx="45" cy="45" r="18"/>
                  {[0,45,90,135,180,225,270,315].map((angle, i) => (
                    <rect key={i} x="42" y="8" width="6" height="14" rx="3" transform={`rotate(${angle} 45 45)`}/>
                  ))}
                </svg>
              </div>
              {/* DOGE */}
              <div className="absolute bottom-[15%] right-[4%] crypto-float-4" style={{opacity: 0.055}}>
                <svg width="95" height="95" viewBox="0 0 100 100" fill="white">
                  <ellipse cx="50" cy="58" rx="30" ry="28"/>
                  <ellipse cx="22" cy="28" rx="12" ry="18" transform="rotate(-12 22 28)"/>
                  <ellipse cx="78" cy="28" rx="12" ry="18" transform="rotate(12 78 28)"/>
                  <circle cx="38" cy="52" r="4" fill="#0a0a0f"/>
                  <circle cx="62" cy="52" r="4" fill="#0a0a0f"/>
                  <ellipse cx="50" cy="60" rx="5" ry="3" fill="#0a0a0f"/>
                </svg>
              </div>
              {/* ADA */}
              <div className="absolute bottom-[35%] left-[8%] crypto-float-5" style={{opacity: 0.06}}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="white" strokeWidth="5">
                  <circle cx="40" cy="40" r="28"/>
                  <circle cx="40" cy="40" r="12" fill="white" stroke="none"/>
                </svg>
              </div>
              {/* XRP */}
              <div className="absolute top-[42%] right-[7%] crypto-float-6" style={{opacity: 0.055}}>
                <svg width="75" height="75" viewBox="0 0 75 75" fill="none" stroke="white">
                  <circle cx="37" cy="37" r="30" strokeWidth="2.5"/>
                  <circle cx="37" cy="37" r="20" strokeWidth="2"/>
                  <circle cx="37" cy="37" r="10" strokeWidth="2.5"/>
                  <circle cx="37" cy="37" r="3" fill="white"/>
                </svg>
              </div>
              {/* BNB */}
              <div className="absolute bottom-[8%] left-[25%] crypto-float-7" style={{opacity: 0.05}}>
                <svg width="70" height="70" viewBox="0 0 70 70" fill="white">
                  <polygon points="35,5 63,20 63,50 35,65 7,50 7,20"/>
                </svg>
              </div>
              {/* LINK */}
              <div className="absolute top-[35%] left-[14%] crypto-float-8" style={{opacity: 0.05}}>
                <svg width="65" height="65" viewBox="0 0 65 65" fill="white">
                  <polygon points="32,2 60,17 60,48 32,63 4,48 4,17" opacity="0.4"/>
                  <polygon points="32,12 50,22 50,43 32,53 14,43 14,22"/>
                </svg>
              </div>
            </div>

            {/* Nav bar */}
            <Nav />

            {/* Page content */}
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
