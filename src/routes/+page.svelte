<script lang="ts">
  // The list of fish you want to track
  const fishTypes = ['Bass', 'Trout', 'Blue Gills', 'Catfish', 'Pickerel'];
  
  // Variables to give the user feedback
  let message = '';
  let isLoading = false;

  /**
   * This function is called when a user clicks a fish button.
   * It sends the fish species to our backend API endpoint.
   */
  async function addCatch(species: string) {
    isLoading = true;
    message = `Adding ${species}...`;

    const response = await fetch('/api/add-catch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ species: species }),
    });

    const result = await response.json();

    if (result.success) {
      message = `Success! A ${species} was added to your FishTale log.`;
    } else {
      message = `Error: ${result.error || 'Something went wrong.'}`;
    }
    isLoading = false;
  }
</script>

<main class="w-full max-w-md mx-auto p-4 font-sans flex flex-col items-center min-h-screen bg-gray-50">
  <header class="text-center my-8">
    <h1 class="text-5xl font-bold text-cyan-700">FishTale 🎣</h1>
    <p class="text-gray-500 mt-2">Log your latest catch</p>
  </header>

  <div class="bg-white p-6 rounded-lg shadow-md w-full">
    <div class="grid grid-cols-1 gap-4">
      {#each fishTypes as fish}
        <button
          on:click={() => addCatch(fish)}
          disabled={isLoading}
          class="flex items-center justify-between p-4 bg-blue-600 text-white rounded-lg text-left hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-sm"
        >
          <span class="text-xl font-semibold">{fish}</span>
          <span class="text-3xl font-light">+</span>
        </button>
      {/each}
    </div>
  </div>

  {#if message}
    <div class="mt-6 text-center text-gray-700 bg-white p-4 rounded-lg shadow-md w-full">
      <p>{message}</p>
    </div>
  {/if}
</main>