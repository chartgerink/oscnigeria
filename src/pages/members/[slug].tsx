import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Header from '../../components/Header'
import Layout from '../../components/Layout'
import Head from 'next/head'
import markdownToHtml from '../../lib/markdownToHtml'
import { Document } from '../../interfaces/document'
import {
  getDocumentPaths,
  getDocumentBySlug,
  getDocuments
} from 'outstatic/server'
import DateFormatter from '../../components/DateFormatter'
import Image from 'next/image'
import ContentGrid from '../../components/ContentGrid'

type Props = {
  member: Document
  moreMembers: Document[]
}

export default function member({ member, moreMembers }: Props) {
  const router = useRouter()
  if (!router.isFallback && !member?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-5">
        <Header />
        {router.isFallback ? (
          <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
            Loading…
          </h1>
        ) : (
          <>
            <article className="mb-8">
              <Head>
                <title>{`${member.title} | Next.js + Outstatic`}</title>
                <meta property="og:image" content={member.coverImage} />
              </Head>
              <div className="grid md:grid-cols-2 gap-8">
              {member.coverImage ? 
                <div className="relative mb-2 md:mb-4 sm:mx-0 h-64">
                  <Image
                    alt={member.title}
                    src={member.coverImage}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div> : ""}
                <div>
                  <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
                    {member.title}
                  </h1>
                  <div className="hidden md:block md:mb-8 text-slate-600">
                    <DateFormatter dateString={member.publishedAt} />.
                  </div>
                  <div className="inline-block p-4 border mb-8 font-semibold text-lg rounded shadow">
                    {member.description}
                  </div>
                  <div className="max-w-2xl mx-auto">
                    <div
                      className="prose lg:prose-xl"
                      dangerouslySetInnerHTML={{ __html: member.content }}
                    />
                  </div>
                </div>
              </div>
            </article>
          </>
        )}
        <div className="mb-16">
          {moreMembers.length > 0 && (
            <ContentGrid
              title="Other members"
              items={moreMembers}
              collection="members"
            />
          )}
        </div>
      </div>
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const member = getDocumentBySlug('members', params.slug, [
    'title',
    'publishedAt',
    'description',
    'slug',
    'author',
    'content',
    'coverImage'
  ])

  const content = await markdownToHtml(member.content || '')

  const moreMembers = getDocuments('members', ['title', 'slug', 'coverImage'])

  return {
    props: {
      member: {
        ...member,
        content
      },
      moreMembers
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: getDocumentPaths('members'),
    fallback: false
  }
}
