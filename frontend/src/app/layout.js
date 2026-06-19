import "./globals.css";

export const metadata = {
  title: "THE COUNCIL — Five Advisors Who Debate Your Decisions",
  description: "Convene your room of expert minds. Watch the debate unfold in real time, receive a synthesized verdict, and ground your decisions in market data.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
