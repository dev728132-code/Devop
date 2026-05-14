export const DEFAULT_PLANS = [
  { id: '1-day', days: 1, price: 50, resellerPrice: 40 },
  { id: '3-days', days: 3, price: 100, resellerPrice: 80 },
  { id: '7-days', days: 7, price: 200, resellerPrice: 150 },
  { id: '15-days', days: 15, price: 350, resellerPrice: 280 },
  { id: '30-days', days: 30, price: 600, resellerPrice: 450 },
];

export const DEFAULT_PRODUCTS = [
  {
    id: "testing",
    title: "Testing",
    platform: "PC",
    description: "Testing fake payment",
    isActive: true,
    logo: "https://img.icons8.com/color/96/test-tube.png", // adding logo field
    plans: [
      { id: '1-day', days: 1, price: 2, resellerPrice: 2 },
    ]
  },
  {
    id: "br-mod-ff-pc",
    title: "BR MOD FF - PC VERSION",
    platform: "PC",
    description: "Premium Battle Royale modification for PC. Features enhanced aim assist and ESP.",
    isActive: true,
    plans: DEFAULT_PLANS
  },
  {
    id: "br-mod-ff-root-vphone",
    title: "BR MOD FF - ROOT + VPHONE",
    platform: "Android (Root / VPhone)",
    description: "Advanced BR modification customized specifically for rooted devices and VPhone emulators.",
    isActive: true,
    plans: DEFAULT_PLANS
  },
  {
    id: "dripclient-ff-pc-aimkill",
    title: "DRIPCLIENT FF - PC AIMKILL",
    platform: "PC",
    description: "Industry-leading DripClient with exclusive AimKill features for unmatched accuracy.",
    isActive: true,
    plans: DEFAULT_PLANS
  },
  {
    id: "dripclient-nonroot-ff",
    title: "DRIPCLIENT - NONROOT FF",
    platform: "Android (Non-Root)",
    description: "Safe & reliable DripClient for non-rooted Android files. Easy installation process.",
    isActive: true,
    plans: DEFAULT_PLANS
  },
  {
    id: "dripclient-root-ff",
    title: "DRIPCLIENT - ROOT FF",
    platform: "Android (Root)",
    description: "The ultimate DripClient experience with full memory access for rooted devices.",
    isActive: true,
    plans: DEFAULT_PLANS
  },
  {
    id: "hg-cheats-ff-nonroot-root",
    title: "HG CHEATS FF - NONROOT + ROOT",
    platform: "Android (All)",
    description: "Versatile HG Cheats suite compatible with both rooted and non-rooted environments.",
    isActive: true,
    plans: DEFAULT_PLANS
  },
  {
    id: "ios-ff-panel-all",
    title: "IOS FF PANEL - ALL",
    platform: "iOS",
    description: "Exclusive iOS Panel with complete features for iPhones and iPads. No jailbreak required.",
    isActive: true,
    plans: DEFAULT_PLANS
  },
  {
    id: "pato-team-ff-nonroot-root",
    title: "PATO TEAM FF - NONROOT + ROOT",
    platform: "Android (All)",
    description: "Official PATO Team modifications delivering top-tier performance for all Android devices.",
    isActive: true,
    plans: DEFAULT_PLANS
  },
  {
    id: "prime-hook-ff-nonroot",
    title: "PRIME HOOK FF - NONROOT",
    platform: "Android (Non-Root)",
    description: "Prime Hook integration for maximum safety and performance without root access.",
    isActive: true,
    plans: DEFAULT_PLANS
  },
  {
    id: "xyz-cheats-ff-root-vphone",
    title: "XYZ CHEATS FF - ROOT + VPHONE",
    platform: "Android (Root / VPhone)",
    description: "XYZ specialized cheats suite engineered for rooted systems and Virtual Phones.",
    isActive: true,
    plans: DEFAULT_PLANS
  }
];
