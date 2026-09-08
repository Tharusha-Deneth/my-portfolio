// import Hero from "./components/hero/Hero";
// import Services from "./components/services/Services";
// import Portfolio from "./components/portfolio/Portfolio";
// import Contact from "./components/contact/Contact";

import { lazy, Suspense, useState } from "react";
import LazyLoad from "react-lazyload";
import SplashScreen from "./components/splash/SplashScreen";

const Hero = lazy(() => import("./components/hero/Hero"));
const About = lazy(() => import("./components/about/About"));
const TechStack = lazy(() => import("./components/tech/TechStack"));
const Portfolio = lazy(() => import("./components/portfolio/Portfolio"));
const Contact = lazy(() => import("./components/contact/Contact"));

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      <div className="app-main">
        <Suspense fallback={"loading..."}>
          <LazyLoad height={"100vh"} offset={300} once={true}>
            <section id="home" className="container">
              <Hero />
            </section>
          </LazyLoad>
        </Suspense>
        <Suspense fallback={"loading..."}>
          <LazyLoad height={"220vh"} offset={300} once={true}>
            <About />
          </LazyLoad>
        </Suspense>
        <Suspense fallback={"loading..."}>
          <LazyLoad height={"600px"} offset={300} once={true}>
            <TechStack />
          </LazyLoad>
        </Suspense>
        <Suspense fallback={"loading..."}>
          <LazyLoad height={"500vh"} offset={300} once={true}>
            <Portfolio />
          </LazyLoad>
        </Suspense>
        <Suspense fallback={"loading..."}>
          <LazyLoad height={"100vh"} offset={300} once={true}>
            <section id="contact" className="container">
              <Contact />
            </section>
          </LazyLoad>
        </Suspense>
      </div>
    </>
  );
};

export default App;