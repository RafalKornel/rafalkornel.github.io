<script>
  let counter = 0;

  function increment() {
    console.log("dupsko");
    counter += 1;
  }
</script>

<div>
  <p>Counter: {counter}</p>
  <button on:click={increment}>+</button>
  <slot />
</div>
