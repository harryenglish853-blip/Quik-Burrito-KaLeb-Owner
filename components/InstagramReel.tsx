'use client';

import React, { useState } from 'react';
import { brand } from '@/data/brand';
import { track } from '@/lib/analytics';

/**
 * Instagram reel, loaded on demand.
 *
 * Instagram's embed script is heavy enough to wreck a restaurant site's mobile
 * load, so nothing from instagram.com is requested until the visitor taps play.
 * Until then this is a lightweight in-house poster frame.
 */
export function InstagramReel({
  url = brand.social.instagram.featuredReelUrl,
  caption = 'Watch on Instagram',
}: {
  url?: string;
  caption?: string;
}) {
  const [playing, setPlaying] = useState(false);

  // Instagram's own lightweight embed endpoint — no third-party JS needed.
  const embedUrl = `${url.replace(/\/+$/, '')}/embed/`;

  return (
    <figure className="reel">
      {playing ? (
        <div className="reel__frame">
          <iframe
            src={embedUrl}
            title="Quik Burrito on Instagram"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            scrolling="no"
          />
        </div>
      ) : (
        <button
          type="button"
          className="reel__poster"
          onClick={() => {
            setPlaying(true);
            track('instagram_click', { surface: 'reel_play' });
          }}
          aria-label="Play the Quik Burrito reel from Instagram"
        >
          <span className="reel__grain" aria-hidden="true" />
          <span className="reel__play" aria-hidden="true">
            ▶
          </span>
          <span className="reel__label">{caption}</span>
          <span className="reel__handle">{brand.social.instagram.handle}</span>
        </button>
      )}

      <figcaption className="reel__cap">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('instagram_click', { surface: 'reel_caption' })}
        >
          View this reel on Instagram
        </a>
      </figcaption>
    </figure>
  );
}

export function InstagramFollow() {
  return (
    <a
      className="btn btn--secondary"
      href={brand.social.instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('instagram_click', { surface: 'follow_button' })}
    >
      Follow {brand.social.instagram.handle}
    </a>
  );
}
