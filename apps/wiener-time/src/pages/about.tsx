import { Icon } from '@iconify/react'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'

const AboutPage: NextPage = () => {
  return (
    <>
      <NextSeo title='Impressum' />
      <aside className='p-4 text-neutral-400 text-xs sticky bottom-0 flex justify-center'>
        <a
          href='https://github.com/DerYeger/wiener-time'
          target='_blank'
          rel='noreferrer'
          className='flex gap-1 items-center hover:text-neutral-600 transition-colors'
        >
          An open-source project
          <Icon icon='ic:round-open-in-new' />
        </a>
      </aside>
      <main className='flex-1 flex flex-col md:flex-row md:justify-center items-center md:items-start px-4 gap-8 md:gap-16'>
        <section className='flex flex-col gap-4'>
          <h2 className='text-3xl font-bold'>Impressum</h2>
          <div className='flex flex-col gap-2'>
            <p>Angaben gemäß § 5 ECG und § 25 Mediengesetz</p>
            <p>Jan Müller</p>
            <div>
              <p>1140 Wien</p>
              <p>Österreich</p>
            </div>
            <p>
              E-Mail:{' '}
              <a href='mailto:mail%40jan-mueller.at'>mail@jan-mueller.at</a>{' '}
            </p>
          </div>

          <div>
            <h2 className='text-2xl'>Haftungsausschluss</h2>
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
            <h2 className='text-2xl'>Urheberrecht</h2>
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
