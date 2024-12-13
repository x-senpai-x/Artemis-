import React, { useEffect, useRef, useState } from 'react';
import BaseLogo from './assets/base.svg';
import PolygonLogo from './assets/polygon.svg';
import ArbitrumLogo from './assets/arbitrum.svg';
import OptimismLogo from './assets/optimism.svg';
import UniswapLogo from './assets/uniswap.svg';
import CowLogo from './assets/cow.png';
import DydxLogo from './assets/dydx.svg';
import InchLogo from './assets/1inch.svg';
import BalancerLogo from './assets/balancer.svg';
import SushiLogo from './assets/sushiswap.svg';
import ArtemisLogo from './assets/logo.jpeg';
import Before from './assets/before.jpeg';
import After from './assets/after.jpeg';
import Eth from './assets/ethereumlogo.webp';
import Sol from './assets/solanalogo.svg';
import Arb from './assets/arbitrumlogo.webp';
import Base from './assets/baselogo.svg';
import Poly from './assets/polygonlogo.svg';
import Attest from './assets/attestation.jpeg';
import Video from './assets/presentation.mp4';

const FaqItem = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-cyan-900/30 rounded-2xl overflow-hidden bg-gray-900/50 mb-4 backdrop-blur-sm shadow-lg shadow-cyan-500/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left text-gray-100 hover:bg-cyan-400/5 transition-colors duration-300"
      >
        <span className="text-lg">{question}</span>
        <span className="text-2xl transform transition-transform text-cyan-400">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96' : 'max-h-0'
      }`}>
        <div className="p-6 pt-0 text-gray-400">
          {children}
        </div>
      </div>
    </div>
  );
};

// Updated Contact Section with neon accents
const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`bg-gray-950 transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-20 relative">
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
            <path d="M0 0L400 400M100 0L400 300M200 0L400 200" stroke="currentColor" strokeWidth="2" className="text-cyan-500" />
          </svg>
        </div>

        <div className="text-white space-y-6 relative z-10 text-left">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl text-left">
            Want to Bring your Chain or your Protocol on our app?
          </h2>
          
          <p className="text-gray-400 text-xl text-left">
            Get in Touch with our team to get onboarded
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <button className="bg-cyan-400 text-gray-900 px-6 py-3 rounded-full hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/50">
              Schedule a Call
            </button>
            <button className="border border-cyan-400 text-cyan-400 px-6 py-3 rounded-full hover:bg-cyan-400/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BenefitCard = ({ title, description, children, animationDelay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, animationDelay);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [animationDelay]);

  return (
    <div
      ref={cardRef}
      className={`bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-cyan-900/30 p-8 transform transition-all duration-1000 ease-out h-full shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/10 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${className}`}
    >
      <h3 className="text-2xl font-bold mb-4 text-cyan-400">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      {children}
    </div>
  );
};

const AppIcon = ({ src, alt }) => (
  <div className="w-14 h-14 p-2 rounded-xl overflow-hidden border border-cyan-900/30 shadow-lg shadow-cyan-500/10">
    <img src={src} alt={alt} className="w-full h-full object-cover" />
  </div>
);

const NFTCard = ({ title, collection, buttonText }) => (
  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-cyan-900/30 shadow-lg shadow-cyan-500/5 p-4">
    <div className="bg-cyan-900/20 rounded-xl mb-4 aspect-[4/3] overflow-hidden">
      <img src="/api/placeholder/300/225" alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="space-y-1">
      <h4 className="font-semibold text-gray-100">{title}</h4>
      <p className="text-sm text-gray-400">{collection}</p>
      {buttonText && (
        <button className="mt-2 bg-cyan-400 text-gray-900 text-sm px-4 py-1 rounded-full shadow-lg shadow-cyan-500/50 hover:bg-cyan-300 transition-colors">
          {buttonText}
        </button>
      )}
    </div>
  </div>
);

const WalletPreview = () => (
  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-900/30 p-6 shadow-lg shadow-cyan-500/5">
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50" />
        <div>
          <p className="font-semibold text-gray-100">ACCOUNT 1</p>
          <p className="text-sm text-gray-400">0x6ab...789e6</p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-6 h-6 bg-gray-800 rounded-full hover:bg-cyan-400/20 transition-colors cursor-pointer" />
        <div className="w-6 h-6 bg-gray-800 rounded-full hover:bg-cyan-400/20 transition-colors cursor-pointer" />
      </div>
    </div>
    
    <div className="text-center mb-8">
      <p className="text-gray-400">TOTAL BALANCE</p>
      <p className="text-4xl font-bold text-cyan-400">$154,723.00</p>
    </div>
    
    <div className="flex gap-4 mb-4">
      <button className="flex-1 bg-gray-800 text-gray-400 rounded-full py-2 hover:bg-cyan-400/10 transition-colors">
        Tokens
      </button>
      <button className="flex-1 bg-cyan-400 text-gray-900 rounded-full py-2 shadow-lg shadow-cyan-500/50 hover:bg-cyan-300 transition-colors">
        NFTs
      </button>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <NFTCard title="G-Mullet" collection="Mullet Head Collection" />
      <div className="bg-gray-800 rounded-xl flex items-center justify-center aspect-[4/3] hover:bg-cyan-400/10 transition-colors cursor-pointer">
        <span className="text-gray-400">Get more</span>
      </div>
    </div>
  </div>
);

const GetStartedStep = ({ number, text }) => (
  // Reduced left padding to give more space for content
  <div className="flex items-start gap-6 mb-6 pl-4">
    {/* Number circle styling remains the same */}
    <div className="flex-shrink-0 w-8 h-8 bg-cyan-400/10 rounded-lg flex items-center justify-center text-cyan-400 border border-cyan-900/30">
      {number}
    </div>
    {/* Added text-left and increased max-width for more horizontal space */}
    <p className="text-lg text-gray-400 text-left max-w-xl">
      {text}
    </p>
  </div>
);

const AppCard = ({ name, bgColor, logo, isEmptyCard }) => {
  if (isEmptyCard) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-cyan-900/30 shadow-lg shadow-cyan-500/5 overflow-hidden hover:shadow-cyan-500/10 transition-all duration-300">
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2 text-gray-200">Is your favourite app not listed here?</h3>
          <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Tell Us.</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-cyan-900/30 shadow-lg shadow-cyan-500/5 overflow-hidden hover:shadow-cyan-500/10 transition-all duration-300">
      <div className={`h-40 ${bgColor} bg-opacity-20 flex items-center justify-center backdrop-blur-sm`}>
        <img src={logo} alt={`${name} logo`} className="w-20 h-20 rounded-full" />
      </div>
      <div className="p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-200">{name}</h3>
      </div>
    </div>
  );
};

function App() {
  const chains = [
    { name: 'BASE', logo: BaseLogo },
    { name: 'Polygon', logo: PolygonLogo },
    { name: 'Arbitrum', logo: ArbitrumLogo },
    { name: 'OP', logo: OptimismLogo }
  ];

  const currentPage = 'home';

  const chainLogos = {
    base: {
      logo: Base,
      name: 'Base Chain',
    },
    poly: {
      logo: Poly,
      name: 'Polygon',
    },
    eth: {
      logo: Eth,
      name: 'Ethereum',
    },
    arb: {
      logo: Arb,
      name: 'Arbitrum',
    },
    sol: {
      logo: Sol,
      name: 'Solana',
    }
  };

  const apps = [
    {
      name: 'Uniswap',
      bgColor: 'bg-gray-900',
      logo: UniswapLogo
    },
    {
      name: 'CoW AMM',
      bgColor: 'bg-gray-900',
      logo: CowLogo
    },
    {
      name: '1inch',
      bgColor: 'bg-gray-900',
      logo: InchLogo
    },
    {
      name: 'DyDx',
      bgColor: 'bg-gray-900',
      logo: DydxLogo
    },
    {
      name: 'Balancer',
      bgColor: 'bg-gray-900',
      logo: BalancerLogo
    },
    {
      name: 'Sushiswap',
      bgColor: 'bg-gray-900',
      logo: SushiLogo
    }
  ];
  
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const steps = [
    "Socket Protocol is used to settle intents across chains.",
    "Agents are built using CDP kit which search a chain for the best price.",
    "Swaps happen inside LIT's secure TEE environment.",
    "Proof of Attestation is used for judging new agents which want to be an AMM searcher."
  ];

  const NavLink = ({ href, isActive, children }) => (
    <a 
      href={href}
      className={`transition-colors duration-300 ${
        isActive 
          ? 'text-white font-medium' 
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {children}
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-2 bg-gray-900/50 backdrop-blur-sm border-b border-cyan-900/30">
        <div className="flex items-center">
          <img 
            src={ArtemisLogo}
            alt="Artemis Wallet Logo"
            className="h-12 opacity-90"
          />
        </div>
        <div className="flex items-center gap-8">
          <NavLink 
            href="https://github.com/x-senpai-x/Artemis?tab=readme-ov-file#architecture-of-the-orderflow" 
            isActive={currentPage === 'architecture'}
          >
            Architecture
          </NavLink>
          <NavLink 
            href="/docs" 
            isActive={currentPage === 'docs'}
          >
            Docs
          </NavLink>
          <a 
            href="https://artemis-fp48.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <button className="px-6 py-2 rounded-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
              Launch App
            </button>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-20 text-center relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <h1 className="relative text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse-slow">
            Introducing the world's first AI agent
            <br />
            powered Intent Settlement Network 
          </span>
          <div className="absolute -inset-2 bg-cyan-400/20 blur-3xl -z-10"></div>
        </h1>

        <p className="text-2xl md:text-3xl mb-12 max-w-4xl mx-auto neon-blue-subtle">
          Any Token | Any Chain | Instantly | Atomically
        </p>
        <a href='https://artemis-fp48.vercel.app' target='blank'>
          <button className="bg-cyan-400 text-gray-900 px-8 py-3 rounded-full text-lg font-medium hover:bg-cyan-300 transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/75 transform hover:-translate-y-0.5">
            Launch App
          </button>
        </a>

        {/* Blockchain Section */}
        <div className="mt-16 text-center relative">
          <h2 className="text-4xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Trade Instantly Across
          </h2>
          
          {/* Scrolling Logo Container with enhanced styling */}
          <div className="relative w-full overflow-hidden mb-24">
            <div className="absolute inset-0 via-transparent to-gray-950 z-10"></div>
            <div className="flex whitespace-nowrap animate-scroll">
              {/* First set of logos */}
              <div className="flex items-center gap-20 mx-10">
                {chains.map((chain) => (
                  <div 
                    key={chain.name} 
                    className="w-48 h-24 flex items-center flex-shrink-0 rounded-xl p-2"
                  >
                    <img 
                      src={chain.logo} 
                      alt={chain.name} 
                      className="w-full h-full opacity-90"
                    />
                  </div>
                ))}
              </div>
              {/* Duplicate set for seamless scrolling */}
              <div className="flex items-center gap-20 mx-10">
                {chains.map((chain) => (
                  <div 
                    key={`${chain.name}-duplicate`} 
                    className="w-48 h-24 flex items-center flex-shrink-0 rounded-xl p-2 "
                  >
                    <img 
                      src={chain.logo} 
                      alt={chain.name} 
                      className="w-full h-full opacity-90"
                    />
                  </div>
                ))}
              </div>
              {/* Duplicate set for seamless scrolling */}
              <div className="flex items-center gap-20 mx-10">
                {chains.map((chain) => (
                  <div 
                    key={`${chain.name}-duplicate`} 
                    className="w-48 h-24 flex items-center flex-shrink-0 rounded-xl p-2 "
                  >
                    <img 
                      src={chain.logo} 
                      alt={chain.name} 
                      className="w-full h-full opacity-90"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Token Balance Text */}
          <h2 className="text-4xl mt-[-20px] font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Let AI agents find the best price before you can blink.
          </h2>

          {/* Coming Soon Badge */}
          <div className="inline-block mt-4 bg-gray-900/80 backdrop-blur-sm text-cyan-400 px-6 py-2 rounded-full text-sm border border-cyan-900/30 shadow-lg shadow-cyan-500/20">
            Supports 5+ EVM and Non-EVM chains
          </div>

          <section className="max-w-7xl mx-auto mt-[-30px] px-4 py-20">
            <div className="grid md:grid-cols-2 gap-8">
              <img src={Before} className='rounded-3xl'></img>
              <img src={After} className='rounded-3xl'></img>
            </div>
          </section>

          {/* Try Chain Abstraction Section */}
          <section className="max-w-7xl mx-auto px-4 py-20 relative">
            {/* Add decorative background elements for depth */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-40 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <h2 className="text-4xl mt-[-100px] font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse-slow relative">
              Agents solve across
              <div className="absolute -inset-2 bg-cyan-400/10 blur-3xl -z-10"></div>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {apps.map((app, index) => (
                <AppCard
                  key={index}
                  name={app.name}
                  bgColor={app.bgColor}
                  logo={app.logo}
                />
              ))}
            </div>
          </section>

          {/* Get Started Section */}
          <section className="max-w-7xl mx-auto px-4 py-20 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm relative">
            {/* Add animated border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-blue-500/20 opacity-20"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left side - Video/Network Visualization */}
              <div className="relative group">
                <div className="aspect-video bg-gray-900/50 rounded-3xl border border-cyan-900/30 shadow-lg shadow-cyan-500/5 overflow-hidden transition-all duration-300 group-hover:shadow-cyan-500/20">
                  {/* Background design elements */}
                  <div className="absolute inset-0">
                    <div className="absolute -bottom-20 -left-20">
                      <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                        <path
                          d="M0 200L200 0M50 200L200 50M100 200L200 100"
                          stroke="rgba(34, 211, 238, 0.1)"
                          strokeWidth="1"
                          className="animate-pulse-slow"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Video section with gradient overlay */}
                  <div className="relative">
                    {/* Auto-playing video element */}
                    <video
                      className="w-full h-full object-cover opacity-80"
                      playsInline
                      muted
                      loop
                      autoPlay  // This makes the video play immediately when loaded
                    >
                      <source src={Video} type="video/mp4" />
                    </video>

                    {/* Gradient overlay on top of the video */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Right side - Get Started Steps */}
              <div className="lg:pl-12">
                <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  How ArtemisX Works
                </h2>
                
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <GetStartedStep
                      key={index}
                      number={index + 1}
                      text={step}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Learn More Section */}
          <section className="max-w-7xl mx-auto px-4 py-20 text-center relative">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse-slow">
                Learn more about the magic behind ArtemisX' (previously Artemis) AI Agents and its Cross-Chain settlement features
                <div className="absolute -inset-2 bg-cyan-400/10 blur-3xl -z-10"></div>
              </h2>
              
              <button className="mt-4 bg-cyan-400 text-gray-900 px-8 py-3 rounded-full text-lg font-medium hover:bg-cyan-300 transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/75 transform hover:-translate-y-0.5">
                Click Here
              </button>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="max-w-7xl mx-auto px-4 py-20 text-center bg-gradient-to-b from-gray-900/50 to-gray-950/50 backdrop-blur-sm relative">
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-blue-500/20 opacity-20"></div>

            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Benefits Beyond Money
              </h2>
            </div>
          </section>

          {/* Benefits Grid Section */}
          <section className="max-w-7xl mx-auto px-4 py-20 relative">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900/50 to-gray-950/50 backdrop-blur-sm"></div>
              <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
              {/* Left Column - Benefits 1 & 2 */}
              <div className="flex flex-col gap-8">
                {/* Benefit cards are already styled in dark mode */}
                <div className="flex-1">
                  <BenefitCard
                    title="Benefit 1"
                    description="Swap any token from any chain to get another token on any other chain"
                    animationDelay={0}
                  >
                    <div className="flex gap-4">
                      {['base', 'poly', 'eth', 'arb', 'sol'].map((chainId) => (
                        <AppIcon
                          key={chainId}
                          src={chainLogos[chainId].logo}
                          alt={chainLogos[chainId].name}
                        />
                      ))}
                    </div>
                  </BenefitCard>
                </div>

                <div className="flex-1">
                  <BenefitCard
                    title="Benefit 2"
                    description="AI Agents execute actions in LIT Protcol's MPC-TEE environment."
                    animationDelay={200}
                  >
                  </BenefitCard>
                </div>
              </div>

              {/* Right Column - Benefit 3 */}
              <div className="h-full">
                <BenefitCard
                  title="Benefit 3"
                  description="Your swaps are executed by trusted AI Agents who hold on-chain attestaions as their reputation."
                  animationDelay={400}
                  className="h-full"
                >
                  <div className="h-full flex flex-col">
                    <img src={Attest} className='rounded-3xl'></img>
                  </div>
                </BenefitCard>
              </div>
            </div>
          </section>

          {/* Contact Section wrapper */}
          <div className="w-full relative">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-950 to-transparent"></div>
            </div>
            <ContactSection />
          </div>
        </div>
      </main>
    </div>
  );
};

const style = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }

  .animate-scroll {
    animation: scroll 20s linear infinite;
  }

  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }

  @keyframes neonFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.neon-blue-subtle {
  /* Creating a more subtle gradient with slightly muted colors */
  background: linear-gradient(
    90deg,
    #4dc9ff,  /* Keeping our bright blue as the base */
    #33b5e5,  /* Slightly muted blue */
    #0077ff,  /* Deep blue */
    #4dc9ff   /* Back to base */
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  
  /* Reduced glow effect with minimal shadow layers */
  text-shadow: 
    /* A thin white edge for definition */
    0 0 1px rgba(255, 255, 255, 0.8),
    /* Single, subtle blue glow */
    0 0 3px rgba(77, 201, 255, 0.5);
    
  animation: neonFlow 8s linear infinite;
  position: relative;
  z-index: 1;
  transition: all 0.2s ease;
}

/* Subtle hover enhancement that doesn't overwhelm */
.neon-blue-subtle:hover {
  text-shadow: 
    0 0 1px rgba(255, 255, 255, 0.9),
    0 0 3px rgba(77, 201, 255, 0.7);
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = style;
document.head.appendChild(styleSheet);

export default App;
