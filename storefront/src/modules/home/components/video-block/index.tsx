'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { VideoData } from '@lib/data/cms'

type Props = {
  videos: VideoData[]
}

const PAGE_SIZE = 6

function toEmbedUrl(raw: string): string | null {
  const url = raw.trim()

  if (url.includes('player.bilibili.com')) {
    return url.includes('autoplay=') ? url : url + (url.includes('?') ? '&autoplay=1' : '?autoplay=1')
  }
  const biliVideo = url.match(/bilibili\.com\/video\/((?:BV|bv)\w+|av\d+)/i) || url.match(/b23\.tv\/(\w+)/)
  if (biliVideo) {
    const id = biliVideo[1]
    return /^(BV|bv)/i.test(id)
      ? `https://player.bilibili.com/player.html?bvid=${id}&autoplay=1`
      : `https://player.bilibili.com/player.html?aid=${id.replace(/^av/i, '')}&autoplay=1`
  }
  const ytShort = url.match(/youtu\.be\/([\w-]+)/)
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1&rel=0`
  const ytWatch = url.match(/[?&]v=([\w-]+)/)
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?autoplay=1&rel=0`
  const ytEmbed = url.match(/youtube\.com\/embed\/([\w-]+)/)
  if (ytEmbed) return `https://www.youtube.com/embed/${ytEmbed[1]}?autoplay=1&rel=0`
  return null
}

function PlayIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="ml-0.5 text-white">
      <path d="M8 5l16 9-16 9V5z" fill="currentColor" />
    </svg>
  )
}

// ── Modal player ──────────────────────────────────────────────────────────────
function VideoModal({ video, onClose }: { video: VideoData; onClose: () => void }) {
  const embedUrl = toEmbedUrl(video.url)
  const [mounted, setMounted] = useState(false)

  // Close on Escape
  useEffect(() => {
    setMounted(true)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-11 right-0 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs uppercase tracking-widest"
        >
          Close <span className="text-base leading-none">✕</span>
        </button>

        {/* Player */}
        <div className="aspect-video rounded-2xl overflow-hidden bg-[#111] shadow-2xl">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 text-sm underline hover:text-white transition-colors"
              >
                Open in new tab →
              </a>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-lora text-xl text-[#f5f0eb] leading-snug">{video.title}</h3>
            {video.text && (
              <p className="mt-1 text-sm text-[#9b9590] leading-relaxed">{video.text}</p>
            )}
          </div>
          <div className="flex gap-2 items-center flex-shrink-0 mt-1">
            {video.tag && (
              <span className="text-xs bg-white/10 text-[#9b9590] px-3 py-1 rounded-full">
                {video.tag}
              </span>
            )}
            {video.duration && (
              <span className="text-xs text-[#9b9590]">{video.duration}</span>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Video card ────────────────────────────────────────────────────────────────
function VideoCard({ video, onClick }: { video: VideoData; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#111]">
        {video.poster_url ? (
          <img
            src={video.poster_url}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-[#2a2a28]" />
        )}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center justify-center w-12 h-12 rounded-full border border-white/60 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
            <PlayIcon size={18} />
          </span>
        </span>
        {video.duration && (
          <span className="absolute bottom-2 right-3 text-xs text-white/70 font-medium">
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1.5">
        {video.tag && (
          <span className="text-xs uppercase tracking-[0.12em] text-[#9b9590]">{video.tag}</span>
        )}
        <p className="text-sm font-medium text-[#51443c] group-hover:text-[#1c1c1a] transition-colors line-clamp-2 leading-snug">
          {video.title}
        </p>
        {video.text && (
          <p className="text-xs text-[#9b9590] line-clamp-2 leading-relaxed">
            {video.text}
          </p>
        )}
      </div>
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function VideoBlock({ videos }: Props) {
  const [page, setPage] = useState(0)
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null)

  const totalPages = Math.ceil(videos.length / PAGE_SIZE)
  const pageVideos = videos.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <>
    <section className="bg-[#fcf9f4] py-20 large:py-28">
      <div className="content-container">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#9b9590] mb-3">Films</p>
            <h2 className="font-lora text-3xl large:text-4xl text-[#1c1c1a]">
              Watch & discover
            </h2>
          </div>
          {totalPages > 1 && (
            <p className="text-xs text-[#9b9590]">
              {page + 1} / {totalPages}
            </p>
          )}
        </div>

        {/* Grid — 3 cols desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 medium:grid-cols-2 large:grid-cols-3 gap-6 large:gap-8">
          {pageVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => setActiveVideo(video)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-5 py-2 rounded-full border border-[#d5c3b8] text-xs text-[#6b6860] hover:border-[#1c1c1a] hover:text-[#1c1c1a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-full text-xs transition-all ${
                  i === page
                    ? 'bg-[#1c1c1a] text-[#fcf9f4]'
                    : 'text-[#6b6860] hover:text-[#1c1c1a]'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-5 py-2 rounded-full border border-[#d5c3b8] text-xs text-[#6b6860] hover:border-[#1c1c1a] hover:text-[#1c1c1a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </section>

    {/* Modal — rendered via portal into document.body */}
    {activeVideo && (
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    )}
    </>
  )
}
