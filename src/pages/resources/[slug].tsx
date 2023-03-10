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
  resource: Document
  moreResources: Document[]
}

export default function resource({ resource, moreResources }: Props) {
  const router = useRouter()
  if (!router.isFallback && !resource?.slug) {
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
                <title>{`${resource.title} | Next.js + Outstatic`}</title>
                <meta property="og:image" content={resource.coverImage} />
              </Head>
              <div className="grid md:grid-cols-2 gap-8">
              {resource.coverImage ? 
                <div className="relative mb-2 md:mb-4 sm:mx-0 h-64">
                  <Image
                    alt={resource.title}
                    src={resource.coverImage}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div> : ""}
                <div>
                  <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
                    {resource.title}
                  </h1>
                  <div className="hidden md:block md:mb-8 text-slate-600">
                    Launched on{' '}
                    <DateFormatter dateString={resource.publishedAt} /> by{' '}
                    {resource.author.name}.
                  </div>
                  <div className="inline-block p-4 border mb-8 font-semibold text-lg rounded shadow">
                    {resource.description}
                  </div>
                  <div className="max-w-2xl mx-auto">
                    <div
                      className="prose lg:prose-xl"
                      dangerouslySetInnerHTML={{ __html: resource.content }}
                    />
                  </div>
                </div>
              </div>
            </article>
          </>
        )}
        <div className="mb-16">
          {moreResources.length > 0 && (
            <ContentGrid
              title="Other resources"
              items={moreResources}
              collection="resources"
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
  const resource = getDocumentBySlug('resources', params.slug, [
    'title',
    'publishedAt',
    'description',
    'slug',
    'author',
    'content',
    'coverImage'
  ])

  const content = await markdownToHtml(resource.content || '')

  const moreResources = getDocuments('resources', ['title', 'slug', 'coverImage'])

  return {
    props: {
      resource: {
        ...resource,
        content
      },
      moreResources
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: getDocumentPaths('resources'),
    fallback: false
  }
}
