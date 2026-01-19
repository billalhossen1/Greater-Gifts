
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Plus, Download, Trash2, PieChart, TrendingUp, Wallet, 
  Sparkles, ArrowUpCircle, ArrowDownCircle, Settings, X, ChevronRight, 
  Calendar, ChevronLeft, Layers, CheckCircle2,
  Cloud, CloudOff, RefreshCw, ChevronDown, Languages, Camera, Users, Palette,
  Info, Clock, FileSpreadsheet
} from 'lucide-react';
import { Transaction, UserSettings, Language } from './types';
import { getFinancialAdvice } from './services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, Legend 
} from 'recharts';
import * as XLSX from 'xlsx';

const THEME_OPTIONS = [
  { name: 'Rose', hex: '#e11d48', class: 'bg-rose-600' },
  { name: 'Pink', hex: '#ec4899', class: 'bg-pink-600' },
  { name: 'Teal', hex: '#0d9488', class: 'bg-teal-600' },
  { name: 'Indigo', hex: '#4f46e5', class: 'bg-indigo-600' },
  { name: 'Amber', hex: '#d97706', class: 'bg-amber-600' },
  { name: 'Emerald', hex: '#059669', class: 'bg-emerald-600' },
];

const translations = {
  en: {
    intelligence: 'Intelligence',
    registry: 'Registry',
    newLog: 'New Log',
    backup: 'Backup',
    syncing: 'Syncing...',
    synced: 'Synced',
    syncFailed: 'Sync Failed',
    offline: 'Offline',
    monthlyInflow: 'Monthly Inflow',
    monthlyOutflow: 'Monthly Outflow',
    periodSurplus: 'Period Surplus',
    lifetimeVault: 'Lifetime Vault',
    strategy: 'Financial Strategy',
    insightEngine: 'Insight Engine',
    allocationMix: 'Allocation Mix',
    dailyFlux: 'Daily Flux',
    primaryLedger: 'Primary Ledger',
    activeSequence: 'Active sequence for',
    timestamp: 'Timestamp',
    classification: 'Classification',
    narrative: 'Narrative',
    value: 'Value',
    action: 'Action',
    recordEntry: 'Record Entry',
    income: 'Income',
    expense: 'Expense',
    sequenceDate: 'Sequence Date',
    select: 'Select...',
    details: 'Details...',
    continuousMode: 'Continuous Input Mode',
    entryLogged: 'Entry Logged',
    commitEntry: 'Commit Entry',
    saveContinue: 'Save & Continue',
    systemConfig: 'System Config',
    corePreferences: 'Core Preferences',
    identity: 'Identify User',
    currency: 'Currency',
    language: 'Language',
    networkSync: 'Network Sync (Shared Account)',
    deployConfig: 'Save Settings',
    active: 'Active',
    noData: 'No Data',
    analyzing: 'Analyzing your patterns...',
    noInfo: 'No information for this month.',
    recentFeed: 'Recent Feed',
    uploadLogo: 'Change Logo/Profile',
    sharedAccountTip: 'Use the same Sync URL on multiple devices (2-3 people) to share this account.',
    themeColor: 'Theme Color',
    syncNow: 'Sync Now',
    sharedModeActive: 'Shared Mode Active',
    lastSynced: 'Last Synced',
    exportData: 'Export Excel',
    categories: {
      business: 'Business',
      others: 'Others',
      food: 'Food',
      shopping: 'Shopping',
      wifi: 'WiFi Bill',
      electricity: 'Electricity Bill',
      businessExp: 'Business Expense'
    }
  },
  bn: {
    intelligence: 'বুদ্ধিমত্তা',
    registry: 'রেজিস্ট্রি',
    newLog: 'নতুন লগ',
    backup: 'ব্যাকআপ',
    syncing: 'সিঙ্ক হচ্ছে...',
    synced: 'সিঙ্ক হয়েছে',
    syncFailed: 'ব্যর্থ হয়েছে',
    offline: 'অফলাইন',
    monthlyInflow: 'মাসিক আয়',
    monthlyOutflow: 'মাসিক ব্যয়',
    periodSurplus: 'মাসিক উদ্বৃত্ত',
    lifetimeVault: 'মোট সঞ্চয়',
    strategy: 'আর্থিক কৌশল',
    insightEngine: 'অ্যালগরিদমিক ইঞ্জিন',
    allocationMix: 'খরচ বিভাজন',
    dailyFlux: 'দৈনিক প্রবাহ',
    primaryLedger: 'প্রধান লেজার',
    activeSequence: 'বর্তমান সময়কাল:',
    timestamp: 'সময়',
    classification: 'শ্রেণীবিভাগ',
    narrative: 'বিবরণ',
    value: 'পরিমাণ',
    action: 'অ্যাকশন',
    recordEntry: 'এন্ট্রি রেকর্ড করুন',
    income: 'আয়',
    expense: 'ব্যয়',
    sequenceDate: 'তারিখ',
    select: 'নির্বাচন করুন...',
    details: 'বিস্তারিত...',
    continuousMode: 'কন্টিনিউয়াস ইনপুট মোড',
    entryLogged: 'এন্ট্রি সেভ হয়েছে',
    commitEntry: 'এন্ট্রি জমা দিন',
    saveContinue: 'সেভ এবং কন্টিনিউ',
    systemConfig: 'সিস্টেম কনফিগ',
    corePreferences: 'মূল সেটিিংস',
    identity: 'ব্যবহারকারীর নাম',
    currency: 'কারেন্সি',
    language: 'ভাষা',
    networkSync: 'নেটওয়ার্ক সিঙ্ক (শেয়ারড একাউন্ট)',
    deployConfig: 'সেটিংস সেভ করুন',
    active: 'সক্রিয়',
    noData: 'তথ্য নেই',
    analyzing: 'পরিচালনা বিশ্লেষণ করা হচ্ছে...',
    noInfo: 'এই মাসের কোনো তথ্য নেই।',
    recentFeed: 'সাম্প্রতিক তথ্য',
    uploadLogo: 'লগো বা ছবি পরিবর্তন',
    sharedAccountTip: '২-৩ জন মিলে এক একাউন্ট ব্যবহার করতে চাইলে একই সিঙ্ক ইউআরএল ব্যবহার করুন।',
    themeColor: 'থিম কালার',
    syncNow: 'এখনই সিঙ্ক করুন',
    sharedModeActive: 'শেয়ারড মোড সক্রিয়',
    lastSynced: 'সর্বশেষ সিঙ্ক',
    exportData: 'এক্সেল এক্সপোর্ট',
    categories: {
      business: 'ব্যবসা',
      others: 'অন্যান্য',
      food: 'ফুড',
      shopping: 'সপিং',
      wifi: 'ওয়িফাই বিল',
      electricity: 'কারেন্ট বিল',
      businessExp: 'ব্যবসায়িক খরচ'
    }
  }
};

const App: React.FC = () => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<UserSettings>({ 
    name: 'Greater Gifts', 
    currency: '৳', 
    syncUrl: '', 
    language: 'bn', 
    themeColor: '#ec4899' // Default pink
  });
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [isAdding, setIsAdding] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Form States
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [keepOpen, setKeepOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Settings Temp States
  const [tempName, setTempName] = useState(user.name);
  const [tempCurrency, setTempCurrency] = useState(user.currency);
  const [tempSyncUrl, setTempSyncUrl] = useState(user.syncUrl || '');
  const [tempLang, setTempLang] = useState<Language>(user.language);
  const [tempAvatar, setTempAvatar] = useState(user.avatar || '');
  const [tempTheme, setTempTheme] = useState(user.themeColor);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[user.language];

  // Persistence
  useEffect(() => {
    const savedTransactions = localStorage.getItem('lumina_transactions');
    const savedUser = localStorage.getItem('lumina_user');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setTempName(parsedUser.name);
      setTempCurrency(parsedUser.currency);
      setTempSyncUrl(parsedUser.syncUrl || '');
      setTempLang(parsedUser.language || 'bn');
      setTempAvatar(parsedUser.avatar || '');
      setTempTheme(parsedUser.themeColor || '#ec4899');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('lumina_user', JSON.stringify(user));
  }, [user]);

  // Sync / Shared Account Logic
  const pushToShared = useCallback(async (data: Transaction[]) => {
    const cleanUrl = user.syncUrl?.trim();
    if (!cleanUrl || !cleanUrl.startsWith('http')) return;
    
    setSyncStatus('syncing');
    try {
      await fetch(cleanUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'push',
          userName: user.name,
          currency: user.currency,
          transactions: data,
          language: user.language,
          avatar: user.avatar,
          themeColor: user.themeColor,
          lastUpdated: new Date().toISOString()
        })
      });
      setSyncStatus('success');
      setLastSyncedTime(new Date().toLocaleTimeString());
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    }
  }, [user]);

  const fetchFromShared = useCallback(async () => {
    const cleanUrl = user.syncUrl?.trim();
    if (!cleanUrl || !cleanUrl.startsWith('http')) return;

    setSyncStatus('syncing');
    try {
      const response = await fetch(cleanUrl);
      const remoteData = await response.json();
      
      if (remoteData && remoteData.transactions) {
        setTransactions(remoteData.transactions);
        if (remoteData.themeColor) setUser(prev => ({ ...prev, themeColor: remoteData.themeColor }));
        if (remoteData.avatar) setUser(prev => ({ ...prev, avatar: remoteData.avatar }));
        setSyncStatus('success');
        setLastSyncedTime(new Date().toLocaleTimeString());
      } else {
        setSyncStatus('idle');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setSyncStatus('error');
    } finally {
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, [user.syncUrl]);

  // Auto-sync polling
  useEffect(() => {
    if (!user.syncUrl) return;
    fetchFromShared();
    const interval = setInterval(fetchFromShared, 30000);
    return () => clearInterval(interval);
  }, [user.syncUrl, fetchFromShared]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Export Logic
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions.map(tr => ({
      Date: tr.date,
      Type: tr.type.toUpperCase(),
      Category: tr.category,
      Description: tr.description,
      Amount: tr.amount,
      Currency: user.currency
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    XLSX.writeFile(workbook, `${user.name}_Expense_Tracker_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Calculations
  const filteredTransactions = useMemo(() => transactions.filter(tr => tr.date.startsWith(selectedMonth)), [transactions, selectedMonth]);

  const summary = useMemo(() => {
    const income = filteredTransactions.filter(tr => tr.type === 'income').reduce((s, tr) => s + tr.amount, 0);
    const expense = filteredTransactions.filter(tr => tr.type === 'expense').reduce((s, tr) => s + tr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const globalSummary = useMemo(() => {
    const totalIncome = transactions.filter(tr => tr.type === 'income').reduce((s, tr) => s + tr.amount, 0);
    const totalExpense = transactions.filter(tr => tr.type === 'expense').reduce((s, tr) => s + tr.amount, 0);
    return { totalIncome, totalExpense, totalBalance: totalIncome - totalExpense };
  }, [transactions]);

  // AI Advice
  useEffect(() => {
    if (filteredTransactions.length > 0) {
      const fetchAdvice = async () => {
        setLoadingAdvice(true);
        try {
          const advice = await getFinancialAdvice(filteredTransactions, user.name);
          setAiAdvice(advice);
        } catch (error) {
          setAiAdvice(user.language === 'bn' ? "আয় ও ব্যয়ের ভারসাম্য রক্ষা করুন।" : "Balance your income and expenses.");
        } finally {
          setLoadingAdvice(false);
        }
      };
      const debounce = setTimeout(fetchAdvice, 2000);
      return () => clearTimeout(debounce);
    } else {
      setAiAdvice(t.noInfo);
    }
  }, [filteredTransactions, user.name, user.language, t.noInfo]);

  const CHART_COLORS = [user.themeColor, '#2dd4bf', '#a855f7', '#6366f1', '#f43f5e', '#f97316', '#eab308', '#22c55e'];

  const chartData = useMemo(() => {
    const data = filteredTransactions.filter(tr => tr.type === 'expense').reduce((acc: any[], tr) => {
      const existing = acc.find(item => item.name === tr.category);
      if (existing) existing.value += tr.amount;
      else acc.push({ name: tr.category, value: tr.amount });
      return acc;
    }, []);
    return data.length > 0 ? data : [{ name: t.noData, value: 1 }];
  }, [filteredTransactions, t.noData]);

  const trendData = useMemo(() => {
    const year = parseInt(selectedMonth.split('-')[0]);
    const month = parseInt(selectedMonth.split('-')[1]);
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      const d = `${selectedMonth}-${day}`;
      const dayTransactions = filteredTransactions.filter(tr => tr.date === d);
      return {
        date: day,
        income: dayTransactions.filter(tr => tr.type === 'income').reduce((s, tr) => s + tr.amount, 0),
        expense: dayTransactions.filter(tr => tr.type === 'expense').reduce((s, tr) => s + tr.amount, 0),
      };
    });
  }, [filteredTransactions, selectedMonth]);

  // Actions
  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: Math.abs(parseFloat(amount)),
      type,
      category,
      description: description || category,
      date,
    };
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    pushToShared(updated);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    if (keepOpen) {
      setAmount('');
      setDescription('');
    } else {
      setSelectedMonth(date.slice(0, 7));
      setAmount('');
      setCategory('');
      setDescription('');
      setIsAdding(false);
    }
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(tr => tr.id !== id);
    setTransactions(updated);
    pushToShared(updated);
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const newUserSettings = { 
      ...user,
      name: tempName, 
      currency: tempCurrency, 
      syncUrl: tempSyncUrl.trim(), 
      language: tempLang, 
      avatar: tempAvatar,
      themeColor: tempTheme
    };
    setUser(newUserSettings);
    setIsSettingsOpen(false);
    if (tempSyncUrl.trim()) pushToShared(transactions);
  };

  const changeMonth = (offset: number) => {
    const d = new Date(selectedMonth + '-01');
    d.setMonth(d.getMonth() + offset);
    setSelectedMonth(d.toISOString().slice(0, 7));
  };

  // Styles
  const themeStyle = { color: user.themeColor };
  const themeBgStyle = { backgroundColor: user.themeColor };
  const themeBorderColorStyle = { borderColor: user.themeColor };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 min-h-screen">
      {/* Top Banner */}
      {user.syncUrl && (
        <div className="mb-6 animate-slide-in flex flex-col md:flex-row items-center justify-center gap-3 py-2 px-6 glass rounded-2xl border-dashed border-white/20">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-teal-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-teal-400/80">{t.sharedModeActive}</span>
          </div>
          {lastSyncedTime && (
            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
              <Clock className="w-3 h-3 text-slate-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.lastSynced}: {lastSyncedTime}</span>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-8 animate-slide-in">
        <div className="flex items-center gap-5">
          <div 
            className="relative p-1 rounded-full shadow-2xl overflow-hidden group cursor-pointer transition-transform hover:scale-105 active:scale-95" 
            style={{ background: `linear-gradient(to bottom right, ${user.themeColor}, #2dd4bf)` }}
            onClick={() => setIsSettingsOpen(true)}
          >
            {user.avatar ? (
              <img src={user.avatar} alt="Logo" className="w-16 h-16 rounded-full object-cover bg-[#06211a]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#06211a] flex items-center justify-center">
                <span className="text-white font-black text-lg">GG</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent transition-all" style={{ backgroundImage: `linear-gradient(to right, ${user.themeColor}, #ffffff, #2dd4bf)` }}>
              {user.name.toUpperCase()}
            </h1>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={themeBgStyle}></span>
              {user.name}'s {t.insightEngine}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.syncUrl && (
            <button 
              onClick={fetchFromShared}
              className={`glass px-5 py-3 rounded-2xl flex items-center gap-3 transition-all hover:bg-white/5 active:scale-95 shadow-lg group ${syncStatus === 'error' ? 'text-rose-400' : 'text-slate-300'}`}
            >
              {syncStatus === 'syncing' ? <RefreshCw className="w-4 h-4 animate-spin" style={themeStyle} /> : 
               syncStatus === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
               syncStatus === 'error' ? <CloudOff className="w-4 h-4" /> : <RefreshCw className="w-4 h-4 opacity-50 transition-transform group-hover:rotate-180" />}
              <span className="text-[10px] font-black uppercase tracking-wider hidden md:inline">
                {syncStatus === 'syncing' ? t.syncing : syncStatus === 'error' ? t.syncFailed : t.syncNow}
              </span>
            </button>
          )}
          <div className="glass flex items-center p-1 rounded-2xl">
            <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-white/5 rounded-xl text-slate-400 active:scale-90"><ChevronLeft className="w-4 h-4" /></button>
            <div className="px-4 text-[10px] font-black uppercase min-w-[120px] text-center tracking-tighter" style={themeStyle}>
              {new Date(selectedMonth).toLocaleString(user.language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', year: 'numeric' })}
            </div>
            <button onClick={() => changeMonth(1)} className="p-3 hover:bg-white/5 rounded-xl text-slate-400 active:scale-90"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="glass glass-hover p-4 rounded-2xl active:scale-90"><Settings className="w-5 h-5 text-slate-300" /></button>
          <button onClick={() => setIsAdding(true)} className="text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-xs font-black uppercase shadow-xl group transition-all active:scale-95" style={{ ...themeBgStyle, boxShadow: `0 10px 30px -10px ${user.themeColor}88` }}>
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>{t.newLog}</span>
          </button>
        </div>
      </nav>

      {/* Hero Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: t.monthlyInflow, val: summary.income, icon: ArrowUpCircle, color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { label: t.monthlyOutflow, val: summary.expense, icon: ArrowDownCircle, color: '', customColor: user.themeColor, bg: `${user.themeColor}1a` },
          { label: t.periodSurplus, val: summary.balance, icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: t.lifetimeVault, val: globalSummary.totalBalance, icon: Wallet, color: 'text-white', bg: `linear-gradient(to bottom right, ${user.themeColor}, #7c3aed)` }
        ].map((item, idx) => (
          <div key={idx} className={`p-8 rounded-[2.5rem] transition-all duration-500 hover:translate-y-[-6px] shadow-2xl ${idx === 3 ? '' : 'glass'}`} style={idx === 3 ? { background: item.bg, boxShadow: `0 25px 40px -10px ${user.themeColor}44` } : {}}>
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-[1.5rem] shadow-inner`} style={idx === 3 ? { background: 'rgba(255,255,255,0.15)' } : (item.customColor ? { backgroundColor: item.bg } : {})}>
                <item.icon className={`w-6 h-6 ${idx === 3 ? 'text-white' : item.color}`} style={!item.color && idx !== 3 ? { color: item.customColor } : {}} />
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${idx === 3 ? 'text-white/70' : 'text-slate-500'}`}>{item.label}</p>
                <p className="text-3xl font-bold tracking-tight">{user.currency}{item.val.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2 bg-black/30 p-2 rounded-2xl w-fit border border-white/5">
              <button onClick={() => setActiveTab('overview')} className={`px-10 py-3 rounded-xl text-[11px] font-black transition-all uppercase tracking-widest ${activeTab === 'overview' ? 'text-white shadow-2xl' : 'text-slate-500 hover:text-slate-300'}`} style={activeTab === 'overview' ? themeBgStyle : {}}>{t.intelligence}</button>
              <button onClick={() => setActiveTab('transactions')} className={`px-10 py-3 rounded-xl text-[11px] font-black transition-all uppercase tracking-widest ${activeTab === 'transactions' ? 'text-white shadow-2xl' : 'text-slate-500 hover:text-slate-300'}`} style={activeTab === 'transactions' ? themeBgStyle : {}}>{t.registry}</button>
            </div>
            
            <button 
              onClick={exportToExcel}
              className="glass glass-hover px-6 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {t.exportData}
            </button>
          </div>

          {activeTab === 'overview' ? (
            <div className="space-y-10 animate-slide-in">
              <div className="glass p-1 rounded-[3rem] bg-gradient-to-r from-pink-500/20 via-teal-500/20 to-transparent">
                <div className="glass-dark p-10 rounded-[2.9rem] relative overflow-hidden">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><Sparkles className="w-6 h-6" style={themeStyle} /></div>
                    <div><h3 className="text-xl font-black text-white tracking-tight">{t.strategy}</h3><p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{t.insightEngine}</p></div>
                    {loadingAdvice && <div className="flex gap-1.5 ml-auto"><div className="w-1.5 h-1.5 rounded-full animate-bounce" style={themeBgStyle}></div><div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]" style={themeBgStyle}></div><div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]" style={themeBgStyle}></div></div>}
                  </div>
                  <div className="space-y-5">
                    {(aiAdvice || t.analyzing).split('\n').filter(l => l.trim()).map((line, i) => (
                      <div key={i} className="flex gap-5 p-5 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors"><div className="w-2 h-2 rounded-full mt-2.5 shrink-0 shadow-lg" style={themeBgStyle}></div><p className="text-slate-200 text-sm leading-relaxed font-medium">{line.replace(/^[-•*]\s*/, '')}</p></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-10 rounded-[3rem]"><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-12 flex items-center gap-3"><PieChart className="w-5 h-5" style={themeStyle} /> {t.allocationMix}</h4><div className="h-[280px]"><ResponsiveContainer><RePieChart><Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={10} dataKey="value" stroke="none">{chartData.map((_, i) => <Cell key={`c-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} /><Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} /></RePieChart></ResponsiveContainer></div></div>
                <div className="glass p-10 rounded-[3rem]"><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-12 flex items-center gap-3"><TrendingUp className="w-5 h-5 text-teal-400" /> {t.dailyFlux}</h4><div className="h-[280px]"><ResponsiveContainer><BarChart data={trendData}><XAxis dataKey="date" hide /><Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} /><Bar dataKey="income" fill="#2dd4bf" radius={[6, 6, 6, 6]} barSize={4} /><Bar dataKey="expense" fill={user.themeColor} radius={[6, 6, 6, 6]} barSize={4} /></BarChart></ResponsiveContainer></div></div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-[3rem] overflow-hidden animate-slide-in shadow-2xl border border-white/5">
              <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                <h3 className="text-2xl font-black tracking-tight">{t.primaryLedger}</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{t.activeSequence} {new Date(selectedMonth).toLocaleString(user.language === 'bn' ? 'bn-BD' : 'en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[11px] font-black uppercase text-slate-500 border-b border-white/5 bg-white/[0.02]">
                    <tr><th className="px-10 py-6">{t.timestamp}</th><th className="px-10 py-6">{t.classification}</th><th className="px-10 py-6">{t.narrative}</th><th className="px-10 py-6">{t.value}</th><th className="px-10 py-6 text-right">{t.action}</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {filteredTransactions.map(tr => (
                      <tr key={tr.id} className="group hover:bg-white/[0.02] transition-colors"><td className="px-10 py-6 text-xs font-bold text-slate-400">{new Date(tr.date).toLocaleDateString(user.language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' })}</td><td className="px-10 py-6"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-white/5`} style={{ backgroundColor: `${tr.type === 'income' ? '#2dd4bf' : user.themeColor}1a`, color: tr.type === 'income' ? '#2dd4bf' : user.themeColor }}>{tr.category}</span></td><td className="px-10 py-6 text-sm font-bold text-slate-200">{tr.description}</td><td className={`px-10 py-6 text-base font-black`} style={tr.type === 'income' ? { color: '#2dd4bf' } : { color: '#f8fafc' }}>{tr.type === 'income' ? '+' : '-'}{user.currency}{tr.amount.toLocaleString()}</td><td className="px-10 py-6 text-right"><button onClick={() => deleteTransaction(tr.id)} className="p-3 rounded-2xl bg-white/[0.03] text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500/10"><Trash2 className="w-5 h-5" /></button></td></tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr><td colSpan={5} className="px-10 py-32 text-center text-slate-500 font-bold text-sm tracking-wide">{t.noInfo}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="glass p-10 rounded-[3rem] sticky top-8 space-y-10 shadow-2xl">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
               <Layers className="w-4 h-4" /> {t.recentFeed}
            </h3>
            <div className="space-y-8">
              {filteredTransactions.slice(0, 5).map(tr => (
                <div key={tr.id} className="flex items-center gap-5 group cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-white/5 transition-transform group-hover:scale-110`} style={{ backgroundColor: `${tr.type === 'income' ? '#2dd4bf' : user.themeColor}1a`, color: tr.type === 'income' ? '#2dd4bf' : user.themeColor }}>
                    {tr.type === 'income' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-black text-slate-100 truncate mb-0.5">{tr.description}</p><p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{tr.category}</p></div>
                  <div className={`text-sm font-black text-right`} style={tr.type === 'income' ? { color: '#2dd4bf' } : { color: '#f8fafc' }}>{user.currency}{tr.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setIsAdding(true)} className="w-full text-white py-5 rounded-[2rem] text-xs font-black uppercase shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 hover:brightness-110" style={themeBgStyle}>{t.newLog} <ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* Entry Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsAdding(false)}></div>
          <div className="glass w-full max-w-xl p-12 rounded-[3.5rem] relative animate-in slide-in-from-bottom-12 max-h-[95vh] overflow-y-auto shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            <button onClick={() => setIsAdding(false)} className="absolute top-10 right-10 p-4 bg-white/5 rounded-3xl hover:bg-white/10 transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            <h2 className="text-3xl font-black tracking-tight mb-3">{t.recordEntry}</h2>
            <form onSubmit={addTransaction} className="space-y-8 mt-10">
              <div className="flex p-2 bg-black/50 rounded-[1.8rem] border border-white/10">
                <button type="button" onClick={() => setType('expense')} className={`flex-1 py-4 rounded-[1.3rem] text-[11px] font-black uppercase transition-all tracking-widest ${type === 'expense' ? 'text-white shadow-2xl' : 'text-slate-500'}`} style={type === 'expense' ? themeBgStyle : {}}>{t.expense}</button>
                <button type="button" onClick={() => setType('income')} className={`flex-1 py-4 rounded-[1.3rem] text-[11px] font-black uppercase transition-all tracking-widest ${type === 'income' ? 'bg-teal-600 text-white shadow-2xl' : 'text-slate-500'}`}>{t.income}</button>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-3">{t.value}</label><input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-2xl font-black text-white focus:outline-none focus:border-white/20 transition-all" /></div>
                <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-3">{t.sequenceDate}</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-xs font-black text-white focus:outline-none focus:border-white/20 transition-all" /></div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-3">{t.classification}</label>
                <div className="relative">
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full bg-slate-900 border border-white/10 rounded-3xl py-5 px-6 text-xs font-black text-white focus:outline-none appearance-none cursor-pointer hover:border-white/20 transition-all">
                    <option value="" disabled className="text-slate-500">{t.select}</option>
                    {type === 'income' ? (
                      <optgroup label={t.income} className="bg-slate-900 text-teal-400">
                        <option value={t.categories.business} className="bg-slate-900">{t.categories.business}</option>
                        <option value={t.categories.others} className="bg-slate-900">{t.categories.others}</option>
                      </optgroup>
                    ) : (
                      <optgroup label={t.expense} className="bg-slate-900" style={themeStyle}>
                        <option value={t.categories.food} className="bg-slate-900">{t.categories.food}</option>
                        <option value={t.categories.shopping} className="bg-slate-900">{t.categories.shopping}</option>
                        <option value={t.categories.wifi} className="bg-slate-900">{t.categories.wifi}</option>
                        <option value={t.categories.electricity} className="bg-slate-900">{t.categories.electricity}</option>
                        <option value={t.categories.businessExp} className="bg-slate-900">{t.categories.businessExp}</option>
                        <option value={t.categories.others} className="bg-slate-900">{t.categories.others}</option>
                      </optgroup>
                    )}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-3">{t.narrative}</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.details} className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-sm font-bold text-white focus:outline-none focus:border-white/20 transition-all" /></div>
              <div className="pt-6 space-y-6">
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setKeepOpen(!keepOpen)}><div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all group-hover:scale-110 ${keepOpen ? 'border-none shadow-lg' : 'border-white/10'}`} style={keepOpen ? themeBgStyle : {}}>{keepOpen && <CheckCircle2 className="w-4 h-4 text-white" />}</div><span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.continuousMode}</span></div>
                  {showSuccess && <div className="text-teal-400 text-[11px] font-black uppercase tracking-widest animate-pulse">{t.entryLogged}</div>}
                </div>
                <button type="submit" className="w-full bg-white text-slate-950 py-6 rounded-[2.2rem] font-black text-sm uppercase shadow-2xl transition-all active:scale-95 hover:bg-slate-100">{keepOpen ? t.saveContinue : t.commitEntry}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="glass w-full max-w-lg p-12 rounded-[3.5rem] relative animate-in zoom-in overflow-y-auto max-h-[95vh] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-10 right-10 p-4 bg-white/5 rounded-3xl hover:bg-white/10 transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            <h2 className="text-3xl font-black tracking-tight mb-3">{t.systemConfig}</h2>
            <form onSubmit={saveSettings} className="space-y-8 mt-10">
              {/* Profile Pic Upload */}
              <div className="flex flex-col items-center gap-5 py-6">
                 <div className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => fileInputRef.current?.click()}>
                    {tempAvatar ? (
                      <img src={tempAvatar} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 shadow-2xl" style={themeBorderColorStyle} />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center transition-colors group-hover:border-white/40 shadow-inner">
                        <Camera className="w-8 h-8 text-slate-500" />
                        <span className="text-[9px] font-black uppercase text-slate-500 mt-3 tracking-widest">Upload</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                 </div>
                 <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">{t.uploadLogo}</p>
                 <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
              </div>

              <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-3">{t.identity}</label><input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-sm font-black text-white focus:outline-none focus:border-white/20 transition-all shadow-inner" /></div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-3">{t.currency}</label>
                  <select value={tempCurrency} onChange={(e) => setTempCurrency(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-3xl py-5 px-6 text-xs font-black text-white focus:outline-none appearance-none shadow-inner">
                    <option value="$" className="bg-slate-900">$ (USD)</option>
                    <option value="৳" className="bg-slate-900">৳ (BDT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-3">{t.language}</label>
                  <div className="relative">
                    <select value={tempLang} onChange={(e) => setTempLang(e.target.value as Language)} className="w-full bg-slate-900 border border-white/10 rounded-3xl py-5 px-6 text-xs font-black text-white focus:outline-none appearance-none shadow-inner">
                      <option value="en" className="bg-slate-900">English</option>
                      <option value="bn" className="bg-slate-900">বাংলা</option>
                    </select>
                    <Languages className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-5 ml-3 flex items-center gap-3">
                  <Palette className="w-4 h-4" /> {t.themeColor}
                </label>
                <div className="flex flex-wrap gap-4 px-3">
                  {THEME_OPTIONS.map((opt) => (
                    <button
                      key={opt.hex}
                      type="button"
                      onClick={() => setTempTheme(opt.hex)}
                      className={`w-10 h-10 rounded-full transition-all border-4 shadow-lg ${tempTheme === opt.hex ? 'border-white scale-115 rotate-6' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-110'}`}
                      style={{ backgroundColor: opt.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-3">
                   {t.networkSync}
                </label>
                <div className="relative">
                  <input type="url" value={tempSyncUrl} onChange={(e) => setTempSyncUrl(e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-[10px] font-black text-slate-400 focus:outline-none pr-12 shadow-inner" />
                  <Users className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                </div>
                <p className="text-[10px] text-slate-500 mt-4 ml-3 font-bold italic opacity-80">{t.sharedAccountTip}</p>
              </div>

              <button type="submit" className="w-full text-white py-6 rounded-[2.2rem] font-black text-sm uppercase shadow-2xl transition-all active:scale-95 mt-6 hover:brightness-110" style={{ ...themeBgStyle, boxShadow: `0 20px 50px -10px ${tempTheme}66` }}>{t.deployConfig}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
