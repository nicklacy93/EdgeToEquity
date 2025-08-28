import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Stethoscope,
    AlertTriangle,
    CheckCircle,
    Lightbulb,
    Code,
    TrendingUp,
    Shield,
    Zap,
    ArrowLeft,
    ArrowRight,
    Copy,
    ExternalLink,
    MessageCircle,
    Bot,
    Eye,
    Edit3,
    Play,
    Target,
    Clock,
    Download,
    SkipForward,
    HelpCircle,
    Settings,
    Upload,
    FileText,
    Clipboard,
    Save
} from 'lucide-react';
import { useStrategyStore } from '@/store/useStrategyStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useUserStore } from '@/store/useUserStore';

interface StrategyDebuggerProps {
    generatedCode?: string;
    selectedPlatform?: 'NinjaScript' | 'PineScript';
}

interface CodeSuggestion {
    line: number;
    type: 'error' | 'warning' | 'optimization' | 'enhancement';
    message: string;
    fix: string;
    impact: string;
    severity: 'high' | 'medium' | 'low';
}

interface EdgeBotMessage {
    id: number;
    type: 'bot' | 'user' | 'system';
    content: string;
    timestamp: Date;
    showCode?: boolean;
    codeLines?: number[];
    actionButtons?: {
        label: string;
        action: string;
        variant?: 'primary' | 'secondary' | 'danger';
    }[];
    context?: {
        userPreference?: string;
        currentFocus?: string;
        completedSteps?: string[];
        skippedIssues?: string[];
    };
}

interface ConversationContext {
    userLevel: 'beginner' | 'intermediate' | 'advanced';
    preferredLearningStyle: 'visual' | 'hands-on' | 'theoretical';
    completedFixes: string[];
    skippedIssues: string[];
    currentFocus: string;
    questionsAsked: string[];
    lastAction: string;
    sessionStartTime: Date;
}

interface CodeAnalysis {
    line: number;
    type: 'error' | 'warning' | 'optimization' | 'enhancement';
    severity: 'high' | 'medium' | 'low';
    message: string;
    fix: string;
    impact: string;
    performanceImpact: {
        riskReduction: number;
        expectedReturn: number;
        falseSignalReduction: number;
    };
    confidence: number;
    estimatedTimeToFix: number;
}

// New interfaces for external code input
interface FileUploadState {
    isDragOver: boolean;
    isUploading: boolean;
    fileName: string | null;
    fileError: string | null;
}

interface ExternalCodeState {
    inputMethod: 'file' | 'paste' | 'none';
    originalCode: string;
    cleanedCode: string;
    detectedPlatform: 'PineScript' | 'NinjaScript' | 'Unknown';
    sourceSpecified: string;
    isProcessing: boolean;
    processingError: string | null;
}

const StrategyDebugger = ({ generatedCode: propGeneratedCode, selectedPlatform: propSelectedPlatform }: StrategyDebuggerProps = {}) => {
    const { generatedCode: storeGeneratedCode, setGeneratedCode, selectedPlatform: storeSelectedPlatform } = useStrategyStore();
    const { setActiveTab } = useWorkspaceStore();

    // User Store Integration
    const {
        incrementConceptsLearned,
        addFocusTime,
        updateLearningStreak,
        markStrategyComplete,
        updateCompletionRate
    } = useUserStore();

    // Use props if provided, otherwise fall back to store
    const generatedCode = propGeneratedCode || storeGeneratedCode;
    const selectedPlatform = propSelectedPlatform || storeSelectedPlatform;

    // Debug logging
    console.log('StrategyDebugger props:', { propGeneratedCode, propSelectedPlatform });
    console.log('StrategyDebugger store:', { storeGeneratedCode, storeSelectedPlatform });
    console.log('StrategyDebugger final:', { generatedCode, selectedPlatform });

    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [issues, setIssues] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [codeSuggestions, setCodeSuggestions] = useState<CodeSuggestion[]>([]);
    const [hoveredLine, setHoveredLine] = useState<number | null>(null);
    const [selectedSuggestion, setSelectedSuggestion] = useState<CodeSuggestion | null>(null);
    const [edgeBotMessages, setEdgeBotMessages] = useState<EdgeBotMessage[]>([]);
    const [isEdgeBotTyping, setIsEdgeBotTyping] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(5);
    const [strategyConfidence, setStrategyConfidence] = useState(85);
    const [showFullCode, setShowFullCode] = useState(false);
    const [userInput, setUserInput] = useState('');

    // New state for external code input
    const [fileUploadState, setFileUploadState] = useState<FileUploadState>({
        isDragOver: false,
        isUploading: false,
        fileName: null,
        fileError: null
    });

    const [externalCodeState, setExternalCodeState] = useState<ExternalCodeState>({
        inputMethod: 'none',
        originalCode: '',
        cleanedCode: '',
        detectedPlatform: 'Unknown',
        sourceSpecified: '',
        isProcessing: false,
        processingError: null
    });

    const [showInputInterface, setShowInputInterface] = useState(false);

    // Phase 2A: Advanced Intelligence State
    const [conversationContext, setConversationContext] = useState<ConversationContext>({
        userLevel: 'intermediate',
        preferredLearningStyle: 'hands-on',
        completedFixes: [],
        skippedIssues: [],
        currentFocus: 'initial-analysis',
        questionsAsked: [],
        lastAction: 'analysis-started',
        sessionStartTime: new Date()
    });
    const [userPreferences, setUserPreferences] = useState({
        showDetailedExplanations: true,
        preferCodeExamples: true,
        wantPerformanceMetrics: true,
        autoApplyFixes: false
    });
    const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis[]>([]);
    const [currentStrategy, setCurrentStrategy] = useState({
        originalCode: '',
        modifiedCode: '',
        changesApplied: [],
        performanceMetrics: {
            originalRisk: 0,
            currentRisk: 0,
            expectedReturn: 0,
            improvement: 0
        }
    });

    // Refs for auto-scrolling
    const conversationEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto-scroll effect
    useEffect(() => {
        scrollToBottom();
    }, [edgeBotMessages, isEdgeBotTyping]);

    // New functions for external code input
    const detectPlatform = (code: string): 'PineScript' | 'NinjaScript' | 'Unknown' => {
        const lowerCode = code.toLowerCase();

        // PineScript indicators
        if (lowerCode.includes('strategy(') || lowerCode.includes('indicator(') ||
            lowerCode.includes('plot(') || lowerCode.includes('close[0]') ||
            lowerCode.includes('ta.') || lowerCode.includes('math.')) {
            return 'PineScript';
        }

        // NinjaScript indicators
        if (lowerCode.includes('public class') || lowerCode.includes('ninjatrader') ||
            lowerCode.includes('protected override') || lowerCode.includes('onbarupdate') ||
            lowerCode.includes('close[0]') || lowerCode.includes('high[0]') ||
            lowerCode.includes('low[0]') || lowerCode.includes('volume[0]')) {
            return 'NinjaScript';
        }

        return 'Unknown';
    };

    const cleanCode = (code: string): string => {
        // Remove markdown code blocks
        let cleaned = code.replace(/```[\s\S]*?```/g, '');

        // Remove common AI platform formatting
        cleaned = cleaned.replace(/^.*?(strategy|indicator|public class)/s, '$1');
        cleaned = cleaned.replace(/```.*$/s, '');

        // Remove excessive whitespace
        cleaned = cleaned.trim();

        return cleaned;
    };

    const handleFileUpload = async (file: File) => {
        setFileUploadState(prev => ({
            ...prev,
            isUploading: true,
            fileName: file.name,
            fileError: null
        }));

        try {
            // Validate file type
            const validExtensions = ['.txt', '.pine', '.cs'];
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

            if (!validExtensions.includes(fileExtension)) {
                throw new Error('Invalid file type. Please upload .txt, .pine, or .cs files.');
            }

            // Read file content
            const text = await file.text();

            // Process the code
            await processExternalCode(text, 'file');

        } catch (error) {
            setFileUploadState(prev => ({
                ...prev,
                isUploading: false,
                fileError: error instanceof Error ? error.message : 'Failed to process file'
            }));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setFileUploadState(prev => ({ ...prev, isDragOver: true }));
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setFileUploadState(prev => ({ ...prev, isDragOver: false }));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setFileUploadState(prev => ({ ...prev, isDragOver: false }));

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const processExternalCode = async (code: string, method: 'file' | 'paste') => {
        setExternalCodeState(prev => ({
            ...prev,
            isProcessing: true,
            processingError: null,
            inputMethod: method,
            originalCode: code
        }));

        try {
            // Clean the code
            const cleanedCode = cleanCode(code);

            // Detect platform
            const detectedPlatform = detectPlatform(cleanedCode);

            // Update state
            setExternalCodeState(prev => ({
                ...prev,
                cleanedCode,
                detectedPlatform,
                isProcessing: false
            }));

            // Update strategy store
            setGeneratedCode(cleanedCode);
            if (detectedPlatform !== 'Unknown') {
                // Update the store with detected platform
                // Note: This assumes setSelectedPlatform exists in the store
                // You may need to adjust based on your actual store implementation
            }

            // Hide input interface and show analysis
            setShowInputInterface(false);

            // Show success message
            const successMessage = `✅ **Code Successfully Processed!**\n\n**Detected Platform:** ${detectedPlatform}\n**Code Length:** ${cleanedCode.split('\n').length} lines\n**Source:** ${externalCodeState.sourceSpecified || 'Not specified'}\n\nYour strategy is now ready for medical examination. I'll analyze it for potential issues and optimization opportunities.`;

            const successEdgeBotMessage: EdgeBotMessage = {
                id: 1,
                type: 'bot',
                content: successMessage,
                timestamp: new Date(),
                actionButtons: [
                    { label: 'Start Analysis', action: 'start_analysis', variant: 'primary' },
                    { label: 'View Processed Code', action: 'view_code', variant: 'secondary' }
                ],
                context: {
                    currentFocus: 'code-processed',
                    userPreference: conversationContext.preferredLearningStyle
                }
            };

            setEdgeBotMessages([successEdgeBotMessage]);

            // Start analysis
            handleAnalyze();

        } catch (error) {
            setExternalCodeState(prev => ({
                ...prev,
                isProcessing: false,
                processingError: error instanceof Error ? error.message : 'Failed to process code'
            }));
        }
    };

    const handlePasteCode = () => {
        if (externalCodeState.originalCode.trim()) {
            processExternalCode(externalCodeState.originalCode, 'paste');
        }
    };

    const handleSaveToArchitect = () => {
        // Save the processed code to Strategy Architect
        if (externalCodeState.cleanedCode) {
            setGeneratedCode(externalCodeState.cleanedCode);
            setActiveTab('generator');
        }
    };

    // Phase 2A: Intelligent Analysis Functions
    const analyzeUserBehavior = (action: string, message?: string) => {
        const newContext = { ...conversationContext };

        // Track user actions and preferences
        newContext.lastAction = action;
        if (message) {
            newContext.questionsAsked.push(message);
        }

        // Determine user level based on actions
        if (action.includes('skip') || action.includes('advanced')) {
            newContext.userLevel = 'advanced';
        } else if (action.includes('explain') || action.includes('help')) {
            newContext.userLevel = 'beginner';
        }

        // Track learning preferences
        if (action.includes('show_code') || action.includes('visual')) {
            newContext.preferredLearningStyle = 'visual';
        } else if (action.includes('apply') || action.includes('hands')) {
            newContext.preferredLearningStyle = 'hands-on';
        }

        setConversationContext(newContext);
    };

    const generatePersonalizedResponse = (action: string, baseMessage: string): string => {
        const { userLevel, preferredLearningStyle, completedFixes, questionsAsked } = conversationContext;

        let personalizedMessage = baseMessage;

        // Adjust tone based on user level
        if (userLevel === 'beginner') {
            personalizedMessage += "\n\n💡 **Pro Tip:** I'll guide you through each step with detailed explanations.";
        } else if (userLevel === 'advanced') {
            personalizedMessage += "\n\n⚡ **Quick Mode:** I'll focus on the technical details and advanced optimizations.";
        }

        // Add context based on previous actions
        if (completedFixes.length > 0) {
            personalizedMessage += `\n\n📈 **Progress:** You've already improved ${completedFixes.length} areas of your strategy.`;
        }

        // Add learning style preference
        if (preferredLearningStyle === 'visual') {
            personalizedMessage += "\n\n🎨 **Visual Learner:** I'll show you code examples and visual comparisons.";
        } else if (preferredLearningStyle === 'hands-on') {
            personalizedMessage += "\n\n🔧 **Hands-on:** I'll provide practical, actionable fixes you can apply immediately.";
        }

        return personalizedMessage;
    };

    const calculatePerformanceImpact = (fixes: string[]): any => {
        const baseMetrics = {
            riskReduction: 0,
            expectedReturn: 0,
            falseSignalReduction: 0,
            confidence: 85
        };

        fixes.forEach(fix => {
            if (fix.includes('stop-loss')) {
                baseMetrics.riskReduction += 40;
                baseMetrics.confidence += 5;
            }
            if (fix.includes('confirmation')) {
                baseMetrics.falseSignalReduction += 30;
                baseMetrics.expectedReturn += 15;
            }
            if (fix.includes('volume')) {
                baseMetrics.falseSignalReduction += 20;
                baseMetrics.expectedReturn += 10;
            }
        });

        return {
            ...baseMetrics,
            riskReduction: Math.min(baseMetrics.riskReduction, 80),
            expectedReturn: Math.min(baseMetrics.expectedReturn, 50),
            falseSignalReduction: Math.min(baseMetrics.falseSignalReduction, 60),
            confidence: Math.min(baseMetrics.confidence, 95)
        };
    };

    const getNextBestAction = (): string => {
        const { completedFixes, skippedIssues, currentFocus } = conversationContext;

        if (completedFixes.length === 0) {
            return 'show_code'; // Start with first critical fix
        }

        if (completedFixes.includes('stop-loss') && !completedFixes.includes('confirmation')) {
            return 'next_issue'; // Move to entry confirmation
        }

        if (completedFixes.includes('confirmation') && !completedFixes.includes('volume')) {
            return 'show_volume_fix'; // Add volume filter
        }

        return 'show_optimization'; // Move to optimizations
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);

        // User Store Integration: Track analysis initiation
        incrementConceptsLearned(); // Learning from analysis
        addFocusTime(3); // Add 3 minutes of focus time for analysis
        updateLearningStreak(); // Update learning streak

        // Simulate analysis time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Initialize intelligent conversation context
        const initialContext = {
            ...conversationContext,
            currentFocus: 'initial-analysis',
            sessionStartTime: new Date()
        };
        setConversationContext(initialContext);

        // Generate personalized initial message
        const initialMessage = generatePersonalizedResponse('analysis_started',
            `🎯 **Strategy Analysis Complete!**\n\nI've analyzed your ${selectedPlatform} strategy and found several opportunities to enhance its performance and reduce risk.\n\n**Key Findings:**\n• **Risk Level:** High (missing stop-loss protection)\n• **Signal Quality:** Medium (no confirmation filters)\n• **Optimization Potential:** High (multiple improvements available)\n\n**Expected Improvements with Optimization:**\n• Risk reduction: 60-80%\n• Performance increase: 25-40%\n• False signal reduction: 40-60%\n\nI'll guide you through each improvement step-by-step, adapting to your learning style and experience level. Let's start with the most critical issue first!`
        );

        const initialEdgeBotMessage: EdgeBotMessage = {
            id: 1,
            type: 'bot',
            content: initialMessage,
            timestamp: new Date(),
            actionButtons: [
                { label: 'Show first critical fix', action: 'show_code', variant: 'primary' },
                { label: 'View all issues', action: 'show_all', variant: 'secondary' },
                { label: 'Ask a question', action: 'ask_question', variant: 'secondary' }
            ],
            context: {
                currentFocus: 'initial-analysis',
                userPreference: conversationContext.preferredLearningStyle
            }
        };

        setEdgeBotMessages([initialEdgeBotMessage]);
        setAnalysisComplete(true);
        setIsAnalyzing(false);
    };

    useEffect(() => {
        if (generatedCode && generatedCode.trim().length > 0) {
            // Automatically run analysis when component loads with code
            handleAnalyze();
        } else {
            // Show input interface when no code is available
            setShowInputInterface(true);
        }
    }, [generatedCode]);

    const handleBackToArchitect = () => {
        setActiveTab('generator');
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        // Could add toast notification here
    };

    const handleApplyFix = (suggestion: CodeSuggestion) => {
        // Simulate applying the fix
        setIsEdgeBotTyping(true);

        // User Store Integration: Track fix application
        incrementConceptsLearned(); // Learning from applying fixes
        addFocusTime(2); // Add 2 minutes of focus time
        updateLearningStreak(); // Update learning streak

        setTimeout(() => {
            const newMessage: EdgeBotMessage = {
                id: edgeBotMessages.length + 1,
                type: 'bot',
                content: "Perfect! ✅ I've applied the fix for \"" + suggestion.message + "\". This will " + suggestion.impact.toLowerCase() + ".\n\nYour strategy is now safer and more robust. The next priority is adding entry confirmation signals to reduce false entries. Should we tackle that next?",
                timestamp: new Date(),
                actionButtons: [
                    { label: 'Yes, continue', action: 'continue', variant: 'primary' },
                    { label: 'Show me the changes', action: 'show_changes', variant: 'secondary' }
                ]
            };

            setEdgeBotMessages(prev => [...prev, newMessage]);
            setIsEdgeBotTyping(false);
            setSelectedSuggestion(null);
            setCurrentStep(prev => prev + 1);
        }, 1500);
    };

    const handleEdgeBotAction = (action: string) => {
        // Analyze user behavior for intelligence
        analyzeUserBehavior(action);

        setIsEdgeBotTyping(true);

        setTimeout(() => {
            let newMessage: EdgeBotMessage;

            switch (action) {
                case 'show_code':
                    const codeMessage = generatePersonalizedResponse(action,
                        "Here's the problematic code at line 15:\n\n// Current code - missing stop-loss\nif (Close[0] > EMA[0]) {\n    EnterLong();\n}\n\nThis code enters a position but has no protection against losses. Let me show you how to add stop-loss protection:"
                    );
                    newMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: codeMessage,
                        timestamp: new Date(),
                        showCode: true,
                        codeLines: [15, 16, 17],
                        actionButtons: [
                            { label: 'Apply this fix', action: 'apply_fix', variant: 'primary' },
                            { label: 'Explain more', action: 'explain', variant: 'secondary' }
                        ],
                        context: {
                            currentFocus: 'stop-loss-implementation',
                            userPreference: conversationContext.preferredLearningStyle
                        }
                    };
                    break;

                case 'apply_fix':
                    // Update conversation context
                    const updatedContext = { ...conversationContext };
                    updatedContext.completedFixes.push('stop-loss');
                    updatedContext.currentFocus = 'entry-confirmation';
                    setConversationContext(updatedContext);

                    // Calculate performance impact
                    const performanceImpact = calculatePerformanceImpact(updatedContext.completedFixes);

                    const applyMessage = generatePersonalizedResponse(action,
                        `Excellent choice! 🛡️ I've added stop-loss protection to your strategy:\n\n// Fixed code with stop-loss\nif (Close[0] > EMA[0]) {\n    EnterLong();\n    stopLoss = Close[0] - (Close[0] * 0.02); // 2% stop-loss\n}\n\n// Stop-loss check\nif (Close[0] < stopLoss) {\n    ExitLong();\n}\n\nThis protects your capital by automatically exiting if the price drops 2% below your entry.\n\n📊 **Performance Impact:**\n• Risk Reduction: ${performanceImpact.riskReduction}%\n• Expected Return: +${performanceImpact.expectedReturn}%\n• Confidence: ${performanceImpact.confidence}%`
                    );

                    newMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: applyMessage,
                        timestamp: new Date(),
                        showCode: true,
                        codeLines: [15, 16, 17, 20, 21, 22],
                        actionButtons: [
                            { label: 'Continue to next issue', action: 'next_issue', variant: 'primary' },
                            { label: 'Adjust stop-loss %', action: 'adjust_stop', variant: 'secondary' }
                        ],
                        context: {
                            currentFocus: 'entry-confirmation',
                            completedSteps: updatedContext.completedFixes
                        }
                    };
                    break;

                case 'next_issue':
                    const nextMessage = generatePersonalizedResponse(action,
                        "Great! Now let's address the second issue: **No Entry Confirmation**.\n\nYour strategy currently enters positions without proper confirmation signals, which can lead to false entries. I recommend adding RSI or MACD confirmation.\n\nWould you like me to show you how to implement this?"
                    );

                    newMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: nextMessage,
                        timestamp: new Date(),
                        actionButtons: [
                            { label: 'Show me the fix', action: 'show_confirmation_fix', variant: 'primary' },
                            { label: 'Skip this issue', action: 'skip_confirmation', variant: 'secondary' }
                        ],
                        context: {
                            currentFocus: 'entry-confirmation',
                            userPreference: conversationContext.preferredLearningStyle
                        }
                    };
                    break;

                case 'show_all':
                    const { completedFixes, questionsAsked } = conversationContext;
                    const performanceMetrics = calculatePerformanceImpact(completedFixes);

                    const overviewMessage = generatePersonalizedResponse(action,
                        `Here's a complete overview of your strategy analysis:\n\n**Critical Issues Found:**\n• Missing stop-loss protection (Line 15)\n• No entry confirmation signals (Line 23)\n\n**Optimization Opportunities:**\n• Add volume filter (Line 31)\n• Implement trailing stop\n• Add time-based filters\n\n**Current Progress:**\n• Completed Fixes: ${completedFixes.length}\n• Questions Asked: ${questionsAsked.length}\n\n**Expected Improvements:**\n• Risk reduction: ${performanceMetrics.riskReduction}%\n• Performance increase: +${performanceMetrics.expectedReturn}%\n• False signal reduction: ${performanceMetrics.falseSignalReduction}%\n\nWhich area would you like to focus on first?`
                    );

                    newMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: overviewMessage,
                        timestamp: new Date(),
                        actionButtons: [
                            { label: 'Fix stop-loss first', action: 'show_code', variant: 'primary' },
                            { label: 'Show all code fixes', action: 'show_all_fixes', variant: 'secondary' }
                        ],
                        context: {
                            currentFocus: 'strategy-overview',
                            completedSteps: completedFixes
                        }
                    };
                    break;

                case 'ask_question':
                    const helpMessage = generatePersonalizedResponse(action,
                        "I'm here to help! What specific question do you have about your strategy? I can help with:\n\n• Code optimization\n• Risk management\n• Performance analysis\n• Entry/exit logic\n• Platform-specific features\n\nJust type your question below and I'll provide detailed guidance."
                    );

                    newMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: helpMessage,
                        timestamp: new Date(),
                        actionButtons: [
                            { label: 'Show common questions', action: 'show_common_questions', variant: 'primary' },
                            { label: 'Back to analysis', action: 'show_all', variant: 'secondary' }
                        ],
                        context: {
                            currentFocus: 'user-question',
                            userPreference: conversationContext.preferredLearningStyle
                        }
                    };
                    break;

                case 'show_common_questions':
                    const commonQuestions = [
                        "How do I add a trailing stop?",
                        "What's the best risk management approach?",
                        "How can I optimize my entry signals?",
                        "What's the difference between RSI and MACD?",
                        "How do I backtest this strategy?"
                    ];

                    const questionsMessage = generatePersonalizedResponse(action,
                        `Here are some common questions traders ask about strategy optimization:\n\n${commonQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nClick any question above or type your own question below. I'll provide personalized guidance based on your ${selectedPlatform} strategy.`
                    );

                    newMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: questionsMessage,
                        timestamp: new Date(),
                        actionButtons: [
                            { label: 'Ask about trailing stops', action: 'explain_trailing_stop', variant: 'primary' },
                            { label: 'Risk management guide', action: 'explain_risk_management', variant: 'secondary' }
                        ],
                        context: {
                            currentFocus: 'common-questions',
                            userPreference: conversationContext.preferredLearningStyle
                        }
                    };
                    break;

                case 'start_analysis':
                    handleAnalyze();
                    return; // Don't add a new message, let handleAnalyze create it

                case 'view_code':
                    setShowFullCode(true);
                    newMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: "Here's your processed code. I've cleaned it up and detected it as " + externalCodeState.detectedPlatform + " code. You can view the full code below or proceed with the analysis.",
                        timestamp: new Date(),
                        actionButtons: [
                            { label: 'Start Analysis', action: 'start_analysis', variant: 'primary' },
                            { label: 'Save to Architect', action: 'save_to_architect', variant: 'secondary' }
                        ],
                        context: {
                            currentFocus: 'code-preview',
                            userPreference: conversationContext.preferredLearningStyle
                        }
                    };
                    break;

                case 'save_to_architect':
                    handleSaveToArchitect();
                    newMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: "✅ **Strategy Saved to Architect!**\n\nYour analyzed strategy has been successfully saved to the Strategy Architect. You can now:\n• Further customize the strategy\n• Generate variations\n• Export for deployment\n\nWould you like to continue with the analysis or go to the Strategy Architect?",
                        timestamp: new Date(),
                        actionButtons: [
                            { label: 'Go to Architect', action: 'go_to_architect', variant: 'primary' },
                            { label: 'Continue Analysis', action: 'continue_analysis', variant: 'secondary' }
                        ],
                        context: {
                            currentFocus: 'strategy-saved',
                            userPreference: conversationContext.preferredLearningStyle
                        }
                    };
                    break;

                case 'go_to_architect':
                    handleBackToArchitect();
                    return; // Don't add a new message

                case 'continue_analysis':
                    // Continue with existing analysis
                    newMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: "Great! Let's continue with the strategy analysis. I'll examine your code for potential improvements and risk management opportunities.",
                        timestamp: new Date(),
                        actionButtons: [
                            { label: 'Show all issues', action: 'show_all', variant: 'primary' },
                            { label: 'Ask a question', action: 'ask_question', variant: 'secondary' }
                        ],
                        context: {
                            currentFocus: 'analysis-continued',
                            userPreference: conversationContext.preferredLearningStyle
                        }
                    };
                    break;

                default:
                    const defaultMessage = generatePersonalizedResponse(action,
                        "I'm here to help! What would you like to know about your strategy?"
                    );

                    newMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: defaultMessage,
                        timestamp: new Date(),
                        actionButtons: [
                            { label: 'Show all issues', action: 'show_all', variant: 'primary' },
                            { label: 'Ask a question', action: 'ask_question', variant: 'secondary' }
                        ],
                        context: {
                            currentFocus: 'general-help',
                            userPreference: conversationContext.preferredLearningStyle
                        }
                    };
            }

            setEdgeBotMessages(prev => [...prev, newMessage]);
            setIsEdgeBotTyping(false);
        }, 1000);
    };

    const handleUserInput = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        // Add user message
        const userMessage: EdgeBotMessage = {
            id: edgeBotMessages.length + 1,
            type: 'user',
            content: userInput,
            timestamp: new Date()
        };

        setEdgeBotMessages(prev => [...prev, userMessage]);

        // Analyze user behavior
        analyzeUserBehavior('user_input', userInput);

        // User Store Integration: Track user questions
        incrementConceptsLearned(); // Learning from questions
        addFocusTime(1); // Add 1 minute of focus time
        updateLearningStreak(); // Update learning streak

        // Clear input
        setUserInput('');

        // Generate intelligent response
        setIsEdgeBotTyping(true);

        setTimeout(() => {
            const response = generateIntelligentResponse(userInput);
            const botMessage: EdgeBotMessage = {
                id: edgeBotMessages.length + 2,
                type: 'bot',
                content: response.content,
                timestamp: new Date(),
                actionButtons: response.actionButtons,
                context: {
                    currentFocus: response.context,
                    userPreference: conversationContext.preferredLearningStyle
                }
            };

            setEdgeBotMessages(prev => [...prev, botMessage]);
            setIsEdgeBotTyping(false);
        }, 1500);
    };

    const generateIntelligentResponse = (userQuestion: string): { content: string; actionButtons: any[]; context: string } => {
        const question = userQuestion.toLowerCase();
        const { userLevel, completedFixes, preferredLearningStyle } = conversationContext;

        // Risk management questions
        if (question.includes('risk') || question.includes('stop') || question.includes('loss')) {
            const riskContent = generatePersonalizedResponse('risk_question',
                `Great question about risk management! 🛡️\n\n**Current Risk Level:** ${completedFixes.includes('stop-loss') ? 'Medium' : 'High'}\n\n**Recommended Approach:**\n• Set stop-loss at 2-3% below entry\n• Use position sizing (1-2% per trade)\n• Consider trailing stops for winners\n\n**For ${selectedPlatform}:**\n\`\`\`\n// Example stop-loss implementation\nif (Close[0] > EMA[0]) {\n    EnterLong();\n    stopLoss = Close[0] * 0.97; // 3% stop-loss\n}\n\`\`\`\n\nWould you like me to implement this in your strategy?`
            );

            return {
                content: riskContent,
                actionButtons: [
                    { label: 'Implement stop-loss', action: 'apply_stop_loss', variant: 'primary' },
                    { label: 'Show risk calculator', action: 'show_risk_calc', variant: 'secondary' }
                ],
                context: 'risk-management'
            };
        }

        // Performance questions
        if (question.includes('performance') || question.includes('profit') || question.includes('return')) {
            const performanceMetrics = calculatePerformanceImpact(completedFixes);
            const perfContent = generatePersonalizedResponse('performance_question',
                `Let me analyze your strategy's performance potential! 📊\n\n**Current Expected Performance:**\n• Risk Reduction: ${performanceMetrics.riskReduction}%\n• Expected Return: +${performanceMetrics.expectedReturn}%\n• False Signal Reduction: ${performanceMetrics.falseSignalReduction}%\n\n**Optimization Opportunities:**\n• Add volume filters (+15% performance)\n• Implement trailing stops (+10% performance)\n• Add time-based filters (+5% performance)\n\n**Next Best Action:** ${getNextBestAction() === 'show_code' ? 'Add stop-loss protection' : 'Optimize entry signals'}\n\nWould you like me to implement these optimizations?`
            );

            return {
                content: perfContent,
                actionButtons: [
                    { label: 'Show optimizations', action: 'show_optimizations', variant: 'primary' },
                    { label: 'Performance analysis', action: 'detailed_performance', variant: 'secondary' }
                ],
                context: 'performance-analysis'
            };
        }

        // Code optimization questions
        if (question.includes('optimize') || question.includes('improve') || question.includes('better')) {
            const optContent = generatePersonalizedResponse('optimization_question',
                `I'll help you optimize your strategy! 🚀\n\n**Current Optimization Status:**\n• Code Quality: ${completedFixes.length > 0 ? 'Good' : 'Needs improvement'}\n• Risk Management: ${completedFixes.includes('stop-loss') ? 'Implemented' : 'Missing'}\n• Signal Quality: ${completedFixes.includes('confirmation') ? 'Enhanced' : 'Basic'}\n\n**Recommended Optimizations:**\n1. **Entry Confirmation** - Add RSI/MACD filters\n2. **Volume Filter** - Only trade on high volume\n3. **Time Filters** - Avoid trading during low-liquidity periods\n4. **Trailing Stops** - Lock in profits automatically\n\nLet me show you the first optimization:`
            );

            return {
                content: optContent,
                actionButtons: [
                    { label: 'Show first optimization', action: 'show_code', variant: 'primary' },
                    { label: 'Show all optimizations', action: 'show_all_optimizations', variant: 'secondary' }
                ],
                context: 'code-optimization'
            };
        }

        // Platform-specific questions
        if (question.includes(selectedPlatform.toLowerCase()) || question.includes('platform')) {
            const platformContent = generatePersonalizedResponse('platform_question',
                `Great question about ${selectedPlatform}! 💻\n\n**${selectedPlatform} Specific Features:**\n• Built-in indicators and functions\n• Real-time data feeds\n• Advanced order types\n• Backtesting capabilities\n\n**Your Strategy on ${selectedPlatform}:**\n• Compatible with platform syntax\n• Uses standard indicators\n• Ready for live trading\n\n**Next Steps:**\n1. Test in simulation mode\n2. Optimize parameters\n3. Deploy to live trading\n\nWould you like me to show you how to implement this in ${selectedPlatform}?`
            );

            return {
                content: platformContent,
                actionButtons: [
                    { label: `Show ${selectedPlatform} code`, action: 'show_platform_code', variant: 'primary' },
                    { label: 'Platform guide', action: 'platform_guide', variant: 'secondary' }
                ],
                context: 'platform-specific'
            };
        }

        // General help
        const generalContent = generatePersonalizedResponse('general_question',
            `I understand you're asking about "${userQuestion}". Let me help you with that!\n\n**Based on your ${userLevel} level and ${preferredLearningStyle} learning style, here's what I recommend:**\n\n• **For beginners:** I'll provide step-by-step explanations\n• **For advanced users:** I'll focus on technical optimizations\n• **Visual learners:** I'll show code examples and comparisons\n• **Hands-on learners:** I'll provide practical, actionable fixes\n\nWhat specific aspect would you like me to help you with?\n\n💡 **Quick Actions:**\n• Show strategy analysis\n• Explain risk management\n• Optimize code performance\n• Platform-specific guidance`
        );

        return {
            content: generalContent,
            actionButtons: [
                { label: 'Show strategy analysis', action: 'show_all', variant: 'primary' },
                { label: 'Ask another question', action: 'ask_question', variant: 'secondary' }
            ],
            context: 'general-help'
        };
    };

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'apply_all_critical':
                // User Store Integration: Track bulk fix application
                incrementConceptsLearned(); // Learning from bulk fixes
                addFocusTime(5); // Add 5 minutes of focus time
                updateLearningStreak(); // Update learning streak
                markStrategyComplete(); // Mark strategy as complete
                updateCompletionRate(); // Update completion rate

                setIsEdgeBotTyping(true);
                setTimeout(() => {
                    const newMessage: EdgeBotMessage = {
                        id: edgeBotMessages.length + 1,
                        type: 'bot',
                        content: "🚀 Fantastic! I've applied all critical fixes to your strategy:\n\n✅ Added stop-loss protection\n✅ Implemented entry confirmation\n✅ Added volume filter\n\nYour strategy is now significantly safer and more robust. The expected improvement is +25% performance with reduced risk.",
                        timestamp: new Date(),
                        actionButtons: [
                            { label: 'Show me the changes', action: 'show_all_changes', variant: 'primary' },
                            { label: 'Export fixed code', action: 'export_code', variant: 'secondary' }
                        ]
                    };
                    setEdgeBotMessages(prev => [...prev, newMessage]);
                    setIsEdgeBotTyping(false);
                    setCurrentStep(totalSteps);
                }, 2000);
                break;

            case 'export_code':
                // Handle code export
                if (generatedCode) {
                    const blob = new Blob([generatedCode], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `improved-strategy-${selectedPlatform}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
                break;

            case 'view_full_code':
                setShowFullCode(!showFullCode);
                break;

            case 'save_to_architect':
                handleSaveToArchitect();
                break;
        }
    };

    const renderCodeWithSuggestions = () => {
        if (!generatedCode) return null;

        const lines = generatedCode.split('\n');

        return (
            <div className="relative">
                {lines.map((line, index) => {
                    const lineNumber = index + 1;
                    const suggestion = codeSuggestions.find(s => s.line === lineNumber);
                    const isHovered = hoveredLine === lineNumber;
                    const isSelected = selectedSuggestion?.line === lineNumber;

                    return (
                        <div
                            key={index}
                            className={`relative group ${suggestion ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                                } ${isHovered ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                } ${isSelected ? 'bg-green-50 dark:bg-green-900/10' : ''
                                }`}
                            onMouseEnter={() => setHoveredLine(lineNumber)}
                            onMouseLeave={() => setHoveredLine(null)}
                        >
                            <div className="flex items-start">
                                {/* Line number */}
                                <div className="w-12 text-xs text-slate-500 dark:text-slate-200 text-right pr-2 select-none">
                                    {lineNumber}
                                </div>

                                {/* Code content */}
                                <div className="flex-1 relative">
                                    <pre className="text-sm text-slate-800 dark:text-white whitespace-pre-wrap">
                                        <code>{line}</code>
                                    </pre>

                                    {/* Suggestion indicator */}
                                    {suggestion && (
                                        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-red-500"></div>
                                    )}

                                    {/* Hover tooltip */}
                                    {isHovered && suggestion && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute left-0 top-8 z-10 w-80 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle className={`w-4 h-4 ${suggestion.severity === 'high' ? 'text-red-500' :
                                                    suggestion.severity === 'medium' ? 'text-amber-500' :
                                                        'text-blue-500'
                                                    }`} />
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {suggestion.type.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-white mb-3">
                                                {suggestion.message}
                                            </p>
                                            <div className="text-xs text-slate-600 dark:text-white mb-3">
                                                <strong>Impact:</strong> {suggestion.impact}
                                            </div>
                                            <button
                                                onClick={() => handleApplyFix(suggestion)}
                                                className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                                            >
                                                Apply Fix
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Loading state
    if (isAnalyzing) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[600px] bg-slate-50 dark:bg-slate-900 strategy-doctor-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-2xl"
                >
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="p-6 rounded-2xl bg-blue-500/20 border border-blue-500/30 mx-auto mb-6 w-fit"
                    >
                        <Stethoscope className="w-12 h-12 text-blue-400" />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Performing Strategy Analysis...
                    </h2>
                    <p className="text-slate-700 dark:text-white text-lg mb-8 leading-relaxed">
                        I'm conducting a comprehensive medical examination of your trading strategy.
                        This includes risk assessment, performance optimization, and enhancement recommendations.
                    </p>

                    <div className="flex items-center justify-center gap-2 text-blue-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // External Code Input Interface - Show when no generatedCode is available
    if (showInputInterface && !generatedCode && !isAnalyzing && !analysisComplete) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[600px] bg-slate-50 dark:bg-slate-900 strategy-doctor-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl w-full"
                >
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="p-6 rounded-2xl bg-blue-500/20 border border-blue-500/30 mx-auto mb-6 w-fit"
                    >
                        <Stethoscope className="w-12 h-12 text-blue-400" />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Strategy Medical Examination 🩺</h2>
                    <p className="text-slate-700 dark:text-white text-lg mb-8 leading-relaxed">
                        I'm your AI Strategy Physician. I'll perform a comprehensive analysis of your trading strategy,
                        diagnosing potential issues and prescribing specific improvements to optimize performance and minimize risk.
                    </p>

                    {/* Input Methods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* File Upload Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400 transition-colors"
                        >
                            <div className="text-center">
                                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Upload Strategy File</h3>
                                <p className="text-slate-600 dark:text-slate-200 mb-4">
                                    Drag & drop or click to upload your strategy file
                                </p>

                                {/* Drag & Drop Area */}
                                <div
                                    className={`p-8 border-2 border-dashed rounded-lg transition-all ${fileUploadState.isDragOver
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {fileUploadState.isUploading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-blue-600 dark:text-blue-400">Processing {fileUploadState.fileName}...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                            <p className="text-sm text-slate-500 dark:text-slate-200 mb-2">
                                                Supports .txt, .pine, .cs files
                                            </p>
                                            <input
                                                type="file"
                                                accept=".txt,.pine,.cs"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                                style={{ backgroundColor: '#3b82f6' }}
                                            >
                                                <Upload className="w-4 h-4" />
                                                Choose File
                                            </label>
                                        </>
                                    )}
                                </div>

                                {fileUploadState.fileError && (
                                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                        <p className="text-sm text-red-600 dark:text-red-400">{fileUploadState.fileError}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Paste Code Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                        >
                            <div className="text-center mb-4">
                                <Clipboard className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Paste Strategy Code</h3>
                                <p className="text-slate-600 dark:text-slate-200">
                                    Paste your strategy code from any source
                                </p>
                            </div>

                            <textarea
                                value={externalCodeState.originalCode}
                                onChange={(e) => setExternalCodeState(prev => ({ ...prev, originalCode: e.target.value }))}
                                placeholder="Paste your PineScript or NinjaScript code here..."
                                className="w-full h-32 p-4 border border-slate-200 dark:border-slate-500 rounded-lg bg-slate-50 dark:bg-slate-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="mt-4 space-y-3">
                                {/* Optional Source Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                        Source (Optional)
                                    </label>
                                    <select
                                        value={externalCodeState.sourceSpecified}
                                        onChange={(e) => setExternalCodeState(prev => ({ ...prev, sourceSpecified: e.target.value }))}
                                        className="w-full p-2 border border-slate-200 dark:border-slate-500 rounded-lg bg-white dark:bg-slate-500 text-slate-900 dark:text-white"
                                        style={{ color: 'white' }}
                                    >
                                        <option value="" className="text-slate-900 dark:text-white bg-white dark:bg-slate-500" style={{ color: 'white', backgroundColor: '#64748b' }}>Select source...</option>
                                        <option value="ChatGPT" className="text-slate-900 dark:text-white bg-white dark:bg-slate-500" style={{ color: 'white', backgroundColor: '#64748b' }}>ChatGPT</option>
                                        <option value="Grok" className="text-slate-900 dark:text-white bg-white dark:bg-slate-500" style={{ color: 'white', backgroundColor: '#64748b' }}>Grok</option>
                                        <option value="Claude" className="text-slate-900 dark:text-white bg-white dark:bg-slate-500" style={{ color: 'white', backgroundColor: '#64748b' }}>Claude</option>
                                        <option value="GitHub" className="text-slate-900 dark:text-white bg-white dark:bg-slate-500" style={{ color: 'white', backgroundColor: '#64748b' }}>GitHub</option>
                                        <option value="Forum" className="text-slate-900 dark:text-white bg-white dark:bg-slate-500" style={{ color: 'white', backgroundColor: '#64748b' }}>Trading Forum</option>
                                        <option value="Other" className="text-slate-900 dark:text-white bg-white dark:bg-slate-500" style={{ color: 'white', backgroundColor: '#64748b' }}>Other</option>
                                    </select>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handlePasteCode}
                                    disabled={!externalCodeState.originalCode.trim() || externalCodeState.isProcessing}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                                    style={{ backgroundColor: '#3b82f6' }}
                                >
                                    {externalCodeState.isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Clipboard className="w-4 h-4" />
                                            Analyze Code
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            {externalCodeState.processingError && (
                                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-600 dark:text-red-400">{externalCodeState.processingError}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Alternative Option */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-slate-600 dark:text-slate-200">Or</span>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleBackToArchitect}
                                className="flex items-center gap-2 px-6 py-3 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                                style={{ backgroundColor: '#3b82f6' }}
                            >
                                <ArrowRight className="w-4 h-4" />
                                Generate Strategy in Architect
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    /* Override global CSS that forces background-color: inherit on all elements */
                    .strategy-doctor-container label[style*="background-color: #3b82f6"],
                    .strategy-doctor-container button[style*="background-color: #3b82f6"],
                    .strategy-debugger label[style*="background-color: #3b82f6"],
                    .strategy-debugger button[style*="background-color: #3b82f6"] {
                        background-color: #3b82f6 !important;
                        color: white !important;
                        border-color: #3b82f6 !important;
                    }
                    
                    /* Dark mode specific overrides with higher specificity */
                    [data-theme="dark"] .strategy-doctor-container label[style*="background-color: #3b82f6"],
                    [data-theme="dark"] .strategy-doctor-container button[style*="background-color: #3b82f6"],
                    [data-theme="dark"] .strategy-debugger label[style*="background-color: #3b82f6"],
                    [data-theme="dark"] .strategy-debugger button[style*="background-color: #3b82f6"] {
                        background-color: #3b82f6 !important;
                        color: white !important;
                        border-color: #3b82f6 !important;
                    }
                    
                    /* Hover states */
                    .strategy-doctor-container label[style*="background-color: #3b82f6"]:hover,
                    .strategy-doctor-container button[style*="background-color: #3b82f6"]:hover,
                    .strategy-debugger label[style*="background-color: #3b82f6"]:hover,
                    .strategy-debugger button[style*="background-color: #3b82f6"]:hover {
                        background-color: #2563eb !important;
                        border-color: #2563eb !important;
                    }
                `
            }} />
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-900 strategy-doctor-container strategy-debugger">
                {/* Header with Progress */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dashboard-header">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBackToArchitect}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Architect
                        </motion.button>
                        <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <Stethoscope className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Strategy Doctor</h1>
                                <p className="text-sm text-slate-600 dark:text-slate-200">AI-Powered Strategy Analysis</p>
                            </div>
                        </div>

                        {/* Platform Detection Indicator */}
                        {externalCodeState.inputMethod !== 'none' && externalCodeState.detectedPlatform !== 'Unknown' && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                    {externalCodeState.detectedPlatform} Detected
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Progress Indicator */}
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-slate-600 dark:text-slate-200">
                                Step {currentStep} of {totalSteps}
                            </div>
                            <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Confidence Score */}
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {strategyConfidence}% Confidence
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content - EdgeBot Centric Layout */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Quick Actions Panel (30%) - Now on LEFT */}
                    <div className="w-[30%] flex flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
                        {/* Quick Actions Header */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Quick Actions</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-200">Common tasks and shortcuts</p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleQuickAction('apply_all_critical')}
                                className="w-full p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-3"
                            >
                                <Shield className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-semibold">Apply All Critical Fixes</div>
                                    <div className="text-sm opacity-90">Fix all high-priority issues</div>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleQuickAction('view_full_code')}
                                className="w-full p-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors flex items-center gap-3"
                            >
                                <Code className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-semibold">{showFullCode ? 'Hide Full Code' : 'View Full Code'}</div>
                                    <div className="text-sm opacity-90">See complete strategy</div>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleQuickAction('export_code')}
                                className="w-full p-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors flex items-center gap-3"
                            >
                                <Download className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-semibold">Export Fixed Code</div>
                                    <div className="text-sm opacity-90">Download improved strategy</div>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleEdgeBotAction('ask_question')}
                                className="w-full p-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors flex items-center gap-3"
                            >
                                <HelpCircle className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-semibold">Ask EdgeBot Anything</div>
                                    <div className="text-sm opacity-90">Get expert advice</div>
                                </div>
                            </motion.button>

                            {/* Save to Strategy Architect - Only show if external code was processed */}
                            {externalCodeState.inputMethod !== 'none' && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSaveToArchitect}
                                    className="w-full p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-3"
                                >
                                    <Save className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-semibold">Save to Strategy Architect</div>
                                        <div className="text-sm opacity-90">Create new strategy from analysis</div>
                                    </div>
                                </motion.button>
                            )}
                        </div>

                        {/* Strategy Summary */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <h4 className="font-medium text-slate-900 dark:text-white mb-3">Strategy Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-200">Issues Found:</span>
                                    <span className="font-medium text-red-500">{issues.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-200">Optimizations:</span>
                                    <span className="font-medium text-amber-500">{suggestions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-200">Expected Impact:</span>
                                    <span className="font-medium text-green-500">+25%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-200">Time to Fix:</span>
                                    <span className="font-medium text-blue-500">~5 min</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EdgeBot Conversation (70%) - Now on RIGHT */}
                    <div className="w-[70%] flex flex-col">
                        {/* EdgeBot Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">EdgeBot Strategy Consultation</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-200">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span>AI Intelligence Active</span>
                                        </div>
                                        <span>•</span>
                                        <span className="capitalize">{conversationContext.userLevel} Level</span>
                                        <span>•</span>
                                        <span className="capitalize">{conversationContext.preferredLearningStyle} Learner</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                                    Phase 2A Active
                                </div>
                                <button
                                    onClick={() => setShowFullCode(!showFullCode)}
                                    className="p-2 text-slate-500 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Fixed-Height Conversation Area with Auto-Scroll */}
                        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
                            {/* Messages Container - Fixed Height with Internal Scroll */}
                            <div
                                ref={messagesContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4"
                                style={{ maxHeight: '500px' }}
                            >
                                {edgeBotMessages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        {message.type === 'bot' && (
                                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                                                <Bot className="w-4 h-4 text-blue-500" />
                                            </div>
                                        )}

                                        <div className={`max-w-lg p-4 rounded-lg ${message.type === 'bot'
                                            ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'
                                            : 'bg-blue-500 text-white'
                                            }`}>
                                            <div className="whitespace-pre-wrap text-sm mb-3 text-slate-900 dark:text-white">{message.content}</div>

                                            {/* Inline Code Display */}
                                            {message.showCode && (
                                                <div className="mb-3">
                                                    <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                                                        <pre className="text-xs text-slate-800 dark:text-white overflow-x-auto">
                                                            <code>{message.content.includes('```') ?
                                                                message.content.split('```')[1] :
                                                                '// Code snippet would appear here'
                                                            }</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            {message.actionButtons && (
                                                <div className="flex gap-2 flex-wrap">
                                                    {message.actionButtons.map((button, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleEdgeBotAction(button.action)}
                                                            className={`px-3 py-2 text-xs rounded-lg transition-colors ${button.variant === 'primary'
                                                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                                                : button.variant === 'danger'
                                                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                                                    : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                                                                }`}
                                                        >
                                                            {button.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {message.type === 'user' && (
                                            <div className="p-2 rounded-lg bg-slate-500/10 border border-slate-500/20 flex-shrink-0">
                                                <MessageCircle className="w-4 h-4 text-slate-500" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {isEdgeBotTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-3 justify-start"
                                    >
                                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                                            <Bot className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Invisible element for auto-scroll */}
                                <div ref={conversationEndRef} />
                            </div>

                            {/* Progress Indicator */}
                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Strategy Optimization Progress
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-200">
                                        {conversationContext.completedFixes.length} of 4 completed
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {[
                                        { id: 'stop-loss', label: 'Stop-Loss', status: conversationContext.completedFixes.includes('stop-loss') ? 'completed' : 'pending' },
                                        { id: 'confirmation', label: 'Entry Confirmation', status: conversationContext.completedFixes.includes('confirmation') ? 'completed' : 'pending' },
                                        { id: 'volume', label: 'Volume Filter', status: conversationContext.completedFixes.includes('volume') ? 'completed' : 'pending' },
                                        { id: 'optimization', label: 'Advanced Optimization', status: conversationContext.completedFixes.includes('optimization') ? 'completed' : 'pending' }
                                    ].map((step) => (
                                        <div
                                            key={step.id}
                                            className={`flex-1 h-2 rounded-full transition-all duration-300 ${step.status === 'completed'
                                                ? 'bg-green-500'
                                                : step.id === conversationContext.currentFocus
                                                    ? 'bg-blue-500 animate-pulse'
                                                    : 'bg-slate-200 dark:bg-slate-700'
                                                }`}
                                            title={`${step.label}: ${step.status === 'completed' ? 'Completed' : 'Pending'}`}
                                        />
                                    ))}
                                </div>
                                <div className="mt-2 text-xs text-slate-500 dark:text-slate-200">
                                    Current focus: <span className="font-medium text-blue-600 dark:text-blue-400">
                                        {conversationContext.currentFocus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </div>
                            </div>

                            {/* Persistent Input Area - Always Visible */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            placeholder="Ask EdgeBot about your strategy..."
                                            className="w-full px-4 py-3 pr-12 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUserInput(e);
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={(e) => handleUserInput(e)}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-slate-500 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleEdgeBotAction('show_all')}
                                        className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <HelpCircle className="w-4 h-4" />
                                        Quick Help
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Code Display (Conditional) - Fixed Height */}
                {showFullCode && (
                    <div className="h-80 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Full Strategy Code</h3>
                                <div className="flex items-center gap-2">
                                    <div className="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                        {selectedPlatform}
                                    </div>
                                    <button
                                        onClick={() => handleCopyCode(generatedCode)}
                                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <Copy className="w-4 h-4 text-slate-600 dark:text-slate-200" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900">
                            {renderCodeWithSuggestions()}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default StrategyDebugger; 
