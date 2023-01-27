import Layout from '../components/Layout'
import Head from 'next/head'
import Header from '../components/Header'
import { useRouter } from 'next/router'
import Image from 'next/image'
import DateFormatter from '../components/DateFormatter'


import { Document } from '../interfaces/document'
import { getDocumentBySlug, getDocuments } from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import markdownToHtml from '../lib/markdownToHtml'

type Props = {
  page: Document
  allPosts: Document[]
  allResources: Document[]
  allMembers: Document[]
}

export default function Index({ page, allPosts, allResources, allMembers }: Props) {
  const router = useRouter()

  return (
    <>
      <Layout>
      <div className="max-w-6xl mx-auto px-5">
        <Header />
        {router.isFallback ? (
          <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
            Loading…
          </h1>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>{`${page.title} | Next.js + Outstatic`}</title>
                <meta property="og:image" content={page.coverImage} />
              </Head>
              {page.coverImage && 
              <div className="relative mb-2 md:mb-4 sm:mx-0 w-full h-52 md:h-96">
                <Image
                alt={page.title}
                src={page.coverImage}
                fill
                className="object-cover object-center"
                priority
                />
              </div>
              }
              <div className="max-w-2xl mx-auto">
                <div
                  className="prose lg:prose-xl"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            </article>
          </>
        )}
      </div>
    </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const page = getDocumentBySlug('pages', 'about', ['content'])

  const allPosts = getDocuments('posts', [
    'title',
    'publishedAt',
    'slug',
    'coverImage',
    'description'
  ])

  const allResources = getDocuments('resources', ['title', 'slug', 'coverImage'])

  const allMembers = getDocuments('members', ['title', 'slug', 'coverImage'])

  const content = await markdownToHtml(page.content || '')

  return {
    props: { page: { content }, allPosts, allResources, allMembers }
  }
}
