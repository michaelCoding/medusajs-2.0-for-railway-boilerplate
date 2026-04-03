import Image from 'next/image'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Text } from '@modules/common/components/text'

type BannerConfig = {
  headline: string
  text: string
  cta: { text: string; link: string }
  image: { url: string; alt: string }
}

export const Banner = ({ data }: { data: BannerConfig }) => {
  return (
    <Container>
      <Box className="relative h-[440px]">
        <Image
          src={data.image.url}
          alt={data.image.alt}
          fill
          className="object-cover object-right-top"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-white">
          <Heading className="text-3xl">{data.headline}</Heading>
          <Text size="lg" className="mt-2 medium:max-w-[600px]">
            {data.text}
          </Text>
          <Button className="mt-8" asChild>
            <LocalizedClientLink href={data.cta.link}>
              {data.cta.text}
            </LocalizedClientLink>
          </Button>
        </div>
      </Box>
    </Container>
  )
}
