import React, { useState } from 'react';
import { Star, CheckCircle2, ShieldCheck, Heart, Sparkles, MessageSquareQuote } from 'lucide-react';

interface TestimonialCardData {
  id: string;
  name: string;
  handle: string;
  country: 'ID' | 'KH';
  flag: string;
  city: string;
  role: string;
  avatarInitials: string;
  avatarGradient: string;
  rating: number;
  timeAgo: string;
  purchasedProduct: string;
  comment: string;
  slangTag: string;
  emojis: string;
  likes: number;
}

const TESTIMONIALS_DATA: TestimonialCardData[] = [
  {
    id: 'testi-1',
    name: 'Rizky "Kikz" Pratama',
    handle: '@kikz_ads',
    country: 'ID',
    flag: '🇮🇩',
    city: 'Jakarta, Indonesia',
    role: 'Media Buyer Pro',
    avatarInitials: 'RP',
    avatarGradient: 'from-red-500 via-rose-600 to-red-700',
    rating: 5,
    timeAgo: '15m ago',
    purchasedProduct: 'FB Marketplace US Aged PVA',
    slangTag: 'Gokil & Auto Cuan',
    emojis: '🔥 💸 🤯',
    comment:
      'Anjir gokil bgt min! 🤯 Akun FB aged nya tahan banting parah, buat gas conversion ads ga pernah checkpoint samsek. Saldo landing sat-set under 15 detik! Auto cuan berjamaah, gaskeun scaling terus min! 🔥💸',
    likes: 47,
  },
  {
    id: 'testi-2',
    name: 'Sovan "Vann" Chea',
    handle: '@vann_agency_pp',
    country: 'KH',
    flag: '🇰🇭',
    city: 'Phnom Penh, Cambodia',
    role: 'E-Com Agency Lead',
    avatarInitials: 'SC',
    avatarGradient: 'from-blue-600 via-indigo-600 to-blue-800',
    rating: 5,
    timeAgo: '42m ago',
    purchasedProduct: 'Business Manager BM2500 Verified',
    slangTag: 'No Cap & Real Deal',
    emojis: '🚀 ⚡ 💎',
    comment:
      'No cap bro, Bodia Tech is crazy legit! 🚀 Ordered 20 Aged US PVA + Dolphin profile, credentials landed in Telegram in 10s. Best supplier in Phnom Penh hands down, smooth scaling no ban! Orkun thom thom 🙏✨',
    likes: 53,
  },
  {
    id: 'testi-3',
    name: 'Bintang "Kecap" Nugraha',
    handle: '@bintang_cuan',
    country: 'ID',
    flag: '🇮🇩',
    city: 'Surabaya, Indonesia',
    role: 'Affiliate Specialist',
    avatarInitials: 'BN',
    avatarGradient: 'from-amber-500 via-orange-600 to-red-600',
    rating: 5,
    timeAgo: '2h ago',
    purchasedProduct: 'Gmail Aged 2017 Clean Sender',
    slangTag: 'Sat-Set & Mantul Pisan',
    emojis: '🤙 🎯 🏆',
    comment:
      'Fast resp bgt sumpah, admin sat-set gapake lama! 😎 Sempet bingung setting 2FA secret key, langsung dibantu live care sampe tuntas. Akun Gmail aged 2017 nya joss gandos, open rate blast tembus 72%! Top markotop! 🏆🤙',
    likes: 39,
  },
  {
    id: 'testi-4',
    name: 'Dara Sokha',
    handle: '@dara_scaling',
    country: 'KH',
    flag: '🇰🇭',
    city: 'Siem Reap, Cambodia',
    role: 'Growth Hacker',
    avatarInitials: 'DS',
    avatarGradient: 'from-emerald-500 via-teal-600 to-emerald-700',
    rating: 5,
    timeAgo: '3h ago',
    purchasedProduct: 'Twitter/X Vintage 2012 PVA',
    slangTag: 'Smooth Like Butter',
    emojis: '🧈 🛡️ 💫',
    comment:
      'Bro this service is butter smooth fr fr! 🧈 BM 2500 run ads smoothly with zero shadowban. Already order 5 times this month, auto dispatch at 3 AM still fast as lightning! 100/10 recommended! 🔥🤝',
    likes: 41,
  },
];

export const Testimonials: React.FC = () => {
  const [likesState, setLikesState] = useState<{ [id: string]: number }>({});
  const [hasLiked, setHasLiked] = useState<{ [id: string]: boolean }>({});

  const handleLike = (id: string, initialLikes: number) => {
    if (hasLiked[id]) return;
    setLikesState((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + 1,
    }));
    setHasLiked((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-[20px] border border-slate-800/80 rounded-[30px] p-6 sm:p-10 lg:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-300">
      {/* Ambient background glows matching the hero card */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-8 mb-8 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-rose-500/40 text-red-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              COMMUNITY TESTIMONIALS
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-semibold">
              <span>🇰🇭</span> Cambodia
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-semibold">
              <span>🇮🇩</span> Indonesia
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>What Our Clients Say</span>
            <span className="text-xl">💬🔥</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl">
            Real feedback from media buyers, dropshippers, and growth hackers in Phnom Penh, Jakarta, Surabaya, and Siem Reap using casual regional slang!
          </p>
        </div>

        {/* Global Rating Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800/80 px-4 py-2.5 rounded-2xl shrink-0 self-start md:self-auto shadow-sm">
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">
              <strong className="text-white font-bold">4.98 / 5.0</strong> (1,480+ Orders)
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-600/15 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4 Cards Grid styled with identical glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {TESTIMONIALS_DATA.map((item) => {
          const currentLikes = likesState[item.id] ?? item.likes;
          const isLiked = !!hasLiked[item.id];

          return (
            <div
              key={item.id}
              className="group relative bg-slate-900/85 backdrop-blur-[16px] border border-slate-800/80 hover:border-rose-500/50 rounded-[24px] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-2 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(239,68,68,0.2)] flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top-right ambient flare */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-red-600/10 via-transparent to-transparent pointer-events-none" />

              <div>
                {/* Header Row: Avatar, Flag, Name & Role */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Gradient Avatar with Country Flag Badge */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.avatarGradient} p-0.5 shadow-md flex items-center justify-center text-white font-black text-sm tracking-wide`}
                      >
                        {item.avatarInitials}
                      </div>
                      <span
                        className="absolute -bottom-1 -right-1 text-xs p-0.5 bg-slate-900 rounded-full border border-slate-700 shadow"
                        title={item.city}
                      >
                        {item.flag}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors leading-tight truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5 leading-none truncate">
                        {item.handle}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium block mt-1 truncate">
                        {item.role}
                      </span>
                    </div>
                  </div>

                  {/* Slang pill */}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/60 border border-red-700/50 text-red-300 shrink-0">
                    {item.slangTag}
                  </span>
                </div>

                {/* Star rating & Verified badge */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] font-bold text-amber-400 ml-1">5.0</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified Order
                  </span>
                </div>

                {/* Casual Slang Comment */}
                <div className="relative py-1 mb-4">
                  <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed italic font-normal">
                    "{item.comment}"
                  </p>
                </div>
              </div>

              {/* Card Footer: SKU + Time & Like Button */}
              <div className="pt-3 border-t border-slate-800/80 mt-2">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-slate-500 font-mono text-[10px]">{item.timeAgo}</span>
                  <span className="text-xs">{item.emojis}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[10px] font-medium text-slate-300 bg-slate-900/90 px-2 py-1 rounded-md border border-slate-700/60 max-w-[70%]">
                    🛒 {item.purchasedProduct}
                  </span>

                  <button
                    onClick={() => handleLike(item.id, item.likes)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                      isLiked
                        ? 'bg-red-950/60 border-red-600 text-red-300'
                        : 'bg-slate-900/80 border-slate-800/80 hover:border-rose-500/40 text-slate-400 hover:text-white'
                    }`}
                    title="Helpful review"
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-red-500 text-rose-500' : 'text-rose-400'}`} />
                    <span>{currentLikes}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
