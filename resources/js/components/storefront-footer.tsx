import { Link } from '@inertiajs/react';

export default function StorefrontFooter() {
    return (
        <footer>
            <section id="section_1">
                <div id="left">
                    <div>
                        <h4>online shopping</h4>
                        <p>men</p>
                        <p>women</p>
                        <p>home & living</p>
                        <p>beauty</p>
                        <p>gift cards</p>
                        <p>
                            myntra insider<span id="latest">New</span>
                        </p>
                    </div>
                    <div>
                        <h4>useful links</h4>
                        <p>men</p>
                        <p>faq</p>
                        <p>t&amp;c</p>
                        <p>terms of use</p>
                        <p>track order</p>
                        <p>shipping</p>
                        <p>cancellation</p>
                        <p>returns</p>
                        <p>whitehat</p>
                        <p>blog</p>
                        <p>careers</p>
                        <p>privacy policy</p>
                        <p>site map</p>
                        <p>corporate information</p>
                    </div>
                    <div>
                        <h4>experience myntra app on mobile</h4>
                        <img src="https://bit.ly/3LluZ4L" alt="Android app" />
                        <img src="https://bit.ly/3DmWQys" alt="iOS app" />
                        <h4 id="social_connect">keep in touch</h4>
                        <div>
                            <i className="fa-brands fa-facebook-square"></i>
                            <i className="fa-brands fa-twitter-square"></i>
                            <i className="fa-brands fa-youtube"></i>
                            <i className="fa-brands fa-instagram"></i>
                        </div>
                    </div>
                </div>
                <div id="right">
                    <div>
                        <img
                            src="https://bit.ly/3JPiL47"
                            alt="Original products"
                        />
                        <p>
                            <span>100% ORIGINAL</span> guarantee for all
                            products at myntra.com
                        </p>
                    </div>
                    <div>
                        <img
                            src="https://bit.ly/3uBalH4"
                            alt="Return policy"
                        />
                        <p>
                            <span>Return within 14days</span> of receiving your
                            order
                        </p>
                    </div>
                </div>
            </section>
            <section id="section_2">
                <h4>popular searches</h4>
                <div></div>
            </section>
            <section id="section_3">
                <Link href="/products/category/men">sherwani</Link>
                <Link href="/products/category/men">track pants</Link>
                <Link href="/products/category/men">blazers</Link>
                <Link href="/products/category/women">sarees</Link>
                <Link href="/products/category/home-living">bed sheets</Link>
                <Link href="/products/category/men">jeans</Link>
                <Link href="/products/category/women">kurtas</Link>
                <Link href="/products/category/home-living">pillows</Link>
                <Link href="/products/category/men">wallets</Link>
                <Link href="/products/category/women">handbags</Link>
            </section>
            <section id="section_4">
                <p>
                    In case of any concern <a href="#">contact us</a>
                </p>
                <p>&#169; 2026 www.myntra.com. All rights reserved.</p>
            </section>
            <hr />
            <section id="section_5">
                <h4>myntra shopping at a superior experience</h4>
                <p>
                    Discover curated edits, richer category rails and a cleaner
                    desktop shopping experience inspired by Myntra&apos;s modern
                    storefront.
                </p>
            </section>
        </footer>
    );
}
