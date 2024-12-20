'use client'
import { AppHero } from '../ui/ui-layout'
import Link from 'next/link';

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
]

export default function DashboardFeature() {
  return (
    <div>
      <AppHero title="Notesols" subtitle="Write and edit your notes on-chain! Click the button below to get started." />
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <button className="btn btn-primary">
          <Link href="/notesols">{"Notesols dApp"}</Link>
        </button>
        {/* <div className="space-y-2">
          <p>Here are some helpful links to get you started.</p>
          {links.map((link, index) => (
            <div key={index}>
              <a href={link.href} className="link" target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  )
}