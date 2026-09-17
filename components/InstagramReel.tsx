'use client';

import React, { useEffect, useRef, useState } from 'react';
import { brand } from '@/data/brand';
import { videoAssets, mediaConfig } from '@/data/media';
import { IS_PREVIEW, mediaUrl } from '@/lib/preview';
import { useReducedMotion } from '@/lib/device';
import { track } from '@/lib/analytics';
import { PlayIcon, ArrowIcon } from './icons';

/**
 * The Quik Burrito reel.
 *
 * Three paths, in order of preference:
 *
 *  1. A self-hosted file (videoAssets.reel) plays natively. Fastest, works
 *     everywhere, and asks nothing of instagram.com. This is the one to use in
 *     production — see data/media.ts for how to fill it in.
 *
 *  2. Otherwise, Instagram's embed, loaded only after a tap so its weight never
 *     lands on first paint. A cross-origin frame fires `load` even when it has
 *     failed, so there is no reliable way to detect a blocked embed from the
 *     page. Rather than guess, a few seconds after the frame is requested an
 *     escape link appears over it — useful whether the reel is playing or the
 *     frame is empty, and it never leaves the viewer stuck at a blank box.
 *
 *  3. In the static preview, where third-party frames are blocked outright, the
 *     embed is skipped and the link-out is shown from the start. Pretending
 *     otherwise would just give the viewer an empty box.
 */

const EMBED_TIMEOUT_MS = 6000;

export function InstagramReel({
  url = brand.social.instagram.featuredReelUrl,
  caption = 'Watch on Instagram',
}: {
  url?: string;
  caption?: string;
}) {
  const localVideo = videoAssets.reel;
  if (localVideo) return <SelfHostedReel src={localVideo} url={url} caption={caption} />;
  return <EmbeddedReel url={url} caption={caption} />;
}

/* ------------------------------------------------------------------ */

function SelfHostedReel({ src, url, caption }: { src: string; url: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const poster = videoAssets.reelPoster;

  // Play only while it is actually on screen — an off-screen video decoding in
  // the background costs battery and bandwidth for nothing.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <figure className="reel">
      <div className="reel__frame">
        <video
          ref={ref}
          className="reel__video"
          src={mediaUrl(src)}
          poster={poster ? mediaUrl(poster) : undefined}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          aria-label="Quik Burrito reel"
        />
      </div>
      <ReelCaption url={url} caption={caption} />
    </figure>
  );
}

/* ------------------------------------------------------------------ */

function EmbeddedReel({ url, caption }: { url: string; caption: string }) {
  // 'idle' -> poster, 'embed' -> frame requested, 'unavailable' -> cannot play
  // in the page at all, so link out from the start.
  const [state, setState] = useState<'idle' | 'embed' | 'unavailable'>(
    IS_PREVIEW ? 'unavailable' : 'idle',
  );
  // Shown a few seconds after the frame is requested, whether or not it loaded.
  const [showEscape, setShowEscape] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const play = () => {
    setState('embed');
    track('instagram_click', { surface: 'reel_play' });
    timer.current = setTimeout(() => setShowEscape(true), EMBED_TIMEOUT_MS);
  };

  if (state === 'unavailable') {
    return (
      <figure className="reel">
        <a
          className="reel__poster reel__poster--link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('instagram_click', { surface: 'reel_fallback' })}
        >
          <span className="reel__grain" aria-hidden="true" />
          <span className="reel__play" aria-hidden="true"><PlayIcon /></span>
          <span className="reel__label">{caption}</span>
          <span className="reel__handle">
            {brand.social.instagram.handle}
            <ArrowIcon className="reel__handle-go" />
          </span>
        </a>
        {mediaConfig.showSlotBadges ? (
          <p className="reel__note">
            Plays on Instagram. To play it in the page itself, add the file — see{' '}
            <code>videoAssets</code> in <code>data/media.ts</code>.
          </p>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="reel">
      {state === 'idle' ? (
        <button type="button" className="reel__poster" onClick={play} aria-label="Play the Quik Burrito reel">
          <span className="reel__grain" aria-hidden="true" />
          <span className="reel__play" aria-hidden="true"><PlayIcon /></span>
          <span className="reel__label">{caption}</span>
          <span className="reel__handle">{brand.social.instagram.handle}</span>
        </button>
      ) : (
        <div className="reel__frame">
          <iframe
            src={`${url.replace(/\/+$/, '')}/embed/`}
            title="Quik Burrito on Instagram"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            scrolling="no"
          />
          {showEscape ? (
            <a
              className="reel__escape"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('instagram_click', { surface: 'reel_escape' })}
            >
              Not playing? Watch on Instagram
              <ArrowIcon className="reel__handle-go" />
            </a>
          ) : null}
        </div>
      )}
      <ReelCaption url={url} caption="View this reel on Instagram" />
    </figure>
  );
}

function ReelCaption({ url, caption }: { url: string; caption: string }) {
  return (
    <figcaption className="reel__cap">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('instagram_click', { surface: 'reel_caption' })}
      >
        {caption}
      </a>
    </figcaption>
  );
}

export function InstagramFollow({ onFilm = false }: { onFilm?: boolean }) {
  return (
    <a
      className={`btn ${onFilm ? 'btn--onfilm' : 'btn--secondary'}`}
      href={brand.social.instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('instagram_click', { surface: 'follow_button' })}
    >
      Follow {brand.social.instagram.handle}
    </a>
  );
}
