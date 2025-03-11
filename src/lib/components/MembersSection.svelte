<script lang="ts">
  let { title = 'Members Resources' } = $props();
  
  // Sample member resources - replace with actual data
  let resources = [
    {
      category: 'Revolt Server',
      items: [
        { name: 'Revolt Server Link', url: 'https://app.revolt.chat/invite/your-invite-code', description: 'Direct link to our Revolt server' },
        { name: 'Invite Codes', url: '/members/invite-codes', description: 'Generate invite codes for new members' }
      ]
    },
    {
      category: 'File Sharing',
      items: [
        { name: 'Document Library', url: '/members/documents', description: 'Access our shared document library' },
        { name: 'Resource Database', url: '/members/resources', description: 'Database of local resources and contacts' }
      ]
    },
    {
      category: 'Community',
      items: [
        { name: 'Event Calendar', url: '/members/events', description: 'Upcoming events and meetups' },
        { name: 'Member Directory', url: '/members/directory', description: 'Connect with other members in your area' }
      ]
    }
  ];
</script>

<section class="py-12 bg-gray-900">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold mb-8 text-center text-white">{title}</h2>
    
    <div class="max-w-4xl mx-auto">
      <div class="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
        <div class="bg-blue-800 text-white py-3 px-4">
          <h3 class="text-xl font-semibold">Members-Only Resources</h3>
        </div>
        
        {#each resources as category}
          <div class="border-b border-gray-700 last:border-b-0">
            <div class="bg-gray-700 px-4 py-3">
              <h4 class="text-lg font-medium text-white">{category.category}</h4>
            </div>
            <ul class="divide-y divide-gray-700">
              {#each category.items as item}
                <li class="p-4 hover:bg-gray-700">
                  <a href={item.url} class="block">
                    <div class="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h5 class="font-medium text-blue-400">{item.name}</h5>
                        <p class="text-gray-300 text-sm mt-1">{item.description}</p>
                      </div>
                      <div class="mt-2 md:mt-0">
                        <span class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-900 text-blue-200">
                          Access
                        </span>
                      </div>
                    </div>
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
