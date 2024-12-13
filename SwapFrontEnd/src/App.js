import React, { useState, useCallback } from 'react';
import { ChevronDown, Settings, ArrowUpDown } from 'lucide-react';
import { BrowserProvider, Contract } from 'ethers';
import ArtemisLogo from './assets/logo.jpeg';
import Particles from 'react-particles';
import { loadSlim } from "tsparticles-slim";

const NavLink = ({ href, children }) => (
  <a 
    href={href}
    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm font-medium"
  >
    {children}
  </a>
);

const contractABI = [
  {
    "inputs": [],
    "name": "increase",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const ParticleBackground = () => {
  // Initialize particles with our callback
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  // Configure particles with a futuristic neon blue theme
  const particlesConfig = {
    particles: {
      number: {
        value: 40,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#60a5fa" // Tailwind blue-400
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.5,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.5,
          sync: false
        }
      },
      links: {
        enable: true,
        distance: 150,
        color: "#93c5fd", // Tailwind blue-300
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out"
        },
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: {
          enable: true,
          mode: "grab"
        },
        onClick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.8
          }
        },
        push: {
          quantity: 4
        }
      }
    },
    background: {
      color: "#030712" // Tailwind gray-950
    },
    fullScreen: {
      enable: true,
      zIndex: -1
    },
    detectRetina: true
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesConfig}
    />
  );
};


// Simplified token and chain lists - removed prices
const tokensList = [
  { name: 'Ethereum', symbol: 'ETH', icon: '◊' },
  { name: 'USD Coin', symbol: 'USDC', icon: '$' },
  { name: 'Tether', symbol: 'USDT', icon: 'T' },
  { name: 'Arbitrum', symbol: 'ARB', icon: 'A' },
  { name: 'Polygon', symbol: 'MATIC', icon: 'P' },
];

const chainsList = [
  { name: 'Ethereum', icon: '◊', id: 'ethereum' },
  { name: 'Polygon', icon: 'P', id: 'polygon' },
  { name: 'Base', icon: 'B', id: 'base' },
  { name: 'Arbitrum', icon: 'A', id: 'arbitrum' },
];

const App = () => {
  // Wallet connection state
  const [userAddress, setUserAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Swap interface state
  const [fromTokenDropdownOpen, setFromTokenDropdownOpen] = useState(false);
  const [toTokenDropdownOpen, setToTokenDropdownOpen] = useState(false);
  const [fromChainDropdownOpen, setFromChainDropdownOpen] = useState(false);
  const [toChainDropdownOpen, setToChainDropdownOpen] = useState(false);

  // Add amount states for swapping
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  // Modified token and chain states with initial values
  const [fromToken, setFromToken] = useState(tokensList[0]);
  const [toToken, setToToken] = useState(tokensList[1]);
  const [fromChain, setFromChain] = useState(chainsList[0]);
  const [toChain, setToChain] = useState(chainsList[1]);

  const [isTransacting, setIsTransacting] = useState(false);
  const [transactionError, setTransactionError] = useState(null);

  // Wallet connection handler
  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log('Connected address:', address);
        setUserAddress(address);
        setIsWalletConnected(true);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };

  // New function to handle the swap/contract interaction
  const handleSwap = async () => {
    setIsTransacting(true);
    setTransactionError(null);

    try {
      // Get provider and signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contractAddress = "0xEA912a237E63fB159A11c5C01A93bD3677248b34";
      const contract = new Contract(contractAddress, contractABI, signer);

      // Call the increase function
      const transaction = await contract.increase();
      
      // Wait for transaction to be mined
      const receipt = await transaction.wait();
      
      console.log('Transaction successful:', receipt);
      
      // Clear amounts after successful transaction
      setFromAmount('');
      setToAmount('');

    } catch (error) {
      console.error('Transaction failed:', error);
      setTransactionError(error.message);
    } finally {
      setIsTransacting(false);
    }
  };

  // New swap direction handler
  const handleSwapDirection = () => {
    // Swap tokens
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    // Swap chains
    const tempChain = fromChain;
    setFromChain(toChain);
    setToChain(tempChain);

    // Swap amounts
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  // Simplified TokenDropdown component
  const TokenDropdown = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;
    
    return (
      <div className="absolute z-50 mt-2 w-64 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-cyan-900/30 shadow-lg shadow-cyan-500/10">
        <div className="p-4 border-b border-gray-800">
          <input
            type="text"
            placeholder="Search tokens"
            className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {tokensList.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-400/5 cursor-pointer group"
              onClick={() => {
                onSelect(token);
                onClose();
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-lg">
                {token.icon}
              </div>
              <div>
                <div className="text-gray-100 group-hover:text-cyan-400 transition-colors">
                  {token.symbol}
                </div>
                <div className="text-gray-500 text-sm">{token.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ChainDropdown = ({ isOpen, onClose, onSelect, selectedChain }) => {
    if (!isOpen) return null;
    
    return (
      <div className="absolute z-50 mt-2 w-48 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-cyan-900/30 shadow-lg shadow-cyan-500/10 right-0">
        {chainsList.map((chain) => (
          <div
            key={chain.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-400/5 cursor-pointer group"
            onClick={() => {
              onSelect(chain);
              onClose();
            }}
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-lg">
              {chain.icon}
            </div>
            <div className="text-gray-100 group-hover:text-cyan-400 transition-colors">
              {chain.name}
            </div>
          </div>
        ))}
      </div>
    );
  };

   // Updated SwapField component to handle amount changes
   const SwapField = ({ 
    label, 
    token, 
    chain,
    amount,
    setAmount,
    isTokenDropdownOpen,
    isChainDropdownOpen,
    setTokenDropdownOpen,
    setChainDropdownOpen,
    onTokenSelect,
    onChainSelect
  }) => (
    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/30 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-400 text-sm">{label}</div>
        <div className="text-gray-400 text-sm">Balance: 0.0</div>
      </div>
      
      <div className="flex items-center justify-between gap-4">
      <style>
        {`
          /* Remove spinner buttons for Chrome, Safari, Edge, Opera */
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Remove spinner buttons for Firefox */
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
        <input 
          type="number" 
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-transparent text-3xl text-gray-100 outline-none w-1/2 font-light"
        />
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              className="flex items-center gap-2 bg-gray-700/50 hover:bg-cyan-400/10 px-4 py-2 rounded-full transition-all duration-300 border border-gray-700/50 hover:border-cyan-400/50 group"
              onClick={() => setTokenDropdownOpen(!isTokenDropdownOpen)}
            >
              {token ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
                    {token.icon}
                  </div>
                  <span className="text-gray-100 group-hover:text-cyan-400">{token.symbol}</span>
                </>
              ) : (
                <span className="text-gray-100 group-hover:text-cyan-400">Select</span>
              )}
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
            </button>
            <TokenDropdown 
              isOpen={isTokenDropdownOpen}
              onClose={() => setTokenDropdownOpen(false)}
              onSelect={onTokenSelect}
            />
          </div>
          
          <div className="relative">
            <button 
              className="flex items-center gap-2 bg-gray-700/50 hover:bg-cyan-400/10 px-3 py-2 rounded-full transition-all duration-300 border border-gray-700/50 hover:border-cyan-400/50 group"
              onClick={() => setChainDropdownOpen(!isChainDropdownOpen)}
            >
              <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
                {chain.icon}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
            </button>
            <ChainDropdown 
              isOpen={isChainDropdownOpen}
              onClose={() => setChainDropdownOpen(false)}
              onSelect={onChainSelect}
              selectedChain={chain}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
      <>
        <ParticleBackground />
        <div className="relative min-h-screen">
          {/* Enhanced Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-2 bg-gray-900/50 backdrop-blur-sm border-b border-cyan-900/30">
          <div className="flex items-center">
            <a 
              href="https://artemis-vert.vercel.app/"
              className="transition-opacity duration-300 hover:opacity-100"
            >
              <img 
                src={ArtemisLogo}
                alt="Artemis Logo"
                className="h-12 opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </div>
          <div className="flex items-center gap-8">
            <NavLink href="/https://github.com/x-senpai-x/Artemis?tab=readme-ov-file#architecture-of-the-orderflow">
              Architecture
            </NavLink>
            <NavLink href="/docs">
              Docs
            </NavLink>
            <button 
              onClick={handleConnectWallet}
              className="px-6 py-2 rounded-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              {isWalletConnected ? 
                `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 
                'Connect Wallet'
              }
            </button>
          </div>
        </nav>

      {/* Main Content */}
      <div className="pt-20 pb-20">
          <div className="max-w-lg mx-auto p-6 mt-20">
            <div className="bg-gray-900/70 backdrop-blur-md rounded-3xl border border-blue-500/20 p-6 shadow-lg shadow-blue-500/5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium text-gray-100">Swap</h2>
                <button className="w-10 h-10 rounded-xl bg-gray-800/70 hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-400 transition-all duration-300">
                  <Settings size={20} />
                </button>
              </div>

            <div className="space-y-4"> {/* Increased space-y for better spacing */}
              <SwapField 
                label="From"
                token={fromToken}
                chain={fromChain}
                amount={fromAmount}
                setAmount={setFromAmount}
                isTokenDropdownOpen={fromTokenDropdownOpen}
                isChainDropdownOpen={fromChainDropdownOpen}
                setTokenDropdownOpen={setFromTokenDropdownOpen}
                setChainDropdownOpen={setFromChainDropdownOpen}
                onTokenSelect={setFromToken}
                onChainSelect={setFromChain}
              />

              {/* Swap Direction Button with adjusted styling */}
              <div className="flex justify-center">
                  <button 
                    onClick={handleSwapDirection}
                    className="w-10 h-10 bg-gray-800/90 rounded-xl border border-blue-500/30 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300"
                  >
                    <ArrowUpDown className="w-6 h-6" />
                  </button>
                </div>

              <SwapField 
                label="To"
                token={toToken}
                chain={toChain}
                amount={toAmount}
                setAmount={setToAmount}
                isTokenDropdownOpen={toTokenDropdownOpen}
                isChainDropdownOpen={toChainDropdownOpen}
                setTokenDropdownOpen={setToTokenDropdownOpen}
                setChainDropdownOpen={setToChainDropdownOpen}
                onTokenSelect={setToToken}
                onChainSelect={setToChain}
              />
            </div>


            <button 
        className={`w-full mt-6 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg ${
          isTransacting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-400 text-gray-900 hover:bg-blue-300 shadow-blue-500/50 hover:shadow-blue-500/75'
        }`}
        onClick={isWalletConnected ? handleSwap : handleConnectWallet}
        disabled={isTransacting}
      >
        {isTransacting ? 'Processing...' : (isWalletConnected ? 'Swap' : 'Connect Wallet')}
      </button>

      {/* Add error message display */}
      {transactionError && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {transactionError}
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default App;
