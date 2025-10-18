import { Icon } from '@iconify/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { generateNextSeo } from 'next-seo/pages'

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        {generateNextSeo({ title: 'Impressum' })}
      </Head>
      <aside className="sticky bottom-0 flex justify-center p-4 text-xs text-neutral-400">
        <a
          href="https://github.com/DerYeger/yeger/tree/main/apps/wiener-time"
          target="_blank"
          rel="noreferrer"
          data-testid="repository-link"
          className="flex items-center gap-1 transition-colors hover:text-neutral-600"
        >
          An open-source project
          <Icon icon="ic:round-open-in-new" />
        </a>
      </aside>
      <main className="flex flex-1 flex-col items-center gap-8 px-4 md:flex-row md:items-start md:justify-center md:gap-16">
        <section className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">Impressum</h2>
          <div className="flex flex-col gap-2">
            <p>Angaben gemäß § 5 ECG und § 25 Mediengesetz</p>
            <p>Jan Müller</p>
            <div>
              <p>1140 Wien</p>
              <p>Österreich</p>
            </div>
            <p>
              E-Mail:
              {' '}
              <a href="mailto:mail%40janmueller.dev">mail@janmueller.dev</a>
              {' '}
            </p>
          </div>

          <div>
            <h2 className="text-2xl">Haftungsausschluss</h2>
            <p>
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt
              erstellt, jedoch wird für die Richtigkeit, Vollständigkeit und
              Aktualität der Inhalte keine Haftung übernommen. Auch für die
              Inhalte externer Links wird trotz sorgfältiger inhaltlicher
              Kontrolle keine Haftung übernommen, da ausschliesslich die
              Betreiber der jeweiligen Seiten für deren Inhalt verantwortlich
              sind.
            </p>
          </div>

          <div>
            <h2 className="text-2xl">Urheberrecht</h2>
            <p>
              Alle Inhalte dieser Website (Texte, Bilder, Quelltexte und
              sonstige Dateien) unterliegen dem Urheberrecht. Eine Nutzung ist
              ohne ausdrückliche schriftliche Genehmigung nicht gestattet.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

export default AboutPage
