import Head from 'next/head'

export default function Metatags({
  title = 'A blog for people who love Code!',
  description = 'Codr Blog',
  image = 'https://firebasestorage.googleapis.com/v0/b/next-blog-f258a.appspot.com/o/uploads%2FnnHHrvOxe7R5F6R0jFO0Ec0c2SK2%2F1613445697308.png?alt=media&token=85d929da-56f1-43a5-97e8-8b63e504aecc',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content='@fireship_dev' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
    </Head>
  )
}
