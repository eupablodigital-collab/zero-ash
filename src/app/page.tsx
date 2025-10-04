"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Calendar, 
  DollarSign, 
  Award, 
  Target, 
  Wind, 
  Clock, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Zap, 
  CheckCircle, 
  Star,
  Play,
  Pause,
  RotateCcw,
  MessageCircle,
  Share2,
  Settings,
  Crown,
  Flame,
  Droplets,
  Activity,
  Brain,
  Shield,
  Gift,
  Plus,
  Minus,
  AlertCircle,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';

// Types
interface UserProfile {
  name: string;
  quitDate: Date;
  smokingFrequency: number;
  costPerPack: number;
  cigarettesPerPack: number;
  quitMethod: 'cold-turkey' | 'gradual';
  triggers: string[];
  reasons: string[];
}

interface CravingLog {
  id: string;
  timestamp: Date;
  intensity: number;
  trigger: string;
  copingStrategy: string;
  notes: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  days: number;
  icon: React.ReactNode;
  achieved: boolean;
}

// Main App Component
export default function QuitSmokingApp() {
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard' | 'breathing' | 'cravings' | 'community' | 'journal' | 'premium'>('onboarding');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [cravingLogs, setCravingLogs] = useState<CravingLog[]>([]);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [selectedBreathingType, setSelectedBreathingType] = useState<'box' | '4-7-8' | 'diaphragmatic'>('box');
  const [isPremium, setIsPremium] = useState(false);

  // Onboarding Component
  const OnboardingFlow = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      name: '',
      quitDate: '',
      smokingFrequency: 20,
      costPerPack: 10,
      cigarettesPerPack: 20,
      quitMethod: 'cold-turkey' as const,
      triggers: [] as string[],
      reasons: [] as string[]
    });

    const triggerOptions = [
      'Stress', 'Social situations', 'Boredom', 'After meals', 
      'With coffee', 'Driving', 'Work breaks', 'Alcohol', 'Anxiety'
    ];

    const reasonOptions = [
      'Better health', 'Save money', 'Family/children', 'Fitness goals',
      'Smell/appearance', 'Social pressure', 'Medical advice', 'Self-control'
    ];

    const handleTriggerToggle = (trigger: string) => {
      setFormData(prev => ({
        ...prev,
        triggers: prev.triggers.includes(trigger)
          ? prev.triggers.filter(t => t !== trigger)
          : [...prev.triggers, trigger]
      }));
    };

    const handleReasonToggle = (reason: string) => {
      setFormData(prev => ({
        ...prev,
        reasons: prev.reasons.includes(reason)
          ? prev.reasons.filter(r => r !== reason)
          : [...prev.reasons, reason]
      }));
    };

    const completeOnboarding = () => {
      const profile: UserProfile = {
        ...formData,
        quitDate: new Date(formData.quitDate)
      };
      setUserProfile(profile);
      setCurrentView('dashboard');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Step {step} of 4</span>
              <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to QuitWise</h2>
                <p className="text-gray-600">Let's create your personalized quit plan</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quit Date</label>
                  <input
                    type="date"
                    value={formData.quitDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, quitDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quit Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, quitMethod: 'cold-turkey' }))}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.quitMethod === 'cold-turkey'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Zap className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Cold Turkey</span>
                    </button>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, quitMethod: 'gradual' }))}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.quitMethod === 'gradual'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Gradual</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.quitDate}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Smoking Habits */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Tell us about your smoking habits</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cigarettes per day: {formData.smokingFrequency}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={formData.smokingFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, smokingFrequency: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>30</span>
                    <span>60+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost per pack ($)</label>
                  <input
                    type="number"
                    value={formData.costPerPack}
                    onChange={(e) => setFormData(prev => ({ ...prev, costPerPack: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10.00"
                    step="0.50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cigarettes per pack</label>
                  <select
                    value={formData.cigarettesPerPack}
                    onChange={(e) => setFormData(prev => ({ ...prev, cigarettesPerPack: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={20}>20 cigarettes</option>
                    <option value={25}>25 cigarettes</option>
                    <option value={30}>30 cigarettes</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Triggers */}
          {step === 3 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-2">What triggers your smoking?</h2>
              <p className="text-gray-600 mb-6">Select all that apply</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {triggerOptions.map((trigger) => (
                  <button
                    key={trigger}
                    onClick={() => handleTriggerToggle(trigger)}
                    className={`p-3 rounded-xl border-2 text-sm transition-all ${
                      formData.triggers.includes(trigger)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {trigger}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Reasons */}
          {step === 4 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Why do you want to quit?</h2>
              <p className="text-gray-600 mb-6">Your motivation matters</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {reasonOptions.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleReasonToggle(reason)}
                    className={`p-3 rounded-xl border-2 text-sm transition-all ${
                      formData.reasons.includes(reason)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={completeOnboarding}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Start My Journey
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    if (!userProfile) return null;

    const daysSinceQuit = Math.max(0, Math.floor((new Date().getTime() - userProfile.quitDate.getTime()) / (1000 * 60 * 60 * 24)));
    const cigarettesAvoided = daysSinceQuit * userProfile.smokingFrequency;
    const moneySaved = (cigarettesAvoided / userProfile.cigarettesPerPack) * userProfile.costPerPack;

    const milestones: Milestone[] = [
      { id: '1', title: '24 Hours', description: 'Heart attack risk decreases', days: 1, icon: <Heart className="w-5 h-5" />, achieved: daysSinceQuit >= 1 },
      { id: '2', title: '1 Week', description: 'Taste and smell improve', days: 7, icon: <Star className="w-5 h-5" />, achieved: daysSinceQuit >= 7 },
      { id: '3', title: '1 Month', description: 'Lung function increases', days: 30, icon: <Wind className="w-5 h-5" />, achieved: daysSinceQuit >= 30 },
      { id: '4', title: '3 Months', description: 'Circulation improves', days: 90, icon: <Activity className="w-5 h-5" />, achieved: daysSinceQuit >= 90 },
      { id: '5', title: '1 Year', description: 'Heart disease risk halved', days: 365, icon: <Shield className="w-5 h-5" />, achieved: daysSinceQuit >= 365 }
    ];

    const motivationalQuotes = [
      "Every cigarette you don't smoke is doing you good.",
      "You are stronger than your cravings.",
      "Your future self will thank you for quitting today.",
      "Progress, not perfection.",
      "One day at a time, one breath at a time."
    ];

    const todayQuote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-800">Hello, {userProfile.name}!</h1>
                <p className="text-sm text-gray-600">Keep up the great work</p>
              </div>
              <div className="flex items-center gap-2">
                {isPremium && <Crown className="w-5 h-5 text-yellow-500" />}
                <button
                  onClick={() => setCurrentView('premium')}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Daily Quote */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Daily Motivation</h3>
                <p className="text-sm opacity-90">"{todayQuote}"</p>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{daysSinceQuit}</p>
                  <p className="text-sm text-gray-600">Days smoke-free</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{cigarettesAvoided}</p>
                  <p className="text-sm text-gray-600">Cigarettes avoided</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">${moneySaved.toFixed(0)}</p>
                  <p className="text-sm text-gray-600">Money saved</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-full">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">+{Math.min(daysSinceQuit * 2, 100)}%</p>
                  <p className="text-sm text-gray-600">Health improved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Health Milestones</h3>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${milestone.achieved ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {milestone.achieved ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      milestone.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${milestone.achieved ? 'text-green-700' : 'text-gray-700'}`}>
                      {milestone.title}
                    </p>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                  {milestone.achieved && (
                    <Award className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentView('breathing')}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-2">
                  <Wind className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-medium text-gray-800">Breathing</p>
                <p className="text-sm text-gray-600">Calm your mind</p>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('cravings')}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-2">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <p className="font-medium text-gray-800">Cravings</p>
                <p className="text-sm text-gray-600">Get help now</p>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('community')}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-2">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <p className="font-medium text-gray-800">Community</p>
                <p className="text-sm text-gray-600">Connect & share</p>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('journal')}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-medium text-gray-800">Journal</p>
                <p className="text-sm text-gray-600">Track thoughts</p>
              </div>
            </button>
          </div>

          {/* Emergency Button */}
          <button
            onClick={() => setCurrentView('cravings')}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            🆘 Emergency Craving Help
          </button>
        </div>
      </div>
    );
  };

  // Breathing Exercises Component
  const BreathingExercises = () => {
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [currentPhase, setCurrentPhase] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const breathingPatterns = {
      'box': { name: 'Box Breathing', phases: [4, 4, 4, 4], labels: ['Inhale', 'Hold', 'Exhale', 'Hold'] },
      '4-7-8': { name: '4-7-8 Breathing', phases: [4, 7, 8, 0], labels: ['Inhale', 'Hold', 'Exhale', 'Rest'] },
      'diaphragmatic': { name: 'Diaphragmatic', phases: [6, 2, 6, 2], labels: ['Inhale', 'Pause', 'Exhale', 'Pause'] }
    };

    const currentPattern = breathingPatterns[selectedBreathingType];

    useEffect(() => {
      if (isActive) {
        intervalRef.current = setInterval(() => {
          setTimer(prev => {
            const newTimer = prev + 1;
            const currentPhaseDuration = currentPattern.phases[currentPhase];
            
            if (newTimer >= currentPhaseDuration) {
              setCurrentPhase(prevPhase => (prevPhase + 1) % currentPattern.phases.length);
              return 0;
            }
            return newTimer;
          });
        }, 1000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isActive, currentPhase, currentPattern.phases]);

    const startBreathing = () => {
      setIsActive(true);
      setTimer(0);
      setCurrentPhase(0);
    };

    const pauseBreathing = () => {
      setIsActive(false);
    };

    const resetBreathing = () => {
      setIsActive(false);
      setTimer(0);
      setCurrentPhase(0);
    };

    const currentPhaseLabel = currentPattern.labels[currentPhase];
    const progress = (timer / currentPattern.phases[currentPhase]) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Breathing Exercises</h1>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Breathing Type Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Your Technique</h3>
            <div className="space-y-3">
              {Object.entries(breathingPatterns).map(([key, pattern]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedBreathingType(key as any);
                    resetBreathing();
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedBreathingType === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-800">{pattern.name}</p>
                  <p className="text-sm text-gray-600">
                    {pattern.phases.join('-')} second pattern
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Breathing Animation */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="relative w-48 h-48 mx-auto mb-6">
                {/* Breathing Circle */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 transition-all duration-1000 ease-in-out"
                  style={{
                    transform: currentPhase === 0 || currentPhase === 1 ? 'scale(1.2)' : 'scale(0.8)',
                    opacity: 0.7
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white mb-2">{currentPhaseLabel}</p>
                    <p className="text-lg text-white">{currentPattern.phases[currentPhase] - timer}s</p>
                  </div>
                </div>
                
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="90"
                    fill="none"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="90"
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
              </div>

              <div className="flex justify-center gap-4">
                {!isActive ? (
                  <button
                    onClick={startBreathing}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={pauseBreathing}
                    className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </button>
                )}
                <button
                  onClick={resetBreathing}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Quick Relief */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Craving Emergency?</h3>
            <p className="text-sm opacity-90 mb-4">Try our 2-minute quick relief session</p>
            <button
              onClick={() => {
                setSelectedBreathingType('4-7-8');
                startBreathing();
              }}
              className="bg-white text-red-500 px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition-all"
            >
              Start Quick Relief
            </button>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Benefits of Breathing Exercises</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Reduces stress and anxiety</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-700">Helps manage cravings</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm text-gray-700">Improves focus and clarity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Craving Management Component
  const CravingManagement = () => {
    const [showEmergency, setShowEmergency] = useState(false);
    const [cravingIntensity, setCravingIntensity] = useState(5);
    const [selectedTrigger, setSelectedTrigger] = useState('');
    const [selectedStrategy, setSelectedStrategy] = useState('');
    const [notes, setNotes] = useState('');

    const triggers = ['Stress', 'Boredom', 'Social', 'After meals', 'Coffee', 'Driving', 'Work break', 'Anxiety'];
    const strategies = [
      { name: 'Deep Breathing', icon: <Wind className="w-5 h-5" />, description: '5-minute breathing exercise' },
      { name: 'Quick Walk', icon: <Activity className="w-5 h-5" />, description: 'Get moving for 10 minutes' },
      { name: 'Drink Water', icon: <Droplets className="w-5 h-5" />, description: 'Hydrate and refresh' },
      { name: 'Call Someone', icon: <MessageCircle className="w-5 h-5" />, description: 'Connect with support' },
      { name: 'Meditation', icon: <Brain className="w-5 h-5" />, description: 'Mindfulness practice' },
      { name: 'Healthy Snack', icon: <Coffee className="w-5 h-5" />, description: 'Satisfy your mouth' }
    ];

    const emergencyMessages = [
      "This craving will pass in 3-5 minutes. You've got this!",
      "Remember why you started. Your health is worth it.",
      "You are stronger than this urge. Breathe through it.",
      "Every craving you resist makes you stronger.",
      "Think about how proud you'll feel tomorrow."
    ];

    const logCraving = () => {
      const newLog: CravingLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        intensity: cravingIntensity,
        trigger: selectedTrigger,
        copingStrategy: selectedStrategy,
        notes
      };
      setCravingLogs(prev => [newLog, ...prev]);
      
      // Reset form
      setCravingIntensity(5);
      setSelectedTrigger('');
      setSelectedStrategy('');
      setNotes('');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Craving Support</h1>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Emergency Help */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Having a Strong Craving?</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">
              {emergencyMessages[Math.floor(Math.random() * emergencyMessages.length)]}
            </p>
            <button
              onClick={() => setShowEmergency(true)}
              className="bg-white text-red-500 px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition-all"
            >
              Get Immediate Help
            </button>
          </div>

          {/* Emergency Modal */}
          {showEmergency && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">You're Stronger Than This</h3>
                  <p className="text-gray-600">This craving will pass. Try one of these strategies:</p>
                </div>

                <div className="space-y-3 mb-6">
                  {strategies.slice(0, 3).map((strategy) => (
                    <button
                      key={strategy.name}
                      onClick={() => {
                        setSelectedStrategy(strategy.name);
                        setShowEmergency(false);
                        if (strategy.name === 'Deep Breathing') {
                          setCurrentView('breathing');
                        }
                      }}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      <div className="p-2 bg-blue-100 rounded-full">
                        {strategy.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{strategy.name}</p>
                        <p className="text-sm text-gray-600">{strategy.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowEmergency(false)}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Coping Strategies */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Healthy Alternatives</h3>
            <div className="grid grid-cols-2 gap-3">
              {strategies.map((strategy) => (
                <button
                  key={strategy.name}
                  onClick={() => {
                    setSelectedStrategy(strategy.name);
                    if (strategy.name === 'Deep Breathing') {
                      setCurrentView('breathing');
                    }
                  }}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-center"
                >
                  <div className="p-2 bg-blue-100 rounded-full w-fit mx-auto mb-2">
                    {strategy.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-800">{strategy.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Log Craving */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Track This Craving</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensity: {cravingIntensity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={cravingIntensity}
                  onChange={(e) => setCravingIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Intense</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What triggered this?</label>
                <select
                  value={selectedTrigger}
                  onChange={(e) => setSelectedTrigger(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a trigger</option>
                  {triggers.map((trigger) => (
                    <option key={trigger} value={trigger}>{trigger}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="How are you feeling? What helped?"
                />
              </div>

              <button
                onClick={logCraving}
                disabled={!selectedTrigger}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                Log Craving
              </button>
            </div>
          </div>

          {/* Recent Logs */}
          {cravingLogs.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Cravings</h3>
              <div className="space-y-3">
                {cravingLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-800">{log.trigger}</span>
                      <span className="text-xs text-gray-500">
                        {log.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Intensity:</span>
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < log.intensity ? 'bg-red-400' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {log.notes && (
                      <p className="text-xs text-gray-600 mt-2">{log.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Community Component
  const Community = () => {
    const [activeTab, setActiveTab] = useState<'forum' | 'share' | 'support'>('forum');

    const forumPosts = [
      {
        id: '1',
        author: 'Sarah M.',
        time: '2 hours ago',
        title: 'Day 30 - Feeling amazing!',
        content: 'Just hit my 30-day milestone. The first week was tough, but breathing exercises really helped. Anyone else find mornings the hardest?',
        likes: 12,
        replies: 5
      },
      {
        id: '2',
        author: 'Mike R.',
        time: '5 hours ago',
        title: 'Craving tips that actually work',
        content: 'Wanted to share what helped me through intense cravings: 1) Cold water, 2) Push-ups, 3) Call a friend. What works for you?',
        likes: 8,
        replies: 3
      },
      {
        id: '3',
        author: 'Emma L.',
        time: '1 day ago',
        title: 'Money saved calculator motivation',
        content: 'Seeing that I\'ve saved $200 in just 3 weeks is incredible motivation. Planning a spa day with the money!',
        likes: 15,
        replies: 7
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Community</h1>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4">
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl p-2 shadow-sm mb-6">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTab('forum')}
                className={`py-2 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'forum'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Forum
              </button>
              <button
                onClick={() => setActiveTab('share')}
                className={`py-2 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'share'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Share
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`py-2 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'support'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Support
              </button>
            </div>
          </div>

          {/* Forum Tab */}
          {activeTab === 'forum' && (
            <div className="space-y-4">
              {forumPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {post.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.time}</p>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mb-2">{post.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{post.content}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {post.replies}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                + Create New Post
              </button>
            </div>
          )}

          {/* Share Tab */}
          {activeTab === 'share' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Share Your Progress</h3>
                
                {userProfile && (
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-4 text-white mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-1">
                        {Math.max(0, Math.floor((new Date().getTime() - userProfile.quitDate.getTime()) / (1000 * 60 * 60 * 24)))} Days
                      </p>
                      <p className="text-sm opacity-90">Smoke-Free</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-all">
                    <Share2 className="w-5 h-5" />
                    Share on Social Media
                  </button>
                  
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all">
                    <MessageCircle className="w-5 h-5" />
                    Send to Friends
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Invite Friends</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Having support makes quitting easier. Invite friends to join you on this journey.
                </p>
                
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="friend@example.com"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all">
                    Invite
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">24/7 Support</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold text-red-700">Crisis Support</h4>
                    </div>
                    <p className="text-sm text-red-600 mb-3">
                      If you're having thoughts of self-harm, please reach out immediately.
                    </p>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition-all">
                      Call Crisis Hotline
                    </button>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                      <h4 className="font-semibold text-blue-700">Quit Line</h4>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">
                      Free counseling and support from trained specialists.
                    </p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-all">
                      1-800-QUIT-NOW
                    </button>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-green-700">Support Groups</h4>
                    </div>
                    <p className="text-sm text-green-600 mb-3">
                      Connect with local support groups in your area.
                    </p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-all">
                      Find Groups
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Helpful Resources</h3>
                
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">Quit Smoking Guide</p>
                      <p className="text-sm text-gray-600">Complete guide to quitting</p>
                    </div>
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                    <Activity className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800">Health Benefits Timeline</p>
                      <p className="text-sm text-gray-600">What happens when you quit</p>
                    </div>
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-800">Coping Strategies</p>
                      <p className="text-sm text-gray-600">Manage withdrawal symptoms</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Journal Component
  const Journal = () => {
    const [entries, setEntries] = useState([
      {
        id: '1',
        date: new Date(),
        mood: 'good',
        content: 'Feeling strong today. Had a small craving after lunch but did some deep breathing and it passed quickly.',
        triggers: ['After meals'],
        strategies: ['Deep breathing']
      }
    ]);
    const [newEntry, setNewEntry] = useState('');
    const [selectedMood, setSelectedMood] = useState<'great' | 'good' | 'okay' | 'difficult' | 'struggling'>('good');

    const moods = [
      { value: 'great', emoji: '😊', label: 'Great', color: 'text-green-500' },
      { value: 'good', emoji: '🙂', label: 'Good', color: 'text-blue-500' },
      { value: 'okay', emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
      { value: 'difficult', emoji: '😔', label: 'Difficult', color: 'text-orange-500' },
      { value: 'struggling', emoji: '😰', label: 'Struggling', color: 'text-red-500' }
    ];

    const addEntry = () => {
      if (!newEntry.trim()) return;
      
      const entry = {
        id: Date.now().toString(),
        date: new Date(),
        mood: selectedMood,
        content: newEntry,
        triggers: [],
        strategies: []
      };
      
      setEntries(prev => [entry, ...prev]);
      setNewEntry('');
      setSelectedMood('good');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Journal</h1>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* New Entry */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">How are you feeling today?</h3>
            
            {/* Mood Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value as any)}
                    className={`flex-shrink-0 p-3 rounded-xl border-2 transition-all ${
                      selectedMood === mood.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <p className={`text-xs font-medium ${mood.color}`}>{mood.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Entry Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your thoughts</label>
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="How are you feeling? What challenges did you face? What went well?"
              />
            </div>

            <button
              onClick={addEntry}
              disabled={!newEntry.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Save Entry
            </button>
          </div>

          {/* Habit Tracker */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Healthy Habits</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-800">Drink 8 glasses of water</span>
                </div>
                <button className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-gray-800">Exercise for 30 minutes</span>
                </div>
                <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-gray-800">Practice mindfulness</span>
                </div>
                <button className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium text-gray-800">Get 8 hours of sleep</span>
                </div>
                <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Previous Entries */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Previous Entries</h3>
            
            <div className="space-y-4">
              {entries.map((entry) => {
                const mood = moods.find(m => m.value === entry.mood);
                return (
                  <div key={entry.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{mood?.emoji}</span>
                      <div>
                        <p className="font-medium text-gray-800">{mood?.label}</p>
                        <p className="text-xs text-gray-500">
                          {entry.date.toLocaleDateString()} at {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{entry.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Premium Component
  const Premium = () => {
    const features = [
      {
        icon: <Wind className="w-6 h-6" />,
        title: 'Advanced Breathing Programs',
        description: 'Access to 15+ specialized breathing techniques and guided sessions'
      },
      {
        icon: <Brain className="w-6 h-6" />,
        title: 'AI Personal Coach',
        description: 'Get personalized advice and support from our AI quit coach'
      },
      {
        icon: <BookOpen className="w-6 h-6" />,
        title: 'Exclusive Content',
        description: 'Premium articles, videos, and expert interviews'
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        title: 'Advanced Analytics',
        description: 'Detailed insights into your quit journey and progress patterns'
      },
      {
        icon: <Users className="w-6 h-6" />,
        title: 'Priority Support',
        description: '24/7 priority access to our support team and counselors'
      },
      {
        icon: <Gift className="w-6 h-6" />,
        title: 'Exclusive Rewards',
        description: 'Special badges, achievements, and milestone celebrations'
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">QuitWise Premium</h1>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Premium Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white text-center">
            <Crown className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
            <p className="text-sm opacity-90">Supercharge your quit journey with advanced features</p>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-800">$9.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600">Cancel anytime • 7-day free trial</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Everything in Free</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Advanced breathing programs</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">AI personal coach</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Priority support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Exclusive content & rewards</span>
              </div>
            </div>

            <button
              onClick={() => setIsPremium(true)}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
            >
              Start Free Trial
            </button>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">What Premium Users Say</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  "The AI coach feature is incredible. It's like having a personal quit counselor available 24/7."
                </p>
                <p className="text-xs text-gray-500">- Jennifer K., 45 days smoke-free</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  "The advanced breathing programs helped me through the toughest cravings. Worth every penny!"
                </p>
                <p className="text-xs text-gray-500">- Michael R., 3 months smoke-free</p>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">30-Day Money Back Guarantee</h4>
                <p className="text-sm text-green-600">Not satisfied? Get a full refund, no questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bottom Navigation
  const BottomNav = () => {
    if (currentView === 'onboarding') return null;

    const navItems = [
      { id: 'dashboard', icon: <Activity className="w-5 h-5" />, label: 'Dashboard' },
      { id: 'breathing', icon: <Wind className="w-5 h-5" />, label: 'Breathe' },
      { id: 'cravings', icon: <AlertCircle className="w-5 h-5" />, label: 'Cravings' },
      { id: 'community', icon: <Users className="w-5 h-5" />, label: 'Community' },
      { id: 'journal', icon: <BookOpen className="w-5 h-5" />, label: 'Journal' }
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'text-blue-500 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'onboarding' && <OnboardingFlow />}
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'breathing' && <BreathingExercises />}
      {currentView === 'cravings' && <CravingManagement />}
      {currentView === 'community' && <Community />}
      {currentView === 'journal' && <Journal />}
      {currentView === 'premium' && <Premium />}
      
      <BottomNav />
      
      {/* Add bottom padding to prevent content from being hidden behind nav */}
      {currentView !== 'onboarding' && <div className="h-20"></div>}
    </div>
  );
}