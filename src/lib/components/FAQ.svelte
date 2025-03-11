<script lang="ts">
  // FAQ component for The Prep Group
  
  // Define the FAQ item type
  type FAQItem = {
    question: string;
    answer: string;
  };
  
  // Default FAQ items that can be overridden by props
  export let faqItems: FAQItem[] = [
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
  
  // Optional title for the FAQ section
  export let title: string = "Frequently Asked Questions";
</script>

<div class="bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
  <h2 class="text-2xl font-semibold mb-8 text-white">{title}</h2>
  
  <div class="space-y-8">
    {#each faqItems as item}
      <div class="bg-gray-700 p-6 rounded-lg border border-gray-600">
        <h3 class="text-xl font-medium text-white mb-3">{item.question}</h3>
        <p class="text-gray-300">
          {item.answer}
        </p>
      </div>
    {/each}
  </div>
</div>
