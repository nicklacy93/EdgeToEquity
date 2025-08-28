import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion/client';
import { fetchStrategyAgent } from "@/utils/fetchStrategyAgent";
import { useStrategyStore } from "@/store/useStrategyStore";
import {
  BookOpen,
  Upload,
  Brain,
  Lightbulb,
  Target,
  TrendingUp,
  Shield,
  Code,
  Eye,
  Download,
  Share2,
  Clock,
  Layers,
  CheckCircle,
  ArrowRight,
  Zap,
  Heart,
  Award,
  Info,
  RefreshCw,
  FileText,
  Settings,
  X,
  Bookmark,
  BookmarkPlus,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  Star,
  Users,
  Play,
  Smile,
  Frown,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Rocket,
  GraduationCap,
  PenTool,
  Sparkles
} from 'lucide-react';

const StrategyExplainer = ({ integratedMode = false, themeColor = "purple" }) => {
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [selectedSection, setSelectedSection] = useState('overview');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [layoutMode, setLayoutMode] = useState('dual'); // 'dual', 'sections'
  const [selectedLine, setSelectedLine] = useState(null);
  const [expandJargon, setExpandJargon] = useState(false);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [friendlyMode, setFriendlyMode] = useState(true);
  const [highlightedTerms, setHighlightedTerms] = useState(new Set());
  const [lineExplanations, setLineExplanations] = useState({});
  const [showLineExplanation, setShowLineExplanation] = useState(false);
  const [studyProgress, setStudyProgress] = useState({});

  const { generatedCode, selectedPlatform } = useStrategyStore();

  const mockCode = `//@version=5
strategy("RSI Mean Reversion", overlay=true, initial_capital=10000)

// Input Parameters
rsi_length = input.int(14, title="RSI Length", minval=1, maxval=50)
rsi_oversold = input.int(30, title="Oversold Level", minval=10, maxval=40)
rsi_overbought = input.int(70, title="Overbought Level", minval=60, maxval=90)
stop_loss_pct = input.float(2.0, title="Stop Loss %", minval=0.5, maxval=5.0)

// Calculate Indicators
rsi = ta.rsi(close, rsi_length)
sma_20 = ta.sma(close, 20)

// Entry Conditions
long_condition = rsi < rsi_oversold and close > sma_20
short_condition = rsi > rsi_overbought and close < sma_20

// Risk Management
if long_condition
    strategy.entry("Long", strategy.long)
    strategy.exit("Long SL", "Long", stop=close * (1 - stop_loss_pct/100))

if short_condition
    strategy.entry("Short", strategy.short)
    strategy.exit("Short SL", "Short", stop=close * (1 + stop_loss_pct/100))

// Visualization
plotshape(long_condition, style=shape.triangleup, location=location.belowbar, color=color.green)
plotshape(short_condition, style=shape.triangledown, location=location.abovebar, color=color.red)`;

  const jargonDefinitions = {
    'RSI': 'Relative Strength Index - A momentum oscillator that measures speed and change of price movements, ranging from 0 to 100',
    'SMA': 'Simple Moving Average - The average price over a specific number of periods, creating a smooth trend line',
    'ATR': 'Average True Range - Measures market volatility by calculating the average of true ranges over a period',
    'overlay': 'Displays the indicator directly on the price chart rather than in a separate panel',
    'ta.rsi': 'TradingView\'s built-in function to calculate the Relative Strength Index',
    'ta.sma': 'TradingView\'s built-in function to calculate the Simple Moving Average',
    'strategy.entry': 'Places a market order to enter a position',
    'strategy.exit': 'Sets exit conditions for an open position (stop loss, take profit)',
    'plotshape': 'Draws shapes on the chart (arrows, circles, etc.) at specific conditions',
    'close': 'The closing price of the current bar/candle',
    'minval': 'Minimum value allowed for an input parameter',
    'maxval': 'Maximum value allowed for an input parameter'
  };

  const mockLineExplanations = {
    1: "This line declares the script version (5 is the latest) and defines it as a strategy with overlay=true so it appears on the price chart.",
    5: "Creates an input parameter for RSI length with default 14, allowing users to adjust between 1-50 periods.",
    6: "Sets the oversold threshold (default 30) - when RSI drops below this, we consider buying.",
    7: "Sets the overbought threshold (default 70) - when RSI rises above this, we consider selling.",
    10: "Calculates the RSI indicator using TradingView's built-in function with the specified length.",
    11: "Calculates a 20-period simple moving average to determine trend direction.",
    14: "Long entry condition: RSI is oversold AND price is above the moving average (uptrend filter).",
    15: "Short entry condition: RSI is overbought AND price is below the moving average (downtrend filter).",
    18: "If long condition is true, enter a long position using Pine Script's entry function.",
    19: "Set a stop loss at 2% below entry price to limit potential losses on long trades.",
    22: "If short condition is true, enter a short position.",
    23: "Set a stop loss at 2% above entry price to limit potential losses on short trades.",
    26: "Draw green up arrows below bars when long conditions are met.",
    27: "Draw red down arrows above bars when short conditions are met."
  };

  const mockExplanation = {
    overview: {
      title: "Strategy Overview",
      content: friendlyMode
        ? "Hey there! 👋 This is a Mean Reversion strategy that's like being a contrarian trader - when everyone else is panicking (oversold), you buy, and when everyone's euphoric (overbought), you sell! It's based on the idea that prices tend to bounce back from extreme levels. Pretty clever, right? 😊"
        : "This is a Mean Reversion strategy that uses the RSI (Relative Strength Index) indicator to identify oversold and overbought conditions in the market. The strategy aims to profit from price corrections by buying when the market is oversold and selling when it's overbought.",
      keyPoints: [
        "Strategy Type: Mean Reversion",
        "Primary Indicator: RSI (14 periods)",
        "Market Bias: Contrarian (trades against momentum)",
        "Risk Management: Percentage-based stop losses"
      ],
      emoji: "🎯",
      difficulty: "Beginner-Friendly"
    },
    indicators: {
      title: "Indicators Explained",
      content: friendlyMode
        ? "Let's break down the 'secret weapons' this strategy uses! 🛠️ Think of indicators as your trading radar - they help you see what's happening beneath the surface of price movements."
        : "The strategy uses two main technical indicators to make trading decisions:",
      components: [
        {
          name: "RSI (Relative Strength Index)",
          purpose: "Measures momentum and identifies overbought/oversold conditions",
          settings: "14-period calculation",
          interpretation: "Values below 30 suggest oversold (buy signal), above 70 suggest overbought (sell signal)",
          analogy: friendlyMode ? "Like a speedometer for price momentum - tells you when things are moving too fast!" : null
        },
        {
          name: "SMA (Simple Moving Average)",
          purpose: "Determines overall trend direction as a filter",
          settings: "20-period moving average",
          interpretation: "Price above SMA = uptrend bias, below SMA = downtrend bias",
          analogy: friendlyMode ? "Your compass for market direction - keeps you pointed the right way!" : null
        }
      ],
      emoji: "📊",
      difficulty: "Easy to Understand"
    },
    logic: {
      title: "Trading Logic",
      content: friendlyMode
        ? "Now for the fun part - how this strategy actually makes decisions! 🧠 It's like having a really smart assistant that follows a strict set of rules."
        : "The strategy follows a systematic approach to entering and exiting trades:",
      steps: [
        {
          step: 1,
          title: "Long Entry Condition",
          description: friendlyMode
            ? "Time to buy! 📈 When RSI drops below 30 (everyone's selling in panic) AND price is still above the 20-day average (we're in an uptrend), that's our cue to step in and catch the bounce!"
            : "Buy when RSI drops below 30 (oversold) AND price is above the 20-period moving average (uptrend filter)"
        },
        {
          step: 2,
          title: "Short Entry Condition",
          description: friendlyMode
            ? "Time to sell! 📉 When RSI rises above 70 (everyone's buying in euphoria) AND price is below the 20-day average (we're in a downtrend), we sell into the excitement!"
            : "Sell when RSI rises above 70 (overbought) AND price is below the 20-period moving average (downtrend filter)"
        },
        {
          step: 3,
          title: "Risk Management",
          description: friendlyMode
            ? "Safety first! 🛡️ Every trade gets a 2% stop loss - think of it as your emergency exit. No matter how confident we are, we always protect our capital!"
            : "Each trade has a stop loss set at 2% from entry price to limit potential losses"
        },
        {
          step: 4,
          title: "Position Sizing",
          description: friendlyMode
            ? "How much to bet? 💰 We use Pine Script's default sizing, but you could improve this by risking a fixed percentage of your account per trade."
            : "Uses default Pine Script position sizing based on available capital"
        }
      ],
      emoji: "🎯",
      difficulty: "Logical Flow"
    },
    risk: {
      title: "Risk Management",
      content: friendlyMode
        ? "Let's talk about staying safe in the markets! 🛡️ This strategy has some good safety features, but there's always room for improvement."
        : "The strategy incorporates several risk management techniques:",
      features: [
        {
          feature: "Stop Losses",
          description: "Fixed percentage stop loss (2%) on every trade to limit downside",
          assessment: "Good - Protects against large losses",
          grade: "B+"
        },
        {
          feature: "Trend Filter",
          description: "Only takes long trades in uptrends and short trades in downtrends",
          assessment: "Excellent - Reduces counter-trend risk",
          grade: "A"
        },
        {
          feature: "Position Sizing",
          description: "Uses default sizing without dynamic adjustment",
          assessment: "Basic - Could be improved with volatility-based sizing",
          grade: "C"
        }
      ],
      emoji: "🛡️",
      difficulty: "Risk Awareness"
    },
    strengths: {
      title: "Strategy Strengths",
      content: friendlyMode
        ? "What makes this strategy shine? ✨ Let's celebrate the good stuff - this strategy has some really solid foundations!"
        : "This strategy has several positive characteristics:",
      points: [
        "Simple and easy to understand logic",
        "Includes trend filtering to improve signal quality",
        "Has proper stop loss protection on every trade",
        "Uses well-established RSI indicator with proven track record",
        "Clear entry and exit rules reduce emotional decision-making"
      ],
      emoji: "⭐",
      difficulty: "Beginner-Friendly"
    },
    improvements: {
      title: "Potential Improvements",
      content: friendlyMode
        ? "Ready to level up? 🚀 Every strategy can be improved, and here are some exciting ideas to make this one even better!"
        : "Areas where the strategy could be enhanced:",
      suggestions: [
        {
          area: "Position Sizing",
          current: "Fixed position size",
          improvement: "Dynamic sizing based on volatility (ATR)",
          benefit: "Better risk-adjusted returns",
          priority: "High"
        },
        {
          area: "Exit Strategy",
          current: "Only stop losses",
          improvement: "Add profit targets or trailing stops",
          benefit: "Capture more profit from winning trades",
          priority: "Medium"
        },
        {
          area: "Market Conditions",
          current: "Trades in all market conditions",
          improvement: "Add volatility or volume filters",
          benefit: "Avoid trading during choppy or low-volume periods",
          priority: "Medium"
        }
      ],
      emoji: "💡",
      difficulty: "Enhancement Ideas"
    }
  };

  useEffect(() => {
    // Track study progress
    if (explanation && selectedSection) {
      setStudyProgress(prev => ({
        ...prev,
        [selectedSection]: (prev[selectedSection] || 0) + 1
      }));
    }
  }, [selectedSection, explanation]);

  useEffect(() => {
    if (generatedCode && generatedCode.trim().length > 0) {
      handleExplain();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedCode]);

  const handleExplain = async () => {
    if (!generatedCode.trim()) return;

    setIsExplaining(true);
    setExplanation(null);
    setLineExplanations({});

    // Simulate AI processing with educational metaphors
    setTimeout(() => {
      setExplanation(mockExplanation);
      setLineExplanations(mockLineExplanations);
      setIsExplaining(false);
      // Removed annoying popup modal for better UX
    }, 2500);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // This should be updated to use the new generatedCode state
      };
      reader.readAsText(file);
    }
  };

  const loadSampleCode = () => {
    // This should be updated to use the new generatedCode state
  };

  const handleLineClick = (lineNumber) => {
    setSelectedLine(lineNumber);
    setShowLineExplanation(true);
  };

  const toggleBookmark = (content, section = null) => {
    const bookmarkId = section ? `${section}-${Date.now()}` : Date.now().toString();
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(bookmarkId)) {
        newBookmarks.delete(bookmarkId);
      } else {
        newBookmarks.add(bookmarkId);
      }
      return newBookmarks;
    });
  };

  const highlightJargon = (text) => {
    if (!expandJargon) return text;

    let highlightedText = text;
    Object.keys(jargonDefinitions).forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex,
        `<span class="bg-blue-500/20 text-blue-300 px-1 rounded cursor-help border-b border-blue-500/50" title="${jargonDefinitions[term]}">${term}</span>`
      );
    });

    return highlightedText;
  };

  const exportExplanation = () => {
    if (!explanation) return;

    const content = Object.entries(explanation)
      .map(([key, section]) => {
        const emoji = section.emoji || '';
        return `# ${emoji} ${section.title}\n\n${section.content}\n\n`;
      })
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strategy_explanation.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: Eye, color: 'emerald' },
    { id: 'indicators', title: 'Indicators', icon: TrendingUp, color: 'blue' },
    { id: 'logic', title: 'Trading Logic', icon: Brain, color: 'purple' },
    { id: 'risk', title: 'Risk Management', icon: Shield, color: 'amber' },
    { id: 'strengths', title: 'Strengths', icon: Award, color: 'green' },
    { id: 'improvements', title: 'Improvements', icon: Lightbulb, color: 'yellow' }
  ];

  const getSectionIcon = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.icon : BookOpen;
  };

  const getSectionColor = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    const colors = {
      emerald: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      blue: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      purple: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      amber: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
      green: 'text-green-400 bg-green-500/20 border-green-500/30',
      yellow: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    };
    return colors[section?.color] || colors.purple;
  };

  const getCurrentSectionIndex = () => {
    return sections.findIndex(section => section.id === selectedSection);
  };

  const handleBack = () => {
    const idx = getCurrentSectionIndex();
    if (idx > 0) setSelectedSection(sections[idx - 1].id);
  };

  const handleNext = () => {
    const idx = getCurrentSectionIndex();
    if (idx < sections.length - 1) setSelectedSection(sections[idx + 1].id);
  };

  // Enhanced Success Animation
  const SuccessAnimation = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/50 text-center max-w-md">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative"
        >
          <GraduationCap className="w-20 h-20 text-blue-400 mx-auto mb-4" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-2xl font-bold text-blue-300 mb-2">
            {friendlyMode ? "Explanation Complete! 📚✨" : "Explanation Complete! 📚"}
          </h4>
          <p className="text-blue-100 mb-4">
            {friendlyMode
              ? "Your strategy is now crystal clear and ready to study! 🎓"
              : "Your strategy has been broken down into clear sections"
            }
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-200">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Happy learning!</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // Onboarding Modal
  const OnboardingModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <GraduationCap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Welcome to Strategy School!</h3>
          </div>
          <button
            onClick={() => setShowOnboarding(false)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-blue-500/15 to-blue-400/10 rounded-xl border border-blue-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-pink-400" />
              <h4 className="text-lg font-semibold text-white">I'm Professor EdgeBot, Your Strategy Teacher!</h4>
            </div>
            <p className="text-slate-300 leading-relaxed">
              I love making complex trading strategies easy to understand! Whether you're a beginner or expert,
              I'll break down your code into bite-sized lessons that actually make sense. Ready to learn? 🎓
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-5 h-5 text-blue-400" />
                <h5 className="font-semibold text-white">1. Upload Your Code</h5>
              </div>
              <p className="text-sm text-slate-400">
                Paste Pine Script or upload a file - I'll analyze every line
              </p>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <PenTool className="w-5 h-5 text-blue-400" />
                <h5 className="font-semibold text-white">2. Click Any Line</h5>
              </div>
              <p className="text-sm text-slate-400">
                Interactive code explanations - click any line for instant help
              </p>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <BookmarkPlus className="w-5 h-5 text-yellow-400" />
                <h5 className="font-semibold text-white">3. Bookmark Key Insights</h5>
              </div>
              <p className="text-sm text-slate-400">
                Save important explanations and "aha moments" for later
              </p>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-emerald-400" />
                <h5 className="font-semibold text-white">4. Learn Step-by-Step</h5>
              </div>
              <p className="text-sm text-slate-400">
                Navigate through organized sections at your own pace
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-500/20">
            <h5 className="font-semibold text-white mb-2">🎓 Learning Features</h5>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
              <div>• Dual-panel layout (code + explanation)</div>
              <div>• Interactive line-by-line help</div>
              <div>• Jargon expansion for complex terms</div>
              <div>• Friendly mode with emojis</div>
              <div>• Bookmark system for key insights</div>
              <div>• Progress tracking</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">Helping 20,000+ traders learn</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowOnboarding(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Skip Tour
              </button>
              <button
                onClick={() => setShowOnboarding(false)}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Start Learning! 🎓
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Line Explanation Modal
  const LineExplanationModal = () => (
    <AnimatePresence>
      {showLineExplanation && selectedLine && lineExplanations[selectedLine] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-slate-800 rounded-2xl border border-blue-500/50 p-6 max-w-lg w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-lg font-bold text-white">Line {selectedLine} Explanation</h4>
              </div>
              <button
                onClick={() => setShowLineExplanation(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                <div className="text-xs text-slate-400 mb-2">Code Line:</div>
                <code className="text-sm text-slate-300 font-mono">
                  {generatedCode.split('\n')[selectedLine - 1]}
                </code>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">
                    {friendlyMode ? "Professor's Explanation:" : "Explanation:"}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {lineExplanations[selectedLine]}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleBookmark(lineExplanations[selectedLine], `line-${selectedLine}`)}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-lg text-yellow-300 text-sm transition-all"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  Bookmark This
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLineExplanation(false)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-300 text-sm transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Got It!
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-4">
      {/* Only show header if not in integrated mode - saves vertical space */}
      {!integratedMode && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border ${themeColor === "emerald"
            ? "bg-emerald-500/5 border-emerald-500/20"
            : "bg-blue-500/5 border-blue-500/20"
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className={`w-4 h-4 ${themeColor === "emerald" ? "text-emerald-400" : "text-blue-400"
                }`} />
              <h3 className="text-base font-semibold text-white">
                Strategy Teacher {friendlyMode ? "📚" : "📚"}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFriendlyMode(!friendlyMode)}
                className="p-1 bg-slate-700/30 hover:bg-slate-700/50 rounded text-slate-300 text-xs transition-all"
              >
                {friendlyMode ? "😊" : "📊"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowOnboarding(true)}
                className={`p-1 rounded text-xs transition-all ${themeColor === "emerald"
                  ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300"
                  : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                  }`}
              >
                <HelpCircle className="w-3 h-3" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Compact Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 bg-slate-800/30 rounded-lg border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Layout:</span>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLayoutMode('dual')}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-all
                  ${layoutMode === 'dual'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-700/30 text-slate-400 hover:text-white border border-slate-600'
                  }
                `}
              >
                <Maximize2 className="w-4 h-4 mr-1 inline" />
                Dual Panel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLayoutMode('sections')}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-all
                  ${layoutMode === 'sections'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-700/30 text-slate-400 hover:text-white border border-slate-600'
                  }
                `}
              >
                <Minimize2 className="w-4 h-4 mr-1 inline" />
                Sections Only
              </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Expand Jargon:</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpandJargon(!expandJargon)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-300 text-sm transition-all"
              >
                {expandJargon ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {expandJargon ? 'On' : 'Off'}
              </motion.button>
            </div>

            {bookmarks.size > 0 && (
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-300">{bookmarks.size} bookmarks</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content Area - Compact */}
      <div className={`${layoutMode === 'dual' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}`}>
        {/* Code Input Section */}
        {(layoutMode === 'dual' || !explanation) && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-blue-400" />
                  <h4 className="text-xl font-bold text-white">Strategy Code</h4>
                  {explanation && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                      Click lines for explanations
                    </span>
                  )}
                </div>
              </div>

              <div className="relative">
                {explanation ? (
                  // Interactive Code Display
                  <div className="relative">
                    <pre className="h-80 p-4 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-300 font-mono text-sm overflow-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
                      <code>
                        {generatedCode.split('\n').map((line, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                            onClick={() => handleLineClick(index + 1)}
                            className={`
                              block cursor-pointer px-2 py-1 rounded transition-colors
                              ${selectedLine === index + 1 ? 'bg-blue-500/20 border-l-2 border-blue-400' : ''}
                              ${lineExplanations[index + 1] ? 'hover:bg-blue-500/10' : 'cursor-default opacity-60'}
                            `}
                          >
                            <span className="text-slate-500 mr-3 select-none">{(index + 1).toString().padStart(2, ' ')}</span>
                            <span>{line}</span>
                            {lineExplanations[index + 1] && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="ml-2 text-blue-400"
                              >
                                💡
                              </motion.span>
                            )}
                          </motion.div>
                        ))}
                      </code>
                    </pre>

                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-300 text-xs">
                        Interactive Mode
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular Code Input
                  <textarea
                    value={generatedCode}
                    placeholder="Your generated strategy code will appear here..."
                    className="w-full h-80 p-4 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500 font-mono text-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                )}

                {!explanation && (
                  <div className="absolute bottom-3 right-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExplain}
                      disabled={!generatedCode.trim() || isExplaining}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 hover:border-blue-500/60 rounded-lg text-blue-300 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExplaining ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          {friendlyMode ? "Teaching..." : "Explaining..."}
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4" />
                          {friendlyMode ? "Teach Me!" : "Explain Strategy"}
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Learning Progress */}
            {isExplaining && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/30"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
                  />
                  <div>
                    <h5 className="text-lg font-semibold text-blue-300 mb-1">
                      {friendlyMode ? "Analyzing Your Strategy... 🔍✨" : "Analyzing Your Strategy..."}
                    </h5>
                    <p className="text-blue-200 text-sm">
                      {friendlyMode
                        ? "Breaking down the code • Understanding the magic • Preparing fun explanations! 📚"
                        : "Breaking down the code • Understanding the logic • Preparing clear explanations"
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Navigation and Content Section */}
        {explanation && (
          <div className="space-y-4">
            {/* Compact Section Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-slate-800/30 rounded-lg border border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-white">Learning Sections</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Progress:</span>
                  <span className="text-xs text-blue-300">
                    {Object.keys(studyProgress).length}/{sections.length} sections visited
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {sections.map((section, index) => {
                  const IconComponent = section.icon;
                  const isActive = selectedSection === section.id;
                  const isVisited = studyProgress[section.id] > 0;
                  const sectionData = explanation[section.id];

                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => setSelectedSection(section.id)}
                      className={`
                        relative p-3 rounded-lg border transition-all text-left
                        ${isActive
                          ? getSectionColor(section.id)
                          : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.title}</span>
                        {sectionData?.emoji && friendlyMode && (
                          <span className="text-xs">{sectionData.emoji}</span>
                        )}
                      </div>

                      {sectionData?.difficulty && (
                        <div className="text-xs opacity-75">
                          {sectionData.difficulty}
                        </div>
                      )}

                      {isVisited && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Compact Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-4 bg-slate-800/30 rounded-lg border border-slate-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-lg font-semibold text-white">
                  {friendlyMode ? "Learning Tools 🛠️" : "Quick Actions"}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={exportExplanation}
                  className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg border border-emerald-500/30 hover:border-emerald-500/50 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-300">
                      {friendlyMode ? "Save My Notes 📄" : "Export Explanation"}
                    </span>
                  </div>
                </button>

                <button className="p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all text-left">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">
                      {friendlyMode ? "Share with Friends 👥" : "Share with Team"}
                    </span>
                  </div>
                </button>

                <button className="p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all text-left">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">
                      {friendlyMode ? "Study Guide 📖" : "Create Study Guide"}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setLayoutMode(layoutMode === 'dual' ? 'sections' : 'dual')}
                  className="p-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30 hover:border-amber-500/50 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    {layoutMode === 'dual' ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-amber-400" />}
                    <span className="text-sm font-medium text-amber-300">
                      {layoutMode === 'dual' ? 'Focus Mode' : 'Dual Panel'}
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Explanation Content - Compact */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBack}
              disabled={getCurrentSectionIndex() === 0}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 rounded-lg text-slate-300 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={getCurrentSectionIndex() === sections.length - 1}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 rounded-lg text-slate-300 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {React.createElement(getSectionIcon(selectedSection), {
                className: "w-6 h-6 text-blue-400"
              })}
              <h4 className="text-2xl font-bold text-white">
                {explanation[selectedSection]?.emoji && friendlyMode && (
                  <span className="mr-2">{explanation[selectedSection].emoji}</span>
                )}
                {explanation[selectedSection]?.title}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleBookmark(explanation[selectedSection]?.content, selectedSection)}
                className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-lg text-yellow-300 text-sm transition-all"
              >
                <BookmarkPlus className="w-4 h-4" />
                Bookmark
              </motion.button>

              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">
                  {Object.keys(explanation).indexOf(selectedSection) + 1} of {Object.keys(explanation).length}
                </span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 bg-slate-800/20 rounded-lg border border-slate-700"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Section Content */}
                <div
                  className="text-slate-300 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{
                    __html: highlightJargon(explanation[selectedSection]?.content || '')
                  }}
                />

                {/* Key Points */}
                {explanation[selectedSection]?.keyPoints && (
                  <div className="space-y-3">
                    <h5 className="text-lg font-semibold text-white">
                      {friendlyMode ? "Key Points to Remember: 🔑" : "Key Points:"}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {explanation[selectedSection].keyPoints.map((point, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30"
                        >
                          <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-sm text-slate-300">{point}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Components */}
                {explanation[selectedSection]?.components && (
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-white">
                      {friendlyMode ? "The Building Blocks: 🧱" : "Components:"}
                    </h5>
                    {explanation[selectedSection].components.map((component, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 bg-slate-700/30 rounded-xl border border-slate-600"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Target className="w-5 h-5 text-blue-400" />
                          <h6 className="text-lg font-semibold text-white">{component.name}</h6>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p><strong className="text-blue-300">Purpose:</strong> {component.purpose}</p>
                          <p><strong className="text-blue-300">Settings:</strong> {component.settings}</p>
                          <p><strong className="text-emerald-300">Interpretation:</strong> {component.interpretation}</p>
                          {component.analogy && friendlyMode && (
                            <p><strong className="text-yellow-300">Think of it like:</strong> {component.analogy}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Steps */}
                {explanation[selectedSection]?.steps && (
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-white">
                      {friendlyMode ? "Step-by-Step Process: 👣" : "Trading Steps:"}
                    </h5>
                    {explanation[selectedSection].steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full border border-blue-500/40 flex-shrink-0">
                          <span className="text-sm font-bold text-blue-300">{step.step}</span>
                        </div>

                        <div>
                          <h6 className="text-lg font-semibold text-white mb-2">{step.title}</h6>
                          <p className="text-slate-300 leading-relaxed">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Features */}
                {explanation[selectedSection]?.features && (
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-white">
                      {friendlyMode ? "Safety Features Report Card: 📊" : "Risk Features:"}
                    </h5>
                    {explanation[selectedSection].features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-700/30 rounded-xl border border-slate-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="text-lg font-semibold text-white">{feature.feature}</h6>
                          <div className="flex items-center gap-2">
                            {feature.grade && friendlyMode && (
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${feature.grade.startsWith('A') ? 'bg-emerald-500/20 text-emerald-400' :
                                feature.grade.startsWith('B') ? 'bg-blue-500/20 text-blue-400' :
                                  feature.grade.startsWith('C') ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                Grade: {feature.grade}
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${feature.assessment.includes('Excellent') ? 'bg-emerald-500/20 text-emerald-400' :
                              feature.assessment.includes('Good') ? 'bg-blue-500/20 text-blue-400' :
                                'bg-amber-500/20 text-amber-400'
                              }`}>
                              {feature.assessment.split(' - ')[0]}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Points */}
                {explanation[selectedSection]?.points && (
                  <div className="space-y-3">
                    <h5 className="text-lg font-semibold text-white">
                      {friendlyMode ? "What Makes This Strategy Awesome: ⭐" : "Strengths:"}
                    </h5>
                    {explanation[selectedSection].points.map((point, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{point}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {explanation[selectedSection]?.suggestions && (
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-white">
                      {friendlyMode ? "Ideas to Make It Even Better: 💡" : "Improvement Suggestions:"}
                    </h5>
                    {explanation[selectedSection].suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 bg-slate-700/30 rounded-xl border border-slate-600"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Lightbulb className="w-5 h-5 text-yellow-400" />
                            <h6 className="text-lg font-semibold text-white">{suggestion.area}</h6>
                          </div>
                          {suggestion.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${suggestion.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                              suggestion.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                              {suggestion.priority} Priority
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400 mb-1">Current:</p>
                            <p className="text-slate-300">{suggestion.current}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 mb-1">Improvement:</p>
                            <p className="text-blue-300">{suggestion.improvement}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 mb-1">Benefit:</p>
                            <p className="text-emerald-300">{suggestion.benefit}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Teacher's Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 bg-gradient-to-r from-blue-500/10 to-blue-500/10 rounded-2xl border border-blue-500/30"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-blue-500/20 rounded-xl flex-shrink-0"
              >
                <Brain className="w-6 h-6 text-blue-400" />
              </motion.div>

              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  {friendlyMode ? "Professor's Teaching Moment 🎓" : "Teacher's Insight"}
                  <Heart className="w-5 h-5 text-pink-400" />
                </h4>

                <div className="space-y-3 text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-blue-300">
                      {friendlyMode ? "Cool Learning Point:" : "Learning Point:"}
                    </strong> This RSI mean reversion strategy
                    is an excellent example of contrarian trading - going against the current momentum to profit
                    from price corrections.
                    {friendlyMode && " Pretty smart, right? 🤓"}
                  </p>

                  <p>
                    <strong className="text-blue-300">
                      {friendlyMode ? "The Secret Sauce:" : "Why it works:"}
                    </strong> Markets often overreact in both directions.
                    When RSI shows extreme readings (below 30 or above 70), it suggests the price has moved too far
                    too fast and is likely to correct.
                    {friendlyMode && " It's like a rubber band snapping back! 🎯"}
                  </p>

                  <p>
                    <strong className="text-emerald-300">
                      {friendlyMode ? "The Big Takeaway:" : "Key takeaway:"}
                    </strong> The trend filter (using the 20-period SMA)
                    is crucial here. It helps ensure you're buying dips in uptrends and selling rallies in downtrends,
                    rather than fighting the overall market direction.
                    {friendlyMode && " Work with the market, not against it! 📈"}
                  </p>

                  <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-300">
                        {friendlyMode ? "Study Tip for Success: 📚" : "Study Tip:"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">
                      Try backtesting this strategy on different timeframes and markets to see how
                      the RSI parameters perform. Understanding <em>why</em> certain settings work
                      better than others will make you a more effective trader.
                      {friendlyMode && " Knowledge is power! 💪"}
                    </p>
                  </div>

                  {/* Personal Study Progress */}
                  {Object.keys(studyProgress).length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-300">
                          {friendlyMode ? "Your Learning Journey: 🎉" : "Your Progress:"}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
                        You've explored {Object.keys(studyProgress).length} of {sections.length} sections
                        {bookmarks.size > 0 && ` and bookmarked ${bookmarks.size} key insights`}!
                        {friendlyMode && " Keep up the great work! 🌟"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Navigation */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              onClick={handleBack}
              disabled={getCurrentSectionIndex() === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              {friendlyMode ? "Previous Lesson" : "Previous Section"}
            </motion.button>

            <div className="flex items-center gap-2">
              {Object.keys(explanation).map((key, index) => (
                <motion.button
                  key={key}
                  onClick={() => setSelectedSection(key)}
                  whileHover={{ scale: 1.2 }}
                  className={`w-3 h-3 rounded-full transition-all ${selectedSection === key ? 'bg-blue-400' : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              onClick={handleNext}
              disabled={getCurrentSectionIndex() === sections.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {friendlyMode ? "Next Lesson" : "Next Section"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Line Explanation Modal */}
      <LineExplanationModal />



      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && <OnboardingModal />}
      </AnimatePresence>
    </div>
  );
};

export default StrategyExplainer;
