import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import svg from "@/public/background.svg";
import logofull from "@/public/logo-full.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "./providers";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gerador de Proposta",
  description: "Gerador de Proposta Elo Solutions",
  icons: "logo.svg",
};

if (typeof Promise.withResolvers === "undefined") {
  if (window) {
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    window.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return { promise, resolve, reject }
    }
  } else {
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    global.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return { promise, resolve, reject }
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={
          "relative w-full min-h-dvh flex items-center justify-center flex-col" +
          inter.className
        }
      >
        <Providers>
          <ToastContainer />
          <Image
            draggable="false"
            src={svg}
            alt=" "
            className="fixed top-0 left-0 z-0 select-none"
            priority
          />
          <Image
            draggable="false"
            src={svg}
            alt=" "
            className="fixed right-0 bottom-0 -scale-100 z-0 select-none"
            priority
          />
          <Image
            draggable="false"
            src={logofull}
            alt=" "
            className="fixed bottom-4 left-4 w-52 z-0 select-none"
          />
          <Image
            draggable="false"
            src={logofull}
            alt=" "
            className="fixed top-4 right-4 w-52 z-0 select-none"
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}