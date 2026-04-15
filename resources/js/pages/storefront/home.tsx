import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    heroSlides,
    storefrontPromoBanner,
    storefrontSections,
} from '@/storefront/catalog';

export default function StorefrontHome() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentSlide((current) => (current + 1) % heroSlides.length);
        }, 4000);

        return () => {
            window.clearInterval(timer);
        };
    }, []);

    return (
        <>
            <Head>
                <title>Myntra</title>
                <link rel="stylesheet" href="/css/storefront-home.css" />
            </Head>

            <div className="storefront-home-page">
                <div className="storefront-home-page__inner">
                    <section className="storefront-home-strip">
                        <Link href={storefrontPromoBanner.href}>
                            <img
                                src={storefrontPromoBanner.image}
                                alt={storefrontPromoBanner.alt}
                            />
                        </Link>
                    </section>

                    <section className="storefront-home-hero">
                        <div className="storefront-home-hero__viewport">
                            <div
                                className="storefront-home-hero__track"
                                style={{
                                    transform: `translateX(-${currentSlide * 100}%)`,
                                }}
                            >
                                {heroSlides.map((slide) => (
                                    <Link
                                        key={slide.image}
                                        href={slide.href}
                                        className="storefront-home-hero__slide"
                                    >
                                        <img src={slide.image} alt={slide.alt} />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="storefront-home-hero__dots">
                            {heroSlides.map((slide, index) => (
                                <button
                                    key={slide.image}
                                    type="button"
                                    className={`storefront-home-hero__dot${currentSlide === index ? ' is-active' : ''}`}
                                    onClick={() => setCurrentSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                    </section>

                    {storefrontSections.map((section) => (
                        <section
                            key={section.id}
                            className="storefront-home-section"
                        >
                            <div className="storefront-home-section__header">
                                <h2>{section.title}</h2>
                            </div>

                            <div
                                className={`storefront-home-section__grid storefront-home-section__grid--${section.layout}`}
                            >
                                {section.images.map((image, index) => (
                                    <Link
                                        key={`${section.id}-${index}`}
                                        href={section.href}
                                        className="storefront-home-card"
                                    >
                                        <img
                                            src={image}
                                            alt={`${section.title} ${index + 1}`}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </>
    );
}
