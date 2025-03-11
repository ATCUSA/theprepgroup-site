<script>
  export let title = 'Revolt Server Channels';
  
  // Channel data from the prompt file
  let categories = [
    {
      name: 'Homesteading 🏡',
      emoji: '🏡',
      description: 'Self-sufficiency & farming',
      channels: [
        { name: 'gardening-permaculture', emoji: '🌱', description: 'Raised beds, hydroponics, composting, worm bins' },
        { name: 'livestock-poultry', emoji: '🐓🐐', description: 'Chickens, rabbits, goats, beekeeping, feed sources' },
        { name: 'food-preservation-storage', emoji: '🥫', description: 'Canning, freeze-drying, dehydrating, root cellars' },
        { name: 'diy-projects', emoji: '🛠️', description: 'Homestead builds, homemade tools, off-grid solutions' },
        { name: 'equipment-maintenance', emoji: '🔧', description: 'Farm tools, machinery, repairs, upkeep' },
        { name: 'off-grid-alternative-energy', emoji: '🔋', description: 'Solar, wind, wood heat, battery backups' }
      ]
    },
    {
      name: 'Preparedness & Survival 🏕️',
      emoji: '🏕️',
      description: 'Readiness & self-reliance',
      channels: [
        { name: 'emergency-preparedness', emoji: '🚨', description: 'First aid, bug-out bags, shelter-in-place plans' },
        { name: 'medical-herbal-remedies', emoji: '🌿', description: 'First aid kits, herbal medicine, essential oils' },
        { name: 'wilderness-survival-skills', emoji: '🔥', description: 'Bushcraft, foraging, water purification' }
      ]
    },
    {
      name: 'Firearms, Ammo, & Tactical Training 🔫',
      emoji: '🔫',
      description: 'Defense & skill-building',
      channels: [
        { name: 'general-firearms-chat', emoji: '🏹', description: 'Talk about guns, laws, firearm maintenance' },
        { name: 'tactical-training-drills', emoji: '🎯', description: 'Defensive tactics, home defense, concealed carry' },
        { name: 'reloading-ammunition', emoji: '⚙️', description: 'DIY ammo, ballistics, reloading setups' },
        { name: 'gun-builds-modifications', emoji: '🔥', description: 'Custom guns, optics, accessories' },
        { name: 'hunting-firearms-equipment', emoji: '🦌', description: 'Rifles, bows, and gear for hunting' },
        { name: '2a-rights-legislation', emoji: '🇺🇸', description: 'News, legal discussions, and advocacy for the Second Amendment' }
      ]
    },
    {
      name: 'Hunting, Fishing & Wild Harvesting 🎯',
      emoji: '🎯',
      description: 'Sustainable food sourcing',
      channels: [
        { name: 'hunting-trapping', emoji: '🦌', description: 'Game prep, butchering, processing' },
        { name: 'fishing-aquaponics', emoji: '🎣', description: 'Freshwater/saltwater fishing, fish farming' },
        { name: 'foraging-wildcrafting', emoji: '🍄', description: 'Wild edibles, mushrooms, medicinal plants' }
      ]
    },
    {
      name: 'Cooking & Food 🍽️',
      emoji: '🍽️',
      description: 'Farm-to-table & food preservation',
      channels: [
        { name: 'general-cooking-chat', emoji: '🍳', description: 'Meal prep, recipes, kitchen talk' },
        { name: 'homestead-recipes', emoji: '📜', description: 'Farm-to-table, whole foods, family recipes' },
        { name: 'baking-breadmaking', emoji: '🍞', description: 'Sourdough, biscuits, pastries, baking tips' },
        { name: 'fermentation-dairy', emoji: '🧀', description: 'Yogurt, cheese, pickling, brewing' },
        { name: 'off-grid-survival-cooking', emoji: '🔥', description: 'Wood stoves, Dutch ovens, campfire meals' }
      ]
    },
    {
      name: 'DIY Home & Natural Living 🏠',
      emoji: '🏠',
      description: 'Homemade, sustainable solutions',
      channels: [
        { name: 'homemade-cleaners-soaps', emoji: '🧼', description: 'DIY soaps, detergents, household cleaners' },
        { name: 'diy-household-products', emoji: '🏺', description: 'Candles, personal care items, eco-friendly swaps' },
        { name: 'natural-pest-control', emoji: '🐜', description: 'Repellents, companion planting, organic solutions' }
      ]
    },
    {
      name: 'Faith ✝️',
      emoji: '✝️',
      description: 'Spirituality, prayer, and Christian fellowship',
      channels: [
        { name: 'faith-fellowship', emoji: '🙏', description: 'Bible study, prayer requests, devotionals' },
        { name: 'homestead-church', emoji: '🏡', description: 'Online/house church, spiritual discussions' },
        { name: 'faith-based-events-meetups', emoji: '📅', description: 'Christian retreats, Bible studies, prayer groups' }
      ]
    },
    {
      name: 'Community 🤝',
      emoji: '🤝',
      description: 'Barter, networking, and local collaboration',
      channels: [
        { name: 'barter-trade', emoji: '💰', description: 'Selling, trading, and exchanging local goods and services' },
        { name: 'skill-sharing', emoji: '🔨', description: 'Teaching and learning homesteading, survival, and DIY skills' },
        { name: 'local-networking', emoji: '🏡', description: 'Finding like-minded people, hiring help, and community projects' },
        { name: 'community-events-meetups', emoji: '📅', description: 'Workshops, work parties, and local gatherings' }
      ]
    },
    {
      name: 'Homeschooling & Education 🎓',
      emoji: '🎓',
      description: 'Raising self-sufficient, well-educated kids',
      channels: [
        { name: 'general-homeschool-chat', emoji: '💬', description: 'Connect with homeschool families' },
        { name: 'curriculum-lesson-plans', emoji: '📚', description: 'Share homeschool curricula, worksheets, plans' },
        { name: 'faith-based-homeschooling', emoji: '✝️', description: 'Christian education, devotionals, values' },
        { name: 'stem-hands-on-learning', emoji: '🔬', description: 'Science, technology, experiments, coding' },
        { name: 'outdoor-survival-education', emoji: '🌲', description: 'Teaching homesteading, survival, and nature' },
        { name: 'neurodivergent-learning', emoji: '🧩', description: 'Support for autistic, ADHD, and alternative learning styles' },
        { name: 'math-logic', emoji: '➗', description: 'Arithmetic, algebra, mental math tricks, and problem-solving' },
        { name: 'science-nature', emoji: '🔬', description: 'Chemistry, biology, physics, natural sciences' },
        { name: 'american-history-civics', emoji: '🇺🇸', description: 'U.S. history, Constitution, government structure' },
        { name: 'computers-technology', emoji: '🖥️', description: 'Coding, cybersecurity, IT, and digital literacy' },
        { name: 'homeschool-events-meetups', emoji: '📅', description: 'Co-ops, field trips, playdates, and activities' }
      ]
    },
    {
      name: 'News & Politics 🗞️',
      emoji: '🗞️',
      description: 'World events, policy discussions, and advocacy',
      channels: [
        { name: 'current-events-news', emoji: '🌍', description: 'General discussions on world events, economy, and trends' },
        { name: 'politics-policy-debate', emoji: '🏛️', description: 'Legislation, elections, and government policies' },
        { name: 'homestead-preparedness-news', emoji: '🌾', description: 'Agriculture laws, food security, and rural policy' }
      ]
    },
    {
      name: 'General Discussion 💬',
      emoji: '💬',
      description: 'Social & off-topic chat',
      channels: [
        { name: 'daily-life-chit-chat', emoji: '🎙️', description: 'Friendly discussions and casual talk' },
        { name: 'homestead-projects', emoji: '🏡', description: 'Share projects, progress, and ideas' },
        { name: 'marketplace-services', emoji: '🛒', description: 'Selling/buying used gear and services' },
        { name: 'general-events-meetups', emoji: '📅', description: 'Online hangouts, game nights, or non-category meetups' }
      ]
    }
  ];
</script>

<section class="py-12 bg-gray-900">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold mb-8 text-center text-white">{title}</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {#each categories as category}
        <div class="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 mb-8">
          <div class="bg-gray-700 text-white py-3 px-4">
            <h3 class="text-xl font-semibold flex items-center">
              <span>{category.name}</span>
              <span class="text-gray-400 text-sm ml-3">— {category.description}</span>
            </h3>
          </div>
          <ul class="divide-y divide-gray-700">
            {#each category.channels as channel}
              <li class="p-4 hover:bg-gray-700 transition-colors duration-200">
                <div class="flex flex-col">
                  <div class="flex items-center">
                    <span class="mr-2">{channel.emoji}</span>
                    <span class="text-blue-400 font-medium">#{channel.name}</span>
                  </div>
                  <span class="text-gray-400 text-sm mt-1">{channel.description}</span>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</section>
