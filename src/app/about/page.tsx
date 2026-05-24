import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "About | EconoLens",
    description: "EconoLens brings AI-powered economics research to Indian students and professionals.",
    };
    export default function AboutPage() {
      return (
          <main className="mx-auto max-w-3xl px-6 py-20">
                <header className="border-b border-neutral-200 pb-8">
                        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">About</p>
                                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">Economics, decoded for India.</h1>
                                      </header>
                                            <div className="mt-10 space-y-5 text-base leading-relaxed text-neutral-700">
                                                    <p>EconoLens is an AI-assisted economics research platform built for Indian students, analysts, and curious minds.</p>
                                                            <p>Our AI research assistant cites authoritative sources like the World Bank, FRED, and RBI and stays focused on economics.</p>
                                                                    <p>We believe high-quality economics education should be accessible. Our free tier gives everyone AI-powered research answers and live economic indicators.</p>
                                                                            <h2 className="pt-4 text-xl font-semibold text-neutral-900">What we offer</h2>
                                                                                    <ul className="list-disc pl-5 space-y-1">
                                                                                              <li>Daily economics and markets news</li>
                                                                                                        <li>Live indicators: GDP, CPI, USD/INR, oil prices</li>
                                                                                                                  <li>AI research assistant (free: 200 words, pro: 600 words)</li>
                                                                                                                          </ul>
                                                                                                                                  <p className="pt-2">Questions? <Link href="/contact" className="underline hover:text-neutral-900">Contact us.</Link></p>
                                                                                                                                        </div>
                                                                                                                                            </main>
                                                                                                                                              );
                                                                                                                                              }
