import { useEffect, useState } from '@lynx-js/react';

import img01 from '../assets/gallery/img-01.jpg';
import img02 from '../assets/gallery/img-02.jpg';
import img03 from '../assets/gallery/img-03.jpg';
import img04 from '../assets/gallery/img-04.jpg';
import img05 from '../assets/gallery/img-05.jpg';

const GALLERY = [
  { src: img01, label: 'Begin with intention' },
  { src: img02, label: 'Make room for reflection' },
  { src: img03, label: 'Read a little every day' },
  { src: img04, label: 'Return to what matters' },
  { src: img05, label: 'End the day gently' },
];

export function HomeGallery() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    'background only';
    const timer = setInterval(() => {
      setActive((index) => (index + 1) % GALLERY.length);
    }, 4_200);
    return () => clearInterval(timer);
  }, []);

  return (
    <view className="home-gallery">
      <view className="home-gallery__stage">
        <image
          key={active}
          className="home-gallery__image"
          src={GALLERY[active].src}
          mode="aspectFill"
        />
        <view className="home-gallery__scrim" />
        <view className="home-gallery__caption">
          <text className="home-gallery__eyebrow">
            Moment {active + 1} of {GALLERY.length}
          </text>
          <text className="home-gallery__label">{GALLERY[active].label}</text>
        </view>
      </view>

      <view className="home-gallery__dots">
        {GALLERY.map((item, index) => (
          <view
            key={item.src}
            className={`home-gallery__dot ${
              index === active ? 'home-gallery__dot--active' : ''
            }`}
            bindtap={() => setActive(index)}
          />
        ))}
      </view>
    </view>
  );
}
