import { LeagueTier, LeagueCompetitor, LeagueCycle, UserProfile } from '../types';

export const CONFIGURABLE_LEAGUE_TIERS: LeagueTier[] = [
  {
    id: 'league-bronze',
    name: 'Bronze League',
    minPoints: 0,
    icon: '🥉',
    color: '#CD7F32',
    badgeBg: 'bg-amber-950/40 border-amber-800/50 text-amber-300',
    promotionThresholdXP: 300,
  },
  {
    id: 'league-silver',
    name: 'Silver Stride',
    minPoints: 300,
    icon: '🥈',
    color: '#C0C0C0',
    badgeBg: 'bg-slate-800/50 border-slate-600/50 text-slate-200',
    promotionThresholdXP: 750,
  },
  {
    id: 'league-gold',
    name: 'Gold Momentum',
    minPoints: 750,
    icon: '🥇',
    color: '#F59E0B',
    badgeBg: 'bg-amber-900/40 border-amber-500/50 text-amber-200',
    promotionThresholdXP: 1400,
  },
  {
    id: 'league-platinum',
    name: 'Platinum Vanguard',
    minPoints: 1400,
    icon: '💎',
    color: '#38BDF8',
    badgeBg: 'bg-cyan-950/50 border-cyan-600/50 text-cyan-200',
    promotionThresholdXP: 2200,
  },
  {
    id: 'league-diamond',
    name: 'Diamond Master',
    minPoints: 2200,
    icon: '⚡',
    color: '#A855F7',
    badgeBg: 'bg-purple-950/50 border-purple-600/50 text-purple-200',
    promotionThresholdXP: 3200,
  },
  {
    id: 'league-elite',
    name: 'Obsidian Elite',
    minPoints: 3200,
    icon: '👑',
    color: '#E37210',
    badgeBg: 'bg-orange-950/60 border-[#E37210]/60 text-orange-200',
    promotionThresholdXP: 5000,
  },
];

/**
 * Generates active competition roster for the current user's league.
 * Realistic cohort names and scores that react smoothly to user habit completion.
 */
export function getLeagueRoster(
  user: UserProfile,
  weeklyPoints: number,
  tier: LeagueTier,
  cycle: 'this_week' | 'last_week' = 'this_week'
): LeagueCompetitor[] {
  // Baseline competitors tailored to this tier's scoring range
  const baselineCompetitors = [
    {
      id: 'comp-01',
      name: 'Amaka Eze',
      avatarInitials: 'AE',
      leagueId: tier.id,
      weeklyPoints: Math.max(tier.minPoints + 280, weeklyPoints + 45),
      totalPoints: 1350,
      rank: 1,
      rankDelta: 2,
      currentStreak: 16,
      achievementsCount: 7,
    },
    {
      id: 'comp-02',
      name: 'Babajide Adeleke',
      avatarInitials: 'BA',
      leagueId: tier.id,
      weeklyPoints: Math.max(tier.minPoints + 240, weeklyPoints + 20),
      totalPoints: 1290,
      rank: 2,
      rankDelta: 0,
      currentStreak: 12,
      achievementsCount: 5,
    },
    {
      id: 'comp-03',
      name: 'Chidinma O.',
      avatarInitials: 'CO',
      leagueId: tier.id,
      weeklyPoints: Math.max(tier.minPoints + 190, weeklyPoints - 15),
      totalPoints: 1180,
      rank: 3,
      rankDelta: -1,
      currentStreak: 10,
      achievementsCount: 6,
    },
    {
      id: 'comp-04',
      name: 'Tunde Bakare',
      avatarInitials: 'TB',
      leagueId: tier.id,
      weeklyPoints: Math.max(tier.minPoints + 150, weeklyPoints - 35),
      totalPoints: 1120,
      rank: 4,
      rankDelta: 1,
      currentStreak: 9,
      achievementsCount: 4,
    },
    {
      id: 'comp-05',
      name: 'Fatima Bello',
      avatarInitials: 'FB',
      leagueId: tier.id,
      weeklyPoints: Math.max(tier.minPoints + 110, weeklyPoints - 65),
      totalPoints: 980,
      rank: 5,
      rankDelta: 0,
      currentStreak: 8,
      achievementsCount: 3,
    },
    {
      id: 'comp-06',
      name: 'Emeka Nwosu',
      avatarInitials: 'EN',
      leagueId: tier.id,
      weeklyPoints: Math.max(tier.minPoints + 80, weeklyPoints - 90),
      totalPoints: 890,
      rank: 6,
      rankDelta: -2,
      currentStreak: 5,
      achievementsCount: 3,
    },
    {
      id: 'comp-07',
      name: 'Zainab Ahmed',
      avatarInitials: 'ZA',
      leagueId: tier.id,
      weeklyPoints: Math.max(tier.minPoints + 50, weeklyPoints - 120),
      totalPoints: 810,
      rank: 7,
      rankDelta: 1,
      currentStreak: 4,
      achievementsCount: 2,
    },
  ];

  // In "Last Week", freeze previous results
  if (cycle === 'last_week') {
    return [
      {
        id: 'comp-01',
        name: 'Amaka Eze',
        avatarInitials: 'AE',
        leagueId: tier.id,
        weeklyPoints: 460,
        totalPoints: 1200,
        rank: 1,
        rankDelta: 2,
        currentStreak: 15,
        achievementsCount: 7,
      },
      {
        id: 'user-self',
        name: user.name,
        avatarInitials: user.name.split(' ').map((n) => n[0]).join(''),
        leagueId: tier.id,
        weeklyPoints: 410,
        totalPoints: user.points - 60,
        rank: 2,
        rankDelta: 3,
        currentStreak: user.currentStreak - 1,
        achievementsCount: 5,
        isCurrentUser: true,
      },
      {
        id: 'comp-02',
        name: 'Babajide Adeleke',
        avatarInitials: 'BA',
        leagueId: tier.id,
        weeklyPoints: 395,
        totalPoints: 1150,
        rank: 3,
        rankDelta: 0,
        currentStreak: 11,
        achievementsCount: 5,
      },
      {
        id: 'comp-03',
        name: 'Chidinma O.',
        avatarInitials: 'CO',
        leagueId: tier.id,
        weeklyPoints: 340,
        totalPoints: 1060,
        rank: 4,
        rankDelta: -1,
        currentStreak: 9,
        achievementsCount: 6,
      },
      {
        id: 'comp-04',
        name: 'Tunde Bakare',
        avatarInitials: 'TB',
        leagueId: tier.id,
        weeklyPoints: 290,
        totalPoints: 980,
        rank: 5,
        rankDelta: 1,
        currentStreak: 8,
        achievementsCount: 4,
      },
    ];
  }

  // Inject current user into the live roster
  const currentUserCompetitor: LeagueCompetitor = {
    id: user.id,
    name: user.name,
    avatarInitials: user.name.split(' ').map((n) => n[0]).join(''),
    leagueId: tier.id,
    weeklyPoints: weeklyPoints,
    totalPoints: user.points,
    rank: 0, // calculated below
    rankDelta: 2, // Climbed 2 spots this week
    currentStreak: user.currentStreak,
    achievementsCount: 5,
    isCurrentUser: true,
  };

  const combined = [...baselineCompetitors, currentUserCompetitor];
  
  // Sort descending by weekly points
  combined.sort((a, b) => b.weeklyPoints - a.weeklyPoints);

  // Assign calculated ranks
  return combined.map((competitor, idx) => ({
    ...competitor,
    rank: idx + 1,
  }));
}

/**
 * Returns current league tier from total user points
 */
export function getLeagueTierForPoints(points: number): LeagueTier {
  for (let i = CONFIGURABLE_LEAGUE_TIERS.length - 1; i >= 0; i--) {
    if (points >= CONFIGURABLE_LEAGUE_TIERS[i].minPoints) {
      return CONFIGURABLE_LEAGUE_TIERS[i];
    }
  }
  return CONFIGURABLE_LEAGUE_TIERS[0];
}

/**
 * Returns the next promotion tier, or null if already at max tier
 */
export function getNextLeagueTier(currentTierId: string): LeagueTier | null {
  const idx = CONFIGURABLE_LEAGUE_TIERS.findIndex((t) => t.id === currentTierId);
  if (idx >= 0 && idx < CONFIGURABLE_LEAGUE_TIERS.length - 1) {
    return CONFIGURABLE_LEAGUE_TIERS[idx + 1];
  }
  return null;
}
