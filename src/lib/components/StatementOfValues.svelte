<script lang="ts">
  // Optional props for customizing the component
  export let showTitle: boolean = true;
  export let compactMode: boolean = false;
</script>

<div class={`bg-gray-800 rounded-lg shadow-md p-${compactMode ? '6' : '8'} border border-gray-700`}>
  {#if showTitle}
    <h2 class="text-2xl font-semibold mb-6 text-white">Statement of Values</h2>
  {/if}
  
  <div class="prose prose-invert max-w-none">
    <p class="text-gray-300 mb-4">
      We are a <strong class="text-blue-400">pro-American community</strong> that believes in the <strong class="text-blue-400">Constitution</strong>, <strong class="text-blue-400">Second Amendment rights</strong>, and <strong class="text-blue-400">conservative values</strong> while fostering <strong class="text-blue-400">respect, self-reliance, and community support</strong>. Our focus is on <strong class="text-blue-400">preparedness, sustainability, and self-sufficiency</strong>—not fear-driven prepping, but building resilient families and communities.
    </p>
    
    <p class="text-gray-300 mb-4">
      We are <strong class="text-blue-400">not a far-right militia group</strong> or an <strong class="text-blue-400">extremist organization</strong>. While many of our members hold <strong class="text-blue-400">faith-based and Christian values</strong>, we welcome all who <strong class="text-blue-400">believe in and live by the Golden Rule</strong>—treating others with respect, honesty, and fairness.
    </p>
    
    <p class="text-gray-300 mb-4">
      Our community is built on <strong class="text-blue-400">principles of freedom, responsibility, and resilience</strong>, with a commitment to:
    </p>
    
    <ul class="text-gray-300 mb-4 list-none space-y-2">
      <li class="flex items-start">
        <span class="text-green-500 mr-2">✔</span> 
        <span><strong class="text-blue-400">Faith, Family, & Freedom</strong> – Upholding moral values, personal responsibility, and individual liberty.</span>
      </li>
      <li class="flex items-start">
        <span class="text-green-500 mr-2">✔</span> 
        <span><strong class="text-blue-400">The Right to Defend & Provide</strong> – Supporting lawful <strong class="text-blue-400">firearms ownership, self-defense, and hunting</strong>.</span>
      </li>
      <li class="flex items-start">
        <span class="text-green-500 mr-2">✔</span> 
        <span><strong class="text-blue-400">Sustainability & Self-Sufficiency</strong> – Encouraging <strong class="text-blue-400">homesteading, local food production, and resourcefulness</strong>.</span>
      </li>
      <li class="flex items-start">
        <span class="text-green-500 mr-2">✔</span> 
        <span><strong class="text-blue-400">Preparedness with Purpose</strong> – Readiness for challenges <strong class="text-blue-400">without paranoia or fearmongering</strong>.</span>
      </li>
      <li class="flex items-start">
        <span class="text-green-500 mr-2">✔</span> 
        <span><strong class="text-blue-400">Respect & Integrity</strong> – Engaging in <strong class="text-blue-400">constructive, civil discourse without hostility or division</strong>.</span>
      </li>
    </ul>
    
    <p class="text-gray-300">
      We welcome those who share our <strong class="text-blue-400">love of country, freedom, and self-reliance</strong>, whether they are <strong class="text-blue-400">farmers, ranchers, homesteaders, tradesmen, parents, or patriots</strong>—people who are committed to <strong class="text-blue-400">building a strong and prepared future</strong> for themselves, their families, and their communities.
    </p>
  </div>
</div>
