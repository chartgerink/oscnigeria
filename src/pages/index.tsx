import Layout from '../components/Layout'
import Head from 'next/head'
import { Document } from '../interfaces/document'
import { getDocumentBySlug, getDocuments } from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import markdownToHtml from '../lib/markdownToHtml'
import Header from '../components/Header'

type Props = {
  page: Document
  allPosts: Document[]
  allResources: Document[]
  allMembers: Document[]
}

export default function Index({ page, allPosts, allResources, allMembers }: Props) {
  return (
    <>
      <Layout>
        <Head>
          <title>Outstatic Example Blog</title>
        </Head>
        <div className="max-w-6xl mx-auto px-5">
        <Header />
          <section className="mt-16 mb-16 md:mb-12">
            <div
              className="prose lg:prose-2xl home-intro"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </section>
          {allPosts.length > 0 && (
            <ContentGrid title="Posts" items={allPosts} collection="posts" />
          )}
          {allResources.length > 0 && (
            <ContentGrid
              title="Resources"
              items={allResources}
              collection="resources"
            />
          )}
          {allMembers.length > 0 && (
            <ContentGrid
              title="Members"
              items={allMembers}
              collection="members"
            />
          )}
        </div>
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const page = getDocumentBySlug('pages', 'home', ['content'])

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
