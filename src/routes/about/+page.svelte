<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import FAQ from '$lib/components/FAQ.svelte';
  import StatementOfValues from '$lib/components/StatementOfValues.svelte';
  import { openAccessRequestModal } from '$lib/stores/modalStore';
  
  // Define the FAQ items for the about page
  const aboutFaqItems = [
    {
      question: "How do I join The Prep Group?",
      answer: "To join our community, click the \"Request Access\" button in the navigation or on our About page. Fill out the application form with your information, and our team will review your request."
    },
    {
      question: "Is membership free?",
      answer: "Yes, membership to The Prep Group is completely free. We're a community-driven organization focused on knowledge sharing and mutual support."
    },
    {
      question: "What activities does the group organize?",
      answer: "Our community engages in various activities including skill-sharing workshops, resource exchanges, online discussions, and occasional in-person meetups for local members. The specific activities vary based on community interests and needs."
    },
    {
      question: "How can I contribute to the community?",
      answer: "Members can contribute by sharing knowledge, participating in discussions, offering skills or resources, and helping to organize community activities. Everyone has something valuable to offer!"
    }
  ];
</script>

<svelte:head>
  <title>About - The Prep Group</title>
  <meta name="description" content="Learn about The Prep Group, our mission, values, and community focus." />
</svelte:head>

<Header />

<main>
  <section class="py-12 bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-8 text-white">About The Prep Group</h1>
        
        <div class="bg-gray-800 rounded-lg shadow-md p-8 mb-8 border border-gray-700">
          <h2 class="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
          <p class="text-gray-300 mb-6">
            The Prep Group is a community-focused organization dedicated to promoting self-sufficiency, preparedness, and resilient local networks. We believe in building strong communities that can thrive in any circumstance through knowledge sharing, skill development, and mutual support.
          </p>
          
          <h2 class="text-2xl font-semibold mb-4 text-white">Our Values</h2>
          <ul class="text-gray-300 mb-6 list-disc pl-6 space-y-2">
            <li><span class="font-medium text-blue-400">Self-Reliance</span> - Developing the skills and knowledge to be self-sufficient</li>
            <li><span class="font-medium text-blue-400">Community</span> - Building strong local networks of like-minded individuals</li>
            <li><span class="font-medium text-blue-400">Sustainability</span> - Promoting sustainable practices that benefit both people and the environment</li>
            <li><span class="font-medium text-blue-400">Knowledge Sharing</span> - Freely sharing skills, experience, and wisdom</li>
            <li><span class="font-medium text-blue-400">Preparedness</span> - Being ready for whatever challenges may arise</li>
          </ul>
          
          <h2 class="text-2xl font-semibold mb-4 text-white">What We Do</h2>
          <p class="text-gray-300 mb-6">
            Our community engages in a wide range of activities focused on homesteading, preparedness, and self-sufficiency:
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-gray-700 p-4 rounded-lg">
              <h3 class="text-xl font-medium mb-2 text-white">Skill Sharing</h3>
              <p class="text-gray-300">
                Regular workshops, online discussions, and hands-on training in essential skills from gardening to emergency preparedness.
              </p>
            </div>
            
            <div class="bg-gray-700 p-4 rounded-lg">
              <h3 class="text-xl font-medium mb-2 text-white">Community Support</h3>
              <p class="text-gray-300">
                Building networks of mutual aid and support among community members through our online platforms and in-person events.
              </p>
            </div>
            
            <div class="bg-gray-700 p-4 rounded-lg">
              <h3 class="text-xl font-medium mb-2 text-white">Resource Sharing</h3>
              <p class="text-gray-300">
                Curating and sharing valuable resources, guides, and information to help members on their journey toward self-sufficiency.
              </p>
            </div>
            
            <div class="bg-gray-700 p-4 rounded-lg">
              <h3 class="text-xl font-medium mb-2 text-white">Local Networking</h3>
              <p class="text-gray-300">
                Facilitating connections between local members for trading, bartering, and collaborative projects.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Statement of Values -->
        <div class="mb-8">
          <StatementOfValues />
        </div>
        
        <div class="bg-gray-800 rounded-lg shadow-md p-8 mb-8 border border-gray-700">
          <h2 class="text-2xl font-semibold mb-4 text-white">Group Management</h2>
          <p class="text-gray-300 mb-6">
            The Prep Group is managed by a dedicated group of founders who are committed to maintaining the integrity and purpose of our community. The founding members oversee all aspects of the group's operations, from content moderation to membership decisions.
          </p>
          
          <p class="text-gray-300 mb-6">
            Our leadership team carefully curates the community to ensure it remains focused on our core mission and values. We believe that a well-managed community provides the most value to all members and creates an environment where everyone can learn, share, and grow together.
          </p>
        </div>
        
        <div class="bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
          <h2 class="text-2xl font-semibold mb-4 text-white">Membership Policies</h2>
          <p class="text-gray-300 mb-6">
            The Prep Group is open to individuals who are committed to preparedness, self-sufficiency, and community building. We welcome people from all backgrounds who share our values and are interested in contributing to a resilient local network.
          </p>
          
          <p class="text-gray-300 mb-6">
            To maintain the quality and security of our community, we have a simple application process. This helps us ensure that new members align with our community values and will contribute positively to our shared goals.
          </p>
          
          <div class="bg-gray-700 p-5 rounded-lg mb-6 border-l-4 border-yellow-500">
            <h3 class="text-xl font-medium mb-2 text-white">Important Notice</h3>
            <p class="text-gray-300">
              The founding members reserve the right to determine who can participate in the community and may remove members who do not align with our values or community standards. This can happen at any point with or without reason, explanation, or notice. This policy exists solely to protect the greater good of the community and its function.
            </p>
          </div>
          
          <div class="flex justify-center">
            <button 
              onclick={openAccessRequestModal}
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Request Access
            </button>
          </div>
        </div>
        
        <!-- FAQ Section -->
        <div class="mt-8">
          <FAQ faqItems={aboutFaqItems} />
        </div>
      </div>
    </div>
  </section>
</main>
