<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  let formStatus = {
    success: false,
    error: false,
    message: ''
  };
  
  let showDirectoryPreferences = false;
  
  // Initialize form data with user profile data
  // Define user type based on schema
  type User = {
    id: string;
    username: string;
    isAdmin: boolean;
    email: string;
    createdAt: string;
  };
  
  // Define default directory preferences type
  type DirectoryPreferences = {
    showPhone: boolean;
    showEmail: boolean;
    showAddress: boolean;
    showBio: boolean;
  };

  // Parse directory preferences safely
  const parseDirectoryPreferences = (prefs: any): DirectoryPreferences => {
    if (!prefs || typeof prefs !== 'object') {
      return {
        showPhone: false,
        showEmail: false,
        showAddress: false,
        showBio: false
      };
    }
    return {
      showPhone: !!prefs.showPhone,
      showEmail: !!prefs.showEmail,
      showAddress: !!prefs.showAddress,
      showBio: !!prefs.showBio
    };
  };

  let formData = {
    firstName: data.profile?.firstName || '',
    lastName: data.profile?.lastName || '',
    phone: data.profile?.phone || '',
    address: data.profile?.address || '',
    city: data.profile?.city || '',
    state: data.profile?.state || '',
    zip: data.profile?.zip || '',
    country: data.profile?.country || '',
    bio: data.profile?.bio || '',
    showInDirectory: data.profile?.showInDirectory || false,
    directoryPreferences: parseDirectoryPreferences(data.profile?.directoryPreferences || {})
  };
</script>

<svelte:head>
  <title>Your Profile | The Prep Group</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-100 mb-6">Your Profile</h1>
  
  <div class="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
    <h2 class="text-xl font-semibold text-gray-100 mb-4">Account Information</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <p class="text-gray-400 text-sm">Username</p>
        <p class="text-gray-100">{data.user.username}</p>
      </div>
      <div>
        <p class="text-gray-400 text-sm">Email</p>
        <p class="text-gray-100">{data.user?.email || 'Not available'}</p>
      </div>
      <div>
        <p class="text-gray-400 text-sm">Member Since</p>
        <p class="text-gray-100">{data.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : 'Not available'}</p>
      </div>
    </div>
    
    <div class="border-t border-gray-700 pt-4 mt-4">
      <p class="text-gray-400 text-sm mb-2">Account Management</p>
      <div class="flex flex-wrap gap-3">
        <a href="/profile/account" class="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
          Account Settings
        </a>
        <a href="/delete-account" class="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition">
          Delete Account
        </a>
      </div>
    </div>
  </div>
  
  <div class="bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 class="text-xl font-semibold text-gray-100 mb-4">Profile Information</h2>
    
    {#if formStatus.success}
      <div class="bg-green-900 border border-green-600 text-green-200 px-4 py-3 rounded mb-4" role="alert">
        <p>{formStatus.message}</p>
      </div>
    {/if}
    
    {#if formStatus.error}
      <div class="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-4" role="alert">
        <p>{formStatus.message}</p>
      </div>
    {/if}
    
    <form method="POST" action="?/updateProfile" use:enhance={() => {
      return async ({ result }) => {
        if (result.type === 'success') {
          formStatus.success = true;
          formStatus.error = false;
          formStatus.message = 'Profile updated successfully';
          
          // Reset form status after a delay
          setTimeout(() => {
            formStatus.success = false;
            formStatus.message = '';
          }, 3000);
        } else {
          formStatus.error = true;
          formStatus.success = false;
          formStatus.message = result.type === 'failure' 
            ? result.data?.message || 'Failed to update profile' 
            : 'An error occurred';
        }
      };
    }}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            bind:value={formData.firstName}
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            bind:value={formData.lastName}
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            bind:value={formData.phone}
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="address" class="block text-sm font-medium text-gray-300 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            bind:value={formData.address}
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="city" class="block text-sm font-medium text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            bind:value={formData.city}
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="state" class="block text-sm font-medium text-gray-300 mb-1">
            State/Province
          </label>
          <input
            type="text"
            id="state"
            name="state"
            bind:value={formData.state}
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="zip" class="block text-sm font-medium text-gray-300 mb-1">
            Zip/Postal Code
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            bind:value={formData.zip}
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="country" class="block text-sm font-medium text-gray-300 mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            bind:value={formData.country}
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div class="mb-6">
        <label for="bio" class="block text-sm font-medium text-gray-300 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          bind:value={formData.bio}
          rows="4"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us about yourself..."
        ></textarea>
      </div>
      
      <div class="mb-6">
        <div class="flex items-center mb-4">
          <input
            type="checkbox"
            id="showInDirectory"
            name="showInDirectory"
            bind:checked={formData.showInDirectory}
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
          />
          <label for="showInDirectory" class="ml-2 block text-sm text-gray-300">
            Show my profile in the member directory
          </label>
        </div>
        
        {#if formData.showInDirectory}
          <div class="ml-6 p-4 border border-gray-700 rounded-md bg-gray-800">
            <p class="text-sm text-gray-300 mb-3">Select which information to display in the directory:</p>
            
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="showEmail"
                  name="directoryPreferences.showEmail"
                  bind:checked={formData.directoryPreferences.showEmail}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label for="showEmail" class="ml-2 block text-sm text-gray-300">
                  Email Address
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="showPhone"
                  name="directoryPreferences.showPhone"
                  bind:checked={formData.directoryPreferences.showPhone}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label for="showPhone" class="ml-2 block text-sm text-gray-300">
                  Phone Number
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="showAddress"
                  name="directoryPreferences.showAddress"
                  bind:checked={formData.directoryPreferences.showAddress}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label for="showAddress" class="ml-2 block text-sm text-gray-300">
                  Address Information
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="showBio"
                  name="directoryPreferences.showBio"
                  bind:checked={formData.directoryPreferences.showBio}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label for="showBio" class="ml-2 block text-sm text-gray-300">
                  Bio
                </label>
              </div>
            </div>
          </div>
        {/if}
      </div>
      
      <div class="flex justify-end">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
</div>
