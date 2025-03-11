<script>
  export let year = new Date().getFullYear();
</script>

<footer class="bg-gray-800 text-white py-6 mt-12">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row justify-between items-center">
      <div>
        <p>&copy; {year} The Prep Group. All rights reserved.</p>
      </div>
      <div class="mt-4 md:mt-0">
        <a href="/about" class="text-gray-300 hover:text-white mr-4">About</a>
        <a href="/contact" class="text-gray-300 hover:text-white mr-4">Contact</a>
        <a href="/members" class="text-gray-300 hover:text-white">Members</a>
      </div>
    </div>
  </div>
</footer>
